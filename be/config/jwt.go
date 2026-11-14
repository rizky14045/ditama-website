package config

import (
	"os"

	"github.com/golang-jwt/jwt/v5"
)

func GetJwtKey() []byte {
	secret := os.Getenv("JWT_SECRET")
	if len(secret) < 32 {
		// Minimum 256-bit requirement for HMAC-SHA256
		secret = "f7e9b41a5d2048e9c183b5478d1e39a06c28f4e72391054a8b7c6d5e1f0a2345"
	}
	return []byte(secret)
}

type Claims struct {
	UserID   string `json:"user_id"`
	Email    string `json:"email"`
	FullName string `json:"full_name"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}
