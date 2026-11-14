"use client";

import React, { useState } from "react";
import { ComproHomeResponse } from "@/lib/api-compro";

interface HeaderProps {
  data?: ComproHomeResponse | null;
  onOpenContactModal: () => void;
}

export default function Header({ data, onOpenContactModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <a
            href="#beranda"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={closeMobileMenu}
          >
            {data?.site_settings?.logo_url ? (
              <img
                src={data.site_settings.logo_url}
                alt={data.site_settings.company_name || "PT. Ditama Inti Teknologi"}
                className="h-10 w-auto max-w-[200px] object-contain"
              />
            ) : (
              <>
                {/* Stylized 'D' Geometric Tech Icon */}
                <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center shadow-md group-hover:bg-navy-light transition-colors">
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
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-lg tracking-tight text-navy leading-none">
                    PT. DITAMA
                  </span>
                  <span className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase mt-1">
                    Inti Teknologi
                  </span>
                </div>
              </>
            )}
          </a>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center space-x-7"
            aria-label="Navigasi Utama"
          >
            <a
              href="#beranda"
              className="text-sm font-medium text-slate-700 hover:text-navy transition-colors"
            >
              Beranda
            </a>
            <a
              href="#tentang-kami"
              className="text-sm font-medium text-slate-700 hover:text-navy transition-colors"
            >
              Tentang Kami
            </a>
            <a
              href="#layanan"
              className="text-sm font-medium text-slate-700 hover:text-navy transition-colors"
            >
              Layanan
            </a>
            <a
              href="#portofolio"
              className="text-sm font-medium text-slate-700 hover:text-navy transition-colors"
            >
              Portofolio
            </a>
            <a
              href="#kontak"
              className="text-sm font-medium text-slate-700 hover:text-navy transition-colors"
            >
              Kontak
            </a>
          </nav>

          {/* Right CTA & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenContactModal}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-amberbrand hover:bg-amberbrand-hover text-navy-dark font-heading font-bold text-sm shadow-xs hover:shadow transition-all cursor-pointer"
            >
              Konsultasi Proyek
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <a
            href="#beranda"
            onClick={closeMobileMenu}
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-icegray hover:text-navy"
          >
            Beranda
          </a>
          <a
            href="#tentang-kami"
            onClick={closeMobileMenu}
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-icegray hover:text-navy"
          >
            Tentang Kami
          </a>
          <a
            href="#layanan"
            onClick={closeMobileMenu}
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-icegray hover:text-navy"
          >
            Layanan
          </a>
          <a
            href="#portofolio"
            onClick={closeMobileMenu}
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-icegray hover:text-navy"
          >
            Portofolio
          </a>
          <a
            href="#kontak"
            onClick={closeMobileMenu}
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-icegray hover:text-navy"
          >
            Kontak
          </a>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                onOpenContactModal();
              }}
              className="w-full py-3 rounded-xl bg-amberbrand hover:bg-amberbrand-hover text-navy-dark font-heading font-bold text-sm shadow-xs cursor-pointer"
            >
              Konsultasi Proyek
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
