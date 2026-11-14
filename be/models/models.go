package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// BaseUUIDModel contains common UUID and audit timestamps
type BaseUUIDModel struct {
	ID        uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	CreatedBy *uuid.UUID     `gorm:"type:uuid" json:"created_by,omitempty"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	UpdatedBy *uuid.UUID     `gorm:"type:uuid" json:"updated_by,omitempty"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	DeletedBy *uuid.UUID     `gorm:"type:uuid" json:"deleted_by,omitempty"`
}

// User represents admin/editor users
type User struct {
	ID           uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	FullName     string         `gorm:"size:120;not null" json:"full_name"`
	Email        string         `gorm:"size:120;not null;uniqueIndex" json:"email"`
	PasswordHash string         `gorm:"type:text;not null" json:"-"`
	Role         string         `gorm:"type:varchar(30);default:'EDITOR';not null" json:"role"` // SUPER_ADMIN, EDITOR
	IsActive     bool           `gorm:"default:true;not null" json:"is_active"`
	LastLoginAt  *time.Time     `json:"last_login_at,omitempty"`
	CreatedAt    time.Time      `gorm:"autoCreateTime" json:"created_at"`
	CreatedBy    *uuid.UUID     `gorm:"type:uuid" json:"created_by,omitempty"`
	UpdatedAt    time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	UpdatedBy    *uuid.UUID     `gorm:"type:uuid" json:"updated_by,omitempty"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	DeletedBy    *uuid.UUID     `gorm:"type:uuid" json:"deleted_by,omitempty"`
}

func (User) TableName() string {
	return "users"
}

// SiteSetting represents global website branding and SEO settings
type SiteSetting struct {
	ID                 uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	CompanyName        string         `gorm:"size:150;not null;default:'PT. Ditama Inti Teknologi'" json:"company_name"`
	CompanyTagline     string         `gorm:"size:255;not null" json:"company_tagline"`
	LogoURL            string         `gorm:"type:text" json:"logo_url"`
	FaviconURL         string         `gorm:"type:text" json:"favicon_url"`
	FooterDescription  string         `gorm:"type:text" json:"footer_description"`
	OfficeAddress      string         `gorm:"type:text;not null" json:"office_address"`
	PicName            string         `gorm:"size:100" json:"pic_name"`
	PhoneWhatsapp      string         `gorm:"size:30" json:"phone_whatsapp"`
	EmailOfficial      string         `gorm:"size:100" json:"email_official"`
	WebsiteURL         string         `gorm:"size:150" json:"website_url"`
	SocialLinks        string         `gorm:"type:jsonb;default:'{}'" json:"social_links"`
	SeoMetaTitle       string         `gorm:"size:70;not null" json:"seo_meta_title"`
	SeoMetaDescription string         `gorm:"size:160;not null" json:"seo_meta_description"`
	SeoOgImageURL      string         `gorm:"type:text" json:"seo_og_image_url"`
	CreatedAt          time.Time      `gorm:"autoCreateTime" json:"created_at"`
	CreatedBy          *uuid.UUID     `gorm:"type:uuid" json:"created_by,omitempty"`
	UpdatedAt          time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	UpdatedBy          *uuid.UUID     `gorm:"type:uuid" json:"updated_by,omitempty"`
	DeletedAt          gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	DeletedBy          *uuid.UUID     `gorm:"type:uuid" json:"deleted_by,omitempty"`
}

func (SiteSetting) TableName() string {
	return "site_settings"
}

// HeroSection represents hero banner content
type HeroSection struct {
	BaseUUIDModel
	BadgeText        string `gorm:"size:120;not null" json:"badge_text"`
	HeadlineH1       string `gorm:"size:255;not null" json:"headline_h1"`
	Subheadline      string `gorm:"type:text;not null" json:"subheadline"`
	PrimaryCtaText   string `gorm:"size:60;default:'Hubungi Kami'" json:"primary_cta_text"`
	PrimaryCtaLink   string `gorm:"size:255;default:'#kontak'" json:"primary_cta_link"`
	SecondaryCtaText string `gorm:"size:60;default:'Lihat Portofolio'" json:"secondary_cta_text"`
	SecondaryCtaLink string `gorm:"size:255;default:'#portofolio'" json:"secondary_cta_link"`
	HeroImageURL     string `gorm:"type:text" json:"hero_image_url"`
	IsActive         bool   `gorm:"default:true;not null" json:"is_active"`
}

func (HeroSection) TableName() string {
	return "hero_sections"
}

// AboutSection represents company background, vision & mission
type AboutSection struct {
	BaseUUIDModel
	Title           string `gorm:"size:150;not null" json:"title"`
	DescriptionHTML string `gorm:"type:text;not null" json:"description_html"`
	VisionText      string `gorm:"type:text;not null" json:"vision_text"`
	MissionItems    string `gorm:"type:jsonb;default:'[]'" json:"mission_items"`
	EstablishedYear int    `gorm:"default:2019" json:"established_year"`
	ExperienceBadge string `gorm:"size:100;default:'Pengalaman Industri'" json:"experience_badge"`
	ExperienceYears string `gorm:"size:50;default:'7+ Tahun'" json:"experience_years"`
	ExperienceDesc  string `gorm:"type:text" json:"experience_desc"`
	ValuePillars    string `gorm:"type:jsonb;default:'[]'" json:"value_pillars"`
	IsActive        bool   `gorm:"default:true;not null" json:"is_active"`
}

func (AboutSection) TableName() string {
	return "about_sections"
}

// CertificationLegality represents CSMS K3 certifications & company legal documents
type CertificationLegality struct {
	BaseUUIDModel
	Category          string     `gorm:"type:varchar(50);not null" json:"category"` // CSMS_K3, LEGALITY
	Title             string     `gorm:"size:180;not null" json:"title"`
	DocumentNumber    string     `gorm:"size:120;not null" json:"document_number"`
	Issuer            string     `gorm:"size:150" json:"issuer"`
	RiskLevel         string     `gorm:"size:80" json:"risk_level"`
	ValidUntil        *time.Time `json:"valid_until,omitempty"`
	FileAttachmentURL string     `gorm:"type:text" json:"file_attachment_url"`
	DisplayOrder      int        `gorm:"default:0" json:"display_order"`
	IsActive          bool       `gorm:"default:true;not null" json:"is_active"`
}

func (CertificationLegality) TableName() string {
	return "certifications_legalities"
}

// Service represents the 4 core service pillars
type Service struct {
	BaseUUIDModel
	Title            string `gorm:"size:120;not null" json:"title"`
	Slug             string `gorm:"size:140;not null;uniqueIndex" json:"slug"`
	ShortDescription string `gorm:"type:text;not null" json:"short_description"`
	BulletFeatures   string `gorm:"type:jsonb;default:'[]'" json:"bullet_features"`
	IconName         string `gorm:"size:60" json:"icon_name"`
	DisplayOrder     int    `gorm:"default:0" json:"display_order"`
	IsActive         bool   `gorm:"default:true;not null" json:"is_active"`
}

func (Service) TableName() string {
	return "services"
}

// Portfolio represents case studies and project portfolios
type Portfolio struct {
	BaseUUIDModel
	Title                   string `gorm:"size:180;not null" json:"title"`
	Slug                    string `gorm:"size:200;not null;uniqueIndex" json:"slug"`
	ClientName              string `gorm:"size:150;not null" json:"client_name"`
	Category                string `gorm:"type:varchar(50);not null" json:"category"` // IT_SOFTWARE, GATE_SECURITY, SUPPLIER_ELECTRICAL
	Summary                 string `gorm:"type:text;not null" json:"summary"`
	ChallengeSolutionDetail string `gorm:"type:text" json:"challenge_solution_detail"`
	ThumbnailURL            string `gorm:"type:text" json:"thumbnail_url"`
	ProjectYear             *int   `json:"project_year,omitempty"`
	SeoMetaTitle            string `gorm:"size:70" json:"seo_meta_title"`
	SeoMetaDescription      string `gorm:"size:160" json:"seo_meta_description"`
	SeoOgImageURL           string `gorm:"type:text" json:"seo_og_image_url"`
	IsFeatured              bool   `gorm:"default:true;not null" json:"is_featured"`
	DisplayOrder            int    `gorm:"default:0" json:"display_order"`
	IsActive                bool   `gorm:"default:true;not null" json:"is_active"`
}

func (Portfolio) TableName() string {
	return "portfolios"
}

// ClientPartner represents BUMN clients & Tech Principals
type ClientPartner struct {
	BaseUUIDModel
	Name         string `gorm:"size:150;not null" json:"name"`
	Type         string `gorm:"type:varchar(30);not null" json:"type"` // CLIENT, TECH_PARTNER
	LogoURL      string `gorm:"type:text" json:"logo_url"`
	WebsiteURL   string `gorm:"size:255" json:"website_url"`
	DisplayOrder int    `gorm:"default:0" json:"display_order"`
	IsActive     bool   `gorm:"default:true;not null" json:"is_active"`
}

func (ClientPartner) TableName() string {
	return "clients_partners"
}

// CtaBanner represents Call-to-Action banner
type CtaBanner struct {
	BaseUUIDModel
	Headline         string `gorm:"size:200;not null" json:"headline"`
	Subtext          string `gorm:"type:text;not null" json:"subtext"`
	ButtonText       string `gorm:"size:60;default:'Contact Us'" json:"button_text"`
	ButtonActionType string `gorm:"type:varchar(30);default:'MODAL'" json:"button_action_type"` // MODAL, LINK
	ButtonTarget     string `gorm:"size:255" json:"button_target"`
	IsActive         bool   `gorm:"default:true;not null" json:"is_active"`
}

func (CtaBanner) TableName() string {
	return "cta_banners"
}

// Inquiry represents contact consultation messages from the public site
type Inquiry struct {
	BaseUUIDModel
	SenderName    string `gorm:"size:150;not null" json:"sender_name"`
	SenderEmail   string `gorm:"size:150;not null" json:"sender_email"`
	ServiceTopic  string `gorm:"size:100;not null" json:"service_topic"`
	ProjectDetail string `gorm:"type:text;not null" json:"project_detail"`
	IPAddress     string `gorm:"size:45" json:"ip_address"`
	IsRead        bool   `gorm:"default:false;not null" json:"is_read"`
	Status        string `gorm:"size:50;default:'NEW'" json:"status"`
	AdminNotes    string `gorm:"type:text" json:"admin_notes"`
}

func (Inquiry) TableName() string {
	return "inquiries"
}

// AuditLog represents append-only activity and security audit trail
type AuditLog struct {
	ID          uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID      *uuid.UUID `gorm:"type:uuid" json:"user_id,omitempty"`
	UserEmail   string     `gorm:"size:120;not null" json:"user_email"`
	ActionType  string     `gorm:"type:varchar(50);not null" json:"action_type"`
	HttpMethod  string     `gorm:"size:10;not null" json:"http_method"`
	Endpoint    string     `gorm:"size:255;not null" json:"endpoint"`
	ModuleName  string     `gorm:"size:60;not null" json:"module_name"`
	RecordID    string     `gorm:"size:64" json:"record_id"`
	BeforeData  string     `gorm:"type:jsonb" json:"before_data,omitempty"`
	AfterData   string     `gorm:"type:jsonb" json:"after_data,omitempty"`
	IPAddress   string     `gorm:"size:45" json:"ip_address"`
	UserAgent   string     `gorm:"type:text" json:"user_agent"`
	CreatedAt   time.Time  `gorm:"autoCreateTime" json:"created_at"`
}

func (AuditLog) TableName() string {
	return "audit_logs"
}
