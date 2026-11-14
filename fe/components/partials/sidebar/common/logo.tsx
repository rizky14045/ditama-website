"use client";

import React, { useEffect, useState } from "react";
import { useSidebar } from "@/store";
import Link from "next/link";
import { fetchComproHomeData } from "@/lib/api-compro";

const SidebarLogo = ({ hovered }: { hovered?: boolean }) => {
  const { sidebarType, setCollapsed, collapsed } = useSidebar();
  const [logoUrl, setLogoUrl] = useState<string>("");

  useEffect(() => {
    try {
      const cached = localStorage.getItem("ditama_admin_logo");
      if (cached) setLogoUrl(cached);
    } catch (_) {}

    async function loadLogo() {
      try {
        const data = await fetchComproHomeData();
        if (data?.site_settings?.logo_url) {
          setLogoUrl(data.site_settings.logo_url);
          try {
            localStorage.setItem("ditama_admin_logo", data.site_settings.logo_url);
          } catch (_) {}
        }
      } catch (_) {}
    }
    loadLogo();

    const handleUpdate = (e: Event) => {
      const ce = e as CustomEvent<{ url: string }>;
      if (ce.detail?.url !== undefined) {
        setLogoUrl(ce.detail.url || "");
      }
    };
    window.addEventListener("ditama:logo-updated", handleUpdate);
    return () => window.removeEventListener("ditama:logo-updated", handleUpdate);
  }, []);

  const isExpanded = !collapsed || hovered;

  return (
    <div className="px-4 py-4 border-b border-default-100 dark:border-default-200/50">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-x-3 overflow-hidden">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo PT. Ditama Inti Teknologi"
              className={
                isExpanded
                  ? "h-9 w-auto max-w-[170px] object-contain transition-all"
                  : "h-8 w-8 object-contain shrink-0"
              }
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center shrink-0">
              D
            </div>
          )}

          {isExpanded && !logoUrl && (
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base text-default-900 leading-none">
                PT. DITAMA
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-default-500 uppercase mt-0.5">
                Admin Panel
              </span>
            </div>
          )}
        </Link>

        {sidebarType === "classic" && isExpanded && (
          <div className="flex-none lg:block hidden">
            <div
              onClick={() => setCollapsed(!collapsed)}
              className={`h-4 w-4 border-[1.5px] border-default-900 dark:border-border rounded-full transition-all duration-150 cursor-pointer ${
                collapsed
                  ? ""
                  : "ring-2 ring-inset ring-offset-4 ring-default-900 bg-default-900 dark:ring-offset-default-300"
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarLogo;
