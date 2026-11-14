"use client";

import React from "react";
import { CtaBannerData } from "@/lib/api-compro";

interface CtaBannerProps {
  data?: CtaBannerData;
  onOpenContactModal: () => void;
}

export default function CtaBanner({ data, onOpenContactModal }: CtaBannerProps) {
  const headline =
    data?.headline || "Siap Mengintegrasikan Sistem IT & Keamanan Fasilitas Anda?";
  const subtext =
    data?.subtext ||
    "Mitra terpercaya BUMN & industri sejak 2019 untuk Software Development, System Integration, dan Keamanan Akses.";
  const buttonText = data?.button_text || "Contact Us";

  const handleButtonClick = () => {
    if (data?.button_action_type === "LINK" && data?.button_target) {
      if (data.button_target.startsWith("#")) {
        const el = document.querySelector(data.button_target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
      window.open(data.button_target, "_blank", "noopener,noreferrer");
      return;
    }
    onOpenContactModal();
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-navy px-6 py-12 sm:px-12 sm:py-16 text-center text-white overflow-hidden shadow-xl">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#F59E0B 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight">
              {headline}
            </h2>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
              {subtext}
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={handleButtonClick}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amberbrand hover:bg-amberbrand-hover text-navy-dark font-heading font-extrabold text-base shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
