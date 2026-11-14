import type { Metadata } from "next";
import ComproPage from "@/components/compro";

export const metadata: Metadata = {
  title: "PT. Ditama Inti Teknologi | Solusi IT, Gate System & General Supplier Industri",
  description:
    "PT. Ditama Inti Teknologi adalah mitra terpercaya BUMN & industri sejak 2019 untuk layanan Software Development, System Integration, Smart Gate System, Access Control, CCTV, dan General Supplier bersertifikat CSMS K3.",
  keywords: [
    "PT Ditama Inti Teknologi",
    "Software Development Cilegon",
    "IT Consultant",
    "Gate Management System",
    "Barrier Gate",
    "Turnstile",
    "Access Control",
    "General Supplier Industri",
    "CSMS PLN",
    "System Integration SCADA",
  ],
  authors: [{ name: "PT. Ditama Inti Teknologi" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.ditamadigital.co.id/",
  },
  openGraph: {
    type: "website",
    title: "PT. Ditama Inti Teknologi | Solusi IT Terintegrasi & Gate System",
    description:
      "Mitra terpercaya BUMN & industri untuk Software Development, System Integration, Keamanan Akses, dan General Supplier.",
    url: "https://www.ditamadigital.co.id/",
    siteName: "PT. Ditama Inti Teknologi",
    locale: "id_ID",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PT. Ditama Inti Teknologi",
  url: "https://www.ditamadigital.co.id",
  foundingDate: "2019",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Komp. PCI Blok D 115 No. 06-07",
    addressLocality: "Cilegon",
    addressRegion: "Banten",
    postalCode: "42423",
    addressCountry: "ID",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+62-813-1050-6456",
    contactType: "sales",
    email: "ditamadigital@gmail.com",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ComproPage />
    </>
  );
}
