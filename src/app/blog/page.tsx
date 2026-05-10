"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import Lenis from "lenis";

const ease = [0.22, 1, 0.36, 1] as const;

const blogPreviews = [
  {
    title: "Featured Story",
    desc: "A highlighted article that captures the current focus of the artist, a new collection, or an important reflection from the studio.",
    img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop",
  },
  {
    title: "Art & Process",
    desc: "Insights into Binari Gamage's creative process, exploring how acrylic texture, watercolour, and mixed media works come to life.",
    img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop",
  },
  {
    title: "Behind the Canvas",
    desc: "Stories that reveal the inspiration, emotions, and moments behind selected artworks and collections.",
    img: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=400&fit=crop",
  },
];

export default function BlogPage() {
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
        title="Blog"
        subtitle="A journal of art, emotion, and creative reflections"
        backgroundImage="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1920&h=800&fit=crop"
      />

      {/* Coming Soon */}
      <SectionReveal>
        <section className="gallery-section text-center" style={{ paddingTop: "5rem", paddingBottom: "2rem" }}>
          <div
            style={{
              display: "inline-block",
              padding: "0.5rem 1.5rem",
              background: "var(--bg-alt)",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontWeight: 600,
              marginBottom: "2rem",
            }}
          >
            Coming Soon
          </div>
          <h2 className="section-title">Art, Emotion &amp; Creative Reflections</h2>
          <p className="section-text" style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            From Binaare Art Gallery — a space for stories, insights, and reflections on the
            creative journey of Colors of Love.
          </p>
        </section>
      </SectionReveal>

      {/* Blog Previews */}
      <section className="gallery-section" style={{ paddingTop: "2rem" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPreviews.map((post, i) => (
            <motion.div
              key={post.title}
              className="blog-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease }}
            >
              <div style={{ overflow: "hidden", aspectRatio: "3/2" }}>
                <Image
                  src={post.img}
                  alt={post.title}
                  width={600}
                  height={400}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                />
              </div>
              <div className="blog-card-body">
                <h3>{post.title}</h3>
                <p>{post.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <SectionReveal>
        <section className="gallery-section text-center" style={{ paddingBottom: "6rem" }}>
          <div style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem 2rem", background: "var(--bg-alt)" }}>
            <h3 className="font-serif text-xl mb-2">Stay Updated</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
              Be the first to read new stories when the blog launches.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="contact-input"
                style={{ flex: 1 }}
              />
              <button className="btn-primary" style={{ whiteSpace: "nowrap" }}>
                Notify Me
              </button>
            </div>
          </div>
        </section>
      </SectionReveal>

      <Footer />
    </main>
  );
}
