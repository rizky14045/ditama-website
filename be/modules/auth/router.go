package auth

import (
	"template/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupRoutes initializes routes for authentication endpoints
func SetupRoutes(router *gin.RouterGroup, db *gorm.DB) {
	authRepo := NewAuthRepository(db)
	authService := NewAuthService(authRepo)
	authHandler := NewAuthHandler(authService, db)

	// Auth routes under /admin/auth and legacy /auth
	auth := router.Group("/admin/auth")
	{
		auth.POST("/login", authHandler.Login)
		auth.POST("/logout", middleware.JWTMiddleware(), authHandler.Logout)
	}

	legacyAuth := router.Group("/auth")
	{
		legacyAuth.POST("/login", authHandler.Login)
		legacyAuth.POST("/logout", middleware.JWTMiddleware(), authHandler.Logout)
	}
}
