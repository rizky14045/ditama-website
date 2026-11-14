package sections

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"
	"template/helper"
	"template/middleware"
	"template/models"
	"template/modules/auditlog"
	"time"

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

func getUserUUID(c *gin.Context) *uuid.UUID {
	if val, ok := c.Get("user_id"); ok {
		if str, okStr := val.(string); okStr && str != "" {
			if id, err := uuid.Parse(str); err == nil {
				return &id
			}
		}
	}
	return nil
}

// ----------------- HERO SECTION -----------------

const heroFilePath = "data/hero_section.json"

func getDefaultHero() models.HeroSection {
	hero := models.HeroSection{
		BadgeText:        "Mitra Terpercaya BUMN & Industri Sejak 2019",
		HeadlineH1:       "Solusi IT Terintegrasi, Gate System & General Supplier Industri",
		Subheadline:      "Menyediakan layanan Software Development, System Integration, Keamanan Akses (Gate & CCTV), serta pengadaan mekanikal & elektrikal berstandar K3.",
		PrimaryCtaText:   "Hubungi Kami",
		PrimaryCtaLink:   "#kontak",
		SecondaryCtaText: "Lihat Portofolio",
		SecondaryCtaLink: "#portofolio",
		IsActive:         true,
	}
	if content, err := os.ReadFile(heroFilePath); err == nil {
		_ = json.Unmarshal(content, &hero)
	}
	return hero
}

func saveHeroToFile(hero models.HeroSection) {
	_ = os.MkdirAll("data", 0755)
	if data, err := json.MarshalIndent(hero, "", "  "); err == nil {
		_ = os.WriteFile(heroFilePath, data, 0644)
	}
}

func GetActiveHero() models.HeroSection {
	return getDefaultHero()
}

func (h *Handler) GetHero(c *gin.Context) {
	if h.DB == nil {
		helper.JsonResponse(c, true, "Hero section retrieved (default)", getDefaultHero(), nil, http.StatusOK)
		return
	}
	var hero models.HeroSection
	if err := h.DB.Where("deleted_at IS NULL").First(&hero).Error; err != nil {
		helper.JsonResponse(c, true, "Hero section retrieved (default)", getDefaultHero(), nil, http.StatusOK)
		return
	}
	helper.JsonResponse(c, true, "Hero section retrieved", hero, nil, http.StatusOK)
}

func (h *Handler) UpdateHero(c *gin.Context) {
	var req models.HeroSection
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		saveHeroToFile(req)
		helper.JsonResponse(c, true, "Hero section updated successfully (fallback storage)", req, nil, http.StatusOK)
		return
	}

	var existing models.HeroSection
	err := h.DB.Where("deleted_at IS NULL").First(&existing).Error
	if err != nil {
		req.CreatedBy = getUserUUID(c)
		if err := h.DB.Create(&req).Error; err != nil {
			helper.JsonResponse(c, false, "Failed to create hero section", nil, err.Error(), http.StatusInternalServerError)
			return
		}
		saveHeroToFile(req)
		auditlog.LogEvent(h.DB, c, "CREATE", "hero_sections", req.ID.String(), nil, req)
		helper.JsonResponse(c, true, "Hero section created", req, nil, http.StatusCreated)
		return
	}

	before := existing
	existing.BadgeText = req.BadgeText
	existing.HeadlineH1 = req.HeadlineH1
	existing.Subheadline = req.Subheadline
	existing.PrimaryCtaText = req.PrimaryCtaText
	existing.PrimaryCtaLink = req.PrimaryCtaLink
	existing.SecondaryCtaText = req.SecondaryCtaText
	existing.SecondaryCtaLink = req.SecondaryCtaLink
	existing.HeroImageURL = req.HeroImageURL
	existing.IsActive = req.IsActive
	existing.UpdatedBy = getUserUUID(c)

	if err := h.DB.Save(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to update hero section", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	saveHeroToFile(existing)
	auditlog.LogEvent(h.DB, c, "UPDATE", "hero_sections", existing.ID.String(), before, existing)
	helper.JsonResponse(c, true, "Hero section updated", existing, nil, http.StatusOK)
}

// ----------------- ABOUT SECTION -----------------

const aboutFilePath = "data/about_section.json"

func getDefaultAbout() models.AboutSection {
	about := models.AboutSection{
		Title:            "Tentang PT. Ditama Inti Teknologi",
		DescriptionHTML:  "Berdiri sejak tahun 2019 di Cilegon, Banten, PT. DITAMA INTI TEKNOLOGI merupakan perusahaan perdagangan umum dan jasa yang bergerak di bidang General Supplier, IT Solution & Multimedia, System Integration, serta Electrical Services.",
		VisionText:       "Menjadi perusahaan General Supplier dan penyedia solusi teknologi terintegrasi di Indonesia yang terkemuka dalam pertumbuhan, efisiensi, dan reputasi.",
		MissionItems:     `["Menyediakan solusi bernilai tambah yang mengoptimalkan kepuasan pelanggan.", "Menciptakan lapangan kerja berkualitas dan berperan aktif sebagai warga korporat yang baik."]`,
		EstablishedYear: 2019,
		ExperienceBadge: "Pengalaman Industri",
		ExperienceYears: "7+ Tahun",
		ExperienceDesc:  "Melayani berbagai perusahaan terkemuka, BUMN, dan kawasan industri di Indonesia sejak tahun 2019.",
		ValuePillars:    `[{"number":"01","title":"Solusi Cepat & Presisi","description":"Respon tanggap kebutuhan pengadaan & integrasi IT."},{"number":"02","title":"Kualitas Mutu Terjamin","description":"Produk hardware & software bergaransi resmi."},{"number":"03","title":"Dukungan Tenaga Ahli","description":"Tim teknisi tersertifikasi & berpengalaman lapangan."}]`,
		IsActive:         true,
	}
	if content, err := os.ReadFile(aboutFilePath); err == nil {
		_ = json.Unmarshal(content, &about)
	}
	return about
}

func saveAboutToFile(about models.AboutSection) {
	_ = os.MkdirAll("data", 0755)
	if data, err := json.MarshalIndent(about, "", "  "); err == nil {
		_ = os.WriteFile(aboutFilePath, data, 0644)
	}
}

func GetActiveAbout() models.AboutSection {
	return getDefaultAbout()
}

