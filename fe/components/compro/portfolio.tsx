"use client";

import React, { useState } from "react";
import { PortfolioData, ServiceCategoryData, DEFAULT_SERVICE_CATEGORIES } from "@/lib/api-compro";

type CategoryFilter = string;

interface PortfolioProps {
  data?: PortfolioData[];
  categories?: ServiceCategoryData[];
}

interface DisplayPortfolioItem {
  id: string;
  category: string;
  categoryLabel: string;
  client: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  gradientClass: string;
  highlightText?: string;
  badgeLabel?: string;
}

const DEFAULT_PORTFOLIO_ITEMS: DisplayPortfolioItem[] = [
  {
    id: "pln-sidak",
    category: "software",
    categoryLabel: "Software Solution",
    client: "PT. PLN Nusantara Power",
    title: "E-Preventive Maintenance & SIDAK AI",
    description:
      "Aplikasi mobile dan website untuk eksekusi preventive maintenance PLTU serta Sistem Data Keamanan (SIDAK) seluruh unit dengan AI rekap data & pemetaan kerawanan.",
    gradientClass: "from-navy to-navy-light",
    badgeLabel: "Enterprise Web & Mobile",
    highlightText: "AI Preventive & SIDAK Analytics",
  },
  {
    id: "semen-gresik",
    category: "security",
    categoryLabel: "Security System",
    client: "PT. Semen Gresik Rembang Tbk.",
    title: "Turnstile Full High & People Counting",
    description:
      "Pemasangan unit Turnstile Full High, sistem Access Control terpadu, serta integrasi sistem Vault dengan fitur Custom People Counting untuk akurasi data personel pabrik.",
    gradientClass: "from-slate-800 to-navy",
    highlightText: "Full Height Turnstile & Vault",
    badgeLabel: "Custom People Counting Integration",
  },
  {
    id: "gleneagles-hospital",
    category: "security",
    categoryLabel: "Security System",
    client: "Gleneagles KL & Likas Hospital",
    title: "Access Control & Radiation Protection",
    description:
      "Sistem integrasi dan instalasi Access Control, CCTV, serta sistem alarm proteksi radiasi fisik (Physical Protection Radiation) pada fasilitas medis internasional.",
    gradientClass: "from-navy-dark to-navy",
    highlightText: "International Healthcare Security",
    badgeLabel: "Kuala Lumpur & Kota Kinabalu",
  },
  {
    id: "pln-muara-karang",
    category: "security",
    categoryLabel: "Security System",
    client: "PT. PLN Nusantara Power UP Muara Karang",
    title: "Barrier Gate & CCTV Maintenance",
    description:
      "Perbaikan, pemasangan Barrier Gate, integrasi Visitor Management System dengan OCR plat nomor, serta pemeliharaan berkala CCTV & Gate Management System.",
    gradientClass: "from-navy to-slate-800",
    highlightText: "Multi-Year Contract (2025–2028)",
    badgeLabel: "Barrier Gate, VMS & CCTV",
  },
  {
    id: "shopee-office",
    category: "security",
    categoryLabel: "Security System",
    client: "PT. Shopee Office",
    title: "Instalasi Access Door Kantor Pusat",
    description:
      "Pemasangan dan konfigurasi sistem Access Door berstandar korporat untuk pengamanan akses ruang kerja di Sopo Del Tower Kuningan, Jakarta Selatan.",
    gradientClass: "from-navy-light to-navy",
    highlightText: "Sopo Del Tower Kuningan Lt. 28",
    badgeLabel: "Corporate Office Access Control",
  },
  {
    id: "krakatau-posco",
    category: "integrator",
    categoryLabel: "System Integrator",
    client: "PT. Krakatau Posco",
    title: "Fabrication Pondation & Pipe Rack 6KV",
    description:
      "Pekerjaan fabrikasi pondasi, pemasangan struktur baja Pipe Rack 6KV, serta dukungan pengadaan mekanikal & elektrikal di kawasan industri Cilegon.",
    gradientClass: "from-slate-800 to-navy-dark",
    highlightText: "Heavy Industrial Structure",
    badgeLabel: "Foundation & Pipe Rack 6KV",
  },
];

