package settings

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"template/helper"
	"template/middleware"
	"template/models"
	"template/modules/auditlog"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

const settingsFilePath = "data/site_settings.json"

func init() {
	loadSettingsFromFile()
	syncFaviconToFrontend(CurrentSiteSettings.FaviconURL)
}

func loadSettingsFromFile() {
	if _, err := os.Stat(settingsFilePath); err == nil {
		content, errRead := os.ReadFile(settingsFilePath)
		if errRead == nil {
			var loaded models.SiteSetting
			if errJSON := json.Unmarshal(content, &loaded); errJSON == nil {
				if loaded.CompanyName != "" {
					CurrentSiteSettings.CompanyName = loaded.CompanyName
				}
				if loaded.CompanyTagline != "" {
					CurrentSiteSettings.CompanyTagline = loaded.CompanyTagline
				}
				if loaded.LogoURL != "" {
					CurrentSiteSettings.LogoURL = loaded.LogoURL
				}
				if loaded.FaviconURL != "" {
					CurrentSiteSettings.FaviconURL = loaded.FaviconURL
				}
				if loaded.OfficeAddress != "" {
					CurrentSiteSettings.OfficeAddress = loaded.OfficeAddress
				}
				if loaded.PicName != "" {
					CurrentSiteSettings.PicName = loaded.PicName
				}
				if loaded.PhoneWhatsapp != "" {
					CurrentSiteSettings.PhoneWhatsapp = loaded.PhoneWhatsapp
				}
				if loaded.EmailOfficial != "" {
					CurrentSiteSettings.EmailOfficial = loaded.EmailOfficial
				}
				if loaded.WebsiteURL != "" {
					CurrentSiteSettings.WebsiteURL = loaded.WebsiteURL
				}
				if loaded.SocialLinks != "" {
					CurrentSiteSettings.SocialLinks = loaded.SocialLinks
				}
				if loaded.SeoMetaTitle != "" {
					CurrentSiteSettings.SeoMetaTitle = loaded.SeoMetaTitle
				}
				if loaded.SeoMetaDescription != "" {
					CurrentSiteSettings.SeoMetaDescription = loaded.SeoMetaDescription
				}
			}
		}
	}
}

func saveSettingsToFile(settings models.SiteSetting) {
	_ = os.MkdirAll("data", 0755)
	if data, err := json.MarshalIndent(settings, "", "  "); err == nil {
		_ = os.WriteFile(settingsFilePath, data, 0644)
	}
}