func (h *Handler) GetAbout(c *gin.Context) {
	if h.DB == nil {
		helper.JsonResponse(c, true, "About section retrieved (default)", getDefaultAbout(), nil, http.StatusOK)
		return
	}
	var about models.AboutSection
	if err := h.DB.Where("deleted_at IS NULL").First(&about).Error; err != nil {
		helper.JsonResponse(c, true, "About section retrieved (default)", getDefaultAbout(), nil, http.StatusOK)
		return
	}
	helper.JsonResponse(c, true, "About section retrieved", about, nil, http.StatusOK)
}

func (h *Handler) UpdateAbout(c *gin.Context) {
	var req models.AboutSection
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		saveAboutToFile(req)
		helper.JsonResponse(c, true, "About section updated successfully", req, nil, http.StatusOK)
		return
	}

	var existing models.AboutSection
	err := h.DB.Where("deleted_at IS NULL").First(&existing).Error
	if err != nil {
		req.CreatedBy = getUserUUID(c)
		if err := h.DB.Create(&req).Error; err != nil {
			helper.JsonResponse(c, false, "Failed to create about section", nil, err.Error(), http.StatusInternalServerError)
			return
		}
		saveAboutToFile(req)
		auditlog.LogEvent(h.DB, c, "CREATE", "about_sections", req.ID.String(), nil, req)
		helper.JsonResponse(c, true, "About section created", req, nil, http.StatusCreated)
		return
	}

	before := existing
	existing.Title = req.Title
	existing.DescriptionHTML = req.DescriptionHTML
	existing.VisionText = req.VisionText
	if req.MissionItems != "" {
		existing.MissionItems = req.MissionItems
	}
	existing.EstablishedYear = req.EstablishedYear
	if req.ExperienceBadge != "" {
		existing.ExperienceBadge = req.ExperienceBadge
	}
	if req.ExperienceYears != "" {
		existing.ExperienceYears = req.ExperienceYears
	}
	if req.ExperienceDesc != "" {
		existing.ExperienceDesc = req.ExperienceDesc
	}
	if req.ValuePillars != "" {
		existing.ValuePillars = req.ValuePillars
	}
	existing.IsActive = req.IsActive
	existing.UpdatedBy = getUserUUID(c)

	if err := h.DB.Save(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to update about section", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	saveAboutToFile(existing)
	auditlog.LogEvent(h.DB, c, "UPDATE", "about_sections", existing.ID.String(), before, existing)
	helper.JsonResponse(c, true, "About section updated", existing, nil, http.StatusOK)
}

// ----------------- SERVICES CRUD -----------------

const servicesFilePath = "data/services.json"

func getDefaultServicesList() []models.Service {
	items := []models.Service{
		{
			BaseUUIDModel:    models.BaseUUIDModel{ID: uuid.MustParse("33333333-3333-3333-3333-333333333301")},
			Title:            "IT Solution & Multimedia",
			Slug:             "it-solution-multimedia",
			ShortDescription: "Pengembangan software kustom, dashboard analitik, dan integrasi kecerdasan buatan.",
			BulletFeatures:   `["Custom Software Development", "Sistem Manajemen Dokumen", "Integrasi AI & OCR"]`,
			IconName:         "code",
			DisplayOrder:     1,
			IsActive:         true,
		},
		{
			BaseUUIDModel:    models.BaseUUIDModel{ID: uuid.MustParse("33333333-3333-3333-3333-333333333302")},
			Title:            "Smart Gate & Security System",
			Slug:             "smart-gate-security-system",
			ShortDescription: "Penyedia dan integrasi barrier gate otomatis, turnstile tripod/flap gate, dan RFID UHF.",
			BulletFeatures:   `["Barrier Gate & Turnstile", "RFID UHF Long Range", "Face Recognition & Visitor"]`,
			IconName:         "shield",
			DisplayOrder:     2,
			IsActive:         true,
		},
		{
			BaseUUIDModel:    models.BaseUUIDModel{ID: uuid.MustParse("33333333-3333-3333-3333-333333333303")},
			Title:            "System Integration & IoT",
			Slug:             "system-integration-iot",
			ShortDescription: "Integrasi sistem industri, otomasi perangkat IoT, SCADA, dan komunikasi data terenkripsi.",
			BulletFeatures:   `["Integrasi SCADA & PLC", "Sensor Industri & IoT", "Jaringan Fiber Optic & CCTV"]`,
			IconName:         "database",
			DisplayOrder:     3,
			IsActive:         true,
		},
		{
			BaseUUIDModel:    models.BaseUUIDModel{ID: uuid.MustParse("33333333-3333-3333-3333-333333333304")},
			Title:            "General Supplier & Electrical",
			Slug:             "general-supplier-electrical",
			ShortDescription: "Pengadaan suku cadang elektrikal industri, kabel instrumen, dan peralatan K3 bersertifikasi.",
			BulletFeatures:   `["Pengadaan Elektrikal & Mekanikal", "Kabel Industri & Panel Listrik", "Standar K3 & CSMS Berkelanjutan"]`,
			IconName:         "zap",
			DisplayOrder:     4,
			IsActive:         true,
		},
	}
	if content, err := os.ReadFile(servicesFilePath); err == nil {
		_ = json.Unmarshal(content, &items)
	}
	return items
}

func saveServicesToFile(items []models.Service) {
	_ = os.MkdirAll("data", 0755)
	if data, err := json.MarshalIndent(items, "", "  "); err == nil {
		_ = os.WriteFile(servicesFilePath, data, 0644)
	}
}

func GetActiveServices() []models.Service {
	all := getDefaultServicesList()
	var active []models.Service
	for _, item := range all {
		if item.IsActive {
			active = append(active, item)
		}
	}
	return active
}

func (h *Handler) ListServices(c *gin.Context) {
	if h.DB == nil {
		helper.JsonResponse(c, true, "Services retrieved (fallback storage)", getDefaultServicesList(), nil, http.StatusOK)
		return
	}
	var services []models.Service
	if err := h.DB.Where("deleted_at IS NULL").Order("display_order ASC, created_at ASC").Find(&services).Error; err != nil {
		helper.JsonResponse(c, true, "Services retrieved (fallback storage)", getDefaultServicesList(), nil, http.StatusOK)
		return
	}
	helper.JsonResponse(c, true, "Services retrieved", services, nil, http.StatusOK)
}

