"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getAdminInquiries, updateAdminInquiryStatus, deleteAdminInquiry, AdminInquiryItem } from "@/lib/api-compro";
import { Icon } from "@iconify/react";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<AdminInquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<AdminInquiryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusVal, setStatusVal] = useState<string>("NEW");
  const [notesVal, setNotesVal] = useState<string>("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getAdminInquiries();
    setInquiries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openDetail = (item: AdminInquiryItem) => {
    setSelectedItem(item);
    setStatusVal(item.status);
    setNotesVal(item.admin_notes || "");
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedItem) return;
    setSavingStatus(true);
    const res = await updateAdminInquiryStatus(selectedItem.id, statusVal, notesVal);
    setSavingStatus(false);
    if (res.success) {
      toast.success(res.message);
      setIsDetailOpen(false);
      loadData();
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAdminInquiry(id);
    if (res.success) {
      toast.success(res.message);
      setDeleteConfirmId(null);
      loadData();
    } else {
      toast.error(res.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20">Baru Masuk</Badge>;
      case "CONTACTED":
        return <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20">Sudah Dihubungi</Badge>;
      case "IN_DISCUSSION":
        return <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20">Tahap Diskusi / Penawaran</Badge>;
      case "CLOSED":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Selesai (Deal / Closed)</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-default-900">Pesan Masuk (Inquiries)</h2>
          <p className="text-sm text-default-500">
            Daftar formulir permohonan konsultasi, pengadaan sistem gate, dan software enterprise yang dikirim oleh calon klien.
          </p>
        </div>
        <Button onClick={loadData} variant="outline" className="text-default-700">
          <Icon icon="lucide:refresh-cw" className="mr-2 h-4 w-4" />
          Muat Ulang
        </Button>
      </div>

      <Card className="border border-default-200">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Konsultasi Masuk ({inquiries.length})</CardTitle>
          <CardDescription>Respon segera setiap calon klien untuk meningkatkan konversi peluang bisnis.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-default-500">
              <Icon icon="lucide:loader-2" className="mx-auto h-8 w-8 animate-spin mb-2" />
              Memuat pesan masuk...
            </div>
          ) : inquiries.length === 0 ? (
            <div className="py-12 text-center text-default-500">
              <Icon icon="lucide:inbox" className="mx-auto h-12 w-12 text-default-300 mb-2" />
              <p>Belum ada pesan masuk dari website.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pengirim</TableHead>
                    <TableHead>Perusahaan</TableHead>
                    <TableHead>Topik Layanan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium text-default-900">{item.sender_name}</div>
                        <div className="text-xs text-default-500">{item.sender_email}</div>
                      </TableCell>
                      <TableCell className="text-default-700 font-medium">
                        {item.sender_company || "-"}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-primary text-xs">{item.service_topic}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-xs text-default-500">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : "-"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {item.sender_phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                            asChild
                          >
                            <a
                              href={`https://wa.me/${item.sender_phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Icon icon="logos:whatsapp-icon" className="h-4 w-4 mr-1" />
                              WhatsApp
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetail(item)}
                          className="h-8 px-2 text-default-700"
                        >
                          <Icon icon="lucide:eye" className="h-3.5 w-3.5 mr-1" />
                          Detail
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

      {/* Modal Detail & Update Status Eye-Catching (Size LG: Luas & Lapang) */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent size="lg" className="max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 sm:px-8 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-xs">
                <Icon icon="lucide:mail-check" className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-navy">
                  Detail Permohonan Konsultasi
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Tinjau kebutuhan calon klien dan perbarui status tindak lanjut tim sales / estimator.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedItem && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 sm:px-8 overflow-y-auto space-y-5 flex-1 bg-slate-50/40 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Nama Calon Klien</span>
                    <span className="font-bold text-navy text-base mt-0.5 block">{selectedItem.sender_name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Email Korporat</span>
                    <a href={`mailto:${selectedItem.sender_email}`} className="text-blue-600 font-semibold hover:underline text-sm mt-0.5 block">
                      {selectedItem.sender_email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Waktu Pengiriman</span>
                    <span className="font-mono text-xs text-slate-700 mt-0.5 block">
                      {new Date(selectedItem.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Status Saat Ini</span>
                    <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Topik Layanan yang Diminati
                  </span>
                  <Badge variant="outline" className="font-semibold text-navy bg-navy/5 border-navy/20 px-3.5 py-1.5 text-xs rounded-xl">
                    <Icon icon="lucide:tag" className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                    {selectedItem.service_topic}
                  </Badge>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Deskripsi Kebutuhan Proyek
                  </span>
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 text-slate-800 leading-relaxed whitespace-pre-wrap text-sm font-medium">
                    {selectedItem.project_detail}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Perbarui Status Follow-Up
                    </Label>
                    <Select value={statusVal} onValueChange={setStatusVal}>
                      <SelectTrigger id="status" className="h-11 rounded-xl border-slate-200 bg-white font-medium">
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="NEW">Baru Masuk (Belum Dihubungi)</SelectItem>
                        <SelectItem value="CONTACTED">Sudah Dihubungi / Follow-Up</SelectItem>
                        <SelectItem value="IN_DISCUSSION">Dalam Tahap Negosiasi / Penawaran Harga</SelectItem>
                        <SelectItem value="CLOSED">Selesai (Deal / Closed Project)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Catatan Internal Sales / Tim Teknis
                    </Label>
                    <Textarea
                      id="notes"
                      rows={2}
                      value={notesVal}
                      onChange={(e) => setNotesVal(e.target.value)}
                      placeholder="Contoh: Sudah dikirim surat penawaran harga via email, menunggu PO dari procurement..."
                      className="rounded-xl border-slate-200 bg-white p-3 font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="p-4 sm:px-8 border-t border-slate-200 bg-white shrink-0 gap-2.5">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailOpen(false)}
                  className="h-11 rounded-xl px-5 cursor-pointer font-semibold"
                >
                  Tutup
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={savingStatus}
                  className="h-11 bg-navy hover:bg-navy-dark text-white font-bold rounded-xl px-6 cursor-pointer shadow-sm"
                >
                  {savingStatus ? (
                    <>
                      <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Icon icon="lucide:check" className="mr-2 h-4 w-4 text-amberbrand" />
                      Simpan Status &amp; Catatan
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Pesan Masuk?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pesan konsultasi ini akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
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
