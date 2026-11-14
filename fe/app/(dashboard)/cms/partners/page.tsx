"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getAdminPartners, createAdminPartner, updateAdminPartner, deleteAdminPartner, ClientPartnerData } from "@/lib/api-compro";
import { Icon } from "@iconify/react";
import ImageUploadDropzone from "@/components/common/image-upload-dropzone";

export default function CmsPartnersPage() {
  const [partners, setPartners] = useState<ClientPartnerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClientPartnerData | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [form, setForm] = useState<{
    name: string;
    logo_url: string;
    website_url: string;
    display_order: number;
  }>({
    name: "",
    logo_url: "",
    website_url: "",
    display_order: 1,
  });

  const loadPartners = async () => {
    setLoading(true);
    const data = await getAdminPartners("TECH_PARTNER");
    setPartners(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const openAddDialog = () => {
    setEditingItem(null);
    setForm({
      name: "",
      logo_url: "",
      website_url: "",
      display_order: partners.length + 1,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: ClientPartnerData) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      logo_url: item.logo_url || "",
      website_url: item.website_url || "",
      display_order: item.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Nama partner / prinsipal tidak boleh kosong");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      type: "TECH_PARTNER" as const,
      logo_url: form.logo_url.trim(),
      website_url: form.website_url.trim(),
      display_order: Number(form.display_order) || 1,
    };

    let res;
    if (editingItem) {
      res = await updateAdminPartner(editingItem.id, payload);
    } else {
      res = await createAdminPartner(payload);
    }

    setSaving(false);
    if (res.success) {
      toast.success(res.message);
      setIsDialogOpen(false);
      loadPartners();
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAdminPartner(id);
    if (res.success) {
      toast.success(res.message);
      setDeleteConfirmId(null);
      loadPartners();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-default-900">Partner Teknologi Resmi (Prinsipal)</h2>
          <p className="text-sm text-default-500">
            Daftar merek prinsipal keamanan, perangkat keras gate, CCTV, dan jaringan industri terkemuka.
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-navy hover:bg-navy-dark text-white font-semibold rounded-xl shadow-xs">
          <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
          Tambah Partner
        </Button>
      </div>

      <Card className="border border-default-200">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Partner Resmi ({partners.length})</CardTitle>
          <CardDescription>
            Prinsipal ini ditampilkan pada section "Ekosistem Prinsipal &amp; Partner Teknologi Resmi".
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-default-500">
              <Icon icon="lucide:loader-2" className="mx-auto h-8 w-8 animate-spin mb-2" />
              Memuat data partner...
            </div>
          ) : partners.length === 0 ? (
            <div className="py-8 text-center text-default-500">
              Belum ada data partner. Klik tombol "Tambah Partner" untuk membuat baru.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">Urutan</TableHead>
                    <TableHead className="w-24">Logo</TableHead>
                    <TableHead>Nama Prinsipal / Brand</TableHead>
                    <TableHead>Tautan Website</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="text-center font-semibold text-default-500">
                        {item.display_order}
                      </TableCell>
                      <TableCell>
                        <div className="w-16 h-11 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 overflow-hidden shadow-2xs">
                          {item.logo_url ? (
                            <img
                              src={item.logo_url}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">TEXT</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-default-900">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-default-600 text-xs font-mono">
                        {item.website_url ? (
                          <a href={item.website_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            {item.website_url}
                          </a>
                        ) : (
                          "-"
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

      {/* Modal Tambah/Edit Partner Eye-Catching (Size LG: Luas & Lapang) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent size="lg" className="max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 sm:px-8 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-xs">
                <Icon icon="lucide:shield-check" className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-navy">
                  {editingItem ? "Edit Partner Teknologi" : "Tambah Partner Teknologi Baru"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Prinsipal produsen perangkat keras keamanan, jaringan, atau kabel industri resmi.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 sm:px-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/40">
              {/* Bagian 1: Identitas Prinsipal */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Icon icon="lucide:info" className="w-4 h-4 text-amber-500" />
                  1. Identitas Brand / Prinsipal
                </h4>

                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Nama Prinsipal / Brand <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Honeywell, CISCO, HIKVISION, Dahua, ZKTeco, FALCO"
                    className="h-11 rounded-xl border-slate-200 bg-white font-medium focus:border-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="website_url" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Tautan Website Resmi (Opsional)
                    </Label>
                    <Input
                      id="website_url"
                      value={form.website_url}
                      onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                      placeholder="https://www.cisco.com"
                      className="h-11 rounded-xl border-slate-200 bg-white text-xs font-mono"
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

              {/* Bagian 2: Berkas Logo Prinsipal */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Icon icon="lucide:image" className="w-4 h-4 text-emerald-500" />
                  2. Berkas Logo Resmi Prinsipal
                </h4>

                <ImageUploadDropzone
                  label="Berkas Logo Partner (Upload File Langsung)"
                  helperText="Upload logo resmi prinsipal format PNG transparan atau SVG resolusi tinggi (Maks. 2MB)"
                  value={form.logo_url}
                  onChange={(url) => setForm({ ...form, logo_url: url })}
                  aspectRatio="square"
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
                    Simpan Partner
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
              Hapus Data Partner?
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data partner teknologi ini dari daftar?
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
              Ya, Hapus Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
