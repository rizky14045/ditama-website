package main

import (
	"log"
	"os"
	"time"

	"template/config"
	"template/database"
	"template/database/seeder"
	"template/middleware"
	"template/models"
	"template/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/ulule/limiter/v3"
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

func main() {
	// Load environment variables
	err := config.LoadEnv()
	if err != nil {
		log.Printf("Warning loading .env: %v", err)
	}

	// Connect to Database
	db, err := database.Connect()
	if err != nil {
		log.Printf("Database connection warning: %v", err)
	} else if db != nil {
		log.Println("Running AutoMigrate for tables...")
		_ = db.AutoMigrate(
			&models.User{},
			&models.SiteSetting{},
			&models.HeroSection{},
			&models.AboutSection{},
			&models.CertificationLegality{},
			&models.ServiceCategory{},
			&models.Service{},
			&models.Portfolio{},
			&models.ClientPartner{},
			&models.CtaBanner{},
			&models.Inquiry{},
			&models.AuditLog{},
		)

		// Ensure all existing portfolios are active for compro visibility
		_ = db.Model(&models.Portfolio{}).Where("is_active IS FALSE OR is_active IS NULL").Update("is_active", true)

		// Auto-initialize default service categories if table is empty
		var countCats int64
		if err := db.Model(&models.ServiceCategory{}).Where("deleted_at IS NULL").Count(&countCats).Error; err == nil && countCats == 0 {
			log.Println("Initializing default Service Categories master data...")
			_ = seeder.Seed(db)
		}

		// Ensure portfolios are seeded if table is empty
		var countPortfolios int64
		if err := db.Model(&models.Portfolio{}).Where("deleted_at IS NULL").Count(&countPortfolios).Error; err == nil && countPortfolios == 0 {
			log.Println("Initializing default Portfolios...")
			_ = seeder.Seed(db)
		}
	}

	// CLI argument for running database seeder
	if len(os.Args) > 1 && (os.Args[1] == "seed" || os.Args[1] == "--seed") {
		if db == nil {
			log.Fatal("Cannot seed: database connection failed")
		}
		if err := seeder.Seed(db); err != nil {
			log.Fatalf("Seeding failed: %v", err)
		}
		log.Println("Database seeder finished successfully!")
		return
	}

	// Rate limiter (e.g., 60 requests per minute)
	rate, err := limiter.NewRateFromFormatted("60-M")
	if err != nil {
		log.Fatal(err)
	}

	store := memory.NewStore()
	limiterInstance := limiter.New(store, rate)

	// Init Gin router with hardened proxy security
	if os.Getenv("APP_ENV") == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.Default()
	_ = r.SetTrustedProxies([]string{"127.0.0.1", "::1"})

	// Enterprise Security Headers
	r.Use(middleware.SecurityHeaders())

	// CORS Configuration (Hardened for Production)
	allowedOrigins := []string{
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		"http://localhost:8070",
		"https://ditamadigital.co.id",
		"https://www.ditamadigital.co.id",
	}
	if envOrigin := os.Getenv("APP_ORIGIN"); envOrigin != "" {
		allowedOrigins = append(allowedOrigins, envOrigin)
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-Requested-With", "Cache-Control", "Pragma", "Expires"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Rate Limiting Middleware
	r.Use(middleware.RateLimiter(limiterInstance))

	// Static route for uploaded images and PDFs with browser caching
	if err := os.MkdirAll("./uploads", 0755); err == nil {
		r.Group("/uploads", func(c *gin.Context) {
			c.Header("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800")
			c.Next()
		}).Static("", "./uploads")
	}

	// Register all RESTful API routes
	routes.SetupRoutes(r, db)

	// Run the server on configured PORT
	port := os.Getenv("PORT")
	if port == "" {
		port = "8070"
	}
	log.Printf("PT. Ditama Inti Teknologi API running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
