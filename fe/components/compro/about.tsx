"use client";

import React from "react";
import { AboutData, ValuePillarItem } from "@/lib/api-compro";

interface AboutProps {
  data?: AboutData | null;
}

const DEFAULT_VALUE_PILLARS: ValuePillarItem[] = [
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

export default function About({ data }: AboutProps) {
  const defaultMissions = [
    "Menyediakan solusi bernilai tambah yang mengoptimalkan kepuasan pelanggan.",
    "Menciptakan lapangan kerja berkualitas dan berperan aktif sebagai warga korporat yang baik.",
    "Memberikan layanan prima dengan kecepatan dan presisi tinggi.",
  ];

  let missionList = defaultMissions;
  if (data?.mission_items) {
    try {
      const parsed = JSON.parse(data.mission_items);
      if (Array.isArray(parsed) && parsed.length > 0) {
        missionList = parsed;
      }
    } catch (_) {}
  }

  const establishedYear = data?.established_year || 2019;
  const currentYear = new Date().getFullYear();
  const calculatedYears = currentYear - establishedYear;

  const experienceBadge = data?.experience_badge || "Pengalaman Industri";
  const experienceYears =
    data?.experience_years ||
    (calculatedYears > 0 ? `${calculatedYears}+ Tahun` : "Sejak 2019");
  const experienceDesc =
    data?.experience_desc ||
    `Melayani berbagai perusahaan terkemuka, BUMN, dan kawasan industri di Indonesia sejak tahun ${establishedYear}.`;

  let valuePillars = DEFAULT_VALUE_PILLARS;
  if (data?.value_pillars) {
    try {
      const parsedPillars = JSON.parse(data.value_pillars);
      if (Array.isArray(parsedPillars) && parsedPillars.length > 0) {
        valuePillars = parsedPillars;
      }
    } catch (_) {}
  }

  // Warna aksen nomor pilar
  const numberBgColors = [
    "bg-amber-500/10 text-amber-600",
    "bg-blue-500/10 text-navy",
    "bg-emerald-500/10 text-emerald-600",
    "bg-purple-500/10 text-purple-600",
  ];

  return (
    <section id="tentang-kami" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2 font-heading">
            Profil Perusahaan
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-navy">
            {data?.title || "Tentang PT. Ditama Inti Teknologi"}
          </h2>
        </div>

        {/* Narrative & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Description (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              {data?.description_html ? (
                data.description_html
              ) : (
                <>
                  Berdiri sejak tahun <strong>{establishedYear}</strong> di{" "}
                  <strong>Cilegon, Banten</strong>,{" "}
                  <strong>PT. DITAMA INTI TEKNOLOGI</strong> merupakan perusahaan
                  perdagangan umum dan jasa yang bergerak di bidang{" "}
                  <em>General Supplier</em>, <em>IT Solution &amp; Multimedia</em>,{" "}
                  <em>System Integration</em>, serta <em>Electrical Services</em>.
                  Kami berkomitmen menghadirkan solusi industri yang cepat,
                  terintegrasi, dan berorientasi pada standar kualitas tinggi demi
                  mendukung kelancaran operasional para mitra industri kami.
                </>
              )}
            </p>

            {/* Visi & Misi Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Visi */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-3 h-3 rounded-full bg-amberbrand" />
                    <h3 className="font-heading font-bold text-lg text-navy">
                      Visi Perusahaan
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {data?.vision_text ||
                      "Menjadi perusahaan General Supplier dan penyedia solusi teknologi terintegrasi di Indonesia yang terkemuka dalam pertumbuhan, efisiensi, dan reputasi."}
                  </p>
                </div>
              </div>

              {/* Misi */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-3 h-3 rounded-full bg-navy" />
                    <h3 className="font-heading font-bold text-lg text-navy">
                      Misi Perusahaan
                    </h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-slate-600">
                    {missionList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <svg
                          className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Credibility Highlights (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Kartu Pengalaman Industri */}
            <div className="p-6 rounded-2xl bg-navy text-white shadow-md">
              <span className="text-xs uppercase font-bold tracking-wider text-amberbrand block mb-1 font-heading">
                {experienceBadge}
              </span>
              <div className="font-heading font-extrabold text-4xl text-white mb-2">
                {experienceYears}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {experienceDesc}
              </p>
            </div>

            {/* Poin Keunggulan Nilai (Value Pillars) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
              {valuePillars.map((pillar, idx) => {
                const colorClass = numberBgColors[idx % numberBgColors.length];
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold font-heading text-xs ${colorClass}`}
                    >
                      {pillar.number || `0${idx + 1}`}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-navy font-heading">
                        {pillar.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