func (h *Handler) CreateService(c *gin.Context) {
	var item models.Service
	if err := c.ShouldBindJSON(&item); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		if item.ID == uuid.Nil {
			item.ID = uuid.New()
		}
		item.CreatedAt = time.Now()
		item.UpdatedAt = time.Now()
		items := getDefaultServicesList()
		items = append(items, item)
		saveServicesToFile(items)
		helper.JsonResponse(c, true, "Service created successfully (fallback storage)", item, nil, http.StatusCreated)
		return
	}

	item.CreatedBy = getUserUUID(c)
	if err := h.DB.Create(&item).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to create service", nil, err.Error(), http.StatusInternalServerError)
		return
	}
	items := getDefaultServicesList()
	items = append(items, item)
	saveServicesToFile(items)
	auditlog.LogEvent(h.DB, c, "CREATE", "services", item.ID.String(), nil, item)
	helper.JsonResponse(c, true, "Service created successfully", item, nil, http.StatusCreated)
}

func (h *Handler) UpdateService(c *gin.Context) {
	id := c.Param("id")
	var req models.Service
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		items := getDefaultServicesList()
		found := false
		for i, item := range items {
			if item.ID.String() == id {
				items[i].Title = req.Title
				items[i].Slug = req.Slug
				items[i].ShortDescription = req.ShortDescription
				if req.BulletFeatures != "" {
					items[i].BulletFeatures = req.BulletFeatures
				}
				items[i].IconName = req.IconName
				items[i].DisplayOrder = req.DisplayOrder
				items[i].IsActive = req.IsActive
				items[i].UpdatedAt = time.Now()
				found = true
				req = items[i]
				break
			}
		}
		if !found {
			helper.JsonResponse(c, false, "Service not found", nil, "Not found", http.StatusNotFound)
			return
		}
		saveServicesToFile(items)
		helper.JsonResponse(c, true, "Service updated successfully (fallback storage)", req, nil, http.StatusOK)
		return
	}

	var existing models.Service
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Service not found", nil, err.Error(), http.StatusNotFound)
		return
	}

	before := existing
	existing.Title = req.Title
	existing.Slug = req.Slug
	existing.ShortDescription = req.ShortDescription
	if req.BulletFeatures != "" {
		existing.BulletFeatures = req.BulletFeatures
	}
	existing.IconName = req.IconName
	existing.DisplayOrder = req.DisplayOrder
	existing.IsActive = req.IsActive
	existing.UpdatedBy = getUserUUID(c)

	if err := h.DB.Save(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to update service", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	items := getDefaultServicesList()
	for i, item := range items {
		if item.ID.String() == id {
			items[i] = existing
			break
		}
	}
	saveServicesToFile(items)
	auditlog.LogEvent(h.DB, c, "UPDATE", "services", existing.ID.String(), before, existing)
	helper.JsonResponse(c, true, "Service updated successfully", existing, nil, http.StatusOK)
}

func (h *Handler) DeleteService(c *gin.Context) {
	id := c.Param("id")

	if h.DB == nil {
		items := getDefaultServicesList()
		var updated []models.Service
		found := false
		for _, item := range items {
			if item.ID.String() == id {
				found = true
				continue
			}
			updated = append(updated, item)
		}
		if !found {
			helper.JsonResponse(c, false, "Service not found", nil, "Not found", http.StatusNotFound)
			return
		}
		saveServicesToFile(updated)
		helper.JsonResponse(c, true, "Service deleted successfully (fallback storage)", nil, nil, http.StatusOK)
		return
	}

	var existing models.Service
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Service not found", nil, err.Error(), http.StatusNotFound)
		return
	}

	existing.DeletedBy = getUserUUID(c)
	_ = h.DB.Model(&existing).Update("deleted_by", existing.DeletedBy)
	if err := h.DB.Delete(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to delete service", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	items := getDefaultServicesList()
	var updated []models.Service
	for _, item := range items {
		if item.ID.String() != id {
			updated = append(updated, item)
		}
	}
	saveServicesToFile(updated)
	auditlog.LogEvent(h.DB, c, "SOFT_DELETE", "services", id, existing, nil)
	helper.JsonResponse(c, true, "Service soft deleted successfully", nil, nil, http.StatusOK)
}

// ----------------- PORTFOLIOS CRUD -----------------

const portfoliosFilePath = "data/portfolios.json"

func getDefaultPortfoliosList() []models.Portfolio {
	year2023 := 2023
	year2024 := 2024
	items := []models.Portfolio{
		{
			BaseUUIDModel:           models.BaseUUIDModel{ID: uuid.MustParse("44444444-4444-4444-4444-444444444401")},
			Title:                   "Implementasi Smart Barrier Gate & Visitor Management RFID",
			Slug:                    "implementasi-smart-barrier-gate-visitor-management",
			ClientName:              "PT. Krakatau Posco",
			Category:                "GATE_SECURITY",
			Summary:                 "Pemasangan 6 unit barrier gate terintegrasi sistem pembaca RFID UHF jarak jauh dan validasi KTP pengunjung otomatis.",
			ChallengeSolutionDetail: "Kebutuhan kontrol arus masuk ribuan kendaraan logistik harian dengan waktu verifikasi di bawah 3 detik.",
			ThumbnailURL:            "",
			ProjectYear:             &year2024,
			IsFeatured:              true,
			DisplayOrder:            1,
			IsActive:                true,
		},
		{
			BaseUUIDModel:           models.BaseUUIDModel{ID: uuid.MustParse("44444444-4444-4444-4444-444444444402")},
			Title:                   "Dashboard Integrasi Sistem SCADA & Monitoring Pembangkit",
			Slug:                    "dashboard-integrasi-sistem-scada-monitoring",
			ClientName:              "PT. PLN Indonesia Power",
			Category:                "IT_SOFTWARE",
			Summary:                 "Aplikasi sentralisasi data telemetri pembangkit listrik berbasis web responsif dengan integrasi ke MAXIMO ERP.",
			ChallengeSolutionDetail: "Sentralisasi data real-time dari 4 unit turbin terdistribusi ke dalam satu dashboard analitik manajemen.",
			ThumbnailURL:            "",
			ProjectYear:             &year2023,
			IsFeatured:              true,
			DisplayOrder:            2,
			IsActive:                true,
		},
		{
			BaseUUIDModel:           models.BaseUUIDModel{ID: uuid.MustParse("44444444-4444-4444-4444-444444444403")},
			Title:                   "Turnstile Full-Height & Akses Wajah Area Terbatas",
			Slug:                    "turnstile-full-height-akses-wajah-area-terbatas",
			ClientName:              "Bank Indonesia",
			Category:                "GATE_SECURITY",
			Summary:                 "Integrasi gate pengamanan fisik turnstile full-height dengan biometrik pengenalan wajah berstandar perbankan.",
			ChallengeSolutionDetail: "Pencegahan akses tanpa izin (anti-tailgating) pada fasilitas data center dan ruang khazanah.",
			ThumbnailURL:            "",
			ProjectYear:             &year2024,
			IsFeatured:              true,
			DisplayOrder:            3,
			IsActive:                true,
		},
		{
			BaseUUIDModel:           models.BaseUUIDModel{ID: uuid.MustParse("44444444-4444-4444-4444-444444444404")},
			Title:                   "Pengadaan Trafo Distribusi & Panel Listrik 6KV",
			Slug:                    "pengadaan-trafo-distribusi-panel-listrik-6kv",
			ClientName:              "PT. Semen Gresik",
			Category:                "SUPPLIER_ELECTRICAL",
			Summary:                 "Penyediaan komponen kelistrikan industri tegangan menengah dan instalasi bersertifikat K3.",
			ChallengeSolutionDetail: "Kebutuhan penggantian unit komponen daya pabrik secara terjadwal tanpa menghentikan produksi utama.",
			ThumbnailURL:            "",
			ProjectYear:             &year2023,
			IsFeatured:              true,
			DisplayOrder:            4,
			IsActive:                true,
		},
	}
	if content, err := os.ReadFile(portfoliosFilePath); err == nil {
		_ = json.Unmarshal(content, &items)
	}
	return items
}

