-- ============================================================================
-- MIGRATION: 000002_seed_data.up.sql
-- PROJECT  : Seed initial verified company profile data for PT. Ditama Inti Teknologi
-- ============================================================================

-- 1. SITE SETTINGS
INSERT INTO site_settings (
    company_name,
    company_tagline,
    footer_description,
    office_address,
    pic_name,
    phone_whatsapp,
    email_official,
    website_url,
    seo_meta_title,
    seo_meta_description
) VALUES (
    'PT. Ditama Inti Teknologi',
    'General Supplier, IT Solution & System Integration',
    'Perusahaan perdagangan umum dan jasa teknologi terintegrasi yang berfokus pada kecepatan layanan, kualitas pengerjaan, dan kepatuhan keselamatan kerja K3.',
    'Komp. PCI Blok D 115 No. 06-07, Cilegon - Banten 42423',
    'Rezza Prawiratama',
    '+62813-1050-6456',
    'ditamadigital@gmail.com',
    'https://www.ditamadigital.co.id',
    'PT. Ditama Inti Teknologi | Solusi IT, Gate System & General Supplier Industri',
    'PT. Ditama Inti Teknologi adalah mitra terpercaya BUMN & industri sejak 2019 untuk layanan Software Development, System Integration, Smart Gate System, Access Control, CCTV, dan General Supplier bersertifikat CSMS K3.'
);

-- 2. HERO SECTION
INSERT INTO hero_sections (
    badge_text,
    headline_h1,
    subheadline,
    primary_cta_text,
    primary_cta_link,
    secondary_cta_text,
    secondary_cta_link,
    is_active
) VALUES (
    'Mitra Terpercaya BUMN & Industri Sejak 2019',
    'Solusi IT Terintegrasi, Gate System & General Supplier Industri',
    'Menyediakan layanan Software Development, System Integration, Keamanan Akses (Gate & CCTV), serta pengadaan mekanikal & elektrikal berstandar K3.',
    'Hubungi Kami',
    '#kontak',
    'Lihat Portofolio',
    '#portofolio',
    TRUE
);

-- 3. ABOUT SECTION
INSERT INTO about_sections (
    title,
    description_html,
    vision_text,
    mission_items,
    established_year,
    is_active
) VALUES (
    'Tentang PT. Ditama Inti Teknologi',
    'Berdiri sejak tahun 2019 di Cilegon, Banten, PT. DITAMA INTI TEKNOLOGI merupakan perusahaan perdagangan umum dan jasa yang bergerak di bidang General Supplier, IT Solution & Multimedia, System Integration, serta Electrical Services. Kami berkomitmen menghadirkan solusi industri yang cepat, terintegrasi, berorientasi pada kualitas tinggi, dan mematuhi standar keselamatan kerja (K3).',
    'Menjadi perusahaan General Supplier dan penyedia solusi teknologi terintegrasi di Indonesia yang terkemuka dalam pertumbuhan, efisiensi, dan reputasi.',
    '["Menyediakan solusi bernilai tambah yang mengoptimalkan kepuasan pelanggan.", "Menciptakan lapangan kerja berkualitas dan berperan aktif sebagai warga korporat yang baik."]'::jsonb,
    2019,
    TRUE
);

-- 4. CERTIFICATIONS & LEGALITIES
INSERT INTO certifications_legalities (
    category,
    title,
    document_number,
    issuer,
    risk_level,
    display_order,
    is_active
) VALUES 
('CSMS_K3', 'Sertifikat CSMS PLN (Risiko Tinggi & Risiko Rendah)', 'CSMS-PLN-2023', 'PT PLN Indonesia Power & PT PLN Nusantara Power', 'Risiko Tinggi & Risiko Rendah', 1, TRUE),
('LEGALITY', 'Akta Pendirian Perusahaan', 'AHU-11 Tahun 2019', 'Kemenkumham RI', NULL, 2, TRUE),
('LEGALITY', 'Nomor Induk Berusaha (NIB)', '0409230098635', 'OSS Republik Indonesia', NULL, 3, TRUE),
('LEGALITY', 'NPWP Perusahaan', '091.005.114.3-417.000', 'Direktorat Jenderal Pajak', NULL, 4, TRUE),
('LEGALITY', 'Tanda Daftar Perusahaan (TDP)', '503/0066/B/DPMPTSP/2019', 'DPMPTSP', NULL, 5, TRUE);

