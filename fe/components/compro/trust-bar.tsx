"use client";

import React from "react";
import { ClientPartnerData } from "@/lib/api-compro";

const DEFAULT_CLIENTS = [
  "PT. PLN Indonesia Power",
  "PT. PLN Nusantara Power",
  "PT. Krakatau Posco",
  "Bank Indonesia",
  "BNPB",
  "PT. Semen Gresik",
  "Shopee",
];

interface TrustBarProps {
  data?: ClientPartnerData[];
}

export default function TrustBar({ data }: TrustBarProps) {
  const clients: ClientPartnerData[] =
    data === undefined
      ? DEFAULT_CLIENTS.map((name, idx) => ({
          id: `default-client-${idx}`,
          name,
          type: "CLIENT" as const,
          logo_url: "",
          website_url: "",
          display_order: idx + 1,
        }))
      : data;

  if (clients.length === 0) return null;

  return (
    <section
      aria-label="Klien dan Mitra Perusahaan"
      className="bg-icegray border-b border-slate-200/80 py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6 font-heading">
          Dipercaya Oleh BUMN &amp; Perusahaan Terkemuka
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {clients.map((client, idx) => {
            const itemKey = client.id || `client-${idx}-${client.name}`;
            const cardInner = (
              <div className="bg-white rounded-xl px-4 py-3 border border-slate-200/70 flex items-center justify-center text-center shadow-2xs hover:border-navy/40 transition-all hover:shadow-xs min-h-[48px]">
                {client.logo_url ? (
                  <img
                    src={client.logo_url}
                    alt={client.name}
                    className="max-h-7 max-w-[140px] object-contain"
                  />
                ) : (
                  <span className="font-heading font-bold text-xs sm:text-sm text-slate-700">
                    {client.name}
                  </span>
                )}
              </div>
            );

            if (client.website_url) {
              return (
                <a
                  key={itemKey}
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:-translate-y-0.5"
                  title={client.name}
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
