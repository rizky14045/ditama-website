"use client";

import React from "react";
import { ServiceData } from "@/lib/api-compro";

interface ServicesProps {
  data?: ServiceData[];
}

function getServiceIcon(slugOrName?: string, index: number = 0) {
  const key = (slugOrName || "").toLowerCase();
  if (key.includes("gate") || key.includes("security") || key.includes("keamanan") || index === 2) {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    );
  }
  if (key.includes("integrat") || key.includes("system") || index === 1) {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    );
  }
  if (key.includes("supplier") || key.includes("electric") || key.includes("listrik") || index === 3) {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function parseBullets(raw: string | undefined): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
    } catch (e) {
      // fallback to newline split
    }
  }
  return trimmed
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

export default function Services({ data }: ServicesProps) {
  const serviceList =
    !data || data.length === 0
      ? []
      : data.map((item, idx) => ({
          id: item.id || `srv-${idx}`,
          title: item.title,
          slug: item.slug || "",
          short_description: item.short_description,
          bullets: parseBullets(item.bullet_features),
          display_order: item.display_order ?? idx + 1,
        }));

  if (serviceList.length === 0) return null;

  return (
    <section id="layanan" className="py-16 lg:py-24 bg-icegray border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            Kompetensi &amp; Solusi
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-navy mt-2">
            Layanan Utama Kami
          </h2>
          <p className="text-slate-600 text-base mt-3">
            {serviceList.length === 3
              ? "Pilar keahlian profesional untuk mendukung transformasi digital, efisiensi operasional, dan keamanan fasilitas industri Anda."
              : serviceList.length === 4
              ? "Pilar keahlian profesional untuk mendukung transformasi digital, efisiensi operasional, dan keamanan fasilitas industri Anda."
              : "Pilar keahlian profesional untuk mendukung transformasi digital, efisiensi operasional, dan keamanan fasilitas industri Anda."}
          </p>
        </div>

        {/* Dynamic Responsive Card Grid (Centered for 1, 2, 3, or 4 items) */}
        <div
          className={`grid gap-6 sm:gap-8 justify-center ${
            serviceList.length === 3
              ? "grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto"
              : serviceList.length === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
              : serviceList.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {serviceList.map((srv, idx) => (
            <article
              key={srv.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-navy/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-navy text-amberbrand flex items-center justify-center mb-5">
                  {getServiceIcon(srv.slug || srv.title, idx)}
                </div>
                <h3 className="font-heading font-bold text-xl text-navy mb-3">
                  {srv.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {srv.short_description}
                </p>
                {srv.bullets && srv.bullets.length > 0 && (
                  <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-slate-100 pt-4">
                    {srv.bullets.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amberbrand shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
