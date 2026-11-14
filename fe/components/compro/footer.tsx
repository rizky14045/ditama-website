"use client";

import React from "react";
import { ComproHomeResponse } from "@/lib/api-compro";

interface FooterProps {
  data?: ComproHomeResponse | null;
}

export default function Footer({ data }: FooterProps) {
  const settings = data?.site_settings;
  const companyName = settings?.company_name || "PT. DITAMA INTI TEKNOLOGI";
  const tagline = settings?.company_tagline || "General Supplier, IT Solution & System Integration";
  const address = settings?.office_address || "Komp. PCI Blok D 115 No. 06-07, Cilegon - Banten 42423";
  const phone = settings?.phone_whatsapp || "+62813-1050-6456";
  const phoneClean = phone.replace(/[^0-9+]/g, "");
  const email = settings?.email_official || "ditamadigital@gmail.com";
  const website = settings?.website_url || "https://www.ditamadigital.co.id";
  const footerDesc =
    settings?.footer_description ||
    "Perusahaan perdagangan umum dan jasa teknologi terintegrasi yang berfokus pada kecepatan layanan, kualitas pengerjaan, dan kepatuhan keselamatan kerja K3.";

  return (
    <footer id="kontak" className="bg-navy-dark text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Office Address */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={companyName}
                  className="h-10 w-auto max-w-[200px] object-contain"
                />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center border border-white/15">
                    <svg
                      className="w-6 h-6 text-white"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 6H16.5C21.7467 6 26 10.2533 26 15.5V16.5C26 21.7467 21.7467 26 16.5 26H7V6Z"
                        stroke="currentColor"
                        strokeWidth="3.2"
                      />
                      <path
                        d="M12.5 11.5H16C18.4853 11.5 20.5 13.5147 20.5 16C20.5 18.4853 18.4853 20.5 16 20.5H12.5V11.5Z"
                        fill="#F59E0B"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-heading font-extrabold text-lg text-white block leading-none">
                      {companyName}
                    </span>
                    <span className="text-xs text-amberbrand font-medium">
                      {tagline}
                    </span>
                  </div>
                </>
              )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {footerDesc}
            </p>
            <div className="flex items-start gap-2.5 text-sm text-slate-300 pt-1">
              <svg
                className="w-5 h-5 text-amberbrand shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{address}</span>
            </div>
          </div>

          {/* Col 2: Kontak Resmi */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider">
              Kontak Resmi
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-amberbrand shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href={`tel:${phoneClean}`}
                  className="hover:text-amberbrand transition-colors"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-amberbrand shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-amberbrand transition-colors"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-amberbrand shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <a
                  href={website.startsWith("http") ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amberbrand transition-colors"
                >
                  {website.replace(/^https?:\/\//, "")}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Tautan Cepat */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider">
              Tautan Cepat
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#tentang-kami" className="hover:text-amberbrand transition-colors">
                  Tentang Perusahaan
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-amberbrand transition-colors">
                  Layanan &amp; Solusi
                </a>
              </li>
              <li>
                <a href="#portofolio" className="hover:text-amberbrand transition-colors">
                  Portofolio &amp; Studi Kasus
                </a>
              </li>
              <li>
                <a href="#mitra" className="hover:text-amberbrand transition-colors">
                  Prinsipal &amp; Partner
                </a>
              </li>
              <li>
                <a href="#kontak" className="hover:text-amberbrand transition-colors">
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-10 mt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">
              Cilegon &bull; Banten &bull; Indonesia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
