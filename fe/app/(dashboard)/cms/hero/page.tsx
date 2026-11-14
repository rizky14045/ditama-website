"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAdminHero, updateAdminHero, HeroData } from "@/lib/api-compro";
import { Icon } from "@iconify/react";
import ImageUploadDropzone from "@/components/common/image-upload-dropzone";

export default function CmsHeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<HeroData>>({
    badge_text: "Mitra Terpercaya BUMN & Industri Sejak 2019",
    headline_h1: "Solusi IT Terintegrasi, Gate System & General Supplier Industri",
    subheadline: "Menyediakan layanan Software Development, System Integration, Keamanan Akses (Gate & CCTV), serta pengadaan mekanikal & elektrikal berstandar K3.",
    primary_cta_text: "Hubungi Kami",
    primary_cta_link: "#kontak",
    secondary_cta_text: "Lihat Portofolio",
    secondary_cta_link: "#portofolio",
    hero_image_url: "",
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getAdminHero();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateAdminHero(formData);
    setSaving(false);
    if (res.success) {
      toast.success(res.message || "Banner Hero berhasil diperbarui.");
    } else {
      toast.error(res.message || "Gagal memperbarui Banner Hero.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-default-900">Banner Utama (Hero Section)</h2>
          <p className="text-sm text-default-500">
            Atur teks judul besar, badge reputasi, sub-deskripsi, berkas gambar banner, dan tombol Call to Action.
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
              Simpan Perubahan Hero
            </>
          )}
        </Button>
      </div>

      {loading ? (
        <Card className="p-8 text-center text-default-500">
          <Icon icon="lucide:loader-2" className="mx-auto h-8 w-8 animate-spin mb-2" />
          Memuat data Hero section...
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <Card className="border border-default-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon icon="lucide:layout-template" className="text-primary h-5 w-5" />
                  Konten Teks &amp; Gambar Banner
                </CardTitle>
                <CardDescription>Teks dan visual yang dilihat pertama kali saat pengunjung membuka website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="badge_text">Badge / Label Atas</Label>
                  <Input
                    id="badge_text"
                    name="badge_text"
                    value={formData.badge_text || ""}
                    onChange={handleChange}
                    placeholder="Mitra Terpercaya BUMN & Industri Sejak 2019"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="headline_h1">Headline Utama (H1)</Label>
                  <Textarea
                    id="headline_h1"
                    name="headline_h1"
                    rows={2}
                    value={formData.headline_h1 || ""}
                    onChange={handleChange}
                    placeholder="Solusi IT Terintegrasi, Gate System & General Supplier Industri"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subheadline">Sub-deskripsi (Paragraf Penjelas)</Label>
                  <Textarea
                    id="subheadline"
                    name="subheadline"
                    rows={3}
                    value={formData.subheadline || ""}
                    onChange={handleChange}
                    placeholder="Menyediakan layanan Software Development, System Integration, Keamanan Akses..."
                    required
                  />
                </div>

                {/* Upload File Gambar Banner */}
                <div className="pt-2">
                  <ImageUploadDropzone
                    label="Berkas Gambar Banner / Ilustrasi Hero (Upload File)"
                    helperText="Upload gambar ilustrasi arsitektur sistem atau banner hero (JPG, PNG, WEBP, SVG • Maks 2MB)"
                    value={formData.hero_image_url || ""}
                    onChange={(url) => setFormData((prev) => ({ ...prev, hero_image_url: url }))}
                    aspectRatio="video"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-default-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon icon="lucide:mouse-pointer-click" className="text-primary h-5 w-5" />
                  Tombol Aksi (Call To Action)
                </CardTitle>
                <CardDescription>Pengaturan label dan link tautan tombol utama.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="primary_cta_text">Teks Tombol Utama</Label>
                  <Input
                    id="primary_cta_text"
                    name="primary_cta_text"
                    value={formData.primary_cta_text || ""}
                    onChange={handleChange}
                    placeholder="Hubungi Kami"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="primary_cta_link">Target Link Tombol Utama</Label>
                  <Input
                    id="primary_cta_link"
                    name="primary_cta_link"
                    value={formData.primary_cta_link || ""}
                    onChange={handleChange}
                    placeholder="#kontak"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="secondary_cta_text">Teks Tombol Sekunder</Label>
                  <Input
                    id="secondary_cta_text"
                    name="secondary_cta_text"
                    value={formData.secondary_cta_text || ""}
                    onChange={handleChange}
                    placeholder="Lihat Portofolio"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="secondary_cta_link">Target Link Tombol Sekunder</Label>
                  <Input
                    id="secondary_cta_link"
                    name="secondary_cta_link"
                    value={formData.secondary_cta_link || ""}
                    onChange={handleChange}
                    placeholder="#portofolio"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </form>

          {/* Pratinjau Tampilan */}
          <div className="space-y-6">
            <Card className="border border-default-200 bg-slate-900 text-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base text-amber-400 flex items-center gap-2">
                  <Icon icon="lucide:eye" className="h-4 w-4" />
                  Pratinjau Live Banner
                </CardTitle>
                <CardDescription className="text-slate-400">Tampilan estimasi pada landing page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {formData.badge_text || "Badge Reputasi"}
                </span>
                <h3 className="text-xl font-bold text-white leading-tight">
                  {formData.headline_h1 || "Headline Utama"}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {formData.subheadline || "Subheadline penjelas..."}
                </p>

                {formData.hero_image_url && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-white/10 bg-slate-800">
                    <img
                      src={formData.hero_image_url}
                      alt="Hero preview"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 text-xs font-semibold bg-amber-500 text-slate-900 rounded-md">
                    {formData.primary_cta_text || "Hubungi Kami"}
                  </span>
                  <span className="px-3 py-1.5 text-xs font-semibold border border-slate-600 text-slate-200 rounded-md">
                    {formData.secondary_cta_text || "Lihat Portofolio"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