-- 5. SERVICES (4 PILAR)
INSERT INTO services (
    title,
    slug,
    short_description,
    bullet_features,
    icon_name,
    display_order,
    is_active
) VALUES 
(
    'IT Solution & Multimedia',
    'it-solution-multimedia',
    'Pengembangan aplikasi kustom sesuai alur bisnis perusahaan dan produksi media visual interaktif.',
    '["Custom Software (Web & Mobile)", "AI & OCR Plat Nomor Kendaraan", "Visitor Management & People Counting", "Animasi 2D/3D Safety Induction"]'::jsonb,
    'code',
    1,
    TRUE
),
(
    'System Integration',
    'system-integration',
    'Menghubungkan perangkat keras, sensor lapangan, dan basis data ke dalam satu dashboard terpusat.',
    '["Integrasi SCADA, MAXIMO & ELLIPSE", "Sinkronisasi Data Pembangkit", "Dashboard Pemantauan Lintas Unit", "Infrastruktur Jaringan & Server"]'::jsonb,
    'database',
    2,
    TRUE
),
(
    'Gate & Security System',
    'gate-security-system',
    'Sistem kontrol akses fisik dan keamanan area berisiko tinggi untuk pabrik, gedung, dan kawasan vital.',
    '["Barrier Gate & Gate Management System", "Turnstile Full High & Tripod", "Access Control Door & Alarm", "Instalasi & Maintenance CCTV"]'::jsonb,
    'shield',
    3,
    TRUE
),
(
    'General Supplier & Electrical',
    'general-supplier-electrical',
    'Pengadaan suku cadang industri serta jasa pemeliharaan kelistrikan dan konstruksi penunjang.',
    '["Produk Mekanikal, Elektrikal & Instrumen", "Maintenance Lift & Motor Generator", "Rewinding Motor AC/DC (Low-High Volt)", "Fabrikasi & Instalasi Struktur 6KV"]'::jsonb,
    'zap',
    4,
    TRUE
);

