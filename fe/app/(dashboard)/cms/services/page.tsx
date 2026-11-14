"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getAdminServices, createAdminService, updateAdminService, deleteAdminService, ServiceData } from "@/lib/api-compro";
import { Icon } from "@iconify/react";

export default function CmsServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceData | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    bullet_features: "",
    icon_name: "heroicons:code-bracket",
    display_order: 1,
  });

  const loadServices = async () => {
    setLoading(true);
    const data = await getAdminServices();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddDialog = () => {
    setEditingItem(null);
    setForm({
      title: "",
      slug: "",
      short_description: "",
      bullet_features: "Fitur 1\nFitur 2\nFitur 3",
      icon_name: "heroicons:computer-desktop",
      display_order: services.length + 1,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: ServiceData) => {
    setEditingItem(item);
    let featuresText = "";
    try {
      const parsed = JSON.parse(item.bullet_features);
      if (Array.isArray(parsed)) {
        featuresText = parsed.join("\n");
      } else {
        featuresText = item.bullet_features;
      }
    } catch {
      featuresText = item.bullet_features || "";
    }

    setForm({
      title: item.title,
      slug: item.slug,
      short_description: item.short_description,
      bullet_features: featuresText,
      icon_name: item.icon_name || "heroicons:computer-desktop",
      display_order: item.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const featureArray = form.bullet_features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      short_description: form.short_description,
      bullet_features: JSON.stringify(featureArray),
      icon_name: form.icon_name,
      display_order: Number(form.display_order) || 1,
    };

    let res;
    if (editingItem) {
      res = await updateAdminService(editingItem.id, payload);
    } else {
      res = await createAdminService(payload);
    }

    setSaving(false);
    if (res.success) {
      toast.success(res.message);
      setIsDialogOpen(false);
      loadServices();
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAdminService(id);
    if (res.success) {
      toast.success(res.message);
      setDeleteConfirmId(null);
      loadServices();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-default-900">Manajemen Layanan & Solusi</h2>
          <p className="text-sm text-default-500">
            Kelola daftar layanan utama PT. Ditama Inti Teknologi (Software Development, Smart Gate System, General Supplier).
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-primary text-primary-foreground">
          <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
          Tambah Layanan Baru
        </Button>
      </div>

      <Card className="border border-default-200">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Layanan ({services.length})</CardTitle>
          <CardDescription>Semua layanan yang ditampilkan pada landing page website publik.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-default-500">
              <Icon icon="lucide:loader-2" className="mx-auto h-8 w-8 animate-spin mb-2" />
              Memuat daftar layanan...
            </div>
          ) : services.length === 0 ? (
            <div className="py-12 text-center text-default-500">
              <Icon icon="lucide:layers" className="mx-auto h-12 w-12 text-default-300 mb-2" />
              <p>Belum ada layanan yang ditambahkan.</p>
              <Button onClick={openAddDialog} variant="outline" className="mt-4">
                Tambah Layanan Pertama
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">Urutan</TableHead>
                    <TableHead>Nama Layanan</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="max-w-md">Deskripsi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-center font-semibold text-default-500">
                        {item.display_order}
                      </TableCell>
                      <TableCell className="font-medium text-default-900">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                            <Icon icon={item.icon_name || "heroicons:cube"} className="h-4 w-4" />
                          </span>
                          <span>{item.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {item.slug}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md text-default-600 text-xs line-clamp-2">
                        {item.short_description}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(item)}
                          className="h-8 px-2 text-default-700"
                        >
                          <Icon icon="lucide:edit-3" className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          color="destructive"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="h-8 px-2"
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

      {/* Modal Tambah/Edit Layanan Eye-Catching (Size LG: Luas & Lapang) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent size="lg" className="max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 sm:px-8 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-xs">
                <Icon icon="lucide:layers" className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-navy">
                  {editingItem ? "Edit Layanan Utama" : "Tambah Layanan Utama Baru"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Isi data detail layanan kompetensi yang ditampilkan pada landing page.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 sm:px-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/40">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Icon icon="lucide:info" className="w-4 h-4 text-amber-500" />
                  1. Judul &amp; Identifikasi Layanan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Judul Layanan <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Contoh: IT Solution & Multimedia"
                      className="h-11 rounded-xl border-slate-200 bg-white font-medium focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="slug" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Slug URL
                    </Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="it-solution-multimedia"
                      className="h-11 rounded-xl border-slate-200 bg-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Icon icon="lucide:file-text" className="w-4 h-4 text-blue-500" />
                  2. Deskripsi &amp; Poin Fitur Unggulan
                </h4>

                <div className="space-y-1.5">
                  <Label htmlFor="short_description" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Deskripsi Singkat Layanan <span className="text-rose-500">*</span>
                  </Label>
                  <Textarea
                    id="short_description"
                    rows={3}
                    value={form.short_description}
                    onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                    placeholder="Rancang bangun aplikasi web, mobile, ERP, dan sistem enterprise terintegrasi..."
                    className="rounded-xl border-slate-200 bg-white p-3 font-medium text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bullet_features" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Poin-Poin Fitur Unggulan (Satu baris per poin fitur)
                  </Label>
                  <Textarea
                    id="bullet_features"
                    rows={4}
                    value={form.bullet_features}
                    onChange={(e) => setForm({ ...form, bullet_features: e.target.value })}
                    placeholder="Custom Software (Web & Mobile)&#10;AI & OCR Plat Nomor Kendaraan&#10;Visitor Management & People Counting&#10;Animasi 2D/3D Safety Induction"
                    className="rounded-xl border-slate-200 bg-white p-3 text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="icon_name" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Iconify Icon Key (Opsional)
                    </Label>
                    <Input
                      id="icon_name"
                      value={form.icon_name}
                      onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
                      placeholder="heroicons:computer-desktop"
                      className="h-11 rounded-xl border-slate-200 bg-white font-mono text-xs"
                    />
                  </div>

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
                    Simpan Layanan
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2">
              <Icon icon="lucide:alert-triangle" className="h-5 w-5" />
              Hapus Layanan?
            </DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Layanan ini akan dihapus dari halaman website utama.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="rounded-xl">
              Batal
            </Button>
            <Button
              color="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="rounded-xl"
            >
              Ya, Hapus Layanan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
