package middleware

import (
	"net/http"
	"strings"
	"template/config"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status":  false,
				"message": "Authorization header missing or invalid.",
				"data":    nil,
				"error":   "Unauthorized",
			})
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims := &config.Claims{}

		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return config.GetJwtKey(), nil
		}, jwt.WithValidMethods([]string{"HS256"}))

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status":  false,
				"message": "Invalid or expired token.",
				"data":    nil,
				"error":   "Invalid Token",
			})
			return
		}

		// Save user info to context
		c.Set("user_id", claims.UserID)
		c.Set("user_email", claims.Email)
		c.Set("user_role", claims.Role)
		c.Next()
	}
}

// RequireRole checks if user has one of allowed roles
func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("user_role")
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"status":  false,
				"message": "Access forbidden: role not found",
			})
			return
		}

		roleStr, ok := userRole.(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"status":  false,
				"message": "Access forbidden: invalid role format",
			})
			return
		}

		// Super admin always has full privileges across all endpoints
		if strings.EqualFold(roleStr, "super_admin") || strings.EqualFold(roleStr, "superadmin") {
			c.Next()
			return
		}

		for _, r := range roles {
			if strings.EqualFold(r, roleStr) {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"status":  false,
			"message": "Access forbidden: insufficient permissions",
		})
	}
}