function normalizeCategory(cat: string): { key: "software" | "security" | "integrator"; label: string; gradient: string } {
  const upper = (cat || "").trim().toUpperCase();

  // 1. Cek Security System terlebih dahulu (hindari substring "IT" cocok dengan "SECUR-IT-Y")
  if (
    upper === "SECURITY" ||
    upper === "SECURITY_SYSTEM" ||
    upper.includes("SECURITY") ||
    upper.includes("GATE") ||
    upper.includes("CCTV") ||
    upper.includes("ACCESS") ||
    upper.includes("TURNSTILE")
  ) {
    return { key: "security", label: "Security System", gradient: "from-slate-800 to-navy" };
  }

  // 2. Cek System Integrator
  if (
    upper === "INTEGRATOR" ||
    upper === "SYSTEM_INTEGRATOR" ||
    upper.includes("INTEGRAT") ||
    upper.includes("SUPPLIER") ||
    upper.includes("ELECTRICAL") ||
    upper.includes("SCADA")
  ) {
    return { key: "integrator", label: "System Integrator", gradient: "from-slate-800 to-navy-dark" };
  }

  // 3. Default / Software Solution
  return { key: "software", label: "Software Solution", gradient: "from-navy to-navy-light" };
}

export default function Portfolio({ data, categories }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");

  const activeCategories = categories && categories.length > 0 ? categories : DEFAULT_SERVICE_CATEGORIES;

  const displayList: DisplayPortfolioItem[] =
    data && data.length > 0
      ? data.map((item, idx) => {
          const catInfo = normalizeCategory(item.category);
          return {
            id: item.id || `pf-${idx}`,
            category: catInfo.key,
            categoryLabel: catInfo.label,
            client: item.client_name || "Klien Terpercaya",
            title: item.title,
            description: item.summary || item.challenge_solution_detail || "",
            thumbnailUrl: item.thumbnail_url,
            gradientClass: catInfo.gradient,
            highlightText: item.project_year ? `Tahun ${item.project_year}` : undefined,
            badgeLabel: catInfo.label,
          };
        })
      : DEFAULT_PORTFOLIO_ITEMS;

  const filteredItems = displayList.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  return (
    <section id="portofolio" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Rekam Jejak Proyek
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-navy mt-2">
              Portofolio &amp; Studi Kasus Unggulan
            </h2>
          </div>

          {/* Interactive Filter Pills */}
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter Kategori Portofolio"
          >
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-amberbrand text-navy-dark font-bold shadow-xs"
                  : "bg-icegray text-slate-700 font-semibold hover:bg-slate-200"
              }`}
            >
              Semua
            </button>
            {activeCategories.map((cat) => {
              const catKey = normalizeCategory(cat.code || cat.name).key;
              const isActive = activeFilter === catKey;
              return (
                <button
                  key={cat.id || cat.code}
                  type="button"
                  onClick={() => setActiveFilter(catKey)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading transition-all cursor-pointer ${
                    isActive
                      ? "bg-amberbrand text-navy-dark font-bold shadow-xs"
                      : "bg-icegray text-slate-700 font-semibold hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Case Study Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col"
            >
              <div
                className={`h-48 bg-gradient-to-br ${item.gradientClass} p-5 flex flex-col justify-between relative overflow-hidden`}
                style={
                  item.thumbnailUrl
                    ? {
                        backgroundImage: `linear-gradient(rgba(10, 25, 47, 0.65), rgba(10, 25, 47, 0.85)), url(${item.thumbnailUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                <span className="self-start px-3 py-1 rounded-lg bg-amberbrand text-navy-dark text-[11px] font-bold uppercase tracking-wide z-10">
                  {item.categoryLabel}
                </span>

                <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3 text-white flex items-center justify-between gap-3 z-10">
                  <div>
                    <p className="text-xs font-bold">{item.client}</p>
                    {item.highlightText && (
                      <p className="text-[11px] text-amberbrand font-medium">{item.highlightText}</p>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-amberbrand/20 text-amberbrand flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                    {item.client}
                  </p>
                  <h3 className="font-heading font-bold text-lg text-navy mt-1 group-hover:text-navy-light transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
