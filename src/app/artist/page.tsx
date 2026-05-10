"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

export default function ArtistPage() {
  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <PageHero
        title="The Artist"
        subtitle="Binari Gamage"
        backgroundImage="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1920&h=800&fit=crop"
      />

      <SectionReveal>
        <section className="gallery-section" style={{ paddingTop: "6rem" }}>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <div className="lg:w-5/12 lg:sticky lg:top-32">
              <Image
                src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=800&fit=crop"
                alt="Binari Gamage"
                width={600}
                height={800}
                style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "2px" }}
              />
              <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "var(--bg-alt)" }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontStyle: "italic", color: "var(--fg)", lineHeight: 1.7 }}>
                  &ldquo;Through this convergence of discipline, reflection, and discovery,
                  art becomes a personal language — one that speaks of transformation,
                  presence, and the quiet unfolding of self.&rdquo;
                </p>
              </div>
            </div>

            <div className="lg:w-7/12">
              <p className="section-label">Biography</p>
              <h2 className="section-title">A Journey of Discovery</h2>
              <div className="section-divider" />

              <p className="section-text" style={{ marginBottom: "1.5rem" }}>
                Binari Gamage is a contemporary artist based in Colombo, Sri Lanka, whose creative
                journey is deeply intertwined with a distinguished professional career in finance
                spanning over 26 years. Educated at Mahamaya Girls&apos; College, Kandy, she later
                completed both her BSc and MSc in Accountancy and General Management at the
                University of Sri Jayewardenepura.
              </p>

              <p className="section-text" style={{ marginBottom: "1.5rem" }}>
                Her path to art emerged later in life as a personal awakening and a search for her
                true self. In her mid-life journey, Binari discovered painting as a powerful form of
                expression and reflection, allowing her to connect more deeply with emotion, presence,
                and inner balance. This discovery became a turning point, shaping her artistic voice
                and defining her practice today.
              </p>

              <h3 className="font-serif text-xl mt-10 mb-4">Beyond Art</h3>
              <div className="section-divider" />

              <p className="section-text" style={{ marginBottom: "1.5rem" }}>
                Beyond her professional and artistic pursuits, Binari was also an accomplished
                competitive swimmer, representing John Keells Holdings PLC at the mercantile level
                and contributing to her team&apos;s Mercantile Championship success. She was honored with
                both School Colors and All-Island University Colors in recognition of her sporting
                excellence and continues her association with sport as a member of the Sinhalese
                Sports Club.
              </p>

              <h3 className="font-serif text-xl mt-10 mb-4">Philosophy &amp; Practice</h3>
              <div className="section-divider" />

              <p className="section-text" style={{ marginBottom: "1.5rem" }}>
                Her artistic sensibility is further enriched by the influence of Buddhist philosophy,
                which guides her approach to life and creativity. Rooted in mindfulness, her work
                reflects calm observation, emotional clarity, and a harmonious balance between inner
                stillness and expressive form.
              </p>

              <p className="section-text">
                Through this convergence of discipline, reflection, and discovery, Binari&apos;s art
                becomes a personal language — one that speaks of transformation, presence, and the
                quiet unfolding of self.
              </p>
            </div>
          </div>
        </section>
      </SectionReveal>

      <Footer />
    </main>
  );
}
