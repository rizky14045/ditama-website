package inquiry

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

	"template/helper"
	"template/middleware"
	"template/models"
	"template/modules/auditlog"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	inquiriesMutex sync.RWMutex
	inquiryFile    = filepath.Join("data", "inquiries.json")
)

type Handler struct {
	DB *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

func getInquiriesFromFile() []models.Inquiry {
	inquiriesMutex.RLock()
	defer inquiriesMutex.RUnlock()

	data, err := os.ReadFile(inquiryFile)
	if err != nil {
		return []models.Inquiry{}
	}
	var list []models.Inquiry
	if err := json.Unmarshal(data, &list); err != nil {
		return []models.Inquiry{}
	}
	for i := range list {
		if list[i].Status == "" {
			if list[i].IsRead {
				list[i].Status = "CONTACTED"
			} else {
				list[i].Status = "NEW"
			}
		}
	}
	return list
}

func saveInquiriesToFile(list []models.Inquiry) error {
	inquiriesMutex.Lock()
	defer inquiriesMutex.Unlock()

	if err := os.MkdirAll(filepath.Dir(inquiryFile), 0755); err != nil {
		return err
	}
	data, err := json.MarshalIndent(list, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(inquiryFile, data, 0644)
}

// SaveInquiry saves a new inquiry to DB or fallback JSON file
func SaveInquiry(db *gorm.DB, item models.Inquiry) error {
	if item.Status == "" {
		item.Status = "NEW"
	}
	if item.ID == uuid.Nil {
		item.ID = uuid.New()
	}
	now := time.Now()
	if item.CreatedAt.IsZero() {
		item.CreatedAt = now
	}
	if item.UpdatedAt.IsZero() {
		item.UpdatedAt = now
	}

	if db != nil {
		return db.Create(&item).Error
	}

	// File fallback
	list := getInquiriesFromFile()
	list = append([]models.Inquiry{item}, list...)
	return saveInquiriesToFile(list)
}

func (h *Handler) ListInquiries(c *gin.Context) {
	status := c.Query("is_read")

	if h.DB == nil {
		list := getInquiriesFromFile()
		var filtered []models.Inquiry
		for _, item := range list {
			if item.DeletedAt.Valid {
				continue
			}
			if status == "true" && !item.IsRead {
				continue
			}
			if status == "false" && item.IsRead {
				continue
			}
			filtered = append(filtered, item)
		}
		if filtered == nil {
			filtered = []models.Inquiry{}
		}
		helper.JsonResponse(c, true, "Inquiries retrieved successfully", filtered, nil, http.StatusOK)
		return
	}

	query := h.DB.Model(&models.Inquiry{}).Where("deleted_at IS NULL")
	if status == "true" {
		query = query.Where("is_read = TRUE")
	} else if status == "false" {
		query = query.Where("is_read = FALSE")
	}

	var inquiries []models.Inquiry
	if err := query.Order("created_at DESC").Find(&inquiries).Error; err != nil {
		helper.JsonResponse(c, true, "Inquiries retrieved (empty)", []models.Inquiry{}, nil, http.StatusOK)
		return
	}

	for i := range inquiries {
		if inquiries[i].Status == "" {
			inquiries[i].Status = "NEW"
		}
	}

	helper.JsonResponse(c, true, "Inquiries retrieved successfully", inquiries, nil, http.StatusOK)
}

func (h *Handler) MarkAsRead(c *gin.Context) {
	id := c.Param("id")

	if h.DB == nil {
		list := getInquiriesFromFile()
		found := false
		var updated models.Inquiry
		for i, item := range list {
			if item.ID.String() == id {
				list[i].IsRead = true
				if list[i].Status == "NEW" {
					list[i].Status = "CONTACTED"
				}
				list[i].UpdatedAt = time.Now()
				updated = list[i]
				found = true
				break
			}
		}
		if !found {
			helper.JsonResponse(c, false, "Inquiry not found", nil, "Not found", http.StatusNotFound)
			return
		}
		saveInquiriesToFile(list)
		helper.JsonResponse(c, true, "Inquiry marked as read", updated, nil, http.StatusOK)
		return
	}

	var item models.Inquiry
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&item).Error; err != nil {
		helper.JsonResponse(c, false, "Inquiry not found", nil, err.Error(), http.StatusNotFound)
		return
	}

	item.IsRead = true
	if item.Status == "NEW" {
		item.Status = "CONTACTED"
	}
	h.DB.Save(&item)

	auditlog.LogEvent(h.DB, c, "UPDATE", "inquiries", id, nil, gin.H{"is_read": true})
	helper.JsonResponse(c, true, "Inquiry marked as read", item, nil, http.StatusOK)
}

type UpdateStatusRequest struct {
	Status     string `json:"status" binding:"required"`
	AdminNotes string `json:"admin_notes"`
}

func (h *Handler) UpdateStatus(c *gin.Context) {
	id := c.Param("id")
	var req UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		list := getInquiriesFromFile()
		found := false
		var updated models.Inquiry
		for i, item := range list {
			if item.ID.String() == id {
				list[i].Status = req.Status
				if req.AdminNotes != "" {
					list[i].AdminNotes = req.AdminNotes
				}
				if req.Status != "NEW" {
					list[i].IsRead = true
				}
				list[i].UpdatedAt = time.Now()
				updated = list[i]
				found = true
				break
			}
		}
		if !found {
			helper.JsonResponse(c, false, "Inquiry not found", nil, "Not found", http.StatusNotFound)
			return
		}
		saveInquiriesToFile(list)
		helper.JsonResponse(c, true, "Status inquiry berhasil diperbarui", updated, nil, http.StatusOK)
		return
	}

	var item models.Inquiry
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&item).Error; err != nil {
		helper.JsonResponse(c, false, "Inquiry not found", nil, err.Error(), http.StatusNotFound)
		return
	}

	item.Status = req.Status
	item.AdminNotes = req.AdminNotes
	if req.Status != "NEW" {
		item.IsRead = true
	}
	h.DB.Save(&item)

	auditlog.LogEvent(h.DB, c, "UPDATE", "inquiries", id, nil, req)
	helper.JsonResponse(c, true, "Status inquiry berhasil diperbarui", item, nil, http.StatusOK)
}

