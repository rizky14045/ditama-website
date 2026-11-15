"use client";

import React, { useState, useEffect } from "react";
import Header from "./header";
import Hero from "./hero";
import TrustBar from "./trust-bar";
import About from "./about";
import Services from "./services";
import Portfolio from "./portfolio";
import TechPartners from "./tech-partners";
import CtaBanner from "./cta-banner";
import Footer from "./footer";
import ContactModal from "./contact-modal";
import { fetchComproHomeData, ComproHomeResponse } from "@/lib/api-compro";

export default function ComproPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [homeData, setHomeData] = useState<ComproHomeResponse | null>(null);

  useEffect(() => {
    // Attempt to fetch dynamic data from Go Backend
    fetchComproHomeData().then((data) => {
      if (data) {
        setHomeData(data);
      }
    });
  }, []);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <div className="min-h-screen bg-white text-slatebrand font-sans antialiased selection:bg-amberbrand selection:text-navy-dark scroll-smooth">
      {/* 1. Header & Navigation */}
      <Header data={homeData} onOpenContactModal={openContactModal} />

      <main>
        {/* 2. Hero Section */}
        <Hero data={homeData?.hero} />

        {/* 3. Trust Bar */}
        <TrustBar data={homeData?.clients} />

        {/* 4. Tentang Kami */}
        <About data={homeData?.about} />

        {/* 5. Layanan Utama */}
        <Services data={homeData?.services} />

        {/* 6. Portofolio & Studi Kasus */}
        <Portfolio data={homeData?.portfolios} categories={homeData?.service_categories} />

        {/* 7. Partner Teknologi Resmi */}
        <TechPartners data={homeData?.tech_partners} />

        {/* 8. CTA Banner */}
        <CtaBanner data={homeData?.cta_banner} onOpenContactModal={openContactModal} />
      </main>

      {/* 9. Footer */}
      <Footer data={homeData} />

      {/* 10. Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        categories={homeData?.service_categories}
      />
    </div>
  );
}
