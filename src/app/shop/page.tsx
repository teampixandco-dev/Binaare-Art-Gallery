"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

const collections = [
  { title: "Acrylic Paintings", desc: "Bold expressions of emotion through vibrant acrylic layers", src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=750&fit=crop" },
  { title: "Watercolour", desc: "Fluid compositions capturing light, memory, and feeling", src: "https://images.unsplash.com/photo-1578301978693-85fa9fd0c369?w=600&h=750&fit=crop" },
  { title: "Textured Abstraction", desc: "Tactile surfaces where texture carries meaning", src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=750&fit=crop" },
  { title: "Mixed Media", desc: "Layered works blending materials and techniques", src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=750&fit=crop" },
];

const shopItems = [
  { src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=650&fit=crop", title: "Whispers of Stillness", medium: "Acrylic on Canvas", size: "60 × 80 cm" },
  { src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&h=650&fit=crop", title: "Emotional Currents", medium: "Mixed Media", size: "50 × 70 cm" },
  { src: "https://images.unsplash.com/photo-1578301978693-85fa9fd0c369?w=500&h=650&fit=crop", title: "Inner Landscape", medium: "Watercolour", size: "40 × 55 cm" },
  { src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=650&fit=crop", title: "Presence in Gold", medium: "Textured Abstraction", size: "70 × 90 cm" },
  { src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&h=650&fit=crop", title: "Reflections of Peace", medium: "Acrylic on Canvas", size: "55 × 75 cm" },
  { src: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=500&h=650&fit=crop", title: "Memory and Light", medium: "Mixed Media", size: "45 × 60 cm" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function ShopPage() {
  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <PageHero
        title="Shop"
        subtitle="Original Artworks by Binari Gamage"
        backgroundImage="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&h=800&fit=crop"
      />

      {/* Welcome */}
      <SectionReveal>
        <section className="gallery-section text-center" style={{ paddingBottom: "2rem" }}>
          <p className="section-text" style={{ maxWidth: "800px", margin: "0 auto" }}>
            Welcome to the Binaare Art Gallery Shop — a curated online space where emotion,
            colour, and texture come together through original artworks by Binari Gamage. Each
            piece is created as a unique expression of feeling, rooted in Colors of Love and
            inspired by emotion, reflection, inner peace, love, and presence.
          </p>
        </section>
      </SectionReveal>

      {/* Collections Grid */}
      <SectionReveal>
        <section className="gallery-section" style={{ paddingTop: "2rem" }}>
          <p className="section-label text-center">Collections</p>
          <h2 className="section-title text-center" style={{ marginBottom: "3rem" }}>Explore by Medium</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {collections.map((col, i) => (
              <motion.div
                key={col.title}
                className="collection-card"
                initial={{ y: 30 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease }}
              >
                <Image src={col.src} alt={col.title} width={600} height={750} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div className="collection-card-overlay">
                  <h3>{col.title}</h3>
                  <p>{col.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* Shop Items */}
      <section style={{ background: "var(--bg-alt)", padding: "6rem 0" }}>
        <div className="gallery-section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <p className="section-label text-center">Available Works</p>
          <h2 className="section-title text-center" style={{ marginBottom: "3rem" }}>Discover Artworks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {shopItems.map((item, i) => (
              <motion.div
                key={item.title}
                className="artwork-card"
                initial={{ y: 40 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.08, ease }}
              >
                <div style={{ overflow: "hidden" }}>
                  <Image src={item.src} alt={item.title} width={500} height={650} className="artwork-card-img" style={{ width: "100%", height: "auto" }} />
                </div>
                <div className="artwork-card-info">
                  <h3 className="artwork-card-title">{item.title}</h3>
                  <p className="artwork-card-medium">{item.medium} · {item.size}</p>
                  <Link href="/contact" className="btn-outline" style={{ marginTop: "0.8rem", padding: "0.5rem 1.2rem", fontSize: "0.65rem" }}>
                    Enquire
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
