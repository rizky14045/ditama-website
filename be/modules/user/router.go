package user

import (
	"template/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupRoutes initializes routes for user-related endpoints
func SetupRoutes(router *gin.RouterGroup, db *gorm.DB) {
	// Jalankan migrasi user
	if err := migrateUser(db); err != nil {
		panic("failed to migrate user table: " + err.Error())
	}

	// Dependency injection
	userRepo := NewUserRepository(db)
	userService := NewUserService(userRepo)
	userHandler := NewUserHandler(userService)

	// Route
	app := router.Group("/user")
	app.Use(middleware.JWTMiddleware())
	app.GET("/", userHandler.Index)
	app.GET("/:id", userHandler.Show)
	app.POST("/create", userHandler.Create)
	app.PATCH("/update/:id", userHandler.Update)
	app.DELETE("/destroy/:id", userHandler.Destroy)
}
