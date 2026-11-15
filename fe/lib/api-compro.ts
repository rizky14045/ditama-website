import axios from "axios";

export const getDynamicApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return "/api/v1";
  }
  return process.env.INTERNAL_API_URL || "http://localhost:8070/api/v1";
};

export const comproApi = axios.create({
  baseURL: typeof window !== "undefined" ? "/api/v1" : (process.env.INTERNAL_API_URL || "http://localhost:8070/api/v1"),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach token from sessionStorage or localStorage if available
comproApi.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    // Normalisasi baseURL di browser agar selalu relative /api/v1 (bebas CORS & Mixed Content)
    if (!config.baseURL || config.baseURL.includes("localhost:8070") || config.baseURL.startsWith("http://localhost")) {
      config.baseURL = "/api/v1";
    }
    let token = localStorage.getItem("ditama_admin_token") || sessionStorage.getItem("ditama_admin_token");
    if (!token) {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        if (sessionData && sessionData.accessToken) {
          token = sessionData.accessToken;
          localStorage.setItem("ditama_admin_token", token as string);
        }
      } catch (err) {
        // ignore
      }
    }
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface SiteSettingsData {
  company_name: string;
  company_tagline: string;
  logo_url?: string;
  favicon_url?: string;
  footer_description?: string;
  office_address: string;
  pic_name?: string;
  phone_whatsapp?: string;
  email_official?: string;
  website_url?: string;
  social_links?: string;
  seo_meta_title?: string;
  seo_meta_description?: string;
}

export interface HeroData {
  badge_text: string;
  headline_h1: string;
  subheadline: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
  hero_image_url?: string;
}

export interface ValuePillarItem {
  number: string;
  title: string;
  description: string;
}

export interface AboutData {
  title: string;
  description_html: string;
  vision_text: string;
  mission_items: string;
  established_year: number;
  experience_badge?: string;
  experience_years?: string;
  experience_desc?: string;
  value_pillars?: string;
}

export interface CertificationLegalityData {
  id: string;
  category: "CSMS_K3" | "LEGALITY";
  title: string;
  document_number: string;
  issuer?: string;
  risk_level?: string;
  file_attachment_url?: string;
  display_order: number;
}

export interface ServiceData {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  bullet_features: string;
  icon_name?: string;
  display_order: number;
}

export interface ServiceCategoryData {
  id: string;
  code: string;
  name: string;
  description?: string;
  display_order?: number;
  is_active?: boolean;
}

export const DEFAULT_SERVICE_CATEGORIES: ServiceCategoryData[] = [];

export interface PortfolioData {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  category: "SOFTWARE_SOLUTION" | "SECURITY_SYSTEM" | "SYSTEM_INTEGRATOR" | string;
  summary: string;
  challenge_solution_detail?: string;
  thumbnail_url?: string;
  project_year?: number;
  display_order: number;
}

export interface ClientPartnerData {
  id: string;
  name: string;
  type: "CLIENT" | "TECH_PARTNER";
  logo_url?: string;
  website_url?: string;
  display_order: number;
}

export interface CtaBannerData {
  headline: string;
  subtext: string;
  button_text: string;
  button_action_type: string;
  button_target?: string;
}

export interface ComproHomeResponse {
  site_settings?: SiteSettingsData;
  hero?: HeroData;
  about?: AboutData;
  certifications_legalities?: CertificationLegalityData[];
  service_categories?: ServiceCategoryData[];
  services?: ServiceData[];
  portfolios?: PortfolioData[];
  clients?: ClientPartnerData[];
  tech_partners?: ClientPartnerData[];
  cta_banner?: CtaBannerData;
}

export interface InquiryPayload {
  sender_name: string;
  sender_email: string;
  service_topic: string;
  project_detail: string;
}

// Fetch Landing page dynamic sections from Go backend
export async function fetchComproHomeData(): Promise<ComproHomeResponse | null> {
  try {
    const res = await comproApi.get("/public/home", {
      params: { _t: Date.now() },
    });
    if (res.data && res.data.status && res.data.data) {
      return res.data.data as ComproHomeResponse;
    }
    return null;
  } catch (error) {
    console.warn("Notice: Go backend API (/public/home) offline or loading default values.", error);
    return null;
  }
}

export const getPublicComproData = fetchComproHomeData;

// Submit Inquiry to Go backend
export async function sendInquiry(payload: InquiryPayload): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.post("/public/inquiries", payload);
    if (res.data && res.data.status) {
      return {
        success: true,
        message: res.data.message || "Permintaan konsultasi Anda berhasil dikirim.",
      };
    }
    return {
      success: false,
      message: res.data?.message || "Gagal mengirim permintaan.",
    };
  } catch (error: any) {
    console.error("API error while sending inquiry:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Koneksi ke server backend gagal.",
    };
  }
}

