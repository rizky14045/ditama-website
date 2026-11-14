"use client";

import React, { useState } from "react";
import { sendInquiry } from "@/lib/api-compro";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [serviceTopic, setServiceTopic] = useState("IT Solution & Software Development");
  const [projectDetail, setProjectDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const result = await sendInquiry({
      sender_name: name.trim(),
      sender_email: email.trim(),
      service_topic: serviceTopic,
      project_detail: projectDetail.trim(),
    });

    setLoading(false);

    if (result.success) {
      setFeedback({
        type: "success",
        text: "Terima kasih! Pesan konsultasi Anda telah tersimpan di sistem kami dan tim PT. Ditama Inti Teknologi akan segera menghubungi Anda.",
      });

      // Prepare mailto fallback redirect after 1.2 second
      const subject = encodeURIComponent(`[Konsultasi Proyek] ${serviceTopic} - ${name}`);
      const body = encodeURIComponent(
        `Halo Tim PT. Ditama Inti Teknologi,\n\n` +
          `Nama / Perusahaan: ${name}\n` +
          `Email: ${email}\n` +
          `Layanan: ${serviceTopic}\n\n` +
          `Detail Kebutuhan:\n${projectDetail}\n`
      );

      setTimeout(() => {
        window.location.href = `mailto:ditamadigital@gmail.com?subject=${subject}&body=${body}`;
      }, 1200);
    } else {
      setFeedback({
        type: "error",
        text: result.message || "Gagal mengirim data ke server. Silakan hubungi kami via email langsung.",
      });
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-9 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amberbrand/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-navy/10 rounded-full blur-2xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer z-10"
          aria-label="Tutup Modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-7 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-navy text-amberbrand flex items-center justify-center shrink-0 shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 inline-block mb-1">
              Konsultasi &amp; Pengadaan
            </span>
            <h3 id="modal-title" className="font-heading font-extrabold text-2xl text-navy">
              Diskusikan Kebutuhan Proyek Anda
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Mitra terpercaya BUMN &amp; industri untuk Software Development, Gate System, dan Mekanikal Elektrikal.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label
              htmlFor="sender-name"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
            >
              Nama Lengkap &amp; Perusahaan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="sender-name"
                required
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso - PT. Industri Nusantara"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 disabled:bg-slate-100 transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sender-email"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
              >
                Email Korporat / Instansi <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                id="sender-email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.co.id"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 disabled:bg-slate-100 transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label
                htmlFor="service-topic"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
              >
                Kategori Layanan
              </label>
              <select
                id="service-topic"
                disabled={loading}
                value={serviceTopic}
                onChange={(e) => setServiceTopic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 disabled:bg-slate-100 transition-all font-medium text-slate-800 cursor-pointer"
              >
                <option value="IT Solution & Software Development">IT Solution &amp; Software (Web, Mobile, AI)</option>
                <option value="System Integration (SCADA/MAXIMO)">System Integration (SCADA, IoT, ERP)</option>
                <option value="Gate & Security System (Turnstile/CCTV)">Gate &amp; Security (Barrier Gate, RFID, CCTV)</option>
                <option value="General Supplier & Electrical">General Supplier &amp; Electrical (K3, 6KV)</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="project-detail"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
            >
              Deskripsi Ringkas Kebutuhan Proyek <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="project-detail"
              rows={3}
              required
              disabled={loading}
              value={projectDetail}
              onChange={(e) => setProjectDetail(e.target.value)}
              placeholder="Jelaskan spesifikasi kebutuhan, jumlah unit gerbang/titik CCTV, atau estimasi target waktu pengerjaan..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 disabled:bg-slate-100 transition-all font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-xl text-xs font-semibold animate-in fade-in flex items-start gap-2.5 ${
                feedback.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {feedback.type === "success" ? (
                <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 px-6 rounded-xl bg-amberbrand hover:bg-amberbrand-hover text-navy-dark font-heading font-bold text-sm shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-navy-dark" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Menyimpan Permintaan...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-navy-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Kirim Permintaan Konsultasi</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-semibold text-sm transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
