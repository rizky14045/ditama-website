"use client";

import { useEffect } from "react";
import { fetchComproHomeData } from "@/lib/api-compro";

export function updateDocumentFavicon(url: string) {
  if (typeof document === "undefined" || !url) return;

  try {
    // Save to cache for instant retrieval on next navigation
    try {
      localStorage.setItem("ditama_site_favicon", url);
    } catch (_) {}

    // Add cache buster to guarantee fresh icon load across all browsers
    const buster = url.includes("?") ? "" : `?t=${Date.now()}`;
    const freshUrl = `${url}${buster}`;

    // Safely update existing link tags without removing elements from DOM
    // (Removing elements directly causes React reconciler: 'null reading removeChild')
    const existingIcons = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
    if (existingIcons.length > 0) {
      existingIcons.forEach((el) => {
        el.href = freshUrl;
      });
    } else {
      let dynamicLink = document.getElementById("ditama-dynamic-favicon") as HTMLLinkElement | null;
      if (!dynamicLink) {
        dynamicLink = document.createElement("link");
        dynamicLink.id = "ditama-dynamic-favicon";
        dynamicLink.rel = "shortcut icon";
        dynamicLink.type = "image/png";
        document.head.appendChild(dynamicLink);
      }
      dynamicLink.href = freshUrl;
    }
  } catch (err) {
    console.error("Failed to set dynamic favicon", err);
  }
}

export default function DynamicFavicon() {
  useEffect(() => {
    // 1. Instant check from local cache
    try {
      const cached = localStorage.getItem("ditama_site_favicon");
      if (cached) {
        updateDocumentFavicon(cached);
      }
    } catch (_) {}

    // 2. Fetch fresh dynamic settings from Go Backend
    async function initFavicon() {
      try {
        const data = await fetchComproHomeData();
        const favUrl = data?.site_settings?.favicon_url || data?.site_settings?.logo_url;
        if (favUrl) {
          updateDocumentFavicon(favUrl);
        }
      } catch (err) {
        console.error("Failed to load dynamic favicon from API", err);
      }
    }

    initFavicon();

    // 3. Listen to CMS live update events
    const handleFaviconChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ url: string }>;
      if (customEvent.detail?.url) {
        updateDocumentFavicon(customEvent.detail.url);
      }
    };

    window.addEventListener("ditama:favicon-updated", handleFaviconChange);
    return () => {
      window.removeEventListener("ditama:favicon-updated", handleFaviconChange);
    };
  }, []);

  return null;
}
