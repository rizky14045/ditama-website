-- ============================================================================
-- MIGRATION: 000001_init_schema.up.sql
-- PROJECT  : Company Profile & Dynamic CMS - PT. DITAMA INTI TEKNOLOGI
-- DATABASE : PostgreSQL 15+
-- FEATURES : UUID v4, Soft Deletes (deleted_at), Audit Fields (created_by,
--            updated_by, deleted_by), Immutable Audit Logs (before/after JSONB)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUM TYPES
CREATE TYPE user_role_enum AS ENUM ('SUPER_ADMIN', 'EDITOR');
CREATE TYPE legality_category_enum AS ENUM ('CSMS_K3', 'LEGALITY');
CREATE TYPE portfolio_category_enum AS ENUM ('IT_SOFTWARE', 'GATE_SECURITY', 'SUPPLIER_ELECTRICAL');
CREATE TYPE partner_type_enum AS ENUM ('CLIENT', 'TECH_PARTNER');
CREATE TYPE cta_action_enum AS ENUM ('MODAL', 'LINK');
CREATE TYPE audit_action_enum AS ENUM (
    'LOGIN',
    'LOGOUT',
    'LOGIN_FAILED',
    'CREATE',
    'UPDATE',
    'SOFT_DELETE',
    'RESTORE',
    'HARD_DELETE',
    'UPLOAD'
);

