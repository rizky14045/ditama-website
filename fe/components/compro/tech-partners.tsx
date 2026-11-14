"use client";

import React from "react";
import { ClientPartnerData } from "@/lib/api-compro";

const DEFAULT_PARTNERS = [
  { name: "Honeywell", style: "tracking-tight font-extrabold" },
  { name: "CISCO", style: "tracking-widest font-extrabold" },
  { name: "HIKVISION", style: "tracking-wide font-extrabold" },
  { name: "Dahua Technology", style: "font-extrabold" },
  { name: "ZKTeco", style: "tracking-wide font-extrabold" },
  { name: "Hanwha Vision", style: "font-extrabold" },
  { name: "Texecom", style: "font-extrabold" },
  { name: "FALCO", style: "tracking-wider font-extrabold" },
  { name: "LS-AG Cable Indonesia", style: "font-extrabold" },
];

interface TechPartnersProps {
  data?: ClientPartnerData[];
}

export default function TechPartners({ data }: TechPartnersProps) {
  const partners: ClientPartnerData[] = data && data.length > 0
    ? data
    : DEFAULT_PARTNERS.map((p, idx) => ({
        id: `default-partner-${idx}`,
        name: p.name,
        type: "TECH_PARTNER" as const,
        logo_url: "",
        website_url: "",
        display_order: idx + 1,
      }));

  return (
    <section
      id="mitra"
      aria-label="Partner Teknologi Resmi"
      className="py-14 bg-icegray border-t border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-heading">
            Ekosistem Prinsipal
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-navy mt-1.5">
            Partner Teknologi Resmi
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Didukung perangkat keras keamanan, jaringan, dan kabel industri
            bersertifikasi global.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {partners.map((partner, idx) => {
            const itemKey = partner.id || `partner-${idx}-${partner.name}`;
            const cardInner = (
              <div className="bg-white rounded-xl px-5 py-4 border border-slate-200/80 flex items-center justify-center text-center shadow-2xs hover:border-navy/40 transition-all hover:shadow-xs min-h-[58px] min-w-[140px]">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-h-8 max-w-[150px] object-contain"
                  />
                ) : (
                  <span className="font-heading font-extrabold text-sm sm:text-base text-slate-800 tracking-wide">
                    {partner.name}
                  </span>
                )}
              </div>
            );

            if (partner.website_url) {
              return (
                <a
                  key={itemKey}
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:-translate-y-0.5"
                  title={partner.name}
                >
                  {cardInner}
                </a>
              );
            }

            return (
              <div key={itemKey}>
                {cardInner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
