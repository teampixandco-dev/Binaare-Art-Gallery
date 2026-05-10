"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionReveal from "@/components/SectionReveal";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const featuredWorks = [
  { src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=800&fit=crop", title: "Whispers of Stillness", medium: "Acrylic on Canvas" },
  { src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=800&fit=crop", title: "Emotional Currents", medium: "Mixed Media" },
  { src: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&h=800&fit=crop", title: "Inner Landscape", medium: "Watercolour" },
  { src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop", title: "Presence in Gold", medium: "Textured Abstraction" },
];

const ease = [0.22, 1, 0.36, 1] as const;

const HERO_VIDEO = "/hero-video-optimized.mp4";
const HERO_POSTER = "/hero-bg.png";
const HERO_GRAIN = "/grain.png";

const heroStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.45,
      staggerChildren: 0.14,
    },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 130, damping: 18, mass: 0.9 },
  },
};

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
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

      // Pin + scrub on `.section-move` (hero, about). Featured collection is excluded.
      const panels = gsap.utils.toArray<HTMLElement>(".section-move");

      panels.forEach((panel) => {
        if (panel.id === "section-featured-collection") return;

        const innerpanel = panel.querySelector<HTMLElement>(".section-inner");
        if (!innerpanel) return;

        const isHero = panel.id === "section-3-1219";
        const scrollTarget = innerpanel;

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
          // Only parallax the video/grain layer — hero copy stays fixed (no coupling to scroll below).
          const upward =
            difference > 0
              ? difference
              : Math.min(240, Math.round(windowHeight * 0.24));
          const bgLayer = panel.querySelector<HTMLElement>("#hero-scroll-layer");
          if (bgLayer) {
            tl.to(bgLayer, { y: -upward, ease: "none", duration: 1 }, 0);
          }
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

  // Hero mouse parallax — video drifts subtly, grain drifts more.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const hero = document.getElementById("section-3-1219");
    const mBg = document.getElementById("hero-mouse-bg");
    const mGrain = document.getElementById("hero-mouse-grain");
    if (!hero || !mBg || !mGrain) return;

    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    let raf = 0;
    let active = false;

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!active) {
        active = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      mBg.style.transform = `translate3d(${cx * -10}px, ${cy * -10}px, 0)`;
      mGrain.style.transform = `translate3d(${cx * -22}px, ${cy * -22}px, 0)`;

      if (Math.abs(cx - tx) < 0.001 && Math.abs(cy - ty) < 0.001 && tx === 0 && ty === 0) {
        active = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);

    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      mBg.style.transform = "";
      mGrain.style.transform = "";
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
          {/* Background Video — layered parallax (scroll + mouse) */}
          <motion.div
            id="hero-parallax-bg"
            className="absolute inset-0 z-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Scroll layer — moves at 0.5x scroll speed (handled by GSAP). */}
            <div id="hero-scroll-layer" className="absolute inset-0">
              {/* Mouse-parallax wrapper for the video (subtle drift). */}
              <div
                id="hero-mouse-bg"
                className="absolute"
                style={{ top: "-6%", left: "-6%", right: "-6%", bottom: "-6%" }}
              >
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={HERO_VIDEO}
                  poster={HERO_POSTER}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                />
              </div>
              {/* Grain texture — drifts more than the video for layered feel. */}
              <div
                id="hero-mouse-grain"
                aria-hidden
                className="pointer-events-none absolute mix-blend-overlay"
                style={{
                  inset: 0,
                  backgroundImage: `url("${HERO_GRAIN}")`,
                  backgroundRepeat: "repeat",
                  backgroundSize: "240px 240px",
                }}
              />
            </div>
            {/* Foreground gradient — stays anchored. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          </motion.div>

          {/* Hero copy — static; scroll parallax applies only to #hero-scroll-layer */}
          <div className="hero-panel-content relative z-10 w-full px-8 lg:px-16 pb-16 lg:pb-24">
            <motion.div
              className="mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
              variants={heroStagger}
              initial="hidden"
              animate="show"
            >
              {/* Left — eyebrow + headline */}
              <div>
                <motion.p
                  variants={heroItem}
                  className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90"
                >
                  Colors of Love
                </motion.p>
                <motion.h1
                  variants={heroItem}
                  className="font-serif font-medium uppercase tracking-[-0.04em] text-white leading-[1.06]"
                  style={{
                    fontSize: "clamp(2.75rem, 7vw, 5rem)",
                  }}
                >
                  Binaare <br /> Art Gallery
                </motion.h1>
              </div>

              {/* Right — subtext + CTA */}
              <div className="max-w-[26rem] text-white">
                <motion.p
                  variants={heroItem}
                  className="mb-6 text-[15px] leading-[1.68] tracking-[-0.015em] text-white/[0.82]"
                >
                  Moving with Emotion, Reflection, Inner Peace, Love, and Presence.
                  A contemplative creative space where emotion finds form and colour
                  becomes a language of the soul.
                </motion.p>
                <motion.div variants={heroItem}>
                  <Link href="/gallery" className="btn-white btn-arrow">
                    Explore Gallery <ArrowRight className="w-4 h-4 btn-arrow-icon" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
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
              <Link href="/about" className="btn-outline btn-arrow">
                Learn More <ArrowRight className="w-3.5 h-3.5 btn-arrow-icon" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SectionReveal>
        {/* ═══ FEATURED COLLECTION (Parallax Gallery) ═══ */}
        <section id="section-featured-collection" style={{ background: "var(--bg-alt)", padding: "6rem 0" }}>
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
              <Link href="/gallery" className="btn-primary btn-arrow">
                View Full Gallery <ArrowRight className="w-4 h-4 btn-arrow-icon" />
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
                  sizes="(max-width: 1024px) 100vw, 42vw"
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
              <Link href="/artist" className="btn-outline btn-arrow">
                Read Full Story <ArrowRight className="w-3.5 h-3.5 btn-arrow-icon" />
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
            className="font-serif font-normal italic leading-[1.55] text-white tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.35rem)", maxWidth: "44rem" }}
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
