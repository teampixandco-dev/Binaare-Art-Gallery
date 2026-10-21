"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { pageHref } from "@/lib/content-types";

interface PageHeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  tag?: string;
}

export default function PageHero({
  title: propTitle,
  subtitle: propSubtitle,
  backgroundImage: propBackgroundImage,
  tag,
}: PageHeroProps) {
  const pathname = usePathname();
  const content = useContent();
  const page = content?.pages?.find(p => pageHref(p) === pathname);

  const title = propTitle || page?.title || "Binaare Art Gallery";
  const subtitle = propSubtitle !== undefined ? propSubtitle : page?.subtitle;
  const rawBg = propBackgroundImage || page?.hero;
  const heroImage =
    !rawBg || rawBg.includes("unsplash.com")
      ? "/artworks/together-we-bloom.webp"
      : rawBg;

  const isVideo = Boolean(heroImage?.endsWith(".mp4"));

  return (
    <section
      className="page-hero relative w-full overflow-hidden min-h-[220px] sm:min-h-[260px] md:min-h-[290px] flex items-center justify-center text-center px-4 py-10 sm:py-14"
      style={{ backgroundImage: isVideo ? undefined : `url("${heroImage}")` }}
    >
      {/* Background Artwork or Ambient Video */}
      {isVideo ? (
        <video
          src={heroImage}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
      ) : (
        <Image
          src={heroImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      )}

      {/* Luxury Gallery Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />

      {/* Content */}
      <div className="page-hero-content relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {tag && (
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.26em] font-semibold text-[#D6BC94] mb-2 block"
          >
            {tag}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-normal text-white leading-tight mb-2.5"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/85 text-xs sm:text-sm font-light uppercase tracking-[0.16em] leading-relaxed max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
