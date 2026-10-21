"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageSections from "@/components/PageSections";
import { useContent, usePageContent } from "@/context/ContentContext";
import { PRODUCTS as STATIC_PRODUCTS } from "@/data/products";
import SectionReveal from "@/components/SectionReveal";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


const ease = [0.22, 1, 0.36, 1] as const;

const HERO_POSTER = "/hero-poster.webp";

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
  const page = usePageContent("home");
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    if (!video.paused) {
      setIsHeroPlaying(true);
    }

    const onPlaySuccess = () => {
      setIsHeroPlaying(true);
    };

    video.addEventListener("playing", onPlaySuccess);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(onPlaySuccess)
        .catch(() => {
          // Autoplay blocked by browser (e.g. iOS Low Power Mode)
          setIsHeroPlaying(false);
        });
    }

    const handleFirstGesture = () => {
      if (video && video.paused) {
        video.play().then(onPlaySuccess).catch(() => {});
      }
    };

    window.addEventListener("touchstart", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("scroll", handleFirstGesture, { once: true, passive: true });

    return () => {
      video.removeEventListener("playing", onPlaySuccess);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
    };
  }, [page?.hero]);
  
  const featuredSlugs = [
    "petals-of-serenity",
    "the-crimson-queen",
    "young-at-heart",
    "beauty-beyond-colour"
  ];
  
  const { products: contentProducts } = useContent();
  const allProducts = contentProducts && contentProducts.length > 0 ? contentProducts : STATIC_PRODUCTS;

  const featuredSection = page?.sections?.find(s => s.id === "featured");
  const featuredItems = featuredSection?.items || [];

  const featuredWorks = featuredItems.length > 0
    ? featuredItems.map((item, index) => {
        const matched = allProducts.find(
          p => p.slug === item.id ||
               (item.title && p.title.trim().toLowerCase() === item.title.trim().toLowerCase()) ||
               (item.src && (p.src === item.src || (p.images || []).includes(item.src)))
        );
        const slug = matched?.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "");
        const categoryTag = (item.category || matched?.category || "").trim();
        const curatorCaption = (item.description || matched?.medium || "").trim();
        return {
          id: item.id || `featured-${index}`,
          src: item.src || matched?.src || "/artworks/together-we-bloom.webp",
          title: item.title || matched?.title || "Featured Artwork",
          medium: categoryTag || "Original Artwork",
          caption: curatorCaption,
          slug,
        };
      })
    : featuredSlugs
        .map(slug => allProducts.find(p => p.slug === slug))
        .filter(Boolean)
        .map(p => ({
          id: p!.slug,
          src: (p!.images || []).find(img => img.includes("showcase")) || p!.src || p!.images?.[0] || "",
          title: p!.title,
          medium: (p!.category || "Original Artwork").trim(),
          caption: (p!.medium || "").trim(),
          slug: p!.slug,
        }));
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Quote Banner Parallax
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

      // 2. Hero scroll-linked fade, scale & translateY
      gsap.to("#hero-content", {
        scrollTrigger: {
          trigger: "#section-3-1219",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        opacity: 0,
        scale: 0.95,
        y: -60,
        ease: "none",
      });

      // Hero video background layer subtle translateY offset (-120px)
      gsap.to("#hero-scroll-layer", {
        scrollTrigger: {
          trigger: "#section-3-1219",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: -120,
        ease: "none",
      });

      // 3. Refresh ScrollTrigger
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      ctx.revert();
    };
  }, []);

  // Hero mouse parallax — video drifts subtly.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const hero = document.getElementById("section-3-1219");
    const mBg = document.getElementById("hero-mouse-bg");
    if (!hero || !mBg) return;

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
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-clip" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section
        className="hero-section sticky top-0 h-screen w-full overflow-hidden z-[1]"
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
            {/* Scroll layer — moves with GPU-accelerated translateY offset (-120px) on scroll */}
            <div id="hero-scroll-layer" className="absolute inset-0" style={{ willChange: "transform" }}>
              {/* Mouse-parallax wrapper for the video (subtle drift). */}
              <div
                id="hero-mouse-bg"
                className="absolute"
                style={{ top: "-6%", left: "-6%", right: "-6%", bottom: "-6%" }}
              >
                {/* Hero image: shows custom hero image if chosen, or HERO_POSTER as video poster / default */}
                <Image
                  src={page?.hero && !page.hero.endsWith(".mp4") ? page.hero : HERO_POSTER}
                  alt={page?.title || "Binaare Art Gallery"}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />

                {/* Hero video: Fades in only once playing is confirmed by browser */}
                {page?.hero && page.hero.endsWith(".mp4") && (
                  <video
                    ref={heroVideoRef}
                    className={`absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-700 ${
                      isHeroPlaying ? "opacity-100" : "opacity-0"
                    }`}
                    src={page.hero}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    disableRemotePlayback
                    tabIndex={-1}
                    aria-hidden="true"
                    suppressHydrationWarning
                  />
                )}
              </div>
            </div>
            {/* Foreground gradient — stays anchored. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          </motion.div>

          {/* Hero copy — scroll-linked fade and scale */}
          <div
            id="hero-content"
            className="hero-panel-content hero-content relative z-10 w-full px-8 lg:px-16 pb-16 lg:pb-24"
            style={{ willChange: "transform, opacity" }}
          >
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
                  {page?.subtitle || "Colors of Love"}
                </motion.p>
                <motion.h1
                  variants={heroItem}
                  className="font-serif font-medium uppercase tracking-[-0.04em] text-white leading-[1.06]"
                  style={{
                    fontSize: "clamp(2.75rem, 7vw, 5rem)",
                  }}
                >
                  {page?.title === "Binaare Art Gallery" ? <>Binaare <br /> Art Gallery</> : page?.title}
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
                  <Link href="/shop" className="btn-white btn-arrow">
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
        id="section-about"
        className="about-section sticky w-full z-[2]"
        style={{ paddingTop: "3rem", paddingBottom: "5rem", background: "var(--bg)" }}
      >
        <div
          id="about-content"
          className="about-content w-full gallery-section"
          style={{ paddingTop: 0, paddingBottom: 0 }}
        >
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="lg:w-1/2">
              <p className="section-label">The Gallery</p>
              <h2 className="section-title">Where Art Is Felt</h2>
              <div className="section-divider" />
            </div>
            <div className="lg:w-1/2">
              <p className="section-text" style={{ marginBottom: "1.25rem" }}>
                Binaare Art Gallery is a contemplative creative space where emotion finds form
                and colour becomes a language of the soul. Rooted in the philosophy of Colors of
                Love, the gallery presents works that explore the quiet depth of human feeling
                through acrylic paintings, expressive landscapes, textured abstraction,
                watercolour compositions, and layered mixed media.
              </p>
              <Link href="/about" className="btn-outline btn-arrow rounded-xs">
                Learn More <ArrowRight className="w-3.5 h-3.5 btn-arrow-icon" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED COLLECTION ═══ */}
      <section
        id="section-featured-collection"
        className="featured-section relative z-[3] w-full"
        style={{ background: "var(--bg-alt)", paddingTop: "3.5rem", paddingBottom: "3.5rem" }}
      >
        <div className="gallery-section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="text-center" style={{ marginBottom: "2.5rem" }}>
            <p className="section-label">Featured Collection</p>
            <h2 className="section-title">{featuredSection?.title || "Selected Works"}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWorks.map((work, i) => {
              const cardHref = work.slug ? `/shop/${work.slug}` : "/shop";
              return (
              <motion.div
                key={work.id}
                className="group flex flex-col h-full bg-white p-4 sm:p-5 rounded-xs border border-[#EBE5DA] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
              >
                {/* Artwork display box with extra-small radius and object-contain */}
                <div className="relative w-full aspect-[4/4.5] bg-[#FAF8F5] p-3 rounded-xs flex items-center justify-center mb-3.5">
                  <Link href={cardHref} className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xs">
                    <Image
                      src={work.src}
                      alt={work.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                </div>

                {/* Card Info */}
                <div className="flex-1 flex flex-col items-center text-center">
                  {/* Centered gold divider line */}
                  <div className="w-8 h-[1px] bg-[#B78646] mx-auto my-2" />

                  <h3 className="font-serif text-[1.08rem] sm:text-[1.12rem] font-normal leading-snug px-1 text-[#24211F] line-clamp-2">
                    <Link href={cardHref} className="transition-colors hover:text-[#8C704F]">
                      {work.title}
                    </Link>
                  </h3>
                  {work.medium && (
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[#77716B] leading-relaxed mt-1.5 mb-2 line-clamp-1 font-medium">
                      {work.medium}
                    </p>
                  )}

                  {work.caption && (
                    <p className="text-[0.8125rem] text-[#635E59] font-normal leading-relaxed px-1 mt-0.5 mb-4 line-clamp-3">
                      {work.caption}
                    </p>
                  )}

                  {/* Centered circular outline arrow button */}
                  <div className="mt-auto flex justify-center pb-1">
                    <Link
                      href={cardHref}
                      className="w-9 h-9 rounded-full border border-[#B78646]/70 flex items-center justify-center text-[#B78646] hover:bg-[#8C704F] hover:text-white hover:border-[#8C704F] transition-all"
                      aria-label={`View ${work.title}`}
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
            })}
          </div>

          <div className="text-center" style={{ marginTop: "2.5rem" }}>
            <Link href="/shop" className="btn-primary btn-arrow rounded-xs">
              View Shop <ArrowRight className="w-4 h-4 btn-arrow-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Subsequent sections in standard flow at z-index: 3 */}
      <div className="relative z-[3] w-full" style={{ background: "var(--bg)" }}>
        {/* ═══ ARTIST PREVIEW ═══ */}
        <SectionReveal>
          <section className="gallery-section" style={{ paddingTop: "4rem", paddingBottom: "4rem", background: "var(--bg)" }}>
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-center">
              <div className="lg:w-4/12">
                <div style={{ overflow: "hidden", borderRadius: "2px" }}>
                  <Image
                    src={page?.sections?.find(s => s.id === "artist")?.items[0]?.src || "/binari-gamage-painting.webp"}
                    alt={page?.sections?.find(s => s.id === "artist")?.items[0]?.title || "Binari Gamage - Artist"}
                    width={800}
                    height={1200}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                    priority
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
                <Link href="/artist" className="btn-outline btn-arrow rounded-xs">
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
            minHeight: "55vh",
            backgroundImage: `url("${page?.sections?.find(s => s.id === "quote")?.items[0]?.src || "/artworks/whispers-of-serenity.webp"}")`,
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
              <Link href="/shop" className="btn-primary">
                Explore Gallery
              </Link>
              <Link href="/contact" className="btn-outline">
                Get in Touch
              </Link>
            </div>
          </section>
        </SectionReveal>

        <PageSections slug="home" />
      <Footer />
      </div>
    </main>
  );
}
