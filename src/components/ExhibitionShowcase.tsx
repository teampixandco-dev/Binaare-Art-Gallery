"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Volume2,
  VolumeX,
  Sparkles,
  Palette,
  Eye,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ExhibitionShowcase() {
  const videoElRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const video = videoElRef.current;
    if (!video) return;

    if (!video.paused) {
      setIsVideoPlaying(true);
    }

    const onPlaySuccess = () => {
      setIsVideoPlaying(true);
    };

    video.addEventListener("playing", onPlaySuccess);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(onPlaySuccess)
        .catch(() => {
          // Autoplay prevented (e.g. iOS Low Power Mode)
          setIsVideoPlaying(false);
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
  }, []);

  const toggleMute = () => {
    if (videoElRef.current) {
      videoElRef.current.muted = !videoElRef.current.muted;
      setIsMuted(videoElRef.current.muted);
    }
  };

  return (
    <section
      id="exhibition-showcase"
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--bg)",
        paddingTop: "5rem",
        paddingBottom: "5.5rem",
      }}
    >
      <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
        {/* Section Heading */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="section-label">Past Exhibition Archive</p>
          <h2 className="section-title">Gallery &amp; Exhibition</h2>
          <div className="section-divider" style={{ margin: "1.25rem auto" }} />
          <p className="section-text" style={{ maxWidth: "100%", textAlign: "center" }}>
            Reflecting on the curated exhibition held at Binaare Gallery, No 17, Stafford Avenue, Colombo 05 —
            where emotion, colour, and texture came together in an intimate retrospective.
          </p>
        </motion.div>

        {/* ═══ SYMMETRICAL TWO EQUAL COLUMNS (50% / 50%) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-20 items-center w-full">
          
          {/* ═══ COLUMN 1: FULL-WIDTH CINEMATIC VIDEO (Left) ═══ */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, scale: 0.97, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease }}
          >
            <div className="relative w-full rounded-xs overflow-hidden bg-black border border-[#E2DBD0] shadow-xl group">
              {/* Native 16:9 Aspect Ratio — shows full width of the video without side-cropping */}
              <div className="relative w-full aspect-video overflow-hidden bg-[#181614]">
                {/* Fallback image underneath — guarantees no ugly gray play button ever appears */}
                <Image
                  src="/exhibition/store-poster.webp"
                  alt="Binaare Gallery Past Exhibition Showcase"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover w-full h-full"
                  priority
                />

                {/* Looping Ambient Video */}
                <video
                  ref={videoElRef}
                  src="/exhibition/store-optimized.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  disableRemotePlayback
                  tabIndex={-1}
                  aria-hidden="true"
                  preload="auto"
                  className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
                    isVideoPlaying ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Subtle Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25 pointer-events-none" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[0.68rem] tracking-[0.16em] uppercase font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#B78646] animate-pulse" />
                  Past Exhibition Highlights
                </div>

                {/* Audio Toggle Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                  className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#8C704F] hover:border-[#8C704F] transition-all cursor-pointer"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                {/* Floating Bottom Caption */}
                <div className="absolute bottom-4 left-4 right-16 z-10 text-white pointer-events-none">
                  <p className="text-[0.68rem] tracking-[0.14em] uppercase font-light text-white/80">
                    Binaare Exhibition
                  </p>
                  <p className="font-serif text-sm sm:text-base font-normal leading-tight text-white/95 truncate">
                    No 17, Stafford Avenue, Colombo 05
                  </p>
                </div>
              </div>

              {/* Sub-bar beneath video */}
              <div className="px-5 py-3.5 bg-[#FAF8F5] border-t border-[#E8E1D5] flex items-center justify-between text-xs text-[#77716B]">
                <span className="flex items-center gap-1.5 font-medium text-[#24211F]">
                  <Sparkles size={13} className="text-[#8C704F]" />
                  Exhibition Retrospective
                </span>
                <span className="text-[0.72rem] tracking-wider uppercase text-[#8C704F] font-semibold">
                  Original Works
                </span>
              </div>
            </div>
          </motion.div>

          {/* ═══ COLUMN 2: SYMMETRICAL EDITORIAL DESCRIPTION (Right) ═══ */}
          <motion.div
            className="w-full flex flex-col justify-center"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, delay: 0.1, ease }}
          >
            {/* Tag / Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B78646]" />
              <p className="section-label mb-0">Past Exhibition</p>
            </div>

            {/* Main Highlight Title */}
            <h3 className="font-serif text-2xl sm:text-3xl text-[#24211F] font-normal leading-snug mb-3">
              Gallery &amp; Exhibition done at Binaare Gallery, No 17, Stafford Avenue, Colombo 05
            </h3>

            {/* Gold Divider */}
            <div className="w-12 h-[1px] bg-[#B78646] my-2" />

            {/* Narrative Paragraph */}
            <p className="section-text text-sm sm:text-[0.95rem] leading-relaxed text-[#5C564E] mt-3 mb-5">
              A past exhibition celebrating the quiet depth of emotion, colour, and texture.
              Held at No 17, Stafford Avenue, Colombo 05, this curated showcase brought
              Binari Gamage&apos;s original artworks to life across acrylic paintings, textured
              abstraction, floral studies, and mixed media in an intimate, contemplative setting.
            </p>

            {/* Symmetrical Feature Cards */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3.5 p-3.5 bg-[#FAF8F5] border border-[#EBE5DA] rounded-xs transition-colors hover:border-[#8C704F]/40">
                <MapPin size={17} className="text-[#8C704F] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-[#24211F] block text-sm mb-0.5">Location (Held At)</span>
                  <span className="text-[#77716B] leading-relaxed">No 17, Stafford Avenue, Colombo 05, Sri Lanka</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 bg-[#FAF8F5] border border-[#EBE5DA] rounded-xs transition-colors hover:border-[#8C704F]/40">
                <Palette size={17} className="text-[#8C704F] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-[#24211F] block text-sm mb-0.5">Exhibited Works</span>
                  <span className="text-[#77716B] leading-relaxed">Original Acrylic, Oil, Texture &amp; Mixed Media on Canvas</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 bg-[#FAF8F5] border border-[#EBE5DA] rounded-xs transition-colors hover:border-[#8C704F]/40">
                <Eye size={17} className="text-[#8C704F] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-[#24211F] block text-sm mb-0.5">Curated Theme</span>
                  <span className="text-[#77716B] leading-relaxed">Colors of Love — Emotion, Reflection, Inner Peace &amp; Presence</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
