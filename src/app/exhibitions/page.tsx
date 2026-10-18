"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageSections from "@/components/PageSections";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import ExhibitionShowcase from "@/components/ExhibitionShowcase";

export default function ExhibitionsPage() {
  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <PageHero
        title="Exhibitions"
        subtitle="Where Colors of Love Comes to Life"
        tag="Curated Spaces"
        backgroundImage="/artworks/rhythm-of-the-city.webp"
      />

      {/* Intro */}
      <SectionReveal>
        <section className="gallery-section text-center" style={{ maxWidth: "820px" }}>
          <p className="section-label">Curated Presence</p>
          <h2 className="section-title">A Living Space of Art &amp; Emotion</h2>
          <div className="section-divider" style={{ margin: "1.5rem auto" }} />
          <p className="section-text" style={{ maxWidth: "100%", textAlign: "center" }}>
            Binaare Art Gallery bridges physical presence and digital curation, bringing
            together contemplative creative spaces where emotion finds form. From our
            past exhibition showcase in Colombo to our online gallery, each presentation
            allows Colors of Love to be experienced through stillness, reflection, and depth.
          </p>
        </section>
      </SectionReveal>

      {/* Vision */}
      <section style={{ background: "var(--bg-alt)", padding: "6rem 2rem" }}>
        <SectionReveal>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/2">
                <p className="section-label">Our Vision</p>
                <h2 className="section-title">Intimate Emotional Experiences</h2>
                <div className="section-divider" />
                <p className="section-text">
                  Future exhibitions will be designed as intimate emotional experiences rather than
                  traditional displays. Each showcase will bring together selected works by Binari
                  Gamage, creating environments that invite stillness, reflection, and presence.
                  These exhibitions will be shaped around emotion, texture, and atmosphere — allowing
                  art to be experienced rather than simply viewed.
                </p>
              </div>
              <div className="lg:w-1/2">
                <p className="section-label">The Experience</p>
                <h2 className="section-title">Beyond Traditional Display</h2>
                <div className="section-divider" />
                <p className="section-text">
                  Curated storytelling across collections, presented through immersive, emotionally
                  designed spaces featuring acrylic, texture, watercolour, and mixed media art pieces
                  — all rooted in themes of emotion, reflection, inner peace, love, and presence,
                  creating a deeper personal connection between artwork and audience.
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ═══ PHYSICAL GALLERY & EXHIBITION SHOWCASE ═══ */}
      <ExhibitionShowcase />

      <PageSections slug="exhibitions" />
      <Footer />
    </main>
  );
}
