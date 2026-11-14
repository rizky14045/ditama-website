package upload

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"template/helper"
	"template/middleware"
	"template/modules/auditlog"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Handler struct {
	DB *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

// UploadFile handles secure file uploads with Magic Bytes validation
func (h *Handler) UploadFile(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		helper.JsonResponse(c, false, "File is required", nil, err.Error(), http.StatusBadRequest)
		return
	}

	// 1. Check file size: max 5MB for PDF, max 2MB for images
	const maxUploadSize = 5 * 1024 * 1024 // 5 MB overall ceiling
	if fileHeader.Size > maxUploadSize {
		helper.JsonResponse(c, false, "File size exceeds limit (max 5 MB for PDF, max 2 MB for images)", nil, "File too large", http.StatusBadRequest)
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		helper.JsonResponse(c, false, "Failed to read file", nil, err.Error(), http.StatusInternalServerError)
		return
	}
	defer file.Close()

	// 2. Read first 512 bytes for Magic Bytes detection
	buffer := make([]byte, 512)
	n, err := file.Read(buffer)
	if err != nil && err != io.EOF {
		helper.JsonResponse(c, false, "Failed to inspect file contents", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	detectedType := http.DetectContentType(buffer[:n])
	var ext string

	switch {
	case strings.HasPrefix(detectedType, "image/jpeg"):
		if fileHeader.Size > 2*1024*1024 {
			helper.JsonResponse(c, false, "Image size exceeds 2 MB limit", nil, "Image too large", http.StatusBadRequest)
			return
		}
		ext = ".jpg"
	case strings.HasPrefix(detectedType, "image/png"):
		if fileHeader.Size > 2*1024*1024 {
			helper.JsonResponse(c, false, "Image size exceeds 2 MB limit", nil, "Image too large", http.StatusBadRequest)
			return
		}
		ext = ".png"
	case strings.HasPrefix(detectedType, "image/webp"):
		if fileHeader.Size > 2*1024*1024 {
			helper.JsonResponse(c, false, "Image size exceeds 2 MB limit", nil, "Image too large", http.StatusBadRequest)
			return
		}
		ext = ".webp"
	case strings.HasPrefix(detectedType, "image/x-icon") || strings.HasPrefix(detectedType, "image/vnd.microsoft.icon") || strings.HasSuffix(strings.ToLower(fileHeader.Filename), ".ico") || (n >= 4 && buffer[0] == 0 && buffer[1] == 0 && buffer[2] == 1 && buffer[3] == 0):
		if fileHeader.Size > 2*1024*1024 {
			helper.JsonResponse(c, false, "Favicon size exceeds 2 MB limit", nil, "Image too large", http.StatusBadRequest)
			return
		}
		ext = ".ico"
	case strings.HasPrefix(detectedType, "image/svg+xml") || strings.HasSuffix(strings.ToLower(fileHeader.Filename), ".svg") || strings.Contains(strings.ToLower(string(buffer[:n])), "<svg"):
		if fileHeader.Size > 2*1024*1024 {
			helper.JsonResponse(c, false, "SVG size exceeds 2 MB limit", nil, "Image too large", http.StatusBadRequest)
			return
		}

		// Security: Strict SVG Sanitization against Stored XSS
		svgFullContent, errRead := io.ReadAll(file)
		if errRead != nil {
			helper.JsonResponse(c, false, "Failed to inspect SVG content", nil, errRead.Error(), http.StatusBadRequest)
			return
		}
		lowerSVG := strings.ToLower(string(svgFullContent))
		prohibitedTokens := []string{
			"<script", "</script", "javascript:", "vbscript:",
			"onload", "onerror", "onclick", "onmouseover", "onfocus",
			"<foreignobject", "<animate", "<set", "xlink:href=\"javascript:",
			"data:text/html", "data:text/javascript",
		}
		for _, token := range prohibitedTokens {
			if strings.Contains(lowerSVG, token) {
				auditlog.LogEvent(h.DB, c, "MALICIOUS_UPLOAD_BLOCKED", "upload", fileHeader.Filename, nil, gin.H{
					"reason": "Dangerous executable token in SVG: " + token,
				})
				helper.JsonResponse(c, false, "Security Violation: SVG contains prohibited executable script or event handler", nil, "Malicious SVG rejected", http.StatusBadRequest)
				return
			}
		}
		ext = ".svg"
	case strings.HasPrefix(detectedType, "application/pdf") || strings.HasPrefix(string(buffer[:n]), "%PDF-"):
		ext = ".pdf"
	default:
		helper.JsonResponse(c, false, "Invalid file format. Allowed formats: JPG, PNG, WEBP, ICO, SVG, PDF", nil, "Unsupported MIME type: "+detectedType, http.StatusBadRequest)
		return
	}

	// Reset file pointer
	if _, err := file.Seek(0, io.SeekStart); err != nil {
		helper.JsonResponse(c, false, "Failed to process file stream", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	// 3. Save with UUID filename
	uploadDir := "./uploads"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		helper.JsonResponse(c, false, "Failed to initialize upload directory", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	uniqueFilename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	dstPath := filepath.Join(uploadDir, uniqueFilename)

	dst, err := os.Create(dstPath)
	if err != nil {
		helper.JsonResponse(c, false, "Failed to save file", nil, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		helper.JsonResponse(c, false, "Failed to write file to disk", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	fileURL := fmt.Sprintf("/uploads/%s", uniqueFilename)

	// 4. Audit Log
	auditlog.LogEvent(h.DB, c, "UPLOAD", "upload", uniqueFilename, nil, gin.H{
		"original_name": fileHeader.Filename,
		"file_url":      fileURL,
		"mime_type":     detectedType,
		"size":          fileHeader.Size,
	})

	helper.JsonResponse(c, true, "File uploaded successfully", gin.H{
		"url":           fileURL,
		"filename":      uniqueFilename,
		"original_name": fileHeader.Filename,
		"mime_type":     detectedType,
		"size":          fileHeader.Size,
	}, nil, http.StatusCreated)
}

func SetupRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	h := NewHandler(db)
	admin := rg.Group("/admin/upload", middleware.JWTMiddleware())
	{
		admin.POST("", h.UploadFile)
	}
}
