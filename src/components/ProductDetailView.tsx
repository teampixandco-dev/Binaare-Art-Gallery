"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import {
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

// Formatted text helper to render markdown **bold** and *italic* from the PDF
function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <strong key={i} className="font-semibold text-[#1F1C19]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
          return (
            <em key={i} className="italic font-serif">
              {part.slice(1, -1)}
            </em>
          );
        }
        return part;
      })}
    </>
  );
}

export default function ProductDetailView({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // Helper to normalize strings for comparison (removes formatting, punctuation, whitespace differences)
  const normalizeText = (str: string) =>
    str
      .replace(/[*_~`]/g, "")
      .replace(/[“”"']/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  // Clean artist message text
  const cleanArtistMessage = (product.artistMessage || "")
    .replace(/^[“"']+|[”"']+$/g, "")
    .trim();

  // Clean closing quote text
  let cleanClosingQuote = (product.closingQuote || "")
    .replace(/^[“"']+|[”"']+$/g, "")
    .replace(/\*\*/g, "")
    .trim();

  // Raw split description paragraphs for "About This Painting"
  const rawParagraphs = (product.description || "")
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // If closing quote is not explicitly present, extract from the last paragraph if it is a quote
  if (!cleanClosingQuote && rawParagraphs.length > 0) {
    const candidate = rawParagraphs[rawParagraphs.length - 1];
    const stripped = candidate.replace(/[*_]/g, "").trim();
    if (stripped.startsWith("“") || stripped.startsWith('"')) {
      cleanClosingQuote = stripped.replace(/^[“"']+|[”"']+$/g, "").trim();
    }
  }

  const normQuote = normalizeText(cleanClosingQuote);
  const normArtist = normalizeText(cleanArtistMessage);

  // Filter paragraphs so neither closing quote nor artist message is duplicated as a regular paragraph
  const paragraphs = rawParagraphs.filter((p) => {
    // Filter out trailing PDF catalog headers / artifacts
    if (/^\*?\*?\d+[\.\)]\s*(Original|Acrylic|Floral|Oil|Textured|Mix|Abstract|Tranquil|Expressive|Contemporary)/i.test(p)) return false;
    if (/^(\*|\*)?\d+\s*$/i.test(p)) return false;
    if (/^Acrylic$/i.test(p)) return false;
    if (/^\*?Original work by/i.test(p)) return false;

    const normP = normalizeText(p);
    if (!normP) return false;

    // Filter out if this paragraph is identical or contained in closing quote (or vice versa)
    if (normQuote && (normP === normQuote || normP.includes(normQuote) || normQuote.includes(normP))) {
      return false;
    }

    // Filter out if this paragraph is the artist message
    if (normArtist && (normP === normArtist || normP.includes(normArtist) || normArtist.includes(normP))) {
      return false;
    }

    // Filter out if paragraph is a standalone quote and closingQuote exists
    if (cleanClosingQuote && /^(\*\*|\*)?[“"'].+[”"'](\*\*|\*)?$/.test(p)) {
      return false;
    }

    return true;
  });

  // Only show closing quote if it does not duplicate the artist message
  const showClosingQuote = Boolean(cleanClosingQuote && normQuote !== normArtist);

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

  const handleAddToCart = () => {
    addItem(product.slug, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="w-full bg-[#FAF8F5] text-[#24211F]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-6 pb-24">
        
        {/* Editorial Breadcrumb */}
        <nav className="text-[0.68rem] uppercase tracking-[0.22em] text-[#77716B] mb-6 font-medium">
          <Link href="/" className="hover:text-[#8C704F] transition-colors">Home</Link>
          <span className="mx-2.5 text-[#C4BEB4]">/</span>
          <Link href="/shop" className="hover:text-[#8C704F] transition-colors">Shop</Link>
          <span className="mx-2.5 text-[#C4BEB4]">/</span>
          <span className="text-[#24211F] font-semibold">{product.title}</span>
        </nav>

        {/* 2-Column Luxury Gallery Layout: Left sticky, Right scrolls */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 xl:gap-16 items-start relative">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Fixed / Sticky Artwork & Interactive Views  */}
          {/* ======================================================== */}
          <div className="w-full lg:w-[48%] xl:w-[46%] lg:sticky lg:top-[90px] self-start flex flex-col gap-5">
            
            {/* Clean Artwork Presentation (No outer frame, resized given artwork image only) */}
            <div className="relative w-full aspect-square bg-white p-4 sm:p-8 flex items-center justify-center border border-[#EBE5DA] rounded-xs shadow-xs overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={product.src}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Subtle Gallery Badges */}
            <div className="flex items-center justify-center gap-5 pt-1 text-[#77716B] text-[0.7rem] tracking-[0.14em] uppercase">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#8C704F]" /> 100% Original Artwork
              </span>
              <span className="w-1 h-1 rounded-full bg-[#D1C9BE]"></span>
              <span className="flex items-center gap-1.5">
                <Award size={12} className="text-[#8C704F]" /> Signed by Artist
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Rich Narrative, Details, Artist's Message  */}
          {/* ======================================================== */}
          <div className="w-full lg:w-[52%] xl:w-[54%] flex flex-col pb-16">
            
            {/* Header: Tag, Title & Divider */}
            <div>
              <span className="inline-block text-[0.68rem] uppercase tracking-[0.24em] text-[#8C704F] font-semibold mb-2">
                Original Artwork
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-normal text-[#24211F] leading-[1.15] mb-3">
                {product.title}
              </h1>

              <div className="w-12 h-[2px] bg-[#8C704F] mb-6"></div>

              {/* Action Buttons: Extra Small Radius & Old Project Color #8C704F (Price Hidden) */}
              <div className="grid grid-cols-[1.6fr_1fr] sm:grid-cols-[1.75fr_1fr] gap-3 mb-8 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="h-11 min-h-[44px] w-full px-5 inline-flex items-center justify-center text-[0.72rem] sm:text-[0.74rem] uppercase tracking-[0.18em] font-semibold bg-[#8C704F] hover:bg-[#785E3E] text-white transition-colors whitespace-nowrap cursor-pointer shadow-xs rounded-xs"
                >
                  {added ? (
                    <>
                      <Check size={16} className="mr-2 inline-block text-white" /> Added to Cart
                    </>
                  ) : (
                    <>
                      Add to Cart <ArrowRight size={15} className="ml-2 inline-block" />
                    </>
                  )}
                </button>

                <Link
                  href="/cart"
                  className="h-11 min-h-[44px] w-full px-4 inline-flex items-center justify-center text-[0.72rem] sm:text-[0.74rem] uppercase tracking-[0.18em] font-semibold border border-[#24211F] text-[#24211F] hover:bg-[#F4F0E9] hover:border-[#8C704F] hover:text-[#8C704F] transition-colors whitespace-nowrap text-center cursor-pointer rounded-xs"
                >
                  View Cart
                </Link>
              </div>
            </div>

            {/* Modern Elegant Artist's Message Card (Extra Small Radius) */}
            {cleanArtistMessage && (
              <div className="relative bg-gradient-to-br from-[#FCFBF8] via-[#F9F7F2] to-[#F5F1E8] border border-[#E8E1D5] rounded-xs p-6 sm:p-8 mb-8 shadow-xs overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#8C704F]" />

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={13} className="text-[#8C704F]" />
                    <span className="text-[0.66rem] uppercase tracking-[0.24em] text-[#8C704F] font-semibold">
                      The Artist&apos;s Message
                    </span>
                  </div>
                  <span className="text-[0.72rem] font-serif italic text-[#8F8880]">
                    Binari Gamage
                  </span>
                </div>

                <div className="relative pl-4 sm:pl-5 border-l-2 border-[#8C704F]/70 my-3">
                  <p className="font-serif italic text-[1.02rem] sm:text-[1.1rem] leading-[1.8] text-[#2F2A25]">
                    &ldquo;{cleanArtistMessage}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#EAE3D6] text-[0.66rem] uppercase tracking-[0.16em] text-[#7D766E]">
                  <span>Original Certificate Included</span>
                  <span className="font-serif italic text-xs text-[#8C704F] normal-case">
                    Binaare Art Gallery
                  </span>
                </div>
              </div>
            )}

            {/* "About This Painting" Section - 3-Font Hierarchy (Eyebrow, Cormorant Garamond Serif Title, Divider, DM Sans Narrative) */}
            <div className="border-t border-[#E7E0D7] pt-10 mb-8">
              <p className="text-[0.6875rem] uppercase tracking-[0.18em] font-semibold text-[#8C704F] mb-2">
                Artwork Narrative
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[2.25rem] font-normal text-[#24211F] leading-[1.15] mb-3">
                About This Painting
              </h2>
              <div className="w-[55px] h-[1px] bg-[#8C704F] mb-6" />

              <div className="space-y-4 sm:space-y-5 text-[1rem] sm:text-[1.0625rem] leading-[1.75] text-[#55504A] font-sans font-normal">
                {paragraphs.map((para, i) => (
                  <p key={i}>
                    <FormattedText text={para} />
                  </p>
                ))}
              </div>
            </div>

            {/* Closing Quote from Artist / PDF */}
            {showClosingQuote && (
              <div className="bg-[#F8F4EC] border-l-4 border-[#8C704F] p-5 rounded-r-xs mb-8 shadow-xs">
                <p className="font-serif italic text-[0.96rem] sm:text-[1.02rem] leading-[1.8] text-[#3E3832]">
                  &ldquo;{cleanClosingQuote}&rdquo;
                </p>
              </div>
            )}

            {/* ARTWORK HIGHLIGHTS & SPECIFICATIONS (2-Column Grid) */}
            <div className="border-t border-[#E7E0D7] pt-10 mb-8">
              <p className="text-[0.6875rem] uppercase tracking-[0.18em] font-semibold text-[#8C704F] mb-2">
                Specifications
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#24211F] leading-[1.15] mb-3">
                Artwork Highlights
              </h2>
              <div className="w-[55px] h-[1px] bg-[#8C704F] mb-6" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {/* 1. MEDIUM */}
                <div className="flex items-start gap-3">
                  <Square className="text-[#8C704F] shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.66rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-0.5">
                      Medium
                    </span>
                    <span className="text-[0.86rem] text-[#6E685E] leading-relaxed">
                      {product.materials || product.medium || "Acrylic on canvas"}
                    </span>
                  </div>
                </div>

                {/* 2. SURFACE */}
                <div className="flex items-start gap-3">
                  <Layers className="text-[#8C704F] shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.66rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-0.5">
                      Surface
                    </span>
                    <span className="text-[0.86rem] text-[#6E685E] leading-relaxed">
                      {product.frame || "Canvas (stretched on a wooden frame) Ready to hang"}
                    </span>
                  </div>
                </div>

                {/* 3. SIZE */}
                <div className="flex items-start gap-3">
                  <Maximize2 className="text-[#8C704F] shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.66rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-0.5">
                      Size
                    </span>
                    <span className="text-[0.86rem] text-[#6E685E] leading-relaxed">
                      {formatDimensions()}
                    </span>
                  </div>
                </div>

                {/* 4. COLOURS */}
                <div className="flex items-start gap-3">
                  <Palette className="text-[#8C704F] shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.66rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-0.5">
                      Colours
                    </span>
                    <span className="text-[0.86rem] text-[#6E685E] leading-relaxed">
                      {product.colours || "Earthy tones, ivory, white, black, red, and gold"}
                    </span>
                  </div>
                </div>

                {/* 5. STYLE */}
                <div className="flex items-start gap-3">
                  <PenTool className="text-[#8C704F] shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.66rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-0.5">
                      Style
                    </span>
                    <span className="text-[0.86rem] text-[#6E685E] leading-relaxed">
                      {product.style || "Contemporary Fine Art"}
                    </span>
                  </div>
                </div>

                {/* 6. ORIGINAL */}
                <div className="flex items-start gap-3">
                  <Sparkles className="text-[#8C704F] shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.66rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-0.5">
                      Original
                    </span>
                    <span className="text-[0.86rem] text-[#6E685E] leading-relaxed">
                      One-of-a-kind artwork
                    </span>
                  </div>
                </div>

                {/* 7. YEAR */}
                <div className="flex items-start gap-3">
                  <Calendar className="text-[#8C704F] shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.66rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-0.5">
                      Year
                    </span>
                    <span className="text-[0.86rem] text-[#6E685E] leading-relaxed">
                      2023 – 2024
                    </span>
                  </div>
                </div>

                {/* 8. SHIPPING */}
                <div className="flex items-start gap-3">
                  <Truck className="text-[#8C704F] shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
                  <div>
                    <span className="block text-[0.66rem] uppercase tracking-[0.14em] font-bold text-[#24211F] mb-0.5">
                      Shipping
                    </span>
                    <span className="text-[0.86rem] text-[#6E685E] leading-relaxed">
                      Worldwide shipping available (insured and carefully packaged)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Authenticity Guarantee Card (Extra Small Radius) */}
            <div className="p-5 bg-white border border-[#E7E0D7] rounded-xs flex items-start gap-3.5 shadow-xs">
              <ShieldCheck className="text-[#8C704F] shrink-0 mt-0.5" size={22} strokeWidth={1.5} />
              <div className="text-xs text-[#6E685E] leading-relaxed">
                <span className="font-semibold text-[#24211F] block mb-0.5 uppercase tracking-wider text-[0.68rem]">
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
