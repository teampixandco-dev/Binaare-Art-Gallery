"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

export default function AboutPage() {
  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <PageHero
        title="About Us"
        subtitle="The Philosophy Behind the Gallery"
        backgroundImage="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1920&h=800&fit=crop"
      />

      <SectionReveal>
        <section className="gallery-section" style={{ paddingTop: "6rem" }}>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="lg:w-1/2">
              <p className="section-label">Our Story</p>
              <h2 className="section-title">Colors of Love</h2>
              <div className="section-divider" />
              <p className="section-text" style={{ marginBottom: "1.5rem" }}>
                Binaare Art Gallery is a contemplative creative space where emotion finds form and
                colour becomes a language of the soul. Rooted in the philosophy of Colors of Love,
                the gallery presents works that explore the quiet depth of human feeling through
                acrylic paintings, expressive landscapes, textured abstraction, watercolour
                compositions, and layered mixed media.
              </p>
              <p className="section-text" style={{ marginBottom: "1.5rem" }}>
                Specialising in acrylic, texture, watercolour, and mixed media, each painting is
                created as an emotional experience rather than a purely visual piece. Through
                nuanced palettes, tactile surfaces, and intuitive composition, the work invites
                viewers to pause, reflect, and connect with what is often felt but rarely spoken.
              </p>
              <p className="section-text">
                At its heart, Binaare Art Gallery is guided by the belief that art holds its
                greatest power when it resonates beyond the eye and reaches the inner self. Every
                painting is conceived not simply as an artwork but a passageway to explore a deeper
                connection with life experience.
              </p>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&h=900&fit=crop"
                alt="Gallery atmosphere"
                width={700}
                height={900}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "2px" }}
              />
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="gallery-section">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=700&h=900&fit=crop"
                alt="Artistic journey"
                width={700}
                height={900}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "2px" }}
              />
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2">
              <p className="section-label">The Artistic Voice</p>
              <h2 className="section-title">Sensitivity, Depth &amp; Emotional Restraint</h2>
              <div className="section-divider" />
              <p className="section-text" style={{ marginBottom: "1.5rem" }}>
                The gallery reflects the artistic journey of Binari Gamage, a contemporary Sri
                Lankan artist whose practice is deeply shaped by personal resilience, mindfulness,
                introspection, and an enduring search for balance and beauty. Her work draws from
                universal emotional truths — love, peace, memory, vulnerability, and connection —
                translating them into compositions that feel both intimate and timeless.
              </p>
              <p className="section-text" style={{ marginBottom: "1.5rem" }}>
                Binaare&apos;s artistic voice is distinguished by its sensitivity, depth, and emotional
                restraint — where texture carries meaning, colour conveys feeling, and every
                brushstroke is placed with intention. The result is a body of work that speaks
                softly yet lingers deeply, offering not only visual beauty, but emotional resonance.
              </p>
              <p className="section-text" style={{ fontStyle: "italic", fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--fg)" }}>
                Binaare Art Gallery is more than a gallery. It is a space where art is felt, where
                colour remembers, and where emotion becomes presence.
              </p>
            </div>
          </div>
        </section>
      </SectionReveal>

      <Footer />
    </main>
  );
}
