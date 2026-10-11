"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Square,
  Layers,
  Maximize2,
  Palette,
  PenTool,
  Sparkles,
  Calendar,
  Truck,
  ShieldCheck,
  Check,
  Award
} from "lucide-react";

type Props = {
  product: Product;
};

type ViewMode = {
  id: number;
  label: string;
  src: string;
  zoomClass: string;
  thumbnailClass: string;
};

export default function ProductDetailView({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [activeViewIndex, setActiveViewIndex] = useState(0);

  // Split description paragraphs for "About This Painting"
  const paragraphs = (product.description || "")
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  // Format dimensions (inches + cm)
  const formatDimensions = () => {
    if (product.width && product.height) {
      const wIn = parseFloat(product.width);
      const hIn = parseFloat(product.height);
      if (!isNaN(wIn) && !isNaN(hIn)) {
        const wCm = Math.round(wIn * 2.54);
        const hCm = Math.round(hIn * 2.54);
        return `${product.width.replace(" inches", "″")} × ${product.height.replace(" inches", "″")} (${wCm} × ${hCm} cm)`;
      }
      return `${product.width} × ${product.height}`;
    }
    return product.size || "Original Dimensions";
  };

  // Clean artist message text
  const cleanArtistMessage = (product.artistMessage || "")
    .replace(/^[“"']+|[”"']+$/g, "")
    .trim();

  // Clean closing quote text
  const cleanClosingQuote = (product.closingQuote || "")
    .replace(/^[“"']+|[”"']+$/g, "")
    .trim();

  // Prepare 4 interactive views (full view, focal detail, impasto texture, frame & corner)
  const hasMultipleImages = Array.isArray(product.images) && product.images.length > 1;
  const viewModes: ViewMode[] = hasMultipleImages
    ? [
        { id: 0, label: "Full Painting", src: product.images[0], zoomClass: "object-contain", thumbnailClass: "object-cover" },
        { id: 1, label: "Detail View", src: product.images[1] || product.src, zoomClass: "object-contain", thumbnailClass: "object-cover" },
        { id: 2, label: "Texture View", src: product.images[2] || product.src, zoomClass: "object-contain", thumbnailClass: "object-cover" },
        { id: 3, label: "Corner View", src: product.images[3] || product.src, zoomClass: "object-contain", thumbnailClass: "object-cover" },
      ]
    : [
        {
          id: 0,
          label: "Full Painting",
          src: product.src,
          zoomClass: "object-contain scale-100 transition-transform duration-500",
          thumbnailClass: "object-cover scale-100",
        },
        {
          id: 1,
          label: "Focal Detail",
          src: product.src,
          zoomClass: "object-cover scale-[1.9] object-center transition-transform duration-500",
          thumbnailClass: "object-cover scale-[2.1] object-center",
        },
        {
          id: 2,
          label: "Impasto Texture",
          src: product.src,
          zoomClass: "object-cover scale-[2.2] object-top transition-transform duration-500",
          thumbnailClass: "object-cover scale-[2.4] object-top",
        },
        {
          id: 3,
          label: "Frame & Canvas",
          src: product.src,
          zoomClass: "object-cover scale-[1.9] object-[85%_85%] transition-transform duration-500",
          thumbnailClass: "object-cover scale-[2.2] object-[90%_90%]",
        },
      ];

  const prevView = () => {
    setActiveViewIndex((prev) => (prev === 0 ? viewModes.length - 1 : prev - 1));
  };

  const nextView = () => {
    setActiveViewIndex((prev) => (prev === viewModes.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addItem(product.slug, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const activeView = viewModes[activeViewIndex];

  return (
    <div className="w-full bg-[#FAF8F5] text-[#24211F]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-8 pb-24">
        
        {/* Editorial Breadcrumb */}
        <nav className="text-[0.68rem] uppercase tracking-[0.22em] text-[#77716B] mb-8 font-medium">
          <Link href="/" className="hover:text-[#740D18] transition-colors">Home</Link>
          <span className="mx-2.5 text-[#C4BEB4]">/</span>
          <Link href="/shop" className="hover:text-[#740D18] transition-colors">Shop</Link>
          <span className="mx-2.5 text-[#C4BEB4]">/</span>
          <span className="text-[#24211F] font-semibold">{product.title}</span>
        </nav>

        {/* 2-Column Luxury Gallery Layout: Left is sticky, Right scrolls */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 xl:gap-16 items-start relative">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Fixed / Sticky Artwork & Interactive Views  */}
          {/* ======================================================== */}
          <div className="w-full lg:w-[48%] xl:w-[46%] lg:sticky lg:top-[90px] self-start flex flex-col gap-6">
            
            {/* Museum Wall & Ornate Frame Presentation */}
            <div className="relative w-full aspect-[4/4.8] sm:aspect-[4/4.5] bg-gradient-to-b from-[#FAF8F4] via-[#F3EFE7] to-[#EBE5DA] p-6 sm:p-10 flex items-center justify-center border border-[#E7E0D7] rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
              
              {/* Luxury Frame Container */}
              <div className="relative w-full max-w-[430px] aspect-[4/4.8] sm:aspect-[4/4.6] p-3 sm:p-4 bg-[#231A14] border-[7px] sm:border-[8px] border-[#38261B] shadow-[0_28px_60px_-15px_rgba(35,22,14,0.38),0_12px_24px_-6px_rgba(35,22,14,0.22)] rounded-sm">
                
                {/* Gold Inner Bevel / Fillet */}
                <div className="w-full h-full p-1 bg-[#17100A] border border-[#B78646]/80 relative overflow-hidden flex items-center justify-center">
                  <div className="relative w-full h-full overflow-hidden bg-[#0F0A07]">
                    <Image
                      src={activeView.src}
                      alt={`${product.title} — ${activeView.label}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className={`${activeView.zoomClass}`}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={prevView}
                aria-label="Previous view"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#24211F] shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all hover:scale-105 z-20 cursor-pointer"
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>

              <button
                type="button"
                onClick={nextView}
                aria-label="Next view"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#24211F] shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all hover:scale-105 z-20 cursor-pointer"
              >
                <ChevronRight size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Row of 4 Thumbnails */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {viewModes.map((view, idx) => {
                const isSelected = activeViewIndex === idx;
                return (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => setActiveViewIndex(idx)}
                    aria-label={`Select ${view.label}`}
                    aria-pressed={isSelected}
                    className={`relative w-[68px] h-[68px] sm:w-[74px] sm:h-[74px] rounded-lg overflow-hidden transition-all cursor-pointer ${
                      isSelected
                        ? "border-2 border-[#B78646] p-0.5 shadow-md scale-105"
                        : "border border-[#E7E0D7] opacity-75 hover:opacity-100 hover:border-[#B78646]/60 p-0.5"
                    }`}
                  >
                    <div className="relative w-full h-full bg-[#FAF8F5] overflow-hidden rounded-md">
                      <Image
                        src={view.src}
                        alt={view.label}
                        fill
                        sizes="80px"
                        className={`${view.thumbnailClass}`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Subtle Gallery Badges */}
            <div className="flex items-center justify-center gap-6 pt-2 text-[#77716B] text-[0.72rem] tracking-[0.14em] uppercase">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#B78646]" /> 100% Original Artwork
              </span>
              <span className="w-1 h-1 rounded-full bg-[#D1C9BE]"></span>
              <span className="flex items-center gap-1.5">
                <Award size={13} className="text-[#B78646]" /> Signed by Artist
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Rich Narrative, Details, Artist's Message  */}
          {/* ======================================================== */}
          <div className="w-full lg:w-[52%] xl:w-[54%] flex flex-col pb-16">
            
            {/* Header: Tag, Title & Modern Gold Divider */}
            <div>
              <span className="inline-block text-[0.7rem] uppercase tracking-[0.24em] text-[#B78646] font-semibold mb-3">
                Original Artwork
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-normal text-[#24211F] leading-[1.14] mb-4">
                {product.title}
              </h1>

              <div className="w-14 h-[2px] bg-[#B78646] mb-6"></div>

              {/* Action Buttons (Price Hidden as Requested) */}
              <div className="grid grid-cols-[1.65fr_1fr] sm:grid-cols-[1.75fr_1fr] gap-3 sm:gap-4 mb-10 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="h-12 min-h-[48px] w-full px-5 inline-flex items-center justify-center text-[0.74rem] sm:text-[0.76rem] uppercase tracking-[0.16em] font-semibold bg-[#740D18] text-white hover:bg-[#580912] transition-colors whitespace-nowrap cursor-pointer shadow-sm rounded-full"
                >
                  {added ? (
                    <>
                      <Check size={16} className="mr-2 inline-block text-[#B78646]" /> Added to Cart
                    </>
                  ) : (
                    <>
                      Add to Cart <ArrowRight size={15} className="ml-2 inline-block" />
                    </>
                  )}
                </button>

                <Link
                  href="/cart"
                  className="h-12 min-h-[48px] w-full px-4 inline-flex items-center justify-center text-[0.74rem] sm:text-[0.76rem] uppercase tracking-[0.16em] font-semibold border border-[#24211F] text-[#24211F] hover:bg-[#F4F0E9] hover:border-[#740D18] hover:text-[#740D18] transition-colors whitespace-nowrap text-center cursor-pointer rounded-full"
                >
                  View Cart
                </Link>
              </div>
            </div>

            {/* Modern Elegant Artist's Message Card */}
            {cleanArtistMessage && (
              <div className="relative bg-gradient-to-br from-[#FCFBF8] via-[#F9F7F2] to-[#F5F1E8] border border-[#E8E1D5] rounded-2xl p-7 sm:p-9 mb-10 shadow-[0_4px_24px_rgba(36,33,31,0.04)] overflow-hidden">
                {/* Gold Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B78646] via-[#D4AF37] to-[#B78646]" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#B78646]" />
                    <span className="text-[0.68rem] uppercase tracking-[0.24em] text-[#B78646] font-semibold">
                      The Artist&apos;s Message
                    </span>
                  </div>
                  <span className="text-[0.72rem] font-serif italic text-[#8F8880]">
                    Binari Gamage
                  </span>
                </div>

                <div className="relative pl-5 sm:pl-6 border-l-2 border-[#B78646]/70 my-3">
                  <p className="font-serif italic text-[1.02rem] sm:text-[1.12rem] leading-[1.8] text-[#2F2A25]">
                    &ldquo;{cleanArtistMessage}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#EAE3D6] text-[0.68rem] uppercase tracking-[0.16em] text-[#7D766E]">
                  <span>Original Certificate Included</span>
                  <span className="font-serif italic text-xs text-[#B78646] normal-case">
                    Binaare Art Gallery
                  </span>
                </div>
              </div>
            )}

            {/* "About This Painting" Section (Full Narrative from PDF) */}
            <div className="border-t border-[#E7E0D7] pt-8 mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-6 h-[1.5px] bg-[#B78646]"></span>
                <h2 className="text-[0.82rem] uppercase tracking-[0.22em] font-bold text-[#24211F]">
                  About This Painting
                </h2>
              </div>

              <div className="space-y-4 text-[0.95rem] sm:text-[1rem] leading-[1.85] text-[#4A453F] font-light">
                {paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Closing Quote from the Artist / PDF */}
            {cleanClosingQuote && (
              <div className="bg-[#F8F4EC] border-l-4 border-[#B78646] p-6 rounded-r-xl mb-10 shadow-sm">
                <p className="font-serif italic text-[0.96rem] sm:text-[1.04rem] leading-[1.8] text-[#3E3832]">
                  &ldquo;{cleanClosingQuote}&rdquo;
                </p>
              </div>
            )}

            {/* ARTWORK HIGHLIGHTS & SPECIFICATIONS (2-Column Grid) */}
            <div className="border-t border-[#E7E0D7] pt-8 mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-6 h-[1.5px] bg-[#B78646]"></span>
                <h2 className="text-[0.82rem] uppercase tracking-[0.22em] font-bold text-[#24211F]">
                  Artwork Highlights
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {/* 1. MEDIUM */}
                <div className="flex items-start gap-3.5">
                  <Square className="text-[#B78646] shrink-0 mt-0.5" size={20} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.68rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-1">
                      Medium
                    </span>
                    <span className="text-[0.88rem] text-[#6E685E] leading-relaxed">
                      {product.materials || product.medium || "Acrylic on canvas"}
                    </span>
                  </div>
                </div>

                {/* 2. SURFACE */}
                <div className="flex items-start gap-3.5">
                  <Layers className="text-[#B78646] shrink-0 mt-0.5" size={20} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.68rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-1">
                      Surface
                    </span>
                    <span className="text-[0.88rem] text-[#6E685E] leading-relaxed">
                      {product.frame || "Canvas (stretched on a wooden frame) Ready to hang"}
                    </span>
                  </div>
                </div>

                {/* 3. SIZE */}
                <div className="flex items-start gap-3.5">
                  <Maximize2 className="text-[#B78646] shrink-0 mt-0.5" size={20} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.68rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-1">
                      Size
                    </span>
                    <span className="text-[0.88rem] text-[#6E685E] leading-relaxed">
                      {formatDimensions()}
                    </span>
                  </div>
                </div>

                {/* 4. COLOURS */}
                <div className="flex items-start gap-3.5">
                  <Palette className="text-[#B78646] shrink-0 mt-0.5" size={20} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.68rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-1">
                      Colours
                    </span>
                    <span className="text-[0.88rem] text-[#6E685E] leading-relaxed">
                      {product.colours || "Earthy tones, ivory, white, black, red, and gold"}
                    </span>
                  </div>
                </div>

                {/* 5. STYLE */}
                <div className="flex items-start gap-3.5">
                  <PenTool className="text-[#B78646] shrink-0 mt-0.5" size={20} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.68rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-1">
                      Style
                    </span>
                    <span className="text-[0.88rem] text-[#6E685E] leading-relaxed">
                      {product.style || "Contemporary Fine Art"}
                    </span>
                  </div>
                </div>

                {/* 6. ORIGINAL */}
                <div className="flex items-start gap-3.5">
                  <Sparkles className="text-[#B78646] shrink-0 mt-0.5" size={20} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.68rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-1">
                      Original
                    </span>
                    <span className="text-[0.88rem] text-[#6E685E] leading-relaxed">
                      One-of-a-kind artwork
                    </span>
                  </div>
                </div>

                {/* 7. YEAR */}
                <div className="flex items-start gap-3.5">
                  <Calendar className="text-[#B78646] shrink-0 mt-0.5" size={20} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.68rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-1">
                      Year
                    </span>
                    <span className="text-[0.88rem] text-[#6E685E] leading-relaxed">
                      2023 – 2024
                    </span>
                  </div>
                </div>

                {/* 8. SHIPPING */}
                <div className="flex items-start gap-3.5">
                  <Truck className="text-[#B78646] shrink-0 mt-0.5" size={20} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.68rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-1">
                      Shipping
                    </span>
                    <span className="text-[0.88rem] text-[#6E685E] leading-relaxed">
                      Worldwide shipping available (insured and carefully packaged)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Authenticity Guarantee Card */}
            <div className="p-6 bg-white border border-[#E7E0D7] rounded-xl flex items-start gap-4 shadow-sm">
              <ShieldCheck className="text-[#B78646] shrink-0 mt-0.5" size={24} strokeWidth={1.5} />
              <div className="text-xs text-[#6E685E] leading-relaxed">
                <span className="font-semibold text-[#24211F] block mb-1 uppercase tracking-wider text-[0.7rem]">
                  Authenticity Guaranteed
                </span>
                Every original acquisition includes a hand-signed Certificate of Authenticity by Binari Gamage and museum-grade protective packaging.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
