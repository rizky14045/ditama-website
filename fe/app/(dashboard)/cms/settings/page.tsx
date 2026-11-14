"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAdminSettings, updateAdminSettings, uploadImageFile, SiteSettingsData } from "@/lib/api-compro";
import { Icon } from "@iconify/react";

export default function CmsSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<SiteSettingsData>>({
    company_name: "PT. DITAMA INTI TEKNOLOGI",
    company_tagline: "General Supplier, IT Solution & System Integration",
    logo_url: "",
    favicon_url: "",
    phone_whatsapp: "+62813-1050-6456",
    email_official: "ditamadigital@gmail.com",
    office_address: "Komp. PCI Blok D 115 No. 06-07, Cilegon - Banten 42423",
    pic_name: "Rezza Prawiratama",
    website_url: "https://www.ditamadigital.co.id",
    seo_meta_title: "PT. Ditama Inti Teknologi | Solusi IT, Gate System & General Supplier Industri",
    seo_meta_description: "Mitra terpercaya BUMN & industri sejak 2019 untuk Software Development, System Integration, Smart Gate System, dan General Supplier bersertifikat CSMS K3.",
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getAdminSettings();
      if (res) {
        setFormData((prev) => ({ ...prev, ...res }));
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran logo maksimal 2 MB.");
      return;
    }

    setUploadingLogo(true);
    const res = await uploadImageFile(file);
    setUploadingLogo(false);

    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, logo_url: res.url }));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("ditama_admin_logo", res.url);
        } catch (_) {}
        window.dispatchEvent(new CustomEvent("ditama:logo-updated", { detail: { url: res.url } }));
      }
      toast.success("Logo berhasil diunggah! Jangan lupa klik 'Simpan Perubahan'.");
    } else {
      toast.error(res.message || "Gagal mengunggah logo.");
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo_url: "" }));
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("ditama_admin_logo");
      } catch (_) {}
      window.dispatchEvent(new CustomEvent("ditama:logo-updated", { detail: { url: "" } }));
    }
    toast.info("Logo dikembalikan ke icon default.");
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran favicon maksimal 2 MB.");
      return;
    }

    setUploadingFavicon(true);
    const res = await uploadImageFile(file);
    setUploadingFavicon(false);

    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, favicon_url: res.url }));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ditama:favicon-updated", { detail: { url: res.url } }));
      }
      toast.success("Favicon berhasil diunggah! Jangan lupa klik 'Simpan Perubahan'.");
    } else {
      toast.error(res.message || "Gagal mengunggah favicon.");
    }
  };

  const handleRemoveFavicon = () => {
    setFormData((prev) => ({ ...prev, favicon_url: "" }));
    toast.info("Favicon dikembalikan ke icon bawaan.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateAdminSettings(formData);
    setSaving(false);
    if (res.success) {
      if (typeof window !== "undefined") {
        if (formData.logo_url) {
          try {
            localStorage.setItem("ditama_admin_logo", formData.logo_url);
          } catch (_) {}
          window.dispatchEvent(new CustomEvent("ditama:logo-updated", { detail: { url: formData.logo_url } }));
        }
        if (formData.favicon_url) {
          window.dispatchEvent(new CustomEvent("ditama:favicon-updated", { detail: { url: formData.favicon_url } }));
        }
      }
      toast.success(res.message || "Pengaturan, logo & favicon berhasil disimpan.");
    } else {
      toast.error(res.message || "Gagal menyimpan pengaturan.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-default-900">Pengaturan Umum & SEO</h2>
          <p className="text-sm text-default-500">
            Kelola logo resmi perusahaan, profil PT. Ditama Inti Teknologi, kontak WhatsApp, alamat operasional, dan metadata SEO Google.
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={saving} className="bg-primary text-primary-foreground">
          {saving ? (
            <>
              <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Icon icon="lucide:save" className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>

      {loading ? (
        <Card className="p-8 text-center text-default-500">
          <Icon icon="lucide:loader-2" className="mx-auto h-8 w-8 animate-spin mb-2" />
          Memuat data pengaturan...
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Khusus: Logo Perusahaan */}
          <Card className="border border-default-200 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon icon="lucide:image" className="text-primary h-5 w-5" />
                Logo Resmi Perusahaan
              </CardTitle>
              <CardDescription>
                Unggah logo PT. Ditama Inti Teknologi dalam format PNG transparan, SVG, atau JPG (Maksimal 2 MB).
                Logo ini akan otomatis tampil di Header website compro, Footer, dan Sidebar dashboard admin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Box Preview Logo di latar Terang & Gelap */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Preview Latar Terang */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-default-500 mb-1.5 font-medium">Tampilan Latar Terang</span>
                    <div className="w-44 h-24 rounded-xl border border-default-200 bg-white flex items-center justify-center p-3 shadow-xs">
                      {formData.logo_url ? (
                        <img
                          src={formData.logo_url}
                          alt="Logo Preview Terang"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-amber-500 font-bold text-sm">
                            D
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900">PT. DITAMA</span>
                            <span className="text-[9px] text-slate-500">Inti Teknologi</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview Latar Gelap */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-default-500 mb-1.5 font-medium">Tampilan Latar Gelap</span>
                    <div className="w-44 h-24 rounded-xl border border-slate-700 bg-slate-950 flex items-center justify-center p-3 shadow-xs">
                      {formData.logo_url ? (
                        <img
                          src={formData.logo_url}
                          alt="Logo Preview Gelap"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-amber-400 font-bold text-sm">
                            D
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">PT. DITAMA</span>
                            <span className="text-[9px] text-slate-400">Inti Teknologi</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tombol Upload & Kontrol */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="bg-primary text-primary-foreground"
                    >
                      {uploadingLogo ? (
                        <>
                          <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />
                          Mengunggah Logo...
                        </>
                      ) : (
                        <>
                          <Icon icon="lucide:upload" className="mr-2 h-4 w-4" />
                          Unggah File Logo Baru
                        </>
                      )}
                    </Button>

                    {formData.logo_url && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveLogo}
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <Icon icon="lucide:trash-2" className="mr-1.5 h-4 w-4" />
                        Gunakan Icon Bawaan
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="logo_url" className="text-xs text-default-500">
                      Atau masukkan URL / Path file logo langsung:
                    </Label>
                    <Input
                      id="logo_url"
                      name="logo_url"
                      value={formData.logo_url || ""}
                      onChange={handleChange}
                      placeholder="/uploads/logo-ditama.png atau https://..."
                      className="text-xs font-mono"
                    />
                  </div>
                  <p className="text-xs text-default-400">
                    Tips: Gunakan file PNG dengan background transparan (resolusi minimal 300x80 px) untuk hasil terbaik di tema terang maupun gelap.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Khusus: Favicon Website (Tab Browser) */}
          <Card className="border border-default-200 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon icon="lucide:globe" className="text-primary h-5 w-5" />
                Favicon Website (Icon Tab Browser)
              </CardTitle>
              <CardDescription>
                Unggah icon kecil yang akan muncul di tab browser pengguna, penanda bookmark, dan icon pintasan layar smartphone (Format: ICO, PNG, SVG, atau JPG, rasio 1:1, disarankan 32x32 atau 64x64 px).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Mockup Tab Browser Chrome Realistis */}
                <div className="w-full lg:w-auto flex flex-col items-center">
                  <span className="text-xs text-default-500 mb-2 font-medium">Pratinjau Tab Browser Chrome</span>
                  <div className="w-full sm:w-80 rounded-xl border border-default-200 bg-slate-100 dark:bg-slate-900 p-2.5 shadow-xs">
                    {/* Chrome Window Dots */}
                    <div className="flex items-center gap-1.5 mb-2 px-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    </div>
                    {/* Active Tab Preview */}
                    <div className="bg-white dark:bg-slate-800 rounded-t-lg px-3 py-2 flex items-center gap-2 border-b-2 border-primary shadow-xs">
                      {formData.favicon_url || formData.logo_url ? (
                        <img
                          src={formData.favicon_url || formData.logo_url}
                          alt="Favicon Preview"
                          className="w-4 h-4 rounded-xs object-contain shrink-0"
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-xs bg-primary text-[9px] text-white font-bold flex items-center justify-center shrink-0">
                          D
                        </div>
                      )}
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[170px]">
                        {formData.company_name || "PT. Ditama Inti Teknologi"}
                      </span>
                      <Icon icon="lucide:x" className="w-3.5 h-3.5 text-slate-400 ml-auto shrink-0" />
                    </div>
                    {/* URL Bar Preview */}
                    <div className="bg-white/90 dark:bg-slate-800/90 rounded-b-lg px-2.5 py-1.5 flex items-center gap-1.5 text-[11px] text-slate-500 border border-slate-200 dark:border-slate-700">
                      <Icon icon="lucide:lock" className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{formData.website_url || "https://www.ditamadigital.co.id"}</span>
                    </div>
                  </div>
                </div>

                {/* Tombol Upload & Kontrol Favicon */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={faviconInputRef}
                      onChange={handleFaviconUpload}
                      accept="image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml,image/jpeg,image/webp,.ico"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => faviconInputRef.current?.click()}
                      disabled={uploadingFavicon}
                      className="bg-primary text-primary-foreground"
                    >
                      {uploadingFavicon ? (
                        <>
                          <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />
                          Mengunggah Favicon...
                        </>
                      ) : (
                        <>
                          <Icon icon="lucide:upload" className="mr-2 h-4 w-4" />
                          Pilih File Favicon
                        </>
                      )}
                    </Button>

                    {formData.favicon_url && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveFavicon}
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <Icon icon="lucide:trash-2" className="mr-1.5 h-4 w-4" />
                        Gunakan Icon Bawaan
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="favicon_url" className="text-xs text-default-500">
                      Atau masukkan URL / Path file favicon langsung:
                    </Label>
                    <Input
                      id="favicon_url"
                      name="favicon_url"
                      value={formData.favicon_url || ""}
                      onChange={handleChange}
                      placeholder="/uploads/favicon-ditama.png atau https://..."
                      className="text-xs font-mono"
                    />
                  </div>
                  <p className="text-xs text-default-400">
                    Tips: Format .ico atau .png berukuran 32x32 atau 64x64 pixel dengan background transparan memberikan hasil tertajam di semua browser modern dan mobile.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identitas Perusahaan */}
          <Card className="border border-default-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon icon="lucide:building" className="text-primary h-5 w-5" />
                Identitas Perusahaan
              </CardTitle>
              <CardDescription>Informasi nama entitas, tagline, dan penanggung jawab.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="company_name">Nama Resmi Perusahaan</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name || ""}
                  onChange={handleChange}
                  placeholder="PT. DITAMA INTI TEKNOLOGI"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="company_tagline">Tagline / Bidang Usaha</Label>
                <Input
                  id="company_tagline"
                  name="company_tagline"
                  value={formData.company_tagline || ""}
                  onChange={handleChange}
                  placeholder="General Supplier, IT Solution & System Integration"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pic_name">Nama PIC / Kontak Representatif</Label>
                <Input
                  id="pic_name"
                  name="pic_name"
                  value={formData.pic_name || ""}
                  onChange={handleChange}
                  placeholder="Rezza Prawiratama"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website_url">URL Website Resmi</Label>
                <Input
                  id="website_url"
                  name="website_url"
                  value={formData.website_url || ""}
                  onChange={handleChange}
                  placeholder="https://www.ditamadigital.co.id"
                />
              </div>
            </CardContent>
          </Card>

          {/* Kontak & Lokasi */}
          <Card className="border border-default-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon icon="lucide:phone-call" className="text-primary h-5 w-5" />
                Kontak & Alamat Operasional
              </CardTitle>
              <CardDescription>Kontak hotline pelanggan dan alamat kantor operasional.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone_whatsapp">Nomor Telepon / WhatsApp Resmi</Label>
                <Input
                  id="phone_whatsapp"
                  name="phone_whatsapp"
                  value={formData.phone_whatsapp || ""}
                  onChange={handleChange}
                  placeholder="+62813-1050-6456"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email_official">Email Resmi Perusahaan</Label>
                <Input
                  id="email_official"
                  name="email_official"
                  type="email"
                  value={formData.email_official || ""}
                  onChange={handleChange}
                  placeholder="ditamadigital@gmail.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="office_address">Alamat Kantor Lengkap</Label>
                <Textarea
                  id="office_address"
                  name="office_address"
                  rows={4}
                  value={formData.office_address || ""}
                  onChange={handleChange}
                  placeholder="Komp. PCI Blok D 115 No. 06-07, Cilegon - Banten 42423"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Metadata SEO */}
          <Card className="border border-default-200 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon icon="lucide:search" className="text-primary h-5 w-5" />
                Optimasi Mesin Pencari (SEO)
              </CardTitle>
              <CardDescription>
                Pengaturan judul dan deskripsi yang akan muncul di hasil pencarian Google dan preview sosial media.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="seo_meta_title">Judul Meta SEO (Title Tag)</Label>
                <Input
                  id="seo_meta_title"
                  name="seo_meta_title"
                  value={formData.seo_meta_title || ""}
                  onChange={handleChange}
                  placeholder="PT. Ditama Inti Teknologi | Solusi IT, Gate System & General Supplier Industri"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="seo_meta_description">Deskripsi Meta SEO (Meta Description)</Label>
                <Textarea
                  id="seo_meta_description"
                  name="seo_meta_description"
                  rows={3}
                  value={formData.seo_meta_description || ""}
                  onChange={handleChange}
                  placeholder="Deskripsi singkat yang informatif mengenai layanan PT. Ditama Inti Teknologi..."
                />
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