-- 2. TRIGGER FUNCTION UNTUK AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. TABEL USERS (Admin & Editor)
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(120) NOT NULL,
    email           VARCHAR(120) NOT NULL,
    password_hash   TEXT NOT NULL,
    role            user_role_enum NOT NULL DEFAULT 'EDITOR',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ NULL,

    -- Audit & Soft Delete Fields
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by      UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    deleted_at      TIMESTAMPTZ NULL,
    deleted_by      UUID NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX idx_users_email_active ON users (LOWER(email)) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_deleted_at ON users (deleted_at);

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 4. TABEL SITE_SETTINGS (Logo, Nama Perusahaan, Alamat Footer & SEO Global)
CREATE TABLE site_settings (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name            VARCHAR(150) NOT NULL DEFAULT 'PT. Ditama Inti Teknologi',
    company_tagline         VARCHAR(255) NOT NULL DEFAULT 'General Supplier, IT Solution & System Integration',
    logo_url                TEXT NULL,
    footer_description      TEXT NULL,
    office_address          TEXT NOT NULL DEFAULT 'Komp. PCI Blok D 115 No. 06-07, Cilegon - Banten 42423',
    pic_name                VARCHAR(100) NULL DEFAULT 'Rezza Prawiratama',
    phone_whatsapp          VARCHAR(30) NULL DEFAULT '+62813-1050-6456',
    email_official          VARCHAR(100) NULL DEFAULT 'ditamadigital@gmail.com',
    website_url             VARCHAR(150) NULL DEFAULT 'https://www.ditamadigital.co.id',
    social_links            JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Global SEO Meta Tags
    seo_meta_title          VARCHAR(70) NOT NULL DEFAULT 'PT. Ditama Inti Teknologi | Solusi IT, Gate System & General Supplier',
    seo_meta_description    VARCHAR(160) NOT NULL DEFAULT 'Mitra terpercaya BUMN & industri sejak 2019 untuk Software Development, System Integration, Smart Gate System, dan General Supplier bersertifikat CSMS K3.',
    seo_og_image_url        TEXT NULL,

    -- Audit & Soft Delete Fields
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by              UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by              UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    deleted_at              TIMESTAMPTZ NULL,
    deleted_by              UUID NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_site_settings_deleted_at ON site_settings (deleted_at);

CREATE TRIGGER set_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 5. TABEL HERO_SECTIONS (CRUD Banner Utama)
CREATE TABLE hero_sections (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_text          VARCHAR(120) NOT NULL,
    headline_h1         VARCHAR(255) NOT NULL,
    subheadline         TEXT NOT NULL,
    primary_cta_text    VARCHAR(60) NOT NULL DEFAULT 'Hubungi Kami',
    primary_cta_link    VARCHAR(255) NOT NULL DEFAULT '#kontak',
    secondary_cta_text  VARCHAR(60) NOT NULL DEFAULT 'Lihat Portofolio',
    secondary_cta_link  VARCHAR(255) NOT NULL DEFAULT '#portofolio',
    hero_image_url      TEXT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit & Soft Delete Fields
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by          UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by          UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    deleted_at          TIMESTAMPTZ NULL,
    deleted_by          UUID NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_hero_sections_active ON hero_sections (is_active) WHERE deleted_at IS NULL;

CREATE TRIGGER set_hero_sections_updated_at
BEFORE UPDATE ON hero_sections
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 6. TABEL ABOUT_SECTIONS (CRUD Profil Perusahaan, Visi & Misi)
CREATE TABLE about_sections (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(150) NOT NULL,
    description_html    TEXT NOT NULL,
    vision_text         TEXT NOT NULL,
    mission_items       JSONB NOT NULL DEFAULT '[]'::jsonb,
    established_year    SMALLINT NOT NULL DEFAULT 2019,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit & Soft Delete Fields
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by          UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by          UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    deleted_at          TIMESTAMPTZ NULL,
    deleted_by          UUID NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_about_sections_active ON about_sections (is_active) WHERE deleted_at IS NULL;

CREATE TRIGGER set_about_sections_updated_at
BEFORE UPDATE ON about_sections
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 7. TABEL CERTIFICATIONS_LEGALITIES (CRUD Sertifikat CSMS K3 & Legalitas)
CREATE TABLE certifications_legalities (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category                legality_category_enum NOT NULL,
    title                   VARCHAR(180) NOT NULL,
    document_number         VARCHAR(120) NOT NULL,
    issuer                  VARCHAR(150) NULL,
    risk_level              VARCHAR(80) NULL,
    valid_until             DATE NULL,
    file_attachment_url     TEXT NULL,
    display_order           INT NOT NULL DEFAULT 0,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit & Soft Delete Fields
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by              UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by              UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    deleted_at              TIMESTAMPTZ NULL,
    deleted_by              UUID NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_cert_legal_category ON certifications_legalities (category, display_order) WHERE deleted_at IS NULL;

CREATE TRIGGER set_cert_legal_updated_at
BEFORE UPDATE ON certifications_legalities
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 8. TABEL SERVICES (CRUD Layanan Utama)
CREATE TABLE services (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(120) NOT NULL,
    slug                VARCHAR(140) NOT NULL,
    short_description   TEXT NOT NULL,
    bullet_features     JSONB NOT NULL DEFAULT '[]'::jsonb,
    icon_name           VARCHAR(60) NULL,
    display_order       INT NOT NULL DEFAULT 0,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit & Soft Delete Fields
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by          UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by          UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    deleted_at          TIMESTAMPTZ NULL,
    deleted_by          UUID NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX idx_services_slug_active ON services (slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_services_order ON services (display_order) WHERE deleted_at IS NULL AND is_active = TRUE;

CREATE TRIGGER set_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 9. TABEL PORTFOLIOS (CRUD Portofolio & Studi Kasus + SEO Meta per Proyek)
CREATE TABLE portfolios (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title                       VARCHAR(180) NOT NULL,
    slug                        VARCHAR(200) NOT NULL,
    client_name                 VARCHAR(150) NOT NULL,
    category                    portfolio_category_enum NOT NULL,
    summary                     TEXT NOT NULL,
    challenge_solution_detail   TEXT NULL,
    thumbnail_url               TEXT NULL,
    project_year                SMALLINT NULL,

    -- Per-Page SEO Meta Tags
    seo_meta_title              VARCHAR(70) NULL,
    seo_meta_description        VARCHAR(160) NULL,
    seo_og_image_url            TEXT NULL,

    is_featured                 BOOLEAN NOT NULL DEFAULT TRUE,
    display_order               INT NOT NULL DEFAULT 0,
    is_active                   BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit & Soft Delete Fields
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by                  UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by                  UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    deleted_at                  TIMESTAMPTZ NULL,
    deleted_by                  UUID NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX idx_portfolios_slug_active ON portfolios (slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_portfolios_category_active ON portfolios (category, display_order) WHERE deleted_at IS NULL AND is_active = TRUE;

CREATE TRIGGER set_portfolios_updated_at
BEFORE UPDATE ON portfolios
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 10. TABEL CLIENTS_PARTNERS (CRUD Logo Klien BUMN & Partner Teknologi)
CREATE TABLE clients_partners (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150) NOT NULL,
    type            partner_type_enum NOT NULL,
    logo_url        TEXT NULL,
    website_url     VARCHAR(255) NULL,
    display_order   INT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit & Soft Delete Fields
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by      UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    deleted_at      TIMESTAMPTZ NULL,
    deleted_by      UUID NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_clients_partners_type ON clients_partners (type, display_order) WHERE deleted_at IS NULL AND is_active = TRUE;

CREATE TRIGGER set_clients_partners_updated_at
BEFORE UPDATE ON clients_partners
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 11. TABEL CTA_BANNERS (CRUD Banner Ajakan Bertindak / Contact Us)
CREATE TABLE cta_banners (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    headline            VARCHAR(200) NOT NULL,
    subtext             TEXT NOT NULL,
    button_text         VARCHAR(60) NOT NULL DEFAULT 'Contact Us',
    button_action_type  cta_action_enum NOT NULL DEFAULT 'MODAL',
    button_target       VARCHAR(255) NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit & Soft Delete Fields
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by          UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by          UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    deleted_at          TIMESTAMPTZ NULL,
    deleted_by          UUID NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_cta_banners_active ON cta_banners (is_active) WHERE deleted_at IS NULL;

CREATE TRIGGER set_cta_banners_updated_at
BEFORE UPDATE ON cta_banners
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 12. TABEL INQUIRIES (Pesan Masuk dari Form Contact Us Publik)
CREATE TABLE inquiries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name     VARCHAR(150) NOT NULL,
    sender_email    VARCHAR(150) NOT NULL,
    service_topic   VARCHAR(100) NOT NULL,
    project_detail  TEXT NOT NULL,
    ip_address      VARCHAR(45) NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,

    -- Audit & Soft Delete Fields
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by      UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    deleted_at      TIMESTAMPTZ NULL,
    deleted_by      UUID NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_inquiries_unread ON inquiries (is_read, created_at DESC) WHERE deleted_at IS NULL;

CREATE TRIGGER set_inquiries_updated_at
BEFORE UPDATE ON inquiries
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 13. TABEL AUDIT_LOGS (Append-Only / Immutable Security & Activity Log)
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    user_email      VARCHAR(120) NOT NULL,
    action_type     audit_action_enum NOT NULL,
    http_method     VARCHAR(10) NOT NULL,
    endpoint        VARCHAR(255) NOT NULL,
    module_name     VARCHAR(60) NOT NULL,
    record_id       VARCHAR(64) NULL,
    before_data     JSONB NULL,
    after_data      JSONB NULL,
    ip_address      VARCHAR(45) NULL,
    user_agent      TEXT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs (user_id, created_at DESC);
CREATE INDEX idx_audit_logs_module_action ON audit_logs (module_name, action_type, created_at DESC);
