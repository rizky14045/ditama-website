"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getAdminPortfolios, createAdminPortfolio, updateAdminPortfolio, deleteAdminPortfolio, PortfolioData } from "@/lib/api-compro";
import { Icon } from "@iconify/react";
import ImageUploadDropzone from "@/components/common/image-upload-dropzone";

export default function CmsPortfoliosPage() {
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioData | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [form, setForm] = useState<{
    title: string;
    slug: string;
    client_name: string;
    category: "IT_SOFTWARE" | "GATE_SECURITY" | "SUPPLIER_ELECTRICAL";
    summary: string;
    challenge_solution_detail: string;
    thumbnail_url: string;
    project_year: number;
    display_order: number;
  }>({
    title: "",
    slug: "",
    client_name: "",
    category: "GATE_SECURITY",
    summary: "",
    challenge_solution_detail: "",
    thumbnail_url: "",
    project_year: new Date().getFullYear(),
    display_order: 1,
  });

  const loadPortfolios = async () => {
    setLoading(true);
    const data = await getAdminPortfolios();
    setPortfolios(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  const openAddDialog = () => {
    setEditingItem(null);
    setForm({
      title: "",
      slug: "",
      client_name: "",
      category: "GATE_SECURITY",
      summary: "",
      challenge_solution_detail: "",
      thumbnail_url: "",
      project_year: new Date().getFullYear(),
      display_order: portfolios.length + 1,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: PortfolioData) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      slug: item.slug,
      client_name: item.client_name,
      category: item.category,
      summary: item.summary,
      challenge_solution_detail: item.challenge_solution_detail || "",
      thumbnail_url: item.thumbnail_url || "",
      project_year: item.project_year || new Date().getFullYear(),
      display_order: item.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      client_name: form.client_name,
      category: form.category,
      summary: form.summary,
      challenge_solution_detail: form.challenge_solution_detail,
      thumbnail_url: form.thumbnail_url,
      project_year: Number(form.project_year),
      display_order: Number(form.display_order),
    };

    let res;
    if (editingItem) {
      res = await updateAdminPortfolio(editingItem.id, payload);
    } else {
      res = await createAdminPortfolio(payload);
    }

    setSaving(false);

    if (res.success) {
      toast.success(res.message);
      setIsDialogOpen(false);
      loadPortfolios();
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAdminPortfolio(id);
    if (res.success) {
      toast.success(res.message);
      setDeleteConfirmId(null);
      loadPortfolios();
    } else {
      toast.error(res.message);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "IT_SOFTWARE":
        return <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20">IT Software</Badge>;
      case "GATE_SECURITY":
        return <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20">Gate & Keamanan</Badge>;
      case "SUPPLIER_ELECTRICAL":
        return <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20">Supplier Elektrikal</Badge>;
      default:
        return <Badge variant="outline">{cat}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-default-900">Portofolio &amp; Studi Kasus Proyek</h2>
          <p className="text-sm text-default-500">
            Kelola rekam jejak proyek implementasi, sistem gerbang otomatis, software, dan pengadaan BUMN/industri.
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-navy hover:bg-navy-dark text-white font-semibold rounded-xl shadow-xs">
          <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
          Tambah Portofolio
        </Button>
      </div>

      <Card className="border border-default-200">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Portofolio Proyek ({portfolios.length})</CardTitle>
          <CardDescription>
            Portofolio ini ditampilkan pada bagian "Rekam Jejak Proyek &amp; Studi Kasus Unggulan" di halaman depan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-default-500">
              <Icon icon="lucide:loader-2" className="mx-auto h-8 w-8 animate-spin mb-2" />
              Memuat data portofolio...
            </div>
          ) : portfolios.length === 0 ? (
            <div className="py-8 text-center text-default-500">
              Belum ada portofolio. Klik tombol "Tambah Portofolio" untuk membuat item baru.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">Urutan</TableHead>
                    <TableHead className="w-20">Foto</TableHead>
                    <TableHead>Judul Proyek</TableHead>
                    <TableHead>Klien</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolios.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="text-center font-semibold text-default-500">
                        {item.display_order}
                      </TableCell>
                      <TableCell>
                        {item.thumbnail_url ? (
                          <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs">
                            <img
                              src={item.thumbnail_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                            <Icon icon="lucide:image" className="w-4 h-4" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-default-900">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-xs text-default-500 line-clamp-1">{item.summary}</div>
                      </TableCell>
                      <TableCell className="font-semibold text-default-700">
                        {item.client_name}
                      </TableCell>
                      <TableCell>{getCategoryBadge(item.category)}</TableCell>
                      <TableCell className="font-mono text-sm">{item.project_year || "-"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(item)}
                          className="h-8 px-2.5 text-default-700 cursor-pointer rounded-lg"
                        >
                          <Icon icon="lucide:edit-3" className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          color="destructive"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="h-8 px-2.5 cursor-pointer rounded-lg"
                        >
                          <Icon icon="lucide:trash-2" className="h-3.5 w-3.5 mr-1" />
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Tambah/Edit Portofolio Eye-Catching (Size LG: Luas & Lega) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent size="lg" className="max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 sm:px-8 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-xs">
                <Icon icon="lucide:briefcase" className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-navy">
                  {editingItem ? "Edit Portofolio Proyek" : "Tambah Portofolio Proyek Baru"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Lengkapi data detail proyek, klien, kategori solusi, serta berkas foto dokumentasi proyek.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 sm:px-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/40">
              {/* Bagian 1: Informasi Dasar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Icon icon="lucide:info" className="w-4 h-4 text-amber-500" />
                  1. Informasi Klien &amp; Judul Proyek
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Judul Proyek <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Contoh: E-Preventive Maintenance & SIDAK AI"
                      className="h-11 rounded-xl border-slate-200 bg-white font-medium focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="client_name" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Nama Klien / Perusahaan <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="client_name"
                      value={form.client_name}
                      onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                      placeholder="Contoh: PT. PLN Nusantara Power"
                      className="h-11 rounded-xl border-slate-200 bg-white font-medium focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="category" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Kategori Solusi
                    </Label>
                    <Select
                      value={form.category}
                      onValueChange={(val: any) => setForm({ ...form, category: val })}
                    >
                      <SelectTrigger id="category" className="h-11 rounded-xl border-slate-200 bg-white font-medium">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="GATE_SECURITY">Gate &amp; Keamanan Akses (Turnstile, Barrier, CCTV)</SelectItem>
                        <SelectItem value="IT_SOFTWARE">IT Software &amp; Sistem Enterprise (Web, Mobile, AI)</SelectItem>
                        <SelectItem value="SUPPLIER_ELECTRICAL">General Supplier &amp; Elektrikal (Mekanikal, K3, 6KV)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="project_year" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Tahun Pelaksanaan
                    </Label>
                    <Input
                      id="project_year"
                      type="number"
                      value={form.project_year}
                      onChange={(e) => setForm({ ...form, project_year: Number(e.target.value) })}
                      min={2018}
                      max={2030}
                      className="h-11 rounded-xl border-slate-200 bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Deskripsi & Ruang Lingkup */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Icon icon="lucide:file-text" className="w-4 h-4 text-blue-500" />
                  2. Narasi &amp; Deskripsi Pekerjaan
                </h4>

                <div className="space-y-1.5">
                  <Label htmlFor="summary" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Ringkasan Proyek (Ditampilkan di Kartu) <span className="text-rose-500">*</span>
                  </Label>
                  <Textarea
                    id="summary"
                    rows={2}
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    placeholder="Aplikasi mobile dan website untuk eksekusi preventive maintenance PLTU..."
                    className="rounded-xl border-slate-200 bg-white p-3 font-medium text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="challenge_solution_detail" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Detail Solusi &amp; Tantangan (Opsional)
                  </Label>
                  <Textarea
                    id="challenge_solution_detail"
                    rows={2}
                    value={form.challenge_solution_detail}
                    onChange={(e) => setForm({ ...form, challenge_solution_detail: e.target.value })}
                    placeholder="Kebutuhan kontrol arus masuk ribuan kendaraan logistik harian dengan waktu verifikasi cepat..."
                    className="rounded-xl border-slate-200 bg-white p-3 font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Bagian 3: Unggah Berkas Gambar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Icon icon="lucide:camera" className="w-4 h-4 text-emerald-500" />
                  3. Foto Dokumentasi / Mockup Proyek
                </h4>

                <ImageUploadDropzone
                  label="Foto Dokumentasi / Thumbnail Proyek (Upload File Langsung)"
                  helperText="Pilih atau seret gambar foto lapangan / tampilan sistem (JPG, PNG, WEBP • Maks 2MB)"
                  value={form.thumbnail_url}
                  onChange={(url) => setForm({ ...form, thumbnail_url: url })}
                  aspectRatio="video"
                />
              </div>

              {/* Bagian 4: Pengaturan Urutan */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="display_order" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Urutan Tampilan
                    </Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={form.display_order}
                      onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                      min={1}
                      className="h-11 rounded-xl border-slate-200 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="slug" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Custom Slug URL (Opsional)
                    </Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="otomatis dari judul proyek jika kosong"
                      className="h-11 rounded-xl border-slate-200 bg-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 sm:px-8 border-t border-slate-200 bg-white shrink-0 gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="h-11 rounded-xl px-5 cursor-pointer font-semibold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="h-11 bg-navy hover:bg-navy-dark text-white font-bold rounded-xl px-7 cursor-pointer shadow-sm"
              >
                {saving ? (
                  <>
                    <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:check" className="mr-2 h-4 w-4 text-amberbrand" />
                    Simpan Portofolio
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent size="sm" className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2">
              <Icon icon="lucide:alert-triangle" className="h-5 w-5" />
              Hapus Portofolio?
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data portofolio ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-3">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="rounded-xl">
              Batal
            </Button>
            <Button
              color="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="rounded-xl"
            >
              Ya, Hapus Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