func savePortfoliosToFile(items []models.Portfolio) {
	_ = os.MkdirAll("data", 0755)
	if data, err := json.MarshalIndent(items, "", "  "); err == nil {
		_ = os.WriteFile(portfoliosFilePath, data, 0644)
	}
}

func GetActivePortfolios() []models.Portfolio {
	all := getDefaultPortfoliosList()
	var active []models.Portfolio
	for _, item := range all {
		if item.IsActive {
			active = append(active, item)
		}
	}
	return active
}

func (h *Handler) ListPortfolios(c *gin.Context) {
	if h.DB == nil {
		helper.JsonResponse(c, true, "Portfolios retrieved (fallback storage)", getDefaultPortfoliosList(), nil, http.StatusOK)
		return
	}
	var items []models.Portfolio
	if err := h.DB.Where("deleted_at IS NULL").Order("display_order ASC, created_at DESC").Find(&items).Error; err != nil {
		helper.JsonResponse(c, true, "Portfolios retrieved (fallback storage)", getDefaultPortfoliosList(), nil, http.StatusOK)
		return
	}
	helper.JsonResponse(c, true, "Portfolios retrieved", items, nil, http.StatusOK)
}

func (h *Handler) CreatePortfolio(c *gin.Context) {
	var item models.Portfolio
	if err := c.ShouldBindJSON(&item); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		if item.ID == uuid.Nil {
			item.ID = uuid.New()
		}
		item.CreatedAt = time.Now()
		item.UpdatedAt = time.Now()
		items := getDefaultPortfoliosList()
		items = append(items, item)
		savePortfoliosToFile(items)
		helper.JsonResponse(c, true, "Portfolio created successfully (fallback storage)", item, nil, http.StatusCreated)
		return
	}

	item.IsActive = true
	item.IsFeatured = true
	item.CreatedBy = getUserUUID(c)
	if err := h.DB.Create(&item).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to create portfolio", nil, err.Error(), http.StatusInternalServerError)
		return
	}
	items := getDefaultPortfoliosList()
	items = append(items, item)
	savePortfoliosToFile(items)
	auditlog.LogEvent(h.DB, c, "CREATE", "portfolios", item.ID.String(), nil, item)
	helper.JsonResponse(c, true, "Portfolio created successfully", item, nil, http.StatusCreated)
}

func (h *Handler) UpdatePortfolio(c *gin.Context) {
	id := c.Param("id")
	var req models.Portfolio
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		items := getDefaultPortfoliosList()
		found := false
		for i, item := range items {
			if item.ID.String() == id {
				items[i].Title = req.Title
				items[i].Slug = req.Slug
				items[i].ClientName = req.ClientName
				items[i].Category = req.Category
				items[i].Summary = req.Summary
				items[i].ChallengeSolutionDetail = req.ChallengeSolutionDetail
				items[i].ThumbnailURL = req.ThumbnailURL
				items[i].ProjectYear = req.ProjectYear
				items[i].SeoMetaTitle = req.SeoMetaTitle
				items[i].SeoMetaDescription = req.SeoMetaDescription
				items[i].SeoOgImageURL = req.SeoOgImageURL
				items[i].IsFeatured = true
				items[i].DisplayOrder = req.DisplayOrder
				items[i].IsActive = true
				items[i].UpdatedAt = time.Now()
				found = true
				req = items[i]
				break
			}
		}
		if !found {
			helper.JsonResponse(c, false, "Portfolio not found", nil, "Not found", http.StatusNotFound)
			return
		}
		savePortfoliosToFile(items)
		helper.JsonResponse(c, true, "Portfolio updated successfully (fallback storage)", req, nil, http.StatusOK)
		return
	}

	var existing models.Portfolio
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Portfolio not found", nil, err.Error(), http.StatusNotFound)
		return
	}

	before := existing
	existing.Title = req.Title
	existing.Slug = req.Slug
	existing.ClientName = req.ClientName
	existing.Category = req.Category
	existing.Summary = req.Summary
	existing.ChallengeSolutionDetail = req.ChallengeSolutionDetail
	existing.ThumbnailURL = req.ThumbnailURL
	existing.ProjectYear = req.ProjectYear
	existing.SeoMetaTitle = req.SeoMetaTitle
	existing.SeoMetaDescription = req.SeoMetaDescription
	existing.SeoOgImageURL = req.SeoOgImageURL
	existing.IsFeatured = true
	existing.DisplayOrder = req.DisplayOrder
	// Pertahankan IsActive tetap true agar selalu tampil di website Compro
	existing.IsActive = true
	existing.UpdatedBy = getUserUUID(c)

	if err := h.DB.Save(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to update portfolio", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	items := getDefaultPortfoliosList()
	for i, item := range items {
		if item.ID.String() == id {
			items[i] = existing
			break
		}
	}
	savePortfoliosToFile(items)
	auditlog.LogEvent(h.DB, c, "UPDATE", "portfolios", existing.ID.String(), before, existing)
	helper.JsonResponse(c, true, "Portfolio updated successfully", existing, nil, http.StatusOK)
}

