package auth

import (
	"errors"
	"net/http"
	"template/helper"
	"template/modules/auditlog"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthHandler struct {
	service AuthService
	db      *gorm.DB
}

func NewAuthHandler(service AuthService, db *gorm.DB) *AuthHandler {
	return &AuthHandler{service: service, db: db}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var request AuthRequest
	err := c.ShouldBindJSON(&request)
	if err != nil {
		var validationErrors validator.ValidationErrors
		if errors.As(err, &validationErrors) {
			errorsMap := make(map[string][]string)
			for _, fieldErr := range validationErrors {
				fieldName := fieldErr.Field()
				message := helper.ValidationMessage(fieldErr)
				errorsMap[fieldName] = append(errorsMap[fieldName], message)
			}

			helper.JsonResponse(
				c,
				false,
				"The given data was invalid.",
				nil,
				gin.H{"errors": errorsMap},
				http.StatusBadRequest,
			)
			return
		}

		helper.JsonResponse(c, false, "Invalid request payload", nil, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := h.service.FindByEmail(request.Email)
	if err != nil || !user.IsActive {
		auditlog.LogEvent(h.db, c, "LOGIN_FAILED", "auth", request.Email, nil, gin.H{"reason": "User not found or inactive"})
		helper.JsonResponse(c, false, "Invalid email or password", nil, "Authentication failed", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(request.Password))
	if err != nil {
		auditlog.LogEvent(h.db, c, "LOGIN_FAILED", "auth", user.ID.String(), nil, gin.H{"reason": "Password mismatch"})
		helper.JsonResponse(c, false, "Invalid email or password", nil, "Authentication failed", http.StatusUnauthorized)
		return
	}

	token, err := h.service.JwtToken(user)
	if err != nil {
		helper.JsonResponse(c, false, "Failed to generate authorization token", nil, err.Error(), http.StatusInternalServerError)
		return
	}

	// Update last login
	h.service.UpdateLastLogin(user.ID.String())

	// Audit Log
	c.Set("user_id", user.ID.String())
	c.Set("user_email", user.Email)
	auditlog.LogEvent(h.db, c, "LOGIN", "auth", user.ID.String(), nil, gin.H{
		"full_name": user.FullName,
		"role":      user.Role,
	})

	helper.JsonResponse(c, true, "Login successful", gin.H{
		"token": token,
		"user": gin.H{
			"id":        user.ID,
			"full_name": user.FullName,
			"email":     user.Email,
			"role":      user.Role,
		},
	}, nil, http.StatusOK)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	auditlog.LogEvent(h.db, c, "LOGOUT", "auth", "", nil, nil)
	helper.JsonResponse(c, true, "Logout successful", nil, nil, http.StatusOK)
}
