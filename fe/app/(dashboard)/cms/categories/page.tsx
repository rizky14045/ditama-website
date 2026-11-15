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
import {
  getAdminServiceCategories,
  createAdminServiceCategory,
  updateAdminServiceCategory,
  deleteAdminServiceCategory,
  ServiceCategoryData,
} from "@/lib/api-compro";
import { Icon } from "@iconify/react";

export default function CmsCategoriesPage() {
  const [categories, setCategories] = useState<ServiceCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceCategoryData | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [form, setForm] = useState<{
    code: string;
    name: string;
    description: string;
    display_order: number;
    is_active: boolean;
  }>({
    code: "",
    name: "",
    description: "",
    display_order: 1,
    is_active: true,
  });

  const loadCategories = async () => {
    setLoading(true);
    const data = await getAdminServiceCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddDialog = () => {
    setEditingItem(null);
    setForm({
      code: "",
      name: "",
      description: "",
      display_order: categories.length + 1,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: ServiceCategoryData) => {
    setEditingItem(item);
    setForm({
      code: item.code,
      name: item.name,
      description: item.description || "",
      display_order: item.display_order ?? 1,
      is_active: item.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const generatedCode =
      form.code.trim() ||
      form.name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_");

    const payload: Partial<ServiceCategoryData> = {
      code: generatedCode,
      name: form.name.trim(),
      description: form.description.trim(),
      display_order: Number(form.display_order),
      is_active: form.is_active,
    };

    let res;
    if (editingItem && editingItem.id && editingItem.id !== "00000000-0000-0000-0000-000000000000") {
      res = await updateAdminServiceCategory(editingItem.id, payload);
      if (!res.success && (res.message?.toLowerCase().includes("not found") || res.message?.toLowerCase().includes("gagal"))) {
        res = await createAdminServiceCategory(payload);
      }
    } else {
      res = await createAdminServiceCategory(payload);
    }

    setSaving(false);

    if (res.success) {
      toast.success(res.message);
      setIsDialogOpen(false);
      loadCategories();
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAdminServiceCategory(id);
    if (res.success) {
      toast.success(res.message);
      setDeleteConfirmId(null);
      loadCategories();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Master Data Solusi
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-default-900 mt-1">
            Kategori Layanan &amp; Solusi Terpusat
          </h2>
          <p className="text-sm text-default-500">
            Kelola 3 kategori solusi utama (Software Solution, Security System, System Integrator). Data ini otomatis dipakai sebagai filter portofolio dan pilihan form konsultasi.
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-navy hover:bg-navy-dark text-white font-semibold rounded-xl shadow-xs"
        >
          <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
          <Icon icon="lucide:layers" className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-blue-900">
          <p className="font-bold">Integrasi Otomatis (Master Data Central):</p>
          <p className="text-blue-800 mt-0.5">
            Perubahan nama atau penambahan kategori di sini akan langsung sinkron ke pilihan kategori di <b>Portofolio Proyek (Admin &amp; Website)</b> serta opsi topik konsultasi di <b>Formulir Hubungi Kami (Modal Contact)</b>.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border border-default-200">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Kategori Solusi ({categories.length})</CardTitle>
          <CardDescription>
            3 Kategori resmi: <b>Software Solution</b>, <b>Security System</b>, dan <b>System Integrator</b>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-default-500">
              <Icon icon="lucide:loader-2" className="mx-auto h-8 w-8 animate-spin mb-2" />
              Memuat data kategori...
            </div>
          ) : categories.length === 0 ? (
            <div className="py-8 text-center text-default-500">
              Belum ada kategori layanan. Silakan tambahkan kategori baru.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">Urutan</TableHead>
                    <TableHead>Kode (System Key)</TableHead>
                    <TableHead>Nama Kategori Solusi</TableHead>
                    <TableHead>Ruang Lingkup / Deskripsi</TableHead>
                    <TableHead className="w-24 text-center">Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((item) => (
                    <TableRow key={item.id || item.code} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="text-center font-semibold text-default-500">
                        {item.display_order ?? "-"}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-navy">
                        <Badge variant="outline" className="font-mono bg-slate-50">
                          {item.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-slate-900">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-xs text-default-600 max-w-md">
                        {item.description || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.is_active !== false ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-400">
                            Nonaktif
                          </Badge>
                        )}
                      </TableCell>
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

      {/* Modal Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Icon icon="lucide:layers" className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-navy">
                  {editingItem ? "Edit Kategori Solusi" : "Tambah Kategori Solusi"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Tentukan kode, nama, dan ringkasan cakupan solusi master data.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSave} className="p-6 space-y-4 bg-slate-50/40">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Nama Kategori Solusi <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Contoh: Software Solution"
                className="h-11 rounded-xl border-slate-200 bg-white font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cat-code" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Kode Unik Sistem (Otomatis jika kosong)
                </Label>
                <Input
                  id="cat-code"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="Contoh: SOFTWARE_SOLUTION"
                  className="h-11 rounded-xl border-slate-200 bg-white font-mono uppercase text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cat-order" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Urutan Tampilan
                </Label>
                <Input
                  id="cat-order"
                  type="number"
                  min={1}
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                  className="h-11 rounded-xl border-slate-200 bg-white font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-desc" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Deskripsi Cakupan / Sub-Layanan
              </Label>
              <Textarea
                id="cat-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Contoh: Aplikasi Web, Mobile, AI Analytics & Enterprise ERP"
                className="rounded-xl border-slate-200 bg-white p-3 font-medium text-slate-800"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-slate-200/80 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-navy hover:bg-navy-dark text-white font-semibold rounded-xl cursor-pointer"
              >
                {saving ? (
                  <>
                    <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : editingItem ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Kategori"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2">
              <Icon icon="lucide:alert-triangle" className="w-5 h-5" />
              Hapus Kategori Solusi?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 mt-2">
              Apakah Anda yakin ingin menghapus kategori solusi ini? Pastikan tidak ada data portofolio yang sedang terikat secara aktif ke kode kategori ini.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-2 pt-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="rounded-xl cursor-pointer"
            >
              Batal
            </Button>
            <Button
              color="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="rounded-xl cursor-pointer"
            >
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