func (h *Handler) DeleteInquiry(c *gin.Context) {
	id := c.Param("id")

	if h.DB == nil {
		list := getInquiriesFromFile()
		found := false
		var remaining []models.Inquiry
		for _, item := range list {
			if item.ID.String() == id {
				found = true
				continue
			}
			remaining = append(remaining, item)
		}
		if !found {
			helper.JsonResponse(c, false, "Inquiry not found", nil, "Not found", http.StatusNotFound)
			return
		}
		saveInquiriesToFile(remaining)
		helper.JsonResponse(c, true, "Inquiry deleted successfully", nil, nil, http.StatusOK)
		return
	}

	var item models.Inquiry
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&item).Error; err != nil {
		helper.JsonResponse(c, false, "Inquiry not found", nil, err.Error(), http.StatusNotFound)
		return
	}

	h.DB.Delete(&item)
	auditlog.LogEvent(h.DB, c, "SOFT_DELETE", "inquiries", id, item, nil)
	helper.JsonResponse(c, true, "Inquiry deleted successfully", nil, nil, http.StatusOK)
}

func SetupRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	h := NewHandler(db)
	admin := rg.Group("/admin/inquiries", middleware.JWTMiddleware())
	{
		admin.GET("", h.ListInquiries)
		admin.PUT("/:id/read", h.MarkAsRead)
		admin.PUT("/:id/status", h.UpdateStatus)
		admin.DELETE("/:id", h.DeleteInquiry)
	}
}