// -------------------------------------------------------------
// ADMIN CRUD API CLIENT FUNCTIONS
// -------------------------------------------------------------

// Settings
export async function uploadImageFile(file: File): Promise<{ success: boolean; url?: string; message: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await comproApi.post("/admin/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data && res.data.status && res.data.data?.url) {
      return { success: true, url: res.data.data.url, message: "File berhasil diunggah." };
    }
    return { success: false, message: res.data?.message || "Gagal mengunggah file." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal mengunggah file ke server." };
  }
}

export async function getAdminSettings(): Promise<SiteSettingsData | null> {
  try {
    const res = await comproApi.get("/admin/settings");
    if (res.data && res.data.status) return res.data.data;
    return null;
  } catch (error) {
    console.error("Failed to fetch admin settings", error);
    return null;
  }
}

export async function updateAdminSettings(data: Partial<SiteSettingsData>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.put("/admin/settings", data);
    return { success: res.data?.status ?? true, message: res.data?.message || "Pengaturan berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal memperbarui pengaturan." };
  }
}

// Hero & CTA
export async function getAdminHero(): Promise<HeroData | null> {
  try {
    const res = await comproApi.get("/admin/sections/hero");
    if (res.data && res.data.status) return res.data.data;
    return null;
  } catch (error) {
    console.error("Failed to fetch admin hero", error);
    return null;
  }
}

export async function updateAdminHero(data: Partial<HeroData>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.put("/admin/sections/hero", data);
    return { success: res.data?.status ?? true, message: res.data?.message || "Banner Hero berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal memperbarui Hero section." };
  }
}

// About / Profil Perusahaan CRUD
export async function getAdminAbout(): Promise<AboutData | null> {
  try {
    const res = await comproApi.get("/admin/sections/about");
    if (res.data && res.data.status && res.data.data) return res.data.data;
    return null;
  } catch (error) {
    console.error("Failed to fetch admin about", error);
    return null;
  }
}

export async function updateAdminAbout(data: Partial<AboutData>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.put("/admin/sections/about", data);
    return { success: res.data?.status ?? true, message: res.data?.message || "Profil Perusahaan berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal memperbarui Profil Perusahaan." };
  }
}

// Services CRUD
export async function getAdminServices(): Promise<ServiceData[]> {
  try {
    const res = await comproApi.get("/admin/sections/services");
    if (res.data && res.data.status && Array.isArray(res.data.data)) return res.data.data;
    return [];
  } catch (error) {
    console.error("Failed to fetch admin services", error);
    return [];
  }
}

export async function createAdminService(data: Partial<ServiceData>): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await comproApi.post("/admin/sections/services", data);
    return { success: res.data?.status ?? true, message: res.data?.message || "Layanan berhasil ditambahkan.", data: res.data?.data };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal menambah layanan." };
  }
}

export async function updateAdminService(id: string, data: Partial<ServiceData>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.put(`/admin/sections/services/${id}`, data);
    return { success: res.data?.status ?? true, message: res.data?.message || "Layanan berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal mengubah layanan." };
  }
}

