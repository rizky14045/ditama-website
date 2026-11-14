"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAdminAbout, updateAdminAbout, AboutData, ValuePillarItem } from "@/lib/api-compro";
import { Icon } from "@iconify/react";

const DEFAULT_PILLARS: ValuePillarItem[] = [
  {
    number: "01",
    title: "Solusi Cepat & Presisi",
    description: "Respon tanggap kebutuhan pengadaan & integrasi IT.",
  },
  {
    number: "02",
    title: "Kualitas Mutu Terjamin",
    description: "Produk hardware & software bergaransi resmi.",
  },
  {
    number: "03",
    title: "Dukungan Tenaga Ahli",
    description: "Tim teknisi tersertifikasi & berpengalaman lapangan.",
  },
];

export default function CmsAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<AboutData>>({
    title: "Tentang PT. Ditama Inti Teknologi",
    description_html:
      "Berdiri sejak tahun 2019 di Cilegon, Banten, PT. DITAMA INTI TEKNOLOGI merupakan perusahaan perdagangan umum dan jasa yang bergerak di bidang General Supplier, IT Solution & Multimedia, System Integration, serta Electrical Services. Kami berkomitmen menghadirkan solusi industri yang cepat, terintegrasi, dan berorientasi pada kualitas mutu tinggi.",
    vision_text:
      "Menjadi perusahaan General Supplier dan penyedia solusi teknologi terintegrasi di Indonesia yang terkemuka dalam pertumbuhan, efisiensi, dan reputasi.",
    mission_items:
      '["Menyediakan solusi bernilai tambah yang mengoptimalkan kepuasan pelanggan.", "Menciptakan lapangan kerja berkualitas dan berperan aktif sebagai warga korporat yang baik.", "Memberikan layanan prima dengan kecepatan dan presisi tinggi."]',
    established_year: 2019,
    experience_badge: "Pengalaman Industri",
    experience_years: "7+ Tahun",
    experience_desc:
      "Melayani berbagai perusahaan terkemuka, BUMN, dan kawasan industri di Indonesia sejak tahun 2019.",
  });

  const [missions, setMissions] = useState<string[]>([
    "Menyediakan solusi bernilai tambah yang mengoptimalkan kepuasan pelanggan.",
    "Menciptakan lapangan kerja berkualitas dan berperan aktif sebagai warga korporat yang baik.",
    "Memberikan layanan prima dengan kecepatan dan presisi tinggi.",
  ]);

  const [pillars, setPillars] = useState<ValuePillarItem[]>(DEFAULT_PILLARS);
  const [newMission, setNewMission] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getAdminAbout();
      if (res) {
        setFormData({
          title: res.title || "Tentang PT. Ditama Inti Teknologi",
          description_html: res.description_html || "",
          vision_text: res.vision_text || "",
          established_year: res.established_year || 2019,
          experience_badge: res.experience_badge || "Pengalaman Industri",
          experience_years: res.experience_years || "7+ Tahun",
          experience_desc:
            res.experience_desc ||
            "Melayani berbagai perusahaan terkemuka, BUMN, dan kawasan industri di Indonesia sejak tahun 2019.",
        });

        if (res.mission_items) {
          try {
            const parsedMissions = JSON.parse(res.mission_items);
            if (Array.isArray(parsedMissions) && parsedMissions.length > 0) {
              setMissions(parsedMissions);
            }
          } catch (_) {}
        }

        if (res.value_pillars) {
          try {
            const parsedPillars = JSON.parse(res.value_pillars);
            if (Array.isArray(parsedPillars) && parsedPillars.length > 0) {
              setPillars(parsedPillars);
            }
          } catch (_) {}
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "established_year" ? parseInt(value) || 2019 : value,
    }));
  };

  const handleAddMission = () => {
    if (!newMission.trim()) return;
    const updated = [...missions, newMission.trim()];
    setMissions(updated);
    setNewMission("");
  };

  const handleRemoveMission = (index: number) => {
    setMissions(missions.filter((_, i) => i !== index));
  };

  const handlePillarChange = (index: number, field: keyof ValuePillarItem, value: string) => {
    const updated = [...pillars];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setPillars(updated);
  };

  const handleAddPillar = () => {
    const nextNum = (pillars.length + 1).toString().padStart(2, "0");
    setPillars([
      ...pillars,
      {
        number: nextNum,
        title: "Poin Keunggulan Baru",
        description: "Deskripsi singkat keunggulan layanan.",
      },
    ]);
  };

  const handleRemovePillar = (index: number) => {
    setPillars(pillars.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      mission_items: JSON.stringify(missions),
      value_pillars: JSON.stringify(pillars),
    };
    const res = await updateAdminAbout(payload);
    setSaving(false);
    if (res.success) {
      toast.success(res.message || "Profil Perusahaan berhasil disimpan.");
    } else {
      toast.error(res.message || "Gagal menyimpan Profil Perusahaan.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-default-900 font-heading">
            Profil Perusahaan (Tentang Kami)
          </h2>
          <p className="text-sm text-default-500">
            Kelola profil narasi, tahun berdiri, visi, misi, pengalaman industri, serta poin keunggulan PT. Ditama Inti Teknologi.
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={saving} className="bg-primary text-primary-foreground shadow-md">
          {saving ? (
            <>
              <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Icon icon="lucide:save" className="mr-2 h-4 w-4" />
              Simpan Profil Perusahaan
            </>
          )}
        </Button>
      </div>

      {loading ? (
        <Card className="p-12 text-center text-default-500 border border-default-200">
          <Icon icon="lucide:loader-2" className="mx-auto h-8 w-8 animate-spin mb-3 text-primary" />
          Memuat data profil perusahaan...
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Editor (7 Kolom) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Informasi Utama */}
              <Card className="border border-default-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon icon="lucide:building-2" className="text-primary h-5 w-5" />
                    Informasi Utama &amp; Sejarah
                  </CardTitle>
                  <CardDescription>
                    Tentukan judul bagian, tahun pendirian, dan narasi pengantar profil perusahaan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label htmlFor="title">Judul Bagian</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title || ""}
                        onChange={handleChange}
                        placeholder="Tentang PT. Ditama Inti Teknologi"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="established_year">Tahun Didirikan</Label>
                      <Input
                        id="established_year"
                        name="established_year"
                        type="number"
                        value={formData.established_year || 2019}
                        onChange={handleChange}
                        placeholder="2019"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description_html">Deskripsi Profil Perusahaan</Label>
                    <Textarea
                      id="description_html"
                      name="description_html"
                      rows={5}
                      value={formData.description_html || ""}
                      onChange={handleChange}
                      placeholder="Tuliskan sejarah, latar belakang, dan komitmen layanan perusahaan..."
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 2. Kartu Pengalaman Industri (Kolom Kanan) */}
              <Card className="border border-default-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon icon="lucide:award" className="text-amber-500 h-5 w-5" />
                    Kartu Pengalaman Industri
                  </CardTitle>
                  <CardDescription>
                    Kotak highlight warna navy di samping profil perusahaan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="experience_badge">Teks Label / Badge</Label>
                      <Input
                        id="experience_badge"
                        name="experience_badge"
                        value={formData.experience_badge || "Pengalaman Industri"}
                        onChange={handleChange}
                        placeholder="Pengalaman Industri"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="experience_years">Teks Highlight Angka</Label>
                      <Input
                        id="experience_years"
                        name="experience_years"
                        value={formData.experience_years || "7+ Tahun"}
                        onChange={handleChange}
                        placeholder="7+ Tahun"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="experience_desc">Keterangan / Deskripsi Pengalaman</Label>
                    <Textarea
                      id="experience_desc"
                      name="experience_desc"
                      rows={2}
                      value={formData.experience_desc || ""}
                      onChange={handleChange}
                      placeholder="Melayani berbagai perusahaan terkemuka, BUMN, dan kawasan industri di Indonesia sejak tahun 2019."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 3. Poin Keunggulan (01, 02, 03 Value Highlights) */}
              <Card className="border border-default-200">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon icon="lucide:check-square" className="text-blue-600 h-5 w-5" />
                      Poin Keunggulan Nilai (01, 02, 03)
                    </CardTitle>
                    <CardDescription>
                      Daftar 3 pilar nilai keunggulan kompetitif perusahaan di landing page.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddPillar}
                    className="shrink-0"
                  >
                    <Icon icon="lucide:plus" className="mr-1 h-4 w-4" />
                    Tambah Poin
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-default-200 bg-default-50/50 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-default-700">
                            Pilar Keunggulan {idx + 1}
                          </span>
                        </div>
                        {pillars.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePillar(idx)}
                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                          >
                            <Icon icon="lucide:trash-2" className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-1 space-y-1">
                          <Label className="text-xs">Nomor Badge</Label>
                          <Input
                            value={pillar.number}
                            onChange={(e) => handlePillarChange(idx, "number", e.target.value)}
                            placeholder="01"
                            className="text-xs h-8"
                          />
                        </div>
                        <div className="sm:col-span-3 space-y-1">
                          <Label className="text-xs">Judul Keunggulan</Label>
                          <Input
                            value={pillar.title}
                            onChange={(e) => handlePillarChange(idx, "title", e.target.value)}
                            placeholder="Solusi Cepat & Presisi"
                            className="text-xs h-8 font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Keterangan Singkat</Label>
                        <Input
                          value={pillar.description}
                          onChange={(e) => handlePillarChange(idx, "description", e.target.value)}
                          placeholder="Respon tanggap kebutuhan pengadaan & integrasi IT."
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 4. Visi & Misi Perusahaan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visi */}
                <Card className="border border-default-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon icon="lucide:compass" className="text-amber-500 h-4 w-4" />
                      Visi Perusahaan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      id="vision_text"
                      name="vision_text"
                      rows={4}
                      value={formData.vision_text || ""}
                      onChange={handleChange}
                      placeholder="Menjadi perusahaan General Supplier..."
                      required
                    />
                  </CardContent>
                </Card>

                {/* Misi */}
                <Card className="border border-default-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon icon="lucide:check-circle-2" className="text-emerald-600 h-4 w-4" />
                      Misi Perusahaan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {missions.map((mission, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg border border-default-200 bg-default-50/50 text-xs"
                        >
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="flex-1 leading-snug">{mission}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMission(index)}
                            className="text-destructive hover:opacity-80 p-0.5"
                          >
                            <Icon icon="lucide:trash-2" className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Input
                        value={newMission}
                        onChange={(e) => setNewMission(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddMission();
                          }
                        }}
                        placeholder="Tambah butir misi..."
                        className="text-xs h-8"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddMission}
                        className="shrink-0 h-8 px-2.5 text-xs"
                      >
                        Tambah
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Live Preview (5 Kolom) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="sticky top-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-default-700 flex items-center gap-1.5 font-heading">
                    <Icon icon="lucide:eye" className="text-primary h-4 w-4" />
                    Pratinjau Langsung (Preview)
                  </h3>
                  <span className="text-xs text-default-400">Section Profil</span>
                </div>

                <div className="rounded-2xl border border-default-200 bg-white p-6 shadow-sm space-y-5">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 block mb-1 font-heading">
                      Profil Perusahaan
                    </span>
                    <h4 className="text-lg font-bold text-default-900 leading-snug font-heading">
                      {formData.title || "Tentang PT. Ditama Inti Teknologi"}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {formData.description_html || "Deskripsi profil perusahaan..."}
                  </p>

                  {/* Preview Kartu Pengalaman Industri */}
                  <div className="p-5 rounded-2xl bg-[#0B1528] text-white shadow-md space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block font-heading">
                      {formData.experience_badge || "Pengalaman Industri"}
                    </span>
                    <div className="font-heading font-extrabold text-3xl text-white">
                      {formData.experience_years || "7+ Tahun"}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                      {formData.experience_desc || "Melayani berbagai perusahaan terkemuka..."}
                    </p>
                  </div>

                  {/* Preview 3 Poin Keunggulan Nilai */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    {pillars.map((pillar, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-bold font-heading text-xs">
                          {pillar.number}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 font-heading">
                            {pillar.title}
                          </h5>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            {pillar.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
