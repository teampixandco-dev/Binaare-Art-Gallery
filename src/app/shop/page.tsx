"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import AddToCartButton from "@/components/AddToCartButton";
import { PRODUCTS, formatPriceUSD } from "@/data/products";

const collections = [
  { title: "Acrylic Paintings", desc: "Bold expressions of emotion through vibrant acrylic layers", src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=750&fit=crop" },
  { title: "Watercolour", desc: "Fluid compositions capturing light, memory, and feeling", src: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&h=750&fit=crop" },
  { title: "Textured Abstraction", desc: "Tactile surfaces where texture carries meaning", src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=750&fit=crop" },
  { title: "Mixed Media", desc: "Layered works blending materials and techniques", src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=750&fit=crop" },
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
                <Image src={col.src} alt={col.title} width={600} height={750} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
          <div className="product-grid">
            {PRODUCTS.map((item, i) => (
              <motion.article
                key={item.slug}
                className="product-card"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease }}
              >
                <Link
                  href={`/shop/${item.slug}`}
                  className="product-card-media"
                  aria-label={`View ${item.title}`}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="product-card-image"
                  />
                  <span className="product-card-tag">{item.medium}</span>
                  <span className="product-card-quickview">
                    <Eye size={14} strokeWidth={1.6} /> Quick view
                  </span>
                </Link>

                <div className="product-card-body">
                  <div className="product-card-row">
                    <h3 className="product-card-title">
                      <Link href={`/shop/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <span className="product-card-price">{formatPriceUSD(item.price)}</span>
                  </div>
                  <p className="product-card-meta">{item.size}</p>

                  <div className="product-card-actions">
                    <AddToCartButton slug={item.slug} className="btn-primary product-card-cta" />
                    <Link
                      href={`/shop/${item.slug}`}
                      className="btn-outline product-card-cta product-card-cta--view"
                    >
                      View <ArrowUpRight size={14} strokeWidth={1.8} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
