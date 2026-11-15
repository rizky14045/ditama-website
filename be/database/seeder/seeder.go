package seeder

import (
	"log"
	"template/models"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Seed populates the database with initial verified data
func Seed(db *gorm.DB) error {
	log.Println("🌱 Seeding database...")

	// 1. Seed Admin Users
	if err := seedUsers(db); err != nil {
		return err
	}

	// 2. Seed Site Settings
	if err := seedSiteSettings(db); err != nil {
		return err
	}

	// 3. Seed Hero Section
	if err := seedHero(db); err != nil {
		return err
	}

	// 4. Seed About Section
	if err := seedAbout(db); err != nil {
		return err
	}

	// 5. Seed Certifications & Legalities
	if err := seedCertificationsLegalities(db); err != nil {
		return err
	}

	// 6. Seed Services Categories (Master Data 3 Solusi)
	if err := seedServiceCategories(db); err != nil {
		return err
	}

	// 7. Seed Services (4 Pillars)
	if err := seedServices(db); err != nil {
		return err
	}

	// 8. Seed Portfolios (6 Case Studies)
	if err := seedPortfolios(db); err != nil {
		return err
	}

	// 9. Seed Clients & Technology Partners
	if err := seedClientsPartners(db); err != nil {
		return err
	}

	// 10. Seed CTA Banner
	if err := seedCtaBanner(db); err != nil {
		return err
	}

	log.Println("✅ Seeding completed successfully!")
	return nil
}

func seedUsers(db *gorm.DB) error {
	users := []struct {
		FullName string
		Email    string
		Password string
		Role     string
	}{
		{
			FullName: "Super Administrator",
			Email:    "admin@ditama.co.id",
			Password: "AdminDitama2025!",
			Role:     "SUPER_ADMIN",
		},
		{
			FullName: "Content Editor",
			Email:    "editor@ditama.co.id",
			Password: "EditorDitama2025!",
			Role:     "EDITOR",
		},
	}

	for _, u := range users {
		var existing models.User
		if err := db.Where("LOWER(email) = LOWER(?)", u.Email).First(&existing).Error; err != nil {
			hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
			if err != nil {
				return err
			}
			newUser := models.User{
				FullName:     u.FullName,
				Email:        u.Email,
				PasswordHash: string(hash),
				Role:         u.Role,
				IsActive:     true,
			}
			if err := db.Create(&newUser).Error; err != nil {
				return err
			}
			log.Printf("  -> User seeded: %s (%s)", u.Email, u.Role)
		}
	}
	return nil
}

func seedSiteSettings(db *gorm.DB) error {
	var count int64
	db.Model(&models.SiteSetting{}).Where("deleted_at IS NULL").Count(&count)
	if count == 0 {
		settings := models.SiteSetting{
			CompanyName:        "PT. Ditama Inti Teknologi",
			CompanyTagline:     "General Supplier, IT Solution & System Integration",
			LogoURL:            "/assets/images/logo.png",
			FooterDescription:  "Perusahaan perdagangan umum dan jasa teknologi terintegrasi yang berfokus pada kecepatan layanan, kualitas pengerjaan, dan kepatuhan keselamatan kerja K3.",
			OfficeAddress:      "Komp. PCI Blok D 115 No. 06-07, Cilegon - Banten 42423",
			PicName:            "Rezza Prawiratama",
			PhoneWhatsapp:      "+62813-1050-6456",
			EmailOfficial:      "ditamadigital@gmail.com",
			WebsiteURL:         "https://www.ditamadigital.co.id",
			SocialLinks:        `{"linkedin":"https://linkedin.com/company/ditamadigital","instagram":"https://instagram.com/ditamadigital"}`,
			SeoMetaTitle:       "PT. Ditama Inti Teknologi | Solusi IT, Gate System & General Supplier",
			SeoMetaDescription: "Mitra terpercaya BUMN & industri sejak 2019 untuk Software Development, System Integration, Smart Gate System, dan General Supplier bersertifikat CSMS K3.",
			SeoKeywords:        "PT Ditama Inti Teknologi, Software Development Cilegon, IT Consultant, Gate Management System, Barrier Gate, Turnstile, Access Control, General Supplier Industri, CSMS PLN, System Integration SCADA",
			SeoOgImageURL:      "/assets/images/og-image.jpg",
		}
		if err := db.Create(&settings).Error; err != nil {
			return err
		}
		log.Println("  -> Site settings seeded")
	} else {
		var existing models.SiteSetting
		if err := db.Where("deleted_at IS NULL").First(&existing).Error; err == nil && existing.SeoKeywords == "" {
			db.Model(&existing).Update("seo_keywords", "PT Ditama Inti Teknologi, Software Development Cilegon, IT Consultant, Gate Management System, Barrier Gate, Turnstile, Access Control, General Supplier Industri, CSMS PLN, System Integration SCADA")
			log.Println("  -> Site settings updated with default SEO keywords")
		}
	}
	return nil
}

func seedHero(db *gorm.DB) error {
	var count int64
	db.Model(&models.HeroSection{}).Where("deleted_at IS NULL").Count(&count)
	if count == 0 {
		hero := models.HeroSection{
			BadgeText:        "Mitra Terpercaya BUMN & Industri Sejak 2019",
			HeadlineH1:       "Solusi IT Terintegrasi, Gate System & General Supplier Industri",
			Subheadline:      "Menyediakan layanan Software Development, System Integration, Keamanan Akses (Gate & CCTV), serta pengadaan mekanikal & elektrikal berstandar K3.",
			PrimaryCtaText:   "Hubungi Kami",
			PrimaryCtaLink:   "#kontak",
			SecondaryCtaText: "Lihat Portofolio",
			SecondaryCtaLink: "#portofolio",
			HeroImageURL:     "",
			IsActive:         true,
		}
		if err := db.Create(&hero).Error; err != nil {
			return err
		}
		log.Println("  -> Hero section seeded")
	}
	return nil
}

func seedAbout(db *gorm.DB) error {
	var count int64
	db.Model(&models.AboutSection{}).Where("deleted_at IS NULL").Count(&count)
	if count == 0 {
		about := models.AboutSection{
			Title:            "Tentang PT. Ditama Inti Teknologi",
			DescriptionHTML:  "Berdiri sejak tahun 2019 di Cilegon, Banten, PT. DITAMA INTI TEKNOLOGI merupakan perusahaan perdagangan umum dan jasa yang bergerak di bidang General Supplier, IT Solution & Multimedia, System Integration, serta Electrical Services. Kami berkomitmen menghadirkan solusi industri yang cepat, terintegrasi, berorientasi pada kualitas tinggi, dan mematuhi standar keselamatan kerja (K3).",
			VisionText:       "Menjadi perusahaan General Supplier dan penyedia solusi teknologi terintegrasi di Indonesia yang terkemuka dalam pertumbuhan, efisiensi, dan reputasi.",
			MissionItems:     `["Menyediakan solusi bernilai tambah yang mengoptimalkan kepuasan pelanggan.", "Menciptakan lapangan kerja berkualitas dan berperan aktif sebagai warga korporat yang baik."]`,
			EstablishedYear: 2019,
			IsActive:         true,
		}
		if err := db.Create(&about).Error; err != nil {
			return err
		}
		log.Println("  -> About section seeded")
	}
	return nil
}

func seedCertificationsLegalities(db *gorm.DB) error {
	var count int64
	db.Model(&models.CertificationLegality{}).Where("deleted_at IS NULL").Count(&count)
	if count == 0 {
		items := []models.CertificationLegality{
			{
				Category:       "CSMS_K3",
				Title:          "Sertifikat CSMS PLN (Risiko Tinggi & Risiko Rendah)",
				DocumentNumber: "CSMS-PLN-2023",
				Issuer:         "PT PLN Indonesia Power & PT PLN Nusantara Power",
				RiskLevel:      "Risiko Tinggi & Risiko Rendah",
				DisplayOrder:   1,
				IsActive:       true,
			},
			{
				Category:       "LEGALITY",
				Title:          "Akta Pendirian Perusahaan",
				DocumentNumber: "AHU-11 Tahun 2019",
				Issuer:         "Kemenkumham RI",
				DisplayOrder:   2,
				IsActive:       true,
			},
			{
				Category:       "LEGALITY",
				Title:          "Nomor Induk Berusaha (NIB)",
				DocumentNumber: "0409230098635",
				Issuer:         "OSS Republik Indonesia",
				DisplayOrder:   3,
				IsActive:       true,
			},
			{
				Category:       "LEGALITY",
				Title:          "NPWP Perusahaan",
				DocumentNumber: "091.005.114.3-417.000",
				Issuer:         "Direktorat Jenderal Pajak",
				DisplayOrder:   4,
				IsActive:       true,
			},
			{
				Category:       "LEGALITY",
				Title:          "Tanda Daftar Perusahaan (TDP)",
				DocumentNumber: "503/0066/B/DPMPTSP/2019",
				Issuer:         "DPMPTSP",
				DisplayOrder:   5,
				IsActive:       true,
			},
		}
		for _, item := range items {
			if err := db.Create(&item).Error; err != nil {
				return err
			}
		}
		log.Println("  -> Certifications & legalities seeded")
	}
	return nil
}

func seedServiceCategories(db *gorm.DB) error {
	categories := []models.ServiceCategory{
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

	for _, c := range categories {
		var existing models.ServiceCategory
		if err := db.Where("code = ?", c.Code).First(&existing).Error; err != nil {
			if err := db.Create(&c).Error; err != nil {
				return err
			}
			log.Printf("  -> Service Category seeded: %s (%s)", c.Name, c.Code)
		} else {
			// Update name & description if already exists
			db.Model(&existing).Updates(map[string]interface{}{
				"name":          c.Name,
				"description":   c.Description,
				"display_order": c.DisplayOrder,
				"is_active":     c.IsActive,
			})
		}
	}
	return nil
}

func seedServices(db *gorm.DB) error {
	services := []models.Service{
		{
			Title:            "IT Solution & Multimedia",
			Slug:             "it-solution-multimedia",
			ShortDescription: "Pengembangan aplikasi kustom sesuai alur bisnis perusahaan dan produksi media visual interaktif.",
			BulletFeatures:   `["Custom Software (Web & Mobile)", "AI & OCR Plat Nomor Kendaraan", "Visitor Management & People Counting", "Animasi 2D/3D Safety Induction"]`,
			IconName:         "code",
			DisplayOrder:     1,
			IsActive:         true,
		},
		{
			Title:            "System Integration",
			Slug:             "system-integration",
			ShortDescription: "Menghubungkan perangkat keras, sensor lapangan, dan basis data ke dalam satu dashboard terpusat.",
			BulletFeatures:   `["Integrasi SCADA, MAXIMO & ELLIPSE", "Sinkronisasi Data Pembangkit", "Dashboard Pemantauan Lintas Unit", "Infrastruktur Jaringan & Server"]`,
			IconName:         "database",
			DisplayOrder:     2,
			IsActive:         true,
		},
		{
			Title:            "Gate & Security System",
			Slug:             "gate-security-system",
			ShortDescription: "Sistem kontrol akses fisik dan keamanan area berisiko tinggi untuk pabrik, gedung, dan kawasan vital.",
			BulletFeatures:   `["Barrier Gate & Gate Management System", "Turnstile Full High & Tripod", "Access Control Door & Alarm", "Instalasi & Maintenance CCTV"]`,
			IconName:         "shield",
			DisplayOrder:     3,
			IsActive:         true,
		},
		{
			Title:            "General Supplier & Electrical",
			Slug:             "general-supplier-electrical",
			ShortDescription: "Pengadaan suku cadang industri serta jasa pemeliharaan kelistrikan dan konstruksi penunjang.",
			BulletFeatures:   `["Produk Mekanikal, Elektrikal & Instrumen", "Maintenance Lift & Motor Generator", "Rewinding Motor AC/DC (Low-High Volt)", "Fabrikasi & Instalasi Struktur 6KV"]`,
			IconName:         "zap",
			DisplayOrder:     4,
			IsActive:         true,
		},
	}

	for _, s := range services {
		var existing models.Service
		if err := db.Where("slug = ?", s.Slug).First(&existing).Error; err != nil {
			if err := db.Create(&s).Error; err != nil {
				return err
			}
			log.Printf("  -> Service seeded: %s", s.Title)
		}
	}
	return nil
}

func seedPortfolios(db *gorm.DB) error {
	portfolios := []models.Portfolio{
		{
			Title:                   "E-Preventive Maintenance & SIDAK AI",
			Slug:                    "pln-np-sidak-ai",
			ClientName:              "PT. PLN Nusantara Power",
			Category:                "SOFTWARE_SOLUTION",
			Summary:                 "Aplikasi mobile dan website untuk eksekusi preventive maintenance PLTU serta Sistem Data Keamanan (SIDAK) seluruh unit dengan AI rekap data & pemetaan kerawanan.",
			ChallengeSolutionDetail: "Integrasi data pemeliharaan unit pembangkit tenaga listrik dengan pemrosesan AI otomatis dan pemetaan risiko secara real-time.",
			DisplayOrder:            1,
			IsFeatured:              true,
			IsActive:                true,
		},
		{
			Title:                   "Turnstile Full High & People Counting",
			Slug:                    "semen-gresik-turnstile",
			ClientName:              "PT. Semen Gresik Rembang Tbk.",
			Category:                "SECURITY_SYSTEM",
			Summary:                 "Pemasangan unit Turnstile Full High, sistem Access Control terpadu, serta integrasi sistem Vault dengan fitur Custom People Counting untuk akurasi data personel pabrik.",
			ChallengeSolutionDetail: "Pengamanan perimeter fasilitas produksi semen dengan barrier turnstile fisik dan integrasi people counting otomatis.",
			DisplayOrder:            2,
			IsFeatured:              true,
			IsActive:                true,
		},
		{
			Title:                   "Access Control & Radiation Protection",
			Slug:                    "gleneagles-radiation-protection",
			ClientName:              "Gleneagles KL & Likas Hospital",
			Category:                "SECURITY_SYSTEM",
			Summary:                 "Sistem integrasi dan instalasi Access Control, CCTV, serta sistem alarm proteksi radiasi fisik (Physical Protection Radiation) pada fasilitas medis internasional.",
			ChallengeSolutionDetail: "Standar kepatuhan proteksi radiasi medis di fasilitas kesehatan Kuala Lumpur & Kota Kinabalu.",
			DisplayOrder:            3,
			IsFeatured:              true,
			IsActive:                true,
		},
		{
			Title:                   "Barrier Gate & CCTV Maintenance",
			Slug:                    "pln-muara-karang-barrier-gate",
			ClientName:              "PT. PLN Nusantara Power UP Muara Karang",
			Category:                "SECURITY_SYSTEM",
			Summary:                 "Perbaikan, pemasangan Barrier Gate, integrasi Visitor Management System dengan OCR plat nomor, serta pemeliharaan berkala CCTV & Gate Management System.",
			ChallengeSolutionDetail: "Kontrak multi-tahun (2025-2028) pemeliharaan sistem gerbang otomatis dan CCTV di pembangkit Muara Karang.",
			DisplayOrder:            4,
			IsFeatured:              true,
			IsActive:                true,
		},
		{
			Title:                   "Instalasi Access Door Kantor Pusat",
			Slug:                    "shopee-office-access-door",
			ClientName:              "PT. Shopee Office",
			Category:                "SECURITY_SYSTEM",
			Summary:                 "Pemasangan dan konfigurasi sistem Access Door berstandar korporat untuk pengamanan akses ruang kerja di Sopo Del Tower Kuningan, Jakarta Selatan.",
			ChallengeSolutionDetail: "Pengamanan akses ruang kerja eksekutif lantai 28 Sopo Del Tower Kuningan.",
			DisplayOrder:            5,
			IsFeatured:              true,
			IsActive:                true,
		},
		{
			Title:                   "Fabrication Pondation & Pipe Rack 6KV",
			Slug:                    "krakatau-posco-pipe-rack",
			ClientName:              "PT. Krakatau Posco",
			Category:                "SYSTEM_INTEGRATOR",
			Summary:                 "Pekerjaan fabrikasi pondasi, pemasangan struktur baja Pipe Rack 6KV, serta dukungan pengadaan mekanikal & elektrikal di kawasan industri Cilegon.",
			ChallengeSolutionDetail: "Pekerjaan rekayasa struktur industri berat dan jalur kelistrikan 6KV.",
			DisplayOrder:            6,
			IsFeatured:              true,
			IsActive:                true,
		},
	}

	for _, p := range portfolios {
		var existing models.Portfolio
		if err := db.Where("slug = ?", p.Slug).First(&existing).Error; err != nil {
			if err := db.Create(&p).Error; err != nil {
				return err
			}
			log.Printf("  -> Portfolio seeded: %s", p.Title)
		} else {
			// Update kategori, title, client_name jika sudah ada
			db.Model(&existing).Updates(map[string]interface{}{
				"title":                     p.Title,
				"client_name":              p.ClientName,
				"category":                 p.Category,
				"summary":                  p.Summary,
				"challenge_solution_detail": p.ChallengeSolutionDetail,
				"display_order":            p.DisplayOrder,
				"is_featured":              p.IsFeatured,
				"is_active":                p.IsActive,
			})
			log.Printf("  -> Portfolio updated: %s (%s)", p.Title, p.Category)
		}
	}
	return nil
}

func seedClientsPartners(db *gorm.DB) error {
	items := []models.ClientPartner{
		// Clients
		{Name: "PT. PLN Indonesia Power", Type: "CLIENT", DisplayOrder: 1, IsActive: true},
		{Name: "PT. PLN Nusantara Power", Type: "CLIENT", DisplayOrder: 2, IsActive: true},
		{Name: "PT. Krakatau Posco", Type: "CLIENT", DisplayOrder: 3, IsActive: true},
		{Name: "Bank Indonesia", Type: "CLIENT", DisplayOrder: 4, IsActive: true},
		{Name: "BNPB", Type: "CLIENT", DisplayOrder: 5, IsActive: true},
		{Name: "PT. Semen Gresik", Type: "CLIENT", DisplayOrder: 6, IsActive: true},
		{Name: "Shopee Indonesia", Type: "CLIENT", DisplayOrder: 7, IsActive: true},
		// Tech Partners
		{Name: "Honeywell", Type: "TECH_PARTNER", DisplayOrder: 10, IsActive: true},
		{Name: "CISCO", Type: "TECH_PARTNER", DisplayOrder: 11, IsActive: true},
		{Name: "HIKVISION", Type: "TECH_PARTNER", DisplayOrder: 12, IsActive: true},
		{Name: "Dahua Technology", Type: "TECH_PARTNER", DisplayOrder: 13, IsActive: true},
		{Name: "ZKTeco", Type: "TECH_PARTNER", DisplayOrder: 14, IsActive: true},
		{Name: "Hanwha Vision", Type: "TECH_PARTNER", DisplayOrder: 15, IsActive: true},
		{Name: "Texecom", Type: "TECH_PARTNER", DisplayOrder: 16, IsActive: true},
		{Name: "FALCO", Type: "TECH_PARTNER", DisplayOrder: 17, IsActive: true},
		{Name: "LS-AG Cable Indonesia", Type: "TECH_PARTNER", DisplayOrder: 18, IsActive: true},
	}

	for _, item := range items {
		var existing models.ClientPartner
		if err := db.Where("name = ? AND type = ?", item.Name, item.Type).First(&existing).Error; err != nil {
			if err := db.Create(&item).Error; err != nil {
				return err
			}
		}
	}
	log.Println("  -> Clients & partners seeded")
	return nil
}

func seedCtaBanner(db *gorm.DB) error {
	var count int64
	db.Model(&models.CtaBanner{}).Where("deleted_at IS NULL").Count(&count)
	if count == 0 {
		cta := models.CtaBanner{
			Headline:         "Siap Mengintegrasikan Sistem IT & Keamanan Fasilitas Anda?",
			Subtext:          "Mitra terpercaya BUMN & industri sejak 2019 untuk Software Development, System Integration, dan Keamanan Akses.",
			ButtonText:       "Contact Us",
			ButtonActionType: "MODAL",
			ButtonTarget:     "#contact-modal",
			IsActive:         true,
		}
		if err := db.Create(&cta).Error; err != nil {
			return err
		}
		log.Println("  -> CTA banner seeded")
	}
	return nil
}
