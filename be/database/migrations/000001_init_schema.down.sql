-- ============================================================================
-- MIGRATION: 000001_init_schema.down.sql
-- ============================================================================

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS cta_banners CASCADE;
DROP TABLE IF EXISTS clients_partners CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS certifications_legalities CASCADE;
DROP TABLE IF EXISTS about_sections CASCADE;
DROP TABLE IF EXISTS hero_sections CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP FUNCTION IF EXISTS trigger_set_updated_at() CASCADE;

DROP TYPE IF EXISTS audit_action_enum;
DROP TYPE IF EXISTS cta_action_enum;
DROP TYPE IF EXISTS partner_type_enum;
DROP TYPE IF EXISTS portfolio_category_enum;
DROP TYPE IF EXISTS legality_category_enum;
DROP TYPE IF EXISTS user_role_enum;