export async function deleteAdminService(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.delete(`/admin/sections/services/${id}`);
    return { success: res.data?.status ?? true, message: res.data?.message || "Layanan berhasil dihapus." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal menghapus layanan." };
  }
}

// Portfolios CRUD
export async function getAdminPortfolios(): Promise<PortfolioData[]> {
  try {
    const res = await comproApi.get("/admin/sections/portfolios", {
      params: { _t: Date.now() },
    });
    if (res.data && res.data.status && Array.isArray(res.data.data)) return res.data.data;
    return [];
  } catch (error) {
    console.error("Failed to fetch admin portfolios", error);
    return [];
  }
}

export async function createAdminPortfolio(data: Partial<PortfolioData>): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await comproApi.post("/admin/sections/portfolios", data);
    return { success: res.data?.status ?? true, message: res.data?.message || "Portofolio berhasil ditambahkan.", data: res.data?.data };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal menambah portofolio." };
  }
}

export async function updateAdminPortfolio(id: string, data: Partial<PortfolioData>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.put(`/admin/sections/portfolios/${id}`, data);
    return { success: res.data?.status ?? true, message: res.data?.message || "Portofolio berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal mengubah portofolio." };
  }
}

export async function deleteAdminPortfolio(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.delete(`/admin/sections/portfolios/${id}`);
    return { success: res.data?.status ?? true, message: res.data?.message || "Portofolio berhasil dihapus." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal menghapus portofolio." };
  }
}

// Legalities & CSMS K3 CRUD
export async function getAdminLegalities(): Promise<CertificationLegalityData[]> {
  try {
    const res = await comproApi.get("/admin/sections/legalities");
    if (res.data && res.data.status && Array.isArray(res.data.data)) return res.data.data;
    return [];
  } catch (error) {
    console.error("Failed to fetch admin legalities", error);
    return [];
  }
}

export async function createAdminLegality(data: Partial<CertificationLegalityData>): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await comproApi.post("/admin/sections/legalities", data);
    return { success: res.data?.status ?? true, message: res.data?.message || "Dokumen berhasil ditambahkan.", data: res.data?.data };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal menambah dokumen." };
  }
}

export async function updateAdminLegality(id: string, data: Partial<CertificationLegalityData>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.put(`/admin/sections/legalities/${id}`, data);
    return { success: res.data?.status ?? true, message: res.data?.message || "Dokumen berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal mengubah dokumen." };
  }
}

export async function deleteAdminLegality(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.delete(`/admin/sections/legalities/${id}`);
    return { success: res.data?.status ?? true, message: res.data?.message || "Dokumen berhasil dihapus." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal menghapus dokumen." };
  }
}

// Partners CRUD
export async function getAdminPartners(type?: "CLIENT" | "TECH_PARTNER" | string): Promise<ClientPartnerData[]> {
  try {
    const url = type ? `/admin/sections/partners?type=${encodeURIComponent(type)}` : "/admin/sections/partners";
    const res = await comproApi.get(url);
    if (res.data && res.data.status && Array.isArray(res.data.data)) return res.data.data;
    return [];
  } catch (error) {
    console.error("Failed to fetch admin partners", error);
    return [];
  }
}

export async function createAdminPartner(data: Partial<ClientPartnerData>): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await comproApi.post("/admin/sections/partners", data);
    return { success: res.data?.status ?? true, message: res.data?.message || "Mitra / Klien berhasil ditambahkan.", data: res.data?.data };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal menambah mitra." };
  }
}

export async function updateAdminPartner(id: string, data: Partial<ClientPartnerData>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.put(`/admin/sections/partners/${id}`, data);
    return { success: res.data?.status ?? true, message: res.data?.message || "Mitra / Klien berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal mengubah mitra." };
  }
}

