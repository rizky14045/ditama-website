"use client";

import React, { useEffect, useState } from "react";

function Logo({ className }: { className?: string; [key: string]: any }) {
  const [logoUrl, setLogoUrl] = useState<string>("");

  useEffect(() => {
    try {
      const cached = localStorage.getItem("ditama_admin_logo");
      if (cached) setLogoUrl(cached);
    } catch (_) {}

    const handleUpdate = (e: Event) => {
      const ce = e as CustomEvent<{ url: string }>;
      if (ce.detail?.url) setLogoUrl(ce.detail.url);
    };
    window.addEventListener("ditama:logo-updated", handleUpdate);
    return () => window.removeEventListener("ditama:logo-updated", handleUpdate);
  }, []);

  if (!logoUrl) {
    return (
      <div className="w-8 h-8 rounded-lg bg-navy text-amberbrand font-bold text-sm flex items-center justify-center shrink-0">
        D
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt="Logo PT. Ditama Inti Teknologi"
      className={className || "h-8 w-auto object-contain"}
    />
  );
}

export default Logo;
