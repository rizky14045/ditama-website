package auditlog

import (
	"net/http"
	"strconv"
	"template/helper"
	"template/middleware"
	"template/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct {
	DB *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

func (h *Handler) GetAuditLogs(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	module := c.Query("module")
	action := c.Query("action")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	offset := (page - 1) * limit

	if h.DB == nil {
		helper.JsonResponse(c, true, "Audit logs retrieved (database offline)", gin.H{
			"items": []models.AuditLog{},
			"meta": gin.H{
				"page":  page,
				"limit": limit,
				"total": 0,
			},
		}, nil, http.StatusOK)
		return
	}

	query := h.DB.Model(&models.AuditLog{})
	if module != "" {
		query = query.Where("module_name = ?", module)
	}
	if action != "" {
		query = query.Where("action_type = ?", action)
	}

	var total int64
	query.Count(&total)

	var logs []models.AuditLog
	if err := query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&logs).Error; err != nil {
		helper.JsonResponse(c, true, "Audit logs retrieved (empty/init)", gin.H{
			"items": []models.AuditLog{},
			"meta": gin.H{
				"page":  page,
				"limit": limit,
				"total": 0,
			},
		}, nil, http.StatusOK)
		return
	}

	helper.JsonResponse(c, true, "Audit logs retrieved successfully", gin.H{
		"items": logs,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
	}, nil, http.StatusOK)
}

func SetupRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	h := NewHandler(db)
	admin := rg.Group("/admin/audit-logs", middleware.JWTMiddleware())
	{
		admin.GET("", h.GetAuditLogs)
	}
}