export async function deleteAdminPartner(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.delete(`/admin/sections/partners/${id}`);
    return { success: res.data?.status ?? true, message: res.data?.message || "Mitra / Klien berhasil dihapus." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal menghapus mitra." };
  }
}

// CTA Banner CRUD
export async function getAdminCta(): Promise<CtaBannerData | null> {
  try {
    const res = await comproApi.get("/admin/sections/cta");
    if (res.data && res.data.status && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch admin CTA banner", error);
    return null;
  }
}

export async function updateAdminCta(data: Partial<CtaBannerData>): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await comproApi.put("/admin/sections/cta", data);
    return { success: res.data?.status ?? true, message: res.data?.message || "Banner CTA berhasil diperbarui.", data: res.data?.data };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal memperbarui banner CTA." };
  }
}

// Inquiries
export interface AdminInquiryItem {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  sender_company?: string;
  service_topic: string;
  project_detail: string;
  status: "NEW" | "CONTACTED" | "IN_DISCUSSION" | "CLOSED";
  admin_notes?: string;
  created_at: string;
}

export async function getAdminInquiries(): Promise<AdminInquiryItem[]> {
  try {
    const res = await comproApi.get("/admin/inquiries");
    if (res.data && res.data.status && res.data.data && Array.isArray(res.data.data.items)) {
      return res.data.data.items;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch admin inquiries", error);
    return [];
  }
}

export async function updateAdminInquiryStatus(id: string, status: string, notes?: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.put(`/admin/inquiries/${id}/status`, { status, admin_notes: notes });
    return { success: res.data?.status ?? true, message: res.data?.message || "Status inquiry berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal mengubah status inquiry." };
  }
}

export async function deleteAdminInquiry(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.delete(`/admin/inquiries/${id}`);
    return { success: res.data?.status ?? true, message: res.data?.message || "Inquiry berhasil dihapus." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal menghapus inquiry." };
  }
}

// Audit Logs
export interface AdminAuditLogItem {
  id: string;
  user_email: string;
  action_type: string;
  module_name: string;
  http_method: string;
  endpoint: string;
  ip_address: string;
  created_at: string;
}

export async function getAdminAuditLogs(): Promise<AdminAuditLogItem[]> {
  try {
    const res = await comproApi.get("/admin/audit-logs");
    if (res.data && res.data.status && res.data.data && Array.isArray(res.data.data.items)) {
      return res.data.data.items;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch admin audit logs", error);
    return [];
  }
}

// ----------------- SERVICE CATEGORIES MASTER DATA API -----------------

export async function getPublicServiceCategories(): Promise<ServiceCategoryData[]> {
  try {
    const res = await comproApi.get("/public/service-categories", {
      params: { _t: Date.now() },
    });
    if (res.data && res.data.status && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.warn("Notice: failed to fetch public service categories.", error);
    return [];
  }
}

export async function getAdminServiceCategories(): Promise<ServiceCategoryData[]> {
  try {
    const res = await comproApi.get("/admin/sections/categories", {
      params: { _t: Date.now() },
    });
    if (res.data && res.data.status && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.warn("Notice: failed to fetch admin service categories.", error);
    return [];
  }
}

export async function createAdminServiceCategory(payload: Partial<ServiceCategoryData>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.post("/admin/sections/categories", payload);
    return { success: res.data?.status ?? true, message: res.data?.message || "Kategori layanan berhasil ditambahkan." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal menambah kategori layanan." };
  }
}

export async function updateAdminServiceCategory(id: string, payload: Partial<ServiceCategoryData>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.put(`/admin/sections/categories/${id}`, payload);
    return { success: res.data?.status ?? true, message: res.data?.message || "Kategori layanan berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal mengubah kategori layanan." };
  }
}

export async function deleteAdminServiceCategory(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await comproApi.delete(`/admin/sections/categories/${id}`);
    return { success: res.data?.status ?? true, message: res.data?.message || "Kategori layanan berhasil dihapus." };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Gagal menghapus kategori layanan." };
  }
}
