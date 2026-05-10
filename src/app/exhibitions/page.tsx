"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import Lenis from "lenis";

export default function ExhibitionsPage() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 2.2, smoothWheel: true });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <PageHero
        title="Exhibitions"
        subtitle="Where Colors of Love Comes to Life"
        backgroundImage="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1920&h=800&fit=crop"
      />

      {/* Intro */}
      <SectionReveal>
        <section className="gallery-section text-center" style={{ maxWidth: "800px" }}>
          <p className="section-label">The Journey Begins</p>
          <h2 className="section-title">A Space in the Making</h2>
          <div className="section-divider" style={{ margin: "1.5rem auto" }} />
          <p className="section-text" style={{ maxWidth: "100%", textAlign: "center" }}>
            Binaare Art Gallery is currently evolving as a purely online space, and we are in the
            process of shaping our first physical exhibition experiences. While no exhibitions have
            been held yet, this space marks the beginning of that journey — a future extension of the
            gallery where Colors of Love will move beyond the canvas and into immersive, shared
            environments.
          </p>
        </section>
      </SectionReveal>

      {/* Vision */}
      <section style={{ background: "var(--bg-alt)", padding: "6rem 2rem" }}>
        <SectionReveal>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/2">
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
              <div className="md:w-1/2">
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

      {/* Stay Connected */}
      <SectionReveal>
        <section className="gallery-section text-center" style={{ maxWidth: "900px" }}>
          <p className="section-label">Stay Connected</p>
          <h2 className="section-title">Be the First to Know</h2>
          <p className="section-text" style={{ maxWidth: "100%", textAlign: "center", marginBottom: "3rem" }}>
            Be the first to know when our exhibitions are announced and receive early access to
            upcoming showcases. If you are interested in future exhibitions, collaborations, or
            private viewing experiences, we would love to hear from you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginBottom: "3rem" }}>
            <div className="exhibit-cta">
              <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>✉</div>
              <h4>Join the Exhibition List</h4>
              <p>Email signup for updates and early access</p>
            </div>
            <div className="exhibit-cta">
              <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>🎨</div>
              <h4>Register Interest</h4>
              <p>For collectors, galleries, or private invitations</p>
            </div>
            <div className="exhibit-cta">
              <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>🤝</div>
              <h4>Inquire for Collaboration</h4>
              <p>For institutions, curators, or events</p>
            </div>
          </div>

          <p className="section-text" style={{ maxWidth: "100%", textAlign: "center", fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
            Until our first exhibition takes form, the gallery continues to live online — where each
            artwork exists as its own quiet exhibition of emotion, reflection, and presence.
          </p>
        </section>
      </SectionReveal>

      <Footer />
    </main>
  );
}
