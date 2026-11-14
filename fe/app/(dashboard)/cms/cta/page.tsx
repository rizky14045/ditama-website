"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getAdminCta, updateAdminCta, CtaBannerData } from "@/lib/api-compro";
import { Icon } from "@iconify/react";

export default function CmsCtaPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<CtaBannerData>({
    headline: "Siap Mengintegrasikan Sistem IT & Keamanan Fasilitas Anda?",
    subtext: "Mitra terpercaya BUMN & industri sejak 2019 untuk Software Development, System Integration, dan Keamanan Akses.",
    button_text: "Contact Us",
    button_action_type: "MODAL",
    button_target: "#contact-modal",
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getAdminCta();
      if (res) {
        setFormData({
          headline: res.headline || "Siap Mengintegrasikan Sistem IT & Keamanan Fasilitas Anda?",
          subtext: res.subtext || "Mitra terpercaya BUMN & industri sejak 2019 untuk Software Development, System Integration, dan Keamanan Akses.",
          button_text: res.button_text || "Contact Us",
          button_action_type: res.button_action_type || "MODAL",
          button_target: res.button_target || "#contact-modal",
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.headline.trim()) {
      toast.error("Judul ajakan (Headline) tidak boleh kosong");
      return;
    }
    if (!formData.button_text.trim()) {
      toast.error("Teks tombol tidak boleh kosong");
      return;
    }

    setSaving(true);
    const res = await updateAdminCta(formData);
    setSaving(false);

    if (res.success) {
      toast.success(res.message || "Banner CTA berhasil diperbarui!");
    } else {
      toast.error(res.message || "Gagal memperbarui banner CTA.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-default-900">Banner CTA Konsultasi (Bagian Bawah)</h2>
          <p className="text-sm text-default-500">
            Kelola teks ajakan aksi, subtext, dan tombol kontak pada bagian bawah landing page sebelum footer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Editor */}
        <div className="lg:col-span-7">
          <Card className="border border-default-200">
            <CardHeader>
              <CardTitle className="text-lg">Form Pengaturan Banner CTA</CardTitle>
              <CardDescription>
                Sesuaikan kalimat penutup penawaran untuk mendorong calon klien BUMN & industri menghubungi Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-12 text-center text-default-500">
                  <Icon icon="lucide:loader-2" className="mx-auto h-8 w-8 animate-spin mb-2" />
                  Memuat data CTA banner...
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="headline">Judul Ajakan (Headline H2)</Label>
                    <Input
                      id="headline"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                      placeholder="Siap Mengintegrasikan Sistem IT & Keamanan Fasilitas Anda?"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subtext">Keterangan / Subtext Penjelas</Label>
                    <Textarea
                      id="subtext"
                      name="subtext"
                      rows={3}
                      value={formData.subtext}
                      onChange={handleChange}
                      placeholder="Mitra terpercaya BUMN & industri sejak 2019..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="button_text">Teks Tombol Aksi</Label>
                      <Input
                        id="button_text"
                        name="button_text"
                        value={formData.button_text}
                        onChange={handleChange}
                        placeholder="Contact Us"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="button_action_type">Tipe Aksi Tombol</Label>
                      <Select
                        value={formData.button_action_type}
                        onValueChange={(val) => setFormData((prev) => ({ ...prev, button_action_type: val }))}
                      >
                        <SelectTrigger id="button_action_type">
                          <SelectValue placeholder="Pilih Aksi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MODAL">Buka Modal Konsultasi (Popup Kontak)</SelectItem>
                          <SelectItem value="LINK">Tautan URL / WhatsApp Langsung</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.button_action_type === "LINK" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="button_target">Target URL / Tautan WhatsApp</Label>
                      <Input
                        id="button_target"
                        name="button_target"
                        value={formData.button_target || ""}
                        onChange={handleChange}
                        placeholder="https://wa.me/6281310506456 atau #kontak"
                      />
                      <p className="text-xs text-default-400">
                        Bisa diisi link WhatsApp, link halaman kontak, atau anchor link.
                      </p>
                    </div>
                  )}

                  <div className="pt-3">
                    <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground">
                      {saving ? (
                        <>
                          <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Icon icon="lucide:save" className="mr-2 h-4 w-4" />
                          Simpan Perubahan Banner
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5">
          <Card className="border border-default-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon icon="lucide:eye" className="h-5 w-5 text-primary" />
                Pratinjau Langsung (Preview)
              </CardTitle>
              <CardDescription>
                Tampilan persis seperti yang akan dilihat oleh pengunjung website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl bg-[#0B1528] p-6 text-center text-white shadow-xl relative overflow-hidden border border-slate-800">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#F59E0B 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative z-10 space-y-4">
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl leading-snug">
                    {formData.headline || "Judul Ajakan Kosong"}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {formData.subtext || "Subtext ajakan kosong"}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#F59E0B] text-[#0B1528] font-bold text-sm shadow-md cursor-default pointer-events-none">
                      {formData.button_text || "Contact Us"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-default-50 border border-default-200 text-xs text-default-500 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-default-700">
                  <Icon icon="lucide:info" className="h-4 w-4 text-blue-500" />
                  Keterangan Aksi Tombol:
                </div>
                <div>
                  {formData.button_action_type === "MODAL"
                    ? "Tombol akan langsung memunculkan formulir interaktif Popup Kontak & Konsultasi Proyek."
                    : `Tombol akan mengarahkan pengunjung ke tautan: ${formData.button_target || "(Belum ditentukan)"}`}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
