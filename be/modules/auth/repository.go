package auth

import (
	"errors"
	"os"
	"strings"
	"template/config"
	"template/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthRepository interface {
	FindByEmail(email string) (*models.User, error)
	JwtToken(user *models.User) (string, error)
	UpdateLastLogin(id string) error
}

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepository{db: db}
}

func (r *authRepository) FindByEmail(email string) (*models.User, error) {
	if r.db == nil {
		if strings.EqualFold(email, "admin@ditama.co.id") {
			hash, _ := bcrypt.GenerateFromPassword([]byte("AdminDitama2025!"), bcrypt.DefaultCost)
			uid := uuid.MustParse("00000000-0000-0000-0000-000000000001")
			return &models.User{
				ID:           uid,
				FullName:     "Super Admin Ditama",
				Email:        "admin@ditama.co.id",
				PasswordHash: string(hash),
				Role:         "super_admin",
				IsActive:     true,
			}, nil
		}
		return nil, errors.New("database not connected and user not found")
	}
	var user models.User
	if err := r.db.Where("LOWER(email) = LOWER(?) AND deleted_at IS NULL", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *authRepository) UpdateLastLogin(id string) error {
	if r.db == nil {
		return nil
	}
	now := time.Now()
	return r.db.Model(&models.User{}).Where("id = ?", id).Update("last_login_at", now).Error
}

func (r *authRepository) JwtToken(user *models.User) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)

	claims := &config.Claims{
		UserID:   user.ID.String(),
		Email:    user.Email,
		FullName: user.FullName,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    os.Getenv("APP_NAME"),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(config.GetJwtKey())
}
