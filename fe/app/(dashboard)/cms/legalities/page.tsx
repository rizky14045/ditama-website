"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getAdminLegalities, createAdminLegality, updateAdminLegality, deleteAdminLegality, CertificationLegalityData } from "@/lib/api-compro";
import { Icon } from "@iconify/react";
import ImageUploadDropzone from "@/components/common/image-upload-dropzone";

export default function CmsLegalitiesPage() {
  const [legalities, setLegalities] = useState<CertificationLegalityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificationLegalityData | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [form, setForm] = useState<{
    title: string;
    category: "CSMS_K3" | "LEGALITY";
    document_number: string;
    issuer: string;
    risk_level: string;
    file_attachment_url: string;
    display_order: number;
  }>({
    title: "",
    category: "CSMS_K3",
    document_number: "",
    issuer: "PT. PLN (Persero)",
    risk_level: "Risiko Ekstrem",
    file_attachment_url: "",
    display_order: 1,
  });

  const loadLegalities = async () => {
    setLoading(true);
    const data = await getAdminLegalities();
    setLegalities(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLegalities();
  }, []);

  const openAddDialog = () => {
    setEditingItem(null);
    setForm({
      title: "",
      category: "CSMS_K3",
      document_number: "",
      issuer: "PT. PLN (Persero)",
      risk_level: "Risiko Ekstrem",
      file_attachment_url: "",
      display_order: legalities.length + 1,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: CertificationLegalityData) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category,
      document_number: item.document_number,
      issuer: item.issuer || "",
      risk_level: item.risk_level || "",
      file_attachment_url: item.file_attachment_url || "",
      display_order: item.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      category: form.category,
      document_number: form.document_number,
      issuer: form.issuer,
      risk_level: form.risk_level,
      file_attachment_url: form.file_attachment_url,
      display_order: Number(form.display_order) || 1,
    };

    let res;
    if (editingItem) {
      res = await updateAdminLegality(editingItem.id, payload);
    } else {
      res = await createAdminLegality(payload);
    }

    setSaving(false);
    if (res.success) {
      toast.success(res.message);
      setIsDialogOpen(false);
      loadLegalities();
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAdminLegality(id);
    if (res.success) {
      toast.success(res.message);
      setDeleteConfirmId(null);
      loadLegalities();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-default-900">Legalitas & Sertifikasi CSMS K3</h2>
          <p className="text-sm text-default-500">
            Kelola dokumen izin berusaha, NIB, sertifikasi keselamatan kerja CSMS PLN, dan bukti kualifikasi tender resmi.
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-primary text-primary-foreground">
          <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
          Tambah Dokumen Baru
        </Button>
      </div>

      <Card className="border border-default-200">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Dokumen Resmi ({legalities.length})</CardTitle>
          <CardDescription>Dokumen legalitas yang membuktikan kepatuhan dan reputasi PT. Ditama Inti Teknologi.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-default-500">
              <Icon icon="lucide:loader-2" className="mx-auto h-8 w-8 animate-spin mb-2" />
              Memuat data legalitas...
            </div>
          ) : legalities.length === 0 ? (
            <div className="py-12 text-center text-default-500">
              <Icon icon="lucide:shield-check" className="mx-auto h-12 w-12 text-default-300 mb-2" />
              <p>Belum ada sertifikasi atau legalitas yang ditambahkan.</p>
              <Button onClick={openAddDialog} variant="outline" className="mt-4">
                Tambah Dokumen Pertama
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">Urutan</TableHead>
                    <TableHead>Nama Dokumen / Izin</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Nomor Surat / Sertifikat</TableHead>
                    <TableHead>Penerbit</TableHead>
                    <TableHead>Kualifikasi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {legalities.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-center font-semibold text-default-500">
                        {item.display_order}
                      </TableCell>
                      <TableCell className="font-medium text-default-900">
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:shield-check" className="h-4 w-4 text-emerald-600" />
                          <span>{item.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.category === "CSMS_K3" ? (
                          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20">CSMS K3</Badge>
                        ) : (
                          <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20">Legalitas</Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{item.document_number}</TableCell>
                      <TableCell className="text-default-700">{item.issuer || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.risk_level || "Terverifikasi"}
                        </Badge>
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

      {/* Modal Tambah/Edit Dokumen Legalitas (Size LG: Luas, Lapang, Eye-Catching) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent size="lg" className="max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 sm:px-8 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-xs">
                <Icon icon="lucide:shield-check" className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-navy">
                  {editingItem ? "Edit Dokumen / Sertifikat" : "Tambah Dokumen / Sertifikat Baru"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Lengkapi data nomor izin, instansi penerbit, predikat kualifikasi, dan scan berkas resmi.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 sm:px-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/40">
              {/* Bagian 1: Identitas & Klasifikasi Dokumen */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Icon icon="lucide:file-text" className="w-4 h-4 text-emerald-600" />
                  1. Klasifikasi &amp; Judul Dokumen
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Nama Dokumen / Izin <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Contoh: Sertifikat Kualifikasi CSMS K3"
                      className="h-11 rounded-xl border-slate-200 bg-white font-medium focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Kategori Sertifikasi <span className="text-rose-500">*</span>
                    </Label>
                    <Select
                      value={form.category}
                      onValueChange={(val: any) => setForm({ ...form, category: val })}
                    >
                      <SelectTrigger id="category" className="h-11 rounded-xl border-slate-200 bg-white font-medium">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSMS_K3">CSMS K3 Keselamatan Kerja PLN</SelectItem>
                        <SelectItem value="LEGALITY">Legalitas Badan Usaha (NIB / SBU / NPWP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="document_number" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Nomor Surat / Sertifikat <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="document_number"
                      value={form.document_number}
                      onChange={(e) => setForm({ ...form, document_number: e.target.value })}
                      placeholder="Contoh: 001/CSMS/PLN-IP/2024"
                      className="h-11 rounded-xl border-slate-200 bg-white font-mono text-xs focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="issuer" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Instansi Penerbit Dokumen
                    </Label>
                    <Input
                      id="issuer"
                      value={form.issuer}
                      onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                      placeholder="Contoh: PT. PLN (Persero) Pusertif"
                      className="h-11 rounded-xl border-slate-200 bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="risk_level" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Predikat / Tingkat Risiko / Nilai
                    </Label>
                    <Input
                      id="risk_level"
                      value={form.risk_level}
                      onChange={(e) => setForm({ ...form, risk_level: e.target.value })}
                      placeholder="Contoh: Kategori Risiko Ekstrem (Terverifikasi)"
                      className="h-11 rounded-xl border-slate-200 bg-white font-medium"
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

              {/* Bagian 2: Unggah Berkas Sertifikat / Dokumen Scan */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Icon icon="lucide:file-up" className="w-4 h-4 text-emerald-600" />
                  2. Berkas Scan Dokumen / Sertifikat Fisik
                </h4>

                <ImageUploadDropzone
                  label="Berkas Dokumen / Sertifikat Resmi (Unggah Berkas Langsung)"
                  helperText="Upload bukti fisik sertifikat atau scan dokumen (format PNG/JPG transparan/bersih, Maks. 2MB)"
                  value={form.file_attachment_url}
                  onChange={(url) => setForm({ ...form, file_attachment_url: url })}
                  aspectRatio="banner"
                />
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
                    Simpan Dokumen
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
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
              <Icon icon="lucide:alert-triangle" className="w-5 h-5" />
            </div>
            <DialogTitle>Hapus Dokumen Sertifikasi?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Dokumen ini akan dihapus secara permanen dari daftar legalitas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Batal
            </Button>
            <Button
              color="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Hapus Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
