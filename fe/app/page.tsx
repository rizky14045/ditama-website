import type { Metadata } from "next";
import ComproPage from "@/components/compro";
import { fetchComproHomeData } from "@/lib/api-compro";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await fetchComproHomeData();
  const settings = homeData?.site_settings;

  const siteTitle =
    settings?.seo_meta_title || settings?.company_name || "PT. Ditama Inti Teknologi";
  const siteDesc =
    settings?.seo_meta_description || settings?.footer_description || "";
  const siteKeywords = settings?.seo_keywords
    ? settings.seo_keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : [];
  const siteUrl = settings?.website_url || "https://www.ditamadigital.co.id/";
  const favicon = settings?.favicon_url || "/favicon.ico";
  const ogImage = settings?.seo_og_image_url || settings?.logo_url;

  return {
    title: siteTitle,
    description: siteDesc,
    keywords: siteKeywords,
    authors: [{ name: settings?.company_name || "PT. Ditama Inti Teknologi" }],
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: "website",
      title: siteTitle,
      description: siteDesc,
      url: siteUrl,
      siteName: settings?.company_name || "PT. Ditama Inti Teknologi",
      locale: "id_ID",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function Page() {
  const homeData = await fetchComproHomeData();
  const settings = homeData?.site_settings;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.company_name || "PT. Ditama Inti Teknologi",
    url: settings?.website_url || "https://www.ditamadigital.co.id",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.office_address || "",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings?.phone_whatsapp || "",
      contactType: "sales",
      email: settings?.email_official || "",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ComproPage initialData={homeData} />
    </>
  );
}
