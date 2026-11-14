package public

import (
	"html"
	"log"
	"net/http"
	"strings"
	"template/helper"
	"template/models"
	"template/modules/inquiry"
	"template/modules/sections"
	"template/modules/settings"

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

// GetHomeSections returns all active landing page sections for the public site
func (h *Handler) GetHomeSections(c *gin.Context) {
	c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
	c.Header("Pragma", "no-cache")
	c.Header("Expires", "0")
	// If database is not connected, return company profile data from JSON storage
	if h.DB == nil {
		log.Println("[Public API] Database connection is nil, serving dynamic compro data from storage.")
		helper.JsonResponse(c, true, "Company profile data loaded successfully", getDefaultComproData(), nil, http.StatusOK)
		return
	}

	data := getDefaultComproData()

	// 1. Site Settings
	var siteSettings models.SiteSetting
	if err := h.DB.Where("deleted_at IS NULL").First(&siteSettings).Error; err == nil && siteSettings.CompanyName != "" {
		data["site_settings"] = siteSettings
	}

	// 2. Hero Section
	var hero models.HeroSection
	if err := h.DB.Where("is_active = TRUE AND deleted_at IS NULL").First(&hero).Error; err == nil && hero.HeadlineH1 != "" {
		data["hero"] = hero
	}

	// 3. About Section
	var about models.AboutSection
	if err := h.DB.Where("is_active = TRUE AND deleted_at IS NULL").First(&about).Error; err == nil && about.Title != "" {
		data["about"] = about
	}

	// 4. Certifications & Legalities
	var certs []models.CertificationLegality
	if err := h.DB.Where("is_active = TRUE AND deleted_at IS NULL").Order("display_order ASC, created_at ASC").Find(&certs).Error; err == nil && len(certs) > 0 {
		data["certifications_legalities"] = certs
	}

	// 5. Services
	var services []models.Service
	if err := h.DB.Where("is_active = TRUE AND deleted_at IS NULL").Order("display_order ASC, created_at ASC").Find(&services).Error; err == nil && len(services) > 0 {
		data["services"] = services
	}

	// 5b. Service Categories Master Data (Software Solution, Security System, System Integrator)
	var serviceCategories []models.ServiceCategory
	if err := h.DB.Where("is_active = TRUE AND deleted_at IS NULL").Order("display_order ASC, created_at ASC").Find(&serviceCategories).Error; err == nil && len(serviceCategories) > 0 {
		data["service_categories"] = serviceCategories
	} else {
		data["service_categories"] = getDefaultServiceCategoriesList()
	}

	// 6. Portfolios
	var portfolios []models.Portfolio
	if err := h.DB.Where("is_active = TRUE AND deleted_at IS NULL").Order("display_order ASC, created_at ASC").Find(&portfolios).Error; err == nil && len(portfolios) > 0 {
		data["portfolios"] = portfolios
	}

	// 7. Clients & Partners
	var allPartners []models.ClientPartner
	if err := h.DB.Where("is_active = TRUE AND deleted_at IS NULL").Order("display_order ASC, created_at ASC").Find(&allPartners).Error; err == nil && len(allPartners) > 0 {
		var clients []models.ClientPartner
		var techPartners []models.ClientPartner
		for _, p := range allPartners {
			if strings.ToUpper(p.Type) == "CLIENT" {
				clients = append(clients, p)
			} else {
				techPartners = append(techPartners, p)
			}
		}
		data["clients"] = clients
		data["tech_partners"] = techPartners
	}

	// 8. CTA Banner
	var cta models.CtaBanner
	if err := h.DB.Where("is_active = TRUE AND deleted_at IS NULL").First(&cta).Error; err == nil && cta.Headline != "" {
		data["cta_banner"] = cta
	}

	helper.JsonResponse(c, true, "Company profile data loaded successfully", data, nil, http.StatusOK)
}

func getDefaultServiceCategoriesList() []models.ServiceCategory {
	return []models.ServiceCategory{
		{
			BaseUUIDModel: models.BaseUUIDModel{ID: uuid.MustParse("55555555-5555-5555-5555-555555555501")},
			Code:          "SOFTWARE_SOLUTION",
			Name:          "Software Solution",
			Description:   "Pengembangan aplikasi web, mobile app, kecerdasan buatan (AI analytics), dan sistem enterprise ERP.",
			DisplayOrder:  1,
			IsActive:      true,
		},
		{
			BaseUUIDModel: models.BaseUUIDModel{ID: uuid.MustParse("55555555-5555-5555-5555-555555555502")},
			Code:          "SECURITY_SYSTEM",
			Name:          "Security System",
			Description:   "Sistem pengamanan gerbang fisik pintar (Turnstile Full Height, Barrier Gate), Access Control RFID, dan CCTV Surveillance terpadu.",
			DisplayOrder:  2,
			IsActive:      true,
		},
		{
			BaseUUIDModel: models.BaseUUIDModel{ID: uuid.MustParse("55555555-5555-5555-5555-555555555503")},
			Code:          "SYSTEM_INTEGRATOR",
			Name:          "System Integrator",
			Description:   "Integrasi sistem industri, otomasi SCADA, pengadaan peralatan keselamatan kerja (K3), serta suplai mekanikal elektrikal.",
			DisplayOrder:  3,
			IsActive:      true,
		},
	}
}

func getDefaultComproData() gin.H {
	return gin.H{
		"site_settings":      settings.CurrentSiteSettings,
		"hero":               sections.GetActiveHero(),
		"about":              sections.GetActiveAbout(),
		"services":           sections.GetActiveServices(),
		"service_categories": getDefaultServiceCategoriesList(),
		"portfolios":         sections.GetActivePortfolios(),
		"clients":            sections.GetActiveClients(),
		"tech_partners":      sections.GetActiveTechPartners(),
		"cta_banner":         sections.GetActiveCta(),
	}
}

// GetServiceCategories returns active solution categories master data for public consumption
func (h *Handler) GetServiceCategories(c *gin.Context) {
	c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
	c.Header("Pragma", "no-cache")
	c.Header("Expires", "0")
	if h.DB == nil {
		helper.JsonResponse(c, true, "Service categories loaded", getDefaultServiceCategoriesList(), nil, http.StatusOK)
		return
	}
	var categories []models.ServiceCategory
	if err := h.DB.Where("is_active = TRUE AND deleted_at IS NULL").Order("display_order ASC, created_at ASC").Find(&categories).Error; err != nil || len(categories) == 0 {
		helper.JsonResponse(c, true, "Service categories loaded (default)", getDefaultServiceCategoriesList(), nil, http.StatusOK)
		return
	}
	helper.JsonResponse(c, true, "Service categories loaded successfully", categories, nil, http.StatusOK)
}

// GetPortfolioDetail returns detail and SEO meta for a specific portfolio project
func (h *Handler) GetPortfolioDetail(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		helper.JsonResponse(c, false, "Slug parameter is required", nil, "Missing slug", http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		portfolios := sections.GetActivePortfolios()
		for _, p := range portfolios {
			if p.Slug == slug {
				helper.JsonResponse(c, true, "Portfolio detail retrieved successfully", p, nil, http.StatusOK)
				return
			}
		}
		helper.JsonResponse(c, false, "Portfolio project not found", nil, "Not found", http.StatusNotFound)
		return
	}

	var portfolio models.Portfolio
	if err := h.DB.Where("slug = ? AND is_active = TRUE AND deleted_at IS NULL", slug).First(&portfolio).Error; err != nil {
		helper.JsonResponse(c, false, "Portfolio project not found", nil, "Not found", http.StatusNotFound)
		return
	}

	helper.JsonResponse(c, true, "Portfolio detail retrieved successfully", portfolio, nil, http.StatusOK)
}

type InquiryRequest struct {
	SenderName    string `json:"sender_name" binding:"required"`
	SenderEmail   string `json:"sender_email" binding:"required,email"`
	ServiceTopic  string `json:"service_topic" binding:"required"`
	ProjectDetail string `json:"project_detail" binding:"required"`
}

// CreateInquiry handles consultation inquiry submissions from public visitors with XSS sanitization
func (h *Handler) CreateInquiry(c *gin.Context) {
	var req InquiryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	// Security: Sanitize all visitor inputs against Stored XSS and polyglot payloads
	cleanName := html.EscapeString(strings.TrimSpace(req.SenderName))
	cleanEmail := strings.ToLower(strings.TrimSpace(req.SenderEmail))
	cleanTopic := html.EscapeString(strings.TrimSpace(req.ServiceTopic))
	cleanDetail := html.EscapeString(strings.TrimSpace(req.ProjectDetail))

	if len(cleanName) > 150 || len(cleanDetail) > 3000 {
		helper.JsonResponse(c, false, "Input length exceeds allowed limits", nil, "Payload too large", http.StatusBadRequest)
		return
	}

	inq := models.Inquiry{
		SenderName:    cleanName,
		SenderEmail:   cleanEmail,
		ServiceTopic:  cleanTopic,
		ProjectDetail: cleanDetail,
		IPAddress:     c.ClientIP(),
		IsRead:        false,
	}
	inq.ID = uuid.New()

	if err := inquiry.SaveInquiry(h.DB, inq); err != nil {
		log.Printf("[Inquiry] Save error: %v", err)
	} else {
		log.Printf("[Inquiry Received]: %+v", inq)
	}

	helper.JsonResponse(c, true, "Inquiry submitted successfully. Our team will contact you shortly.", gin.H{
		"sender_name":  cleanName,
		"sender_email": cleanEmail,
	}, nil, http.StatusCreated)
}

func SetupRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	h := NewHandler(db)
	pub := rg.Group("/public")
	{
		pub.GET("/home", h.GetHomeSections)
		pub.GET("/service-categories", h.GetServiceCategories)
		pub.GET("/portfolios/:slug", h.GetPortfolioDetail)
		pub.POST("/inquiries", h.CreateInquiry)
	}
}
