"use client";

import React from "react";
import { HeroData } from "@/lib/api-compro";

interface HeroProps {
  data?: HeroData;
}

export default function Hero({ data }: HeroProps) {
  if (!data || !data.headline_h1) return null;

  const badgeText = data.badge_text || "";
  const headline = data.headline_h1;
  const subheadline = data.subheadline || "";
  const primaryText = data.primary_cta_text || "Hubungi Kami";
  const primaryLink = data.primary_cta_link || "#kontak";
  const secondaryText = data.secondary_cta_text || "Lihat Portofolio";
  const secondaryLink = data.secondary_cta_link || "#portofolio";

  return (
    <section id="beranda" className="relative bg-navy text-white overflow-hidden">
      {/* Subtle Geometric Background Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-navy-light rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amberbrand/10 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          {badgeText && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-amberbrand text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amberbrand" />
              {badgeText}
            </div>
          )}

          {/* Main H1 Headline */}
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-[54px] leading-tight tracking-tight text-white">
            {headline.includes("Gate System") ? (
              <>
                {headline.split("Gate System")[0]}
                <span className="text-amberbrand">Gate System</span>
                {headline.split("Gate System")[1]}
              </>
            ) : (
              headline
            )}
          </h1>

          {/* Subheadline Paragraph */}
          <p className="text-slate-200 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto">
            {subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <a
              href={primaryLink}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amberbrand hover:bg-amberbrand-hover text-navy-dark font-heading font-bold text-base shadow-lg shadow-black/20 hover:shadow-xl transition-all"
            >
              {primaryText}
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href={secondaryLink}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/25 font-heading font-semibold text-base transition-all"
            >
              {secondaryText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
