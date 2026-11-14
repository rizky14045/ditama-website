package routes

import (
	"template/modules/auditlog"
	"template/modules/auth"
	"template/modules/inquiry"
	"template/modules/public"
	"template/modules/sections"
	"template/modules/settings"
	"template/modules/upload"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB) {
	// Fallback handlers for legacy template routes to prevent 404
	emptyArrayHandler := func(c *gin.Context) {
		c.JSON(200, gin.H{"status": true, "data": []interface{}{}})
	}
	emptyObjHandler := func(c *gin.Context) {
		c.JSON(200, gin.H{"status": true, "data": gin.H{}})
	}

	// Standard v1 API endpoints according to blueprint
	v1 := router.Group("/api/v1")
	{
		public.SetupRoutes(v1, db)
		auth.SetupRoutes(v1, db)
		settings.SetupRoutes(v1, db)
		sections.SetupRoutes(v1, db)
		inquiry.SetupRoutes(v1, db)
		upload.SetupRoutes(v1, db)
		auditlog.SetupRoutes(v1, db)

		for _, path := range []string{
			"/tasks", "/tasks/*path",
			"/projects", "/projects/*path",
			"/boards", "/boards/*path",
			"/calendars", "/calendars/*path",
			"/email", "/email/*path",
			"/chat", "/chat/*path",
			"/comments", "/comments/*path",
		} {
			v1.GET(path, emptyArrayHandler)
			v1.POST(path, emptyObjHandler)
			v1.PUT(path, emptyObjHandler)
			v1.DELETE(path, emptyObjHandler)
		}
	}

	// Legacy /api alias for frontend compatibility
	api := router.Group("/api")
	{
		public.SetupRoutes(api, db)
		auth.SetupRoutes(api, db)
		settings.SetupRoutes(api, db)
		sections.SetupRoutes(api, db)
		inquiry.SetupRoutes(api, db)
		upload.SetupRoutes(api, db)
		auditlog.SetupRoutes(api, db)

		for _, path := range []string{
			"/tasks", "/tasks/*path",
			"/projects", "/projects/*path",
			"/boards", "/boards/*path",
			"/calendars", "/calendars/*path",
			"/email", "/email/*path",
			"/chat", "/chat/*path",
			"/comments", "/comments/*path",
		} {
			api.GET(path, emptyArrayHandler)
			api.POST(path, emptyObjHandler)
			api.PUT(path, emptyObjHandler)
			api.DELETE(path, emptyObjHandler)
		}
	}

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"app":     "PT. Ditama Inti Teknologi API",
			"version": "1.0.0",
		})
	})
}