func (h *Handler) DeletePortfolio(c *gin.Context) {
	id := c.Param("id")

	if h.DB == nil {
		items := getDefaultPortfoliosList()
		var updated []models.Portfolio
		found := false
		for _, item := range items {
			if item.ID.String() == id {
				found = true
				continue
			}
			updated = append(updated, item)
		}
		if !found {
			helper.JsonResponse(c, false, "Portfolio not found", nil, "Not found", http.StatusNotFound)
			return
		}
		savePortfoliosToFile(updated)
		helper.JsonResponse(c, true, "Portfolio soft deleted successfully (fallback storage)", nil, nil, http.StatusOK)
		return
	}

	var existing models.Portfolio
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Portfolio not found", nil, err.Error(), http.StatusNotFound)
		return
	}

	existing.DeletedBy = getUserUUID(c)
	_ = h.DB.Model(&existing).Update("deleted_by", existing.DeletedBy)
	if err := h.DB.Delete(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to delete portfolio", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	items := getDefaultPortfoliosList()
	var updated []models.Portfolio
	for _, item := range items {
		if item.ID.String() != id {
			updated = append(updated, item)
		}
	}
	savePortfoliosToFile(updated)
	auditlog.LogEvent(h.DB, c, "SOFT_DELETE", "portfolios", id, existing, nil)
	helper.JsonResponse(c, true, "Portfolio soft deleted successfully", nil, nil, http.StatusOK)
}

// ----------------- CERTIFICATIONS & LEGALITIES CRUD -----------------

func (h *Handler) ListLegalities(c *gin.Context) {
	if h.DB == nil {
		helper.JsonResponse(c, true, "Certifications retrieved (default)", []models.CertificationLegality{}, nil, http.StatusOK)
		return
	}
	var items []models.CertificationLegality
	if err := h.DB.Where("deleted_at IS NULL").Order("display_order ASC, created_at ASC").Find(&items).Error; err != nil {
		helper.JsonResponse(c, true, "Certifications retrieved (empty)", []models.CertificationLegality{}, nil, http.StatusOK)
		return
	}
	helper.JsonResponse(c, true, "Certifications and legalities retrieved", items, nil, http.StatusOK)
}

func (h *Handler) CreateLegality(c *gin.Context) {
	if h.DB == nil {
		helper.JsonResponse(c, false, "Database offline", nil, "DB nil", http.StatusServiceUnavailable)
		return
	}
	var item models.CertificationLegality
	if err := c.ShouldBindJSON(&item); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}
	item.CreatedBy = getUserUUID(c)
	if err := h.DB.Create(&item).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to create certificate/legality", nil, err.Error(), http.StatusInternalServerError)
		return
	}
	auditlog.LogEvent(h.DB, c, "CREATE", "certifications_legalities", item.ID.String(), nil, item)
	helper.JsonResponse(c, true, "Certificate/legality created successfully", item, nil, http.StatusCreated)
}

func (h *Handler) UpdateLegality(c *gin.Context) {
	if h.DB == nil {
		helper.JsonResponse(c, false, "Database offline", nil, "DB nil", http.StatusServiceUnavailable)
		return
	}
	id := c.Param("id")
	var existing models.CertificationLegality
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Not found", nil, err.Error(), http.StatusNotFound)
		return
	}

	var req models.CertificationLegality
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	before := existing
	existing.Category = req.Category
	existing.Title = req.Title
	existing.DocumentNumber = req.DocumentNumber
	existing.Issuer = req.Issuer
	existing.RiskLevel = req.RiskLevel
	existing.ValidUntil = req.ValidUntil
	existing.FileAttachmentURL = req.FileAttachmentURL
	existing.DisplayOrder = req.DisplayOrder
	existing.IsActive = req.IsActive
	existing.UpdatedBy = getUserUUID(c)

	if err := h.DB.Save(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to update", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	auditlog.LogEvent(h.DB, c, "UPDATE", "certifications_legalities", existing.ID.String(), before, existing)
	helper.JsonResponse(c, true, "Updated successfully", existing, nil, http.StatusOK)
}

func (h *Handler) DeleteLegality(c *gin.Context) {
	if h.DB == nil {
		helper.JsonResponse(c, false, "Database offline", nil, "DB nil", http.StatusServiceUnavailable)
		return
	}
	id := c.Param("id")
	var existing models.CertificationLegality
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Not found", nil, err.Error(), http.StatusNotFound)
		return
	}

	existing.DeletedBy = getUserUUID(c)
	_ = h.DB.Model(&existing).Update("deleted_by", existing.DeletedBy)
	if err := h.DB.Delete(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to delete legality", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	auditlog.LogEvent(h.DB, c, "SOFT_DELETE", "certifications_legalities", id, existing, nil)
	helper.JsonResponse(c, true, "Deleted successfully", nil, nil, http.StatusOK)
}

// ----------------- CLIENTS & PARTNERS CRUD -----------------

const partnersFilePath = "data/clients_partners.json"

func getDefaultPartnersList() []models.ClientPartner {
	var items []models.ClientPartner
	if content, err := os.ReadFile(partnersFilePath); err == nil {
		if errJSON := json.Unmarshal(content, &items); errJSON == nil && len(items) > 0 {
			return items
		}
	}
	return []models.ClientPartner{}
}

func savePartnersListToFile(items []models.ClientPartner) {
	_ = os.MkdirAll("data", 0755)
	if data, err := json.MarshalIndent(items, "", "  "); err == nil {
		_ = os.WriteFile(partnersFilePath, data, 0644)
	}
}

func GetActiveClients() []models.ClientPartner {
	all := getDefaultPartnersList()
	var clients []models.ClientPartner
	for _, item := range all {
		if item.Type == "CLIENT" && item.IsActive {
			clients = append(clients, item)
		}
	}
	return clients
}

func GetActiveTechPartners() []models.ClientPartner {
	all := getDefaultPartnersList()
	var tech []models.ClientPartner
	for _, item := range all {
		if item.Type == "TECH_PARTNER" && item.IsActive {
			tech = append(tech, item)
		}
	}
	return tech
}