-- 6. PORTFOLIOS (6 CASE STUDIES)
INSERT INTO portfolios (
    title,
    slug,
    client_name,
    category,
    summary,
    challenge_solution_detail,
    display_order,
    is_featured,
    is_active
) VALUES 
(
    'E-Preventive Maintenance & SIDAK AI',
    'pln-np-sidak-ai',
    'PT. PLN Nusantara Power',
    'IT_SOFTWARE',
    'Aplikasi mobile dan website untuk eksekusi preventive maintenance PLTU serta Sistem Data Keamanan (SIDAK) seluruh unit dengan AI rekap data & pemetaan kerawanan.',
    'Integrasi data pemeliharaan unit pembangkit tenaga listrik dengan pemrosesan AI otomatis dan pemetaan risiko secara real-time.',
    1,
    TRUE,
    TRUE
),
(
    'Turnstile Full High & People Counting',
    'semen-gresik-turnstile',
    'PT. Semen Gresik Rembang Tbk.',
    'GATE_SECURITY',
    'Pemasangan unit Turnstile Full High, sistem Access Control terpadu, serta integrasi sistem Vault dengan fitur Custom People Counting untuk akurasi data personel pabrik.',
    'Pengamanan perimeter fasilitas produksi semen dengan barrier turnstile fisik dan integrasi people counting otomatis.',
    2,
    TRUE,
    TRUE
),
(
    'Access Control & Radiation Protection',
    'gleneagles-radiation-protection',
    'Gleneagles KL & Likas Hospital',
    'GATE_SECURITY',
    'Sistem integrasi dan instalasi Access Control, CCTV, serta sistem alarm proteksi radiasi fisik (Physical Protection Radiation) pada fasilitas medis internasional.',
    'Standar kepatuhan proteksi radiasi medis di Kuala Lumpur & Kota Kinabalu.',
    3,
    TRUE,
    TRUE
),
(
    'Barrier Gate & CCTV Maintenance',
    'pln-muara-karang-barrier-gate',
    'PT. PLN Nusantara Power UP Muara Karang',
    'GATE_SECURITY',
    'Perbaikan, pemasangan Barrier Gate, integrasi Visitor Management System dengan OCR plat nomor, serta pemeliharaan berkala CCTV & Gate Management System.',
    'Kontrak multi-tahun (2025-2028) pemeliharaan sistem gerbang otomatis dan CCTV di pembangkit Muara Karang.',
    4,
    TRUE,
    TRUE
),
(
    'Instalasi Access Door Kantor Pusat',
    'shopee-office-access-door',
    'PT. Shopee Office',
    'GATE_SECURITY',
    'Pemasangan dan konfigurasi sistem Access Door berstandar korporat untuk pengamanan akses ruang kerja di Sopo Del Tower Kuningan, Jakarta Selatan.',
    'Pengamanan akses ruang kerja eksekutif lantai 28 Sopo Del Tower Kuningan.',
    5,
    TRUE,
    TRUE
),
(
    'Fabrication Pondation & Pipe Rack 6KV',
    'krakatau-posco-pipe-rack',
    'PT. Krakatau Posco',
    'SUPPLIER_ELECTRICAL',
    'Pekerjaan fabrikasi pondasi, pemasangan struktur baja Pipe Rack 6KV, serta dukungan pengadaan mekanikal & elektrikal di kawasan industri Cilegon.',
    'Pekerjaan rekayasa struktur industri berat dan jalur kelistrikan 6KV.',
    6,
    TRUE,
    TRUE
);

-- 7. CLIENTS & TECH PARTNERS
INSERT INTO clients_partners (name, type, display_order, is_active) VALUES
-- Clients (BUMN & Corporate)
('PT. PLN Indonesia Power', 'CLIENT', 1, TRUE),
('PT. PLN Nusantara Power', 'CLIENT', 2, TRUE),
('PT. Krakatau Posco', 'CLIENT', 3, TRUE),
('Bank Indonesia', 'CLIENT', 4, TRUE),
('BNPB', 'CLIENT', 5, TRUE),
('PT. Semen Gresik', 'CLIENT', 6, TRUE),
('Shopee Indonesia', 'CLIENT', 7, TRUE),
-- Tech Partners
('Honeywell', 'TECH_PARTNER', 10, TRUE),
('CISCO', 'TECH_PARTNER', 11, TRUE),
('HIKVISION', 'TECH_PARTNER', 12, TRUE),
('Dahua Technology', 'TECH_PARTNER', 13, TRUE),
('ZKTeco', 'TECH_PARTNER', 14, TRUE),
('Hanwha Vision', 'TECH_PARTNER', 15, TRUE),
('Texecom', 'TECH_PARTNER', 16, TRUE),
('FALCO', 'TECH_PARTNER', 17, TRUE),
('LS-AG Cable Indonesia', 'TECH_PARTNER', 18, TRUE);

-- 8. CTA BANNER
INSERT INTO cta_banners (
    headline,
    subtext,
    button_text,
    button_action_type,
    button_target,
    is_active
) VALUES (
    'Siap Mengintegrasikan Sistem IT & Keamanan Fasilitas Anda?',
    'Mitra terpercaya BUMN & industri sejak 2019 untuk Software Development, System Integration, dan Keamanan Akses.',
    'Contact Us',
    'MODAL',
    '#contact-modal',
    TRUE
);
