package auditlog

import (
	"encoding/json"
	"template/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// LogEvent records an audit entry safely
func LogEvent(db *gorm.DB, c *gin.Context, actionType, moduleName, recordID string, before, after interface{}) {
	if db == nil || c == nil {
		return
	}

	var userUUID *uuid.UUID
	userEmail := "anonymous"

	if val, exists := c.Get("user_id"); exists {
		if uidStr, ok := val.(string); ok && uidStr != "" {
			if parsed, err := uuid.Parse(uidStr); err == nil {
				userUUID = &parsed
			}
		}
	}

	if val, exists := c.Get("user_email"); exists {
		if emailStr, ok := val.(string); ok && emailStr != "" {
			userEmail = emailStr
		}
	}

	var beforeJSON, afterJSON string
	if before != nil {
		if bytes, err := json.Marshal(before); err == nil {
			beforeJSON = string(bytes)
		}
	}
	if after != nil {
		if bytes, err := json.Marshal(after); err == nil {
			afterJSON = string(bytes)
		}
	}

	logEntry := models.AuditLog{
		UserID:     userUUID,
		UserEmail:  userEmail,
		ActionType: actionType,
		HttpMethod: c.Request.Method,
		Endpoint:   c.Request.URL.Path,
		ModuleName: moduleName,
		RecordID:   recordID,
		BeforeData: beforeJSON,
		AfterData:  afterJSON,
		IPAddress:  c.ClientIP(),
		UserAgent:  c.Request.UserAgent(),
	}

	go func(entry models.AuditLog) {
		defer func() {
			_ = recover() // Catch any unexpected goroutine panic safely
		}()
		if db != nil {
			db.Create(&entry)
		}
	}(logEntry)
}