func (h *Handler) ListPartners(c *gin.Context) {
	typeFilter := c.Query("type")
	if h.DB == nil {
		items := getDefaultPartnersList()
		if typeFilter != "" {
			var filtered []models.ClientPartner
			for _, it := range items {
				if strings.EqualFold(it.Type, typeFilter) {
					filtered = append(filtered, it)
				}
			}
			helper.JsonResponse(c, true, "Partners retrieved", filtered, nil, http.StatusOK)
			return
		}
		helper.JsonResponse(c, true, "Partners retrieved", items, nil, http.StatusOK)
		return
	}
	var items []models.ClientPartner
	q := h.DB.Where("deleted_at IS NULL")
	if typeFilter != "" {
		q = q.Where("LOWER(type) = LOWER(?)", typeFilter)
	}
	if err := q.Order("display_order ASC, created_at ASC").Find(&items).Error; err != nil {
		helper.JsonResponse(c, true, "Partners retrieved (empty)", []models.ClientPartner{}, nil, http.StatusOK)
		return
	}
	helper.JsonResponse(c, true, "Clients and partners retrieved", items, nil, http.StatusOK)
}

func (h *Handler) CreatePartner(c *gin.Context) {
	var item models.ClientPartner
	if err := c.ShouldBindJSON(&item); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		if item.ID == uuid.Nil {
			item.ID = uuid.New()
		}
		item.IsActive = true
		items := getDefaultPartnersList()
		items = append(items, item)
		savePartnersListToFile(items)
		helper.JsonResponse(c, true, "Client/partner created successfully", item, nil, http.StatusCreated)
		return
	}

	item.CreatedBy = getUserUUID(c)
	if err := h.DB.Create(&item).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to create client/partner", nil, err.Error(), http.StatusInternalServerError)
		return
	}
	// Also sync to file
	items := getDefaultPartnersList()
	items = append(items, item)
	savePartnersListToFile(items)

	auditlog.LogEvent(h.DB, c, "CREATE", "clients_partners", item.ID.String(), nil, item)
	helper.JsonResponse(c, true, "Client/partner created successfully", item, nil, http.StatusCreated)
}

func (h *Handler) UpdatePartner(c *gin.Context) {
	id := c.Param("id")
	var req models.ClientPartner
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		items := getDefaultPartnersList()
		found := false
		for idx, it := range items {
			if it.ID.String() == id {
				items[idx].Name = req.Name
				if req.Type != "" {
					items[idx].Type = req.Type
				}
				items[idx].LogoURL = req.LogoURL
				items[idx].WebsiteURL = req.WebsiteURL
				items[idx].DisplayOrder = req.DisplayOrder
				items[idx].IsActive = req.IsActive
				found = true
				req.ID = it.ID
				break
			}
		}
		if !found {
			helper.JsonResponse(c, false, "Item not found", nil, "Not found", http.StatusNotFound)
			return
		}
		savePartnersListToFile(items)
		helper.JsonResponse(c, true, "Updated successfully", req, nil, http.StatusOK)
		return
	}

	var existing models.ClientPartner
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Not found", nil, err.Error(), http.StatusNotFound)
		return
	}

	before := existing
	existing.Name = req.Name
	existing.Type = req.Type
	existing.LogoURL = req.LogoURL
	existing.WebsiteURL = req.WebsiteURL
	existing.DisplayOrder = req.DisplayOrder
	existing.IsActive = req.IsActive
	existing.UpdatedBy = getUserUUID(c)

	if err := h.DB.Save(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to update", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	// Also sync to file
	items := getDefaultPartnersList()
	for idx, it := range items {
		if it.ID.String() == id {
			items[idx] = existing
			break
		}
	}
	savePartnersListToFile(items)

	auditlog.LogEvent(h.DB, c, "UPDATE", "clients_partners", existing.ID.String(), before, existing)
	helper.JsonResponse(c, true, "Updated successfully", existing, nil, http.StatusOK)
}

func (h *Handler) DeletePartner(c *gin.Context) {
	id := c.Param("id")

	if h.DB == nil {
		items := getDefaultPartnersList()
		var updated []models.ClientPartner
		found := false
		for _, it := range items {
			if it.ID.String() == id {
				found = true
				continue
			}
			updated = append(updated, it)
		}
		if !found {
			helper.JsonResponse(c, false, "Item not found", nil, "Not found", http.StatusNotFound)
			return
		}
		savePartnersListToFile(updated)
		helper.JsonResponse(c, true, "Deleted successfully", nil, nil, http.StatusOK)
		return
	}

	var existing models.ClientPartner
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Not found", nil, err.Error(), http.StatusNotFound)
		return
	}

	existing.DeletedBy = getUserUUID(c)
	_ = h.DB.Model(&existing).Update("deleted_by", existing.DeletedBy)
	if err := h.DB.Delete(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to delete partner", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	// Also sync to file
	items := getDefaultPartnersList()
	var updated []models.ClientPartner
	for _, it := range items {
		if it.ID.String() == id {
			continue
		}
		updated = append(updated, it)
	}
	savePartnersListToFile(updated)

	auditlog.LogEvent(h.DB, c, "SOFT_DELETE", "clients_partners", id, existing, nil)
	helper.JsonResponse(c, true, "Deleted successfully", nil, nil, http.StatusOK)
}

// ----------------- CTA BANNER -----------------

const ctaFilePath = "data/cta_banner.json"

func getDefaultCta() models.CtaBanner {
	cta := models.CtaBanner{
		Headline:         "Siap Mengintegrasikan Sistem IT & Keamanan Fasilitas Anda?",
		Subtext:          "Mitra terpercaya BUMN & industri sejak 2019 untuk Software Development, System Integration, dan Keamanan Akses.",
		ButtonText:       "Contact Us",
		ButtonActionType: "MODAL",
		ButtonTarget:     "#contact-modal",
		IsActive:         true,
	}
	if content, err := os.ReadFile(ctaFilePath); err == nil {
		_ = json.Unmarshal(content, &cta)
	}
	return cta
}

func saveCtaToFile(cta models.CtaBanner) {
	_ = os.MkdirAll("data", 0755)
	if data, err := json.MarshalIndent(cta, "", "  "); err == nil {
		_ = os.WriteFile(ctaFilePath, data, 0644)
	}
}

func GetActiveCta() models.CtaBanner {
	return getDefaultCta()
}

func (h *Handler) GetCta(c *gin.Context) {
	if h.DB == nil {
		helper.JsonResponse(c, true, "CTA banner retrieved (default)", getDefaultCta(), nil, http.StatusOK)
		return
	}
	var cta models.CtaBanner
	if err := h.DB.Where("deleted_at IS NULL").First(&cta).Error; err != nil {
		helper.JsonResponse(c, true, "CTA banner retrieved (default)", getDefaultCta(), nil, http.StatusOK)
		return
	}
	helper.JsonResponse(c, true, "CTA banner retrieved", cta, nil, http.StatusOK)
}

