"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageSections from "@/components/PageSections";
import { usePageContent } from "@/context/ContentContext";
import PageHero from "@/components/PageHero";



const ease = [0.22, 1, 0.36, 1] as const;

export default function GalleryPage() {
  const page = usePageContent("gallery");
  const artworks = (page?.sections.find(s => s.id === "artworks")?.items || []).map(item => ({ ...item, medium: item.category }));
  const filters = ["All", ...new Set(artworks.map(a => a.medium).filter(Boolean))];
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "All" ? artworks : artworks.filter((a) => a.medium === filter);

  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <PageHero
        title="Gallery"
        subtitle="Explore the Online Gallery"
        backgroundImage="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=800&fit=crop"
      />

      <section className="gallery-section">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "btn-primary" : "btn-outline"}
              style={{ padding: "0.6rem 1.5rem" }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((work, i) => (
              <motion.div
                key={work.id}
                className="artwork-card"
                layout
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                exit={{ scale: 0.95 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease }}
                onClick={() => setLightbox(artworks.indexOf(work))}
              >
                <div style={{ overflow: "hidden" }}>
                  <Image
                    src={work.src}
                    alt={work.title}
                    width={600}
                    height={800}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="artwork-card-img"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <div className="artwork-card-info">
                  <h3 className="artwork-card-title">{work.title}</h3>
                  <p className="artwork-card-medium">{work.medium}</p>
                  {work.description && <p className="section-text mt-2">{work.description}</p>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && artworks[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(0,0,0,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "zoom-out",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "80vw", maxHeight: "85vh", position: "relative" }}
            >
              <Image
                src={artworks[lightbox].src}
                alt={artworks[lightbox].title}
                width={1200}
                height={1600}
                sizes="80vw"
                style={{ maxHeight: "85vh", width: "auto", objectFit: "contain" }}
              />
              <div style={{ textAlign: "center", color: "#fff", marginTop: "1rem" }}>
                <h3 className="font-serif text-xl">{artworks[lightbox].title}</h3>
                <p style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.6, marginTop: "0.3rem" }}>
                  {artworks[lightbox].medium}
                </p>
              </div>
            </motion.div>
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: "absolute", top: "2rem", right: "2rem",
                background: "none", border: "none", color: "#fff",
                fontSize: "1.5rem", cursor: "pointer",
              }}
              aria-label="Close lightbox"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <PageSections slug="gallery" />
      <Footer />
    </main>
  );
}
