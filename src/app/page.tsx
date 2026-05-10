"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionReveal from "@/components/SectionReveal";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const featuredWorks = [
  { src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=800&fit=crop", title: "Whispers of Stillness", medium: "Acrylic on Canvas" },
  { src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=800&fit=crop", title: "Emotional Currents", medium: "Mixed Media" },
  { src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=800&fit=crop", title: "Inner Landscape", medium: "Watercolour" },
  { src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop", title: "Presence in Gold", medium: "Textured Abstraction" },
];

const ease = [0.22, 1, 0.36, 1] as const;

const HERO_BG_IMAGE = "/hero-bg.png";

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to("#hero-parallax-bg", {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: "#section-3-1219",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to("#section-10-1219", {
        backgroundPosition: "50% 0%",
        ease: "none",
        scrollTrigger: {
          trigger: "#section-10-1219",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Pin + scrub on `.section-move` (hero, about, featured collection).
      const panels = gsap.utils.toArray<HTMLElement>(".section-move");

      panels.forEach((panel) => {
        const innerpanel = panel.querySelector<HTMLElement>(".section-inner");
        if (!innerpanel) return;

        const heroContent = panel.querySelector<HTMLElement>(".hero-panel-content");
        const isHero = panel.id === "section-3-1219";
        const scrollTarget =
          isHero && heroContent ? heroContent : innerpanel;

        const panelHeight = innerpanel.offsetHeight;
        const windowHeight = window.innerHeight;
        const difference = panelHeight - windowHeight;
        const fakeScrollRatio =
          difference > 0 ? difference / (difference + windowHeight) : 0;

        if (fakeScrollRatio) {
          panel.style.marginBottom = `${panelHeight * fakeScrollRatio}px`;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "bottom bottom",
            end: () =>
              fakeScrollRatio ? `+=${innerpanel.offsetHeight}` : "bottom top",
            pinSpacing: false,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        if (isHero) {
          const upward =
            difference > 0
              ? difference
              : Math.min(240, Math.round(windowHeight * 0.24));
          tl.to(scrollTarget, { y: -upward, ease: "none", duration: 1 }, 0);
        } else if (difference > 0) {
          tl.to(scrollTarget, { y: -difference, ease: "none", duration: 1 }, 0);
        } else {
          const nudge = Math.min(140, Math.round(windowHeight * 0.14));
          tl.to(scrollTarget, { y: -nudge, ease: "none", duration: 1 }, 0);
        }
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      ctx.revert();
      document.querySelectorAll(".section-move").forEach((el) => {
        (el as HTMLElement).style.marginBottom = "";
      });
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section
        className="relative h-screen w-full overflow-hidden section-move"
        id="section-3-1219"
      >
        <div className="section-inner relative flex min-h-screen w-full flex-col justify-end overflow-hidden">
          {/* Background Image */}
          <motion.div
            id="hero-parallax-bg"
            className="absolute inset-0 z-0"
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1.15, opacity: 1 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundImage: `url('${HERO_BG_IMAGE}')`,
              backgroundSize: "cover",
              backgroundPosition: "50% 0%",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          </motion.div>

          {/* Hero Content — GSAP scroll layer (moves up while section is pinned) */}
          <div className="hero-panel-content relative z-10 w-full px-8 lg:px-16 pb-16 lg:pb-24">
            <div className="mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              {/* Left — text masking (background clipped to glyphs) */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.8, delay: 0.6, ease }}
              >
                <p
                  className="text-[10px] lg:text-xs tracking-[0.3em] uppercase font-semibold mb-4"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, var(--accent-light) 55%, var(--accent) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Colors of Love
                </p>
                <h1
                  className="font-serif leading-[1.08] uppercase font-light"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                    backgroundImage: `url('${HERO_BG_IMAGE}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Binaare <br /> Art Gallery
                </h1>
              </motion.div>

              {/* Right */}
              <motion.div
                className="text-white max-w-[380px]"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.8, delay: 0.9, ease }}
              >
                <p className="text-sm leading-relaxed opacity-85 mb-6">
                  Moving with Emotion, Reflection, Inner Peace, Love, and Presence.
                  A contemplative creative space where emotion finds form and colour
                  becomes a language of the soul.
                </p>
                <Link href="/gallery" className="btn-white">
                  Explore Gallery <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT PREVIEW ═══ */}
      <section
        className="gallery-section section-move"
        style={{ paddingTop: "8rem", paddingBottom: "8rem", background: "var(--bg)" }}
      >
        <div className="section-inner">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <div className="lg:w-1/2">
              <p className="section-label">The Gallery</p>
              <h2 className="section-title">Where Art Is Felt</h2>
              <div className="section-divider" />
            </div>
            <div className="lg:w-1/2">
              <p className="section-text" style={{ marginBottom: "1.5rem" }}>
                Binaare Art Gallery is a contemplative creative space where hero section 
                piece. Through nuanced palettes, tactile surfaces, and intuitive composition,
                the work invites viewers to pause, reflect, and connect with what is often felt
                but rarely spoken.
              </p>
              <Link href="/about" className="btn-outline">
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SectionReveal>
        {/* ═══ FEATURED COLLECTION (Parallax Gallery) ═══ */}
        <section style={{ background: "var(--bg-alt)", padding: "6rem 0" }}>
          <div className="gallery-section" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div className="text-center" style={{ marginBottom: "4rem" }}>
              <p className="section-label">Featured Collection</p>
              <h2 className="section-title">Selected Works</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredWorks.map((work, i) => (
                <motion.div
                  key={work.title}
                  className="artwork-card"
                  initial={{ y: 50 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, delay: i * 0.12, ease }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <Image
                      src={work.src}
                      alt={work.title}
                      width={600}
                      height={800}
                      className="artwork-card-img"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <div className="artwork-card-info">
                    <h3 className="artwork-card-title">{work.title}</h3>
                    <p className="artwork-card-medium">{work.medium}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center" style={{ marginTop: "3rem" }}>
              <Link href="/gallery" className="btn-primary">
                View Full Gallery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>
      {/* ═══ ARTIST PREVIEW ═══ */}
      <SectionReveal>
        <section className="gallery-section" style={{ paddingTop: "8rem", paddingBottom: "8rem", background: "var(--bg)" }}>
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-5/12">
              <div style={{ overflow: "hidden", borderRadius: "2px" }}>
                <Image
                  src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=750&fit=crop"
                  alt="Binari Gamage - Artist"
                  width={600}
                  height={750}
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="lg:w-7/12">
              <p className="section-label">The Artist</p>
              <h2 className="section-title">Binari Gamage</h2>
              <div className="section-divider" />
              <p className="section-text" style={{ marginBottom: "1.5rem" }}>
                Binari Gamage is a contemporary artist based in Colombo, Sri Lanka, whose
                creative journey is deeply intertwined with a distinguished professional
                career in finance spanning over 26 years. Her path to art emerged later in
                life as a personal awakening and a search for her true self.
              </p>
              <p className="section-text" style={{ marginBottom: "2rem" }}>
                Through this convergence of discipline, reflection, and discovery, Binari&apos;s
                art becomes a personal language — one that speaks of transformation, presence,
                and the quiet unfolding of self.
              </p>
              <Link href="/artist" className="btn-outline">
                Read Full Story <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ═══ QUOTE BANNER ═══ */}
      <section
        id="section-10-1219"
        className="relative flex items-center justify-center text-center overflow-hidden"
        style={{
          minHeight: "60vh",
          backgroundImage: "url('https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1920&h=800&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "50% 100%",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(26,26,26,0.65)" }} />
        <motion.div
          className="relative z-10 px-8"
          initial={{ y: 30 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
        >
          <p
            className="font-serif text-white italic leading-relaxed"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", maxWidth: "800px" }}
          >
            &ldquo;Binaare Art Gallery is more than a gallery. It is a space where art is felt,
            where colour remembers, and where emotion becomes presence.&rdquo;
          </p>
        </motion.div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <SectionReveal>
        <section className="gallery-section text-center" style={{ paddingTop: "6rem", paddingBottom: "6rem", background: "var(--bg)" }}>
          <p className="section-label">Begin Your Journey</p>
          <h2 className="section-title">Discover Colors of Love</h2>
          <p className="section-text" style={{ margin: "0 auto 2.5rem", textAlign: "center" }}>
            Explore the collections, learn about the artist, or get in touch for
            commissions, exhibitions, and collaboration opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/gallery" className="btn-primary">
              Explore Gallery
            </Link>
            <Link href="/contact" className="btn-outline">
              Get in Touch
            </Link>
          </div>
        </section>
      </SectionReveal>

      <Footer />
    </main>
  );
}