func (h *Handler) UpdateCta(c *gin.Context) {
	var req models.CtaBanner
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.JsonResponse(c, false, "Validation error", nil, err.Error(), http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		saveCtaToFile(req)
		helper.JsonResponse(c, true, "CTA banner updated successfully (fallback storage)", req, nil, http.StatusOK)
		return
	}

	var existing models.CtaBanner
	err := h.DB.Where("deleted_at IS NULL").First(&existing).Error
	if err != nil {
		req.CreatedBy = getUserUUID(c)
		if err := h.DB.Create(&req).Error; err != nil {
			helper.JsonResponse(c, false, "Failed to create CTA banner", nil, err.Error(), http.StatusInternalServerError)
			return
		}
		saveCtaToFile(req)
		auditlog.LogEvent(h.DB, c, "CREATE", "cta_banners", req.ID.String(), nil, req)
		helper.JsonResponse(c, true, "CTA banner created", req, nil, http.StatusCreated)
		return
	}

	before := existing
	existing.Headline = req.Headline
	existing.Subtext = req.Subtext
	existing.ButtonText = req.ButtonText
	existing.ButtonActionType = req.ButtonActionType
	existing.ButtonTarget = req.ButtonTarget
	existing.IsActive = req.IsActive
	existing.UpdatedBy = getUserUUID(c)

	if err := h.DB.Save(&existing).Error; err != nil {
		helper.JsonResponse(c, false, "Failed to update CTA banner", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	saveCtaToFile(existing)
	auditlog.LogEvent(h.DB, c, "UPDATE", "cta_banners", existing.ID.String(), before, existing)
	helper.JsonResponse(c, true, "CTA banner updated", existing, nil, http.StatusOK)
}

// ----------------- SERVICE CATEGORIES (MASTER DATA) -----------------

const serviceCategoriesFilePath = "data/service_categories.json"

func getDefaultServiceCategories() []models.ServiceCategory {
	cats := []models.ServiceCategory{
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
	if content, err := os.ReadFile(serviceCategoriesFilePath); err == nil {
		var list []models.ServiceCategory
		if err := json.Unmarshal(content, &list); err == nil && len(list) > 0 {
			return list
		}
	}
	return cats
}

func saveServiceCategoriesToFile(cats []models.ServiceCategory) {
	_ = os.MkdirAll("data", 0755)
	if data, err := json.MarshalIndent(cats, "", "  "); err == nil {
		_ = os.WriteFile(serviceCategoriesFilePath, data, 0644)
	}
}

func (h *Handler) ListServiceCategories(c *gin.Context) {
	if h.DB == nil {
		helper.JsonResponse(c, true, "Loaded service categories from storage", getDefaultServiceCategories(), nil, http.StatusOK)
		return
	}
	var cats []models.ServiceCategory
	if err := h.DB.Where("deleted_at IS NULL").Order("display_order ASC, created_at ASC").Find(&cats).Error; err != nil {
		helper.JsonResponse(c, true, "Loaded default service categories", getDefaultServiceCategories(), nil, http.StatusOK)
		return
	}
	if len(cats) == 0 {
		defaults := getDefaultServiceCategories()
		for _, d := range defaults {
			var chk models.ServiceCategory
			if err := h.DB.Where("code = ?", d.Code).First(&chk).Error; err != nil {
				_ = h.DB.Create(&d)
			}
		}
		_ = h.DB.Where("deleted_at IS NULL").Order("display_order ASC, created_at ASC").Find(&cats)
		if len(cats) == 0 {
			cats = defaults
		}
	}
	helper.JsonResponse(c, true, "Service categories fetched", cats, nil, http.StatusOK)
}

func (h *Handler) CreateServiceCategory(c *gin.Context) {
	var req struct {
		Code         string `json:"code"`
		Name         string `json:"name" binding:"required"`
		Description  string `json:"description"`
		DisplayOrder int    `json:"display_order"`
		IsActive     *bool  `json:"is_active"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.JsonResponse(c, false, "Invalid request", nil, err.Error(), http.StatusBadRequest)
		return
	}

	code := strings.TrimSpace(req.Code)
	if code == "" {
		code = strings.ToUpper(strings.ReplaceAll(strings.TrimSpace(req.Name), " ", "_"))
	}

	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	newCat := models.ServiceCategory{
		Code:         code,
		Name:         strings.TrimSpace(req.Name),
		Description:  strings.TrimSpace(req.Description),
		DisplayOrder: req.DisplayOrder,
		IsActive:     isActive,
	}
	newCat.CreatedBy = getUserUUID(c)

	if h.DB != nil {
		if err := h.DB.Create(&newCat).Error; err != nil {
			helper.JsonResponse(c, false, "Failed to create service category", nil, err.Error(), http.StatusInternalServerError)
			return
		}
		auditlog.LogEvent(h.DB, c, "CREATE", "service_categories", newCat.ID.String(), nil, newCat)
	}

	cats := getDefaultServiceCategories()
	cats = append(cats, newCat)
	saveServiceCategoriesToFile(cats)

	helper.JsonResponse(c, true, "Service category created successfully", newCat, nil, http.StatusCreated)
}

func (h *Handler) UpdateServiceCategory(c *gin.Context) {
	idParam := c.Param("id")
	targetID, _ := uuid.Parse(idParam)

	var req struct {
		Code         string `json:"code"`
		Name         string `json:"name"`
		Description  string `json:"description"`
		DisplayOrder int    `json:"display_order"`
		IsActive     *bool  `json:"is_active"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.JsonResponse(c, false, "Invalid request payload", nil, err.Error(), http.StatusBadRequest)
		return
	}

	code := strings.TrimSpace(req.Code)
	name := strings.TrimSpace(req.Name)
	if code == "" && name != "" {
		code = strings.ToUpper(strings.ReplaceAll(name, " ", "_"))
	}

	if h.DB != nil {
		var existing models.ServiceCategory
		found := false

		// 1. Coba cari berdasarkan UUID jika valid dan bukan uuid.Nil
		if targetID != uuid.Nil {
			if err := h.DB.First(&existing, "id = ? AND deleted_at IS NULL", targetID).Error; err == nil {
				found = true
			}
		}

		// 2. Jika tidak ditemukan lewat ID, cari berdasarkan Code
		if !found && code != "" {
			if err := h.DB.First(&existing, "code = ? AND deleted_at IS NULL", code).Error; err == nil {
				found = true
			}
		}

		// 3. Jika masih tidak ditemukan, cari berdasarkan Name
		if !found && name != "" {
			if err := h.DB.First(&existing, "name ILIKE ? AND deleted_at IS NULL", name).Error; err == nil {
				found = true
			}
		}

		// 4. Jika record belum ada sama sekali di DB, auto-create!
		if !found {
			newCat := models.ServiceCategory{
				BaseUUIDModel: models.BaseUUIDModel{ID: uuid.New()},
				Code:          code,
				Name:          name,
				Description:   strings.TrimSpace(req.Description),
				DisplayOrder:  req.DisplayOrder,
				IsActive:      true,
			}
			if req.IsActive != nil {
				newCat.IsActive = *req.IsActive
			}
			if newCat.Name == "" {
				newCat.Name = newCat.Code
			}
			if err := h.DB.Create(&newCat).Error; err != nil {
				helper.JsonResponse(c, false, "Failed to create category", nil, err.Error(), http.StatusInternalServerError)
				return
			}
			auditlog.LogEvent(h.DB, c, "CREATE", "service_categories", newCat.ID.String(), nil, newCat)
			helper.JsonResponse(c, true, "Service category created successfully", newCat, nil, http.StatusOK)
			return
		}

		// Update existing
		before := existing
		if name != "" {
			existing.Name = name
		}
		if code != "" {
			existing.Code = code
		}
		existing.Description = strings.TrimSpace(req.Description)
		existing.DisplayOrder = req.DisplayOrder
		if req.IsActive != nil {
			existing.IsActive = *req.IsActive
		}
		existing.UpdatedBy = getUserUUID(c)

		if err := h.DB.Save(&existing).Error; err != nil {
			helper.JsonResponse(c, false, "Failed to update category", nil, err.Error(), http.StatusInternalServerError)
			return
		}
		auditlog.LogEvent(h.DB, c, "UPDATE", "service_categories", existing.ID.String(), before, existing)
		helper.JsonResponse(c, true, "Service category updated successfully", existing, nil, http.StatusOK)
		return
	}

	// Fallback file storage
	cats := getDefaultServiceCategories()
	found := false
	for i, cat := range cats {
		if (targetID != uuid.Nil && cat.ID == targetID) || (code != "" && cat.Code == code) {
			if name != "" {
				cats[i].Name = name
			}
			if code != "" {
				cats[i].Code = code
			}
			cats[i].Description = strings.TrimSpace(req.Description)
			cats[i].DisplayOrder = req.DisplayOrder
			if req.IsActive != nil {
				cats[i].IsActive = *req.IsActive
			}
			found = true
			req.Code = cats[i].Code
			req.Name = cats[i].Name
			break
		}
	}
	if !found {
		newCat := models.ServiceCategory{
			BaseUUIDModel: models.BaseUUIDModel{ID: uuid.New()},
			Code:          code,
			Name:          name,
			Description:   strings.TrimSpace(req.Description),
			DisplayOrder:  req.DisplayOrder,
			IsActive:      true,
		}
		if req.IsActive != nil {
			newCat.IsActive = *req.IsActive
		}
		cats = append(cats, newCat)
	}
	saveServiceCategoriesToFile(cats)
	helper.JsonResponse(c, true, "Category updated successfully", req, nil, http.StatusOK)
}

func (h *Handler) DeleteServiceCategory(c *gin.Context) {
	idParam := c.Param("id")
	targetID, _ := uuid.Parse(idParam)
	codeParam := c.Query("code")

	if h.DB != nil {
		var existing models.ServiceCategory
		found := false
		if targetID != uuid.Nil {
			if err := h.DB.First(&existing, "id = ? AND deleted_at IS NULL", targetID).Error; err == nil {
				found = true
			}
		}
		if !found && codeParam != "" {
			if err := h.DB.First(&existing, "code = ? AND deleted_at IS NULL", codeParam).Error; err == nil {
				found = true
			}
		}
		if found {
			existing.DeletedBy = getUserUUID(c)
			_ = h.DB.Save(&existing)
			_ = h.DB.Delete(&existing)
			auditlog.LogEvent(h.DB, c, "DELETE", "service_categories", existing.ID.String(), existing, nil)
		}
	}

	cats := getDefaultServiceCategories()
	var updated []models.ServiceCategory
	for _, cat := range cats {
		if (targetID != uuid.Nil && cat.ID == targetID) || (codeParam != "" && cat.Code == codeParam) {
			continue
		}
		updated = append(updated, cat)
	}
	saveServiceCategoriesToFile(updated)
	helper.JsonResponse(c, true, "Service category deleted successfully", nil, nil, http.StatusOK)
}

func SetupRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	h := NewHandler(db)
	sec := rg.Group("/admin/sections", middleware.JWTMiddleware())
	{
		// Service Categories Master Data
		sec.GET("/categories", h.ListServiceCategories)
		sec.POST("/categories", h.CreateServiceCategory)
		sec.PUT("/categories/:id", h.UpdateServiceCategory)
		sec.DELETE("/categories/:id", h.DeleteServiceCategory)

		// Hero
		sec.GET("/hero", h.GetHero)
		sec.PUT("/hero", h.UpdateHero)

		// About
		sec.GET("/about", h.GetAbout)
		sec.PUT("/about", h.UpdateAbout)

		// Services
		sec.GET("/services", h.ListServices)
		sec.POST("/services", h.CreateService)
		sec.PUT("/services/:id", h.UpdateService)
		sec.DELETE("/services/:id", h.DeleteService)

		// Portfolios
		sec.GET("/portfolios", h.ListPortfolios)
		sec.POST("/portfolios", h.CreatePortfolio)
		sec.PUT("/portfolios/:id", h.UpdatePortfolio)
		sec.DELETE("/portfolios/:id", h.DeletePortfolio)

		// Legalities & CSMS
		sec.GET("/legalities", h.ListLegalities)
		sec.POST("/legalities", h.CreateLegality)
		sec.PUT("/legalities/:id", h.UpdateLegality)
		sec.DELETE("/legalities/:id", h.DeleteLegality)

		// Partners & Clients
		sec.GET("/partners", h.ListPartners)
		sec.POST("/partners", h.CreatePartner)
		sec.PUT("/partners/:id", h.UpdatePartner)
		sec.DELETE("/partners/:id", h.DeletePartner)

		// CTA Banner
		sec.GET("/cta", h.GetCta)
		sec.PUT("/cta", h.UpdateCta)
	}
}
