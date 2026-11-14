import React from "react";
import LogInForm from "@/components/auth/login-form";
import { Cpu, ShieldCheck, Wrench, BadgeCheck } from "lucide-react";
import { fetchComproHomeData } from "@/lib/api-compro";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Ambil langsung pengaturan situs & logo resmi dari API backend
  const data = await fetchComproHomeData();
  const logoUrl = data?.site_settings?.logo_url || "";
  const companyName = data?.site_settings?.company_name || "PT. DITAMA INTI TEKNOLOGI";
  const companyTagline = data?.site_settings?.company_tagline || "General Supplier, IT Solution & System Integration";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center w-full">
      <div className="min-h-screen flex flex-wrap w-full justify-center">
        {/* Left Section: Official PT. Ditama Inti Teknologi Brand Showcase */}
        <div className="basis-1/2 w-full relative hidden xl:flex flex-col justify-between p-14 2xl:p-16 bg-gradient-to-br from-[#071326] via-[#0E2448] to-[#1B3B6F] text-white overflow-hidden shadow-2xl">
          {/* Ambient background glow & grid elements */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-heading">
              Enterprise Admin Portal
            </span>
          </div>

          {/* Center Brand Hero Card */}
          <div className="relative z-10 my-auto py-8">
            <div className="backdrop-blur-md bg-white/[0.07] border border-white/15 p-8 2xl:p-10 rounded-3xl shadow-2xl max-w-[540px]">
              {/* Logo Box diambil dinamis dari API */}
              <div className="mb-6 inline-flex p-3.5 bg-white rounded-2xl shadow-md border border-white/30">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={companyName}
                    className="h-12 w-auto max-w-[220px] object-contain"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-navy text-amberbrand font-extrabold flex items-center justify-center text-2xl">
                    D
                  </div>
                )}
              </div>

              <h2 className="text-2xl 2xl:text-3xl font-extrabold tracking-tight text-white font-heading">
                {companyName}
              </h2>
              <p className="text-amber-300 font-semibold text-xs tracking-wider uppercase mt-1">
                {companyTagline}
              </p>

              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full my-5" />

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Pusat kendali administrasi terpadu untuk pengelolaan profil perusahaan, portofolio proyek, layanan kompetensi, dan permohonan konsultasi klien industri.
              </p>

              {/* Pillars list */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <span>IT Software Development, ERP &amp; Artificial Intelligence</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>Smart Gate System, Turnstile, RFID &amp; Keamanan Akses</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                  <span>General Supplier Mekanikal, Elektrikal &amp; Standar K3 PLN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Note */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10">
            <span className="font-mono text-[11px] text-slate-400">
              v1.0.1 Stable
            </span>
          </div>
        </div>

        {/* Right Section: Clean Login Form */}
        <div className="min-h-screen basis-full xl:basis-1/2 w-full px-6 py-10 flex justify-center items-center bg-white">
          <div className="w-full max-w-[460px]">
            <LogInForm logoUrl={logoUrl} companyName={companyName} />
          </div>
        </div>
      </div>
    </div>
  );
}