type Handler struct {
	DB *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

var CurrentSiteSettings = models.SiteSetting{
	CompanyName:        "PT. Ditama Inti Teknologi",
	CompanyTagline:     "General Supplier, IT Solution & System Integration",
	LogoURL:            "/uploads/091dd349-1f1c-4567-b668-ad9f4f440e9e.png",
	FaviconURL:         "/uploads/091dd349-1f1c-4567-b668-ad9f4f440e9e.png",
	OfficeAddress:      "Komp. PCI Blok D 115 No. 06-07, Cilegon - Banten 42423",
	PicName:            "Rezza Prawiratama",
	PhoneWhatsapp:      "+62813-1050-6456",
	EmailOfficial:      "ditamadigital@gmail.com",
	WebsiteURL:         "https://www.ditamadigital.co.id",
	SocialLinks:        `{"linkedin":"https://linkedin.com/company/ditamadigital"}`,
	SeoMetaTitle:       "PT. Ditama Inti Teknologi | Solusi IT, Gate System & General Supplier Industri",
	SeoMetaDescription: "Mitra terpercaya BUMN & industri sejak 2019 untuk Software Development, System Integration, Smart Gate System, dan General Supplier bersertifikat CSMS K3.",
}

func getDefaultSiteSettings() models.SiteSetting {
	return CurrentSiteSettings
}

func (h *Handler) GetSettings(c *gin.Context) {
	if h.DB == nil {
		helper.JsonResponse(c, true, "Site settings retrieved (active)", CurrentSiteSettings, nil, http.StatusOK)
		return
	}

	var settings models.SiteSetting
	if err := h.DB.Where("deleted_at IS NULL").First(&settings).Error; err != nil {
		helper.JsonResponse(c, true, "Site settings retrieved (active)", CurrentSiteSettings, nil, http.StatusOK)
		return
	}
	helper.JsonResponse(c, true, "Site settings retrieved successfully", settings, nil, http.StatusOK)
}

type UpdateSettingsRequest struct {
	CompanyName        string `json:"company_name"`
	CompanyTagline     string `json:"company_tagline"`
	LogoURL            string `json:"logo_url"`
	FaviconURL         string `json:"favicon_url"`
	FooterDescription  string `json:"footer_description"`
	OfficeAddress      string `json:"office_address"`
	PicName            string `json:"pic_name"`
	PhoneWhatsapp      string `json:"phone_whatsapp"`
	EmailOfficial      string `json:"email_official"`
	WebsiteURL         string `json:"website_url"`
	SocialLinks        string `json:"social_links"`
	SeoMetaTitle       string `json:"seo_meta_title"`
	SeoMetaDescription string `json:"seo_meta_description"`
	SeoOgImageURL      string `json:"seo_og_image_url"`
}

func (h *Handler) UpdateSettings(c *gin.Context) {
	var req UpdateSettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	if len(req.SeoMetaTitle) > 70 {
		helper.JsonResponse(c, false, "SEO Meta Title cannot exceed 70 characters", nil, "Validation failed", http.StatusBadRequest)
		return
	}
	if len(req.SeoMetaDescription) > 160 {
		helper.JsonResponse(c, false, "SEO Meta Description cannot exceed 160 characters", nil, "Validation failed", http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		if req.CompanyName != "" {
			CurrentSiteSettings.CompanyName = req.CompanyName
		}
		CurrentSiteSettings.CompanyTagline = req.CompanyTagline
		CurrentSiteSettings.LogoURL = req.LogoURL
		CurrentSiteSettings.FaviconURL = req.FaviconURL
		CurrentSiteSettings.FooterDescription = req.FooterDescription
		CurrentSiteSettings.OfficeAddress = req.OfficeAddress
		CurrentSiteSettings.PicName = req.PicName
		CurrentSiteSettings.PhoneWhatsapp = req.PhoneWhatsapp
		CurrentSiteSettings.EmailOfficial = req.EmailOfficial
		CurrentSiteSettings.WebsiteURL = req.WebsiteURL
		if req.SocialLinks != "" {
			CurrentSiteSettings.SocialLinks = req.SocialLinks
		}
		CurrentSiteSettings.SeoMetaTitle = req.SeoMetaTitle
		CurrentSiteSettings.SeoMetaDescription = req.SeoMetaDescription
		CurrentSiteSettings.SeoOgImageURL = req.SeoOgImageURL

		saveSettingsToFile(CurrentSiteSettings)
		syncFaviconToFrontend(req.FaviconURL)
		helper.JsonResponse(c, true, "Site settings updated successfully", CurrentSiteSettings, nil, http.StatusOK)
		return
	}

	var existing models.SiteSetting
	err := h.DB.Where("deleted_at IS NULL").First(&existing).Error
	if err != nil {
		newSettings := models.SiteSetting{
			CompanyName:        req.CompanyName,
			CompanyTagline:     req.CompanyTagline,
			LogoURL:            req.LogoURL,
			FaviconURL:         req.FaviconURL,
			FooterDescription:  req.FooterDescription,
			OfficeAddress:      req.OfficeAddress,
			PicName:            req.PicName,
			PhoneWhatsapp:      req.PhoneWhatsapp,
			EmailOfficial:      req.EmailOfficial,
			WebsiteURL:         req.WebsiteURL,
			SocialLinks:        req.SocialLinks,
			SeoMetaTitle:       req.SeoMetaTitle,
			SeoMetaDescription: req.SeoMetaDescription,
			SeoOgImageURL:      req.SeoOgImageURL,
		}
		if err := h.DB.Create(&newSettings).Error; err != nil {
			helper.JsonResponse(c, false, "Failed to create site settings", nil, err.Error(), http.StatusInternalServerError)
			return
		}
		auditlog.LogEvent(h.DB, c, "CREATE", "site_settings", newSettings.ID.String(), nil, newSettings)
		helper.JsonResponse(c, true, "Site settings created successfully", newSettings, nil, http.StatusCreated)
		return
	}

	before := existing

	var userUUID *uuid.UUID
	if uidVal, ok := c.Get("user_id"); ok {
		if uidStr, okStr := uidVal.(string); okStr {
			if parsed, errParse := uuid.Parse(uidStr); errParse == nil {
				userUUID = &parsed
			}
		}
	}

	existing.CompanyName = req.CompanyName
	existing.CompanyTagline = req.CompanyTagline
	existing.LogoURL = req.LogoURL
	existing.FaviconURL = req.FaviconURL
	existing.FooterDescription = req.FooterDescription
	existing.OfficeAddress = req.OfficeAddress
	existing.PicName = req.PicName
	existing.PhoneWhatsapp = req.PhoneWhatsapp
	existing.EmailOfficial = req.EmailOfficial
	existing.WebsiteURL = req.WebsiteURL
	if req.SocialLinks != "" {
		existing.SocialLinks = req.SocialLinks
	}
	existing.SeoMetaTitle = req.SeoMetaTitle
	existing.SeoMetaDescription = req.SeoMetaDescription
	existing.SeoOgImageURL = req.SeoOgImageURL
	existing.UpdatedBy = userUUID

	if err := h.DB.Save(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to update site settings", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	auditlog.LogEvent(h.DB, c, "UPDATE", "site_settings", existing.ID.String(), before, existing)
	saveSettingsToFile(existing)
	syncFaviconToFrontend(req.FaviconURL)
	helper.JsonResponse(c, true, "Site settings updated successfully", existing, nil, http.StatusOK)
}

func syncFaviconToFrontend(faviconURL string) {
	if faviconURL == "" {
		return
	}
	// Security: Prevent Directory Traversal by enforcing base filename only
	baseFilename := filepath.Base(faviconURL)
	if baseFilename == "." || baseFilename == "/" || strings.Contains(baseFilename, "..") {
		return
	}
	srcPath := filepath.Join("uploads", baseFilename)
	if data, err := os.ReadFile(srcPath); err == nil {
		_ = os.WriteFile("../fe/app/favicon.ico", data, 0644)
		_ = os.WriteFile("../fe/public/favicon.ico", data, 0644)
	}
}

func SetupRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	h := NewHandler(db)
	admin := rg.Group("/admin/settings", middleware.JWTMiddleware())
	{
		admin.GET("", h.GetSettings)
		admin.PUT("", middleware.RequireRole("super_admin", "editor", "SUPER_ADMIN", "EDITOR"), h.UpdateSettings)
	}
}
