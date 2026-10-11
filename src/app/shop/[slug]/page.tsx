import type { Metadata } from "next";
import ProductImages from "@/components/ProductImages";
import { getPublicContent } from "@/lib/content-store";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import AddToCartButton from "@/components/AddToCartButton";
import { formatPriceUSD } from "@/data/products";
import { Layers, MoveHorizontal, Palette, MoveVertical, PenTool, Box, Square, Sparkles } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPublicContent().products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublicContent().products.find(p => p.slug === slug);
  if (!product) return { title: "Artwork | Binaare" };
  return {
    title: `${product.title} | Shop | Binaare`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getPublicContent().products.find(p => p.slug === slug);
  if (!product) notFound();

  // Split description
  const descriptionParagraphs = product.description.split('\n\n').filter(p => p.trim());
  const shortIntro = descriptionParagraphs.length > 0 ? descriptionParagraphs[0] : "";
  const highlightText = descriptionParagraphs.length > 1 ? descriptionParagraphs[1] : "";
  const remainingDescription = descriptionParagraphs.slice(2);

  return (
    <main style={{ background: "#FAF8F4", color: "#24211F", minHeight: "100vh" }}>
      <Navbar />

      <PageHero
        title={product.title}
        subtitle="ORIGINAL ARTWORK"
        backgroundImage={product.src}
      />

      <div className="max-w-[1440px] mx-auto pt-10 lg:pt-16 px-6 lg:px-10 pb-20">
        
        {/* Breadcrumb */}
        <nav className="text-[0.7rem] uppercase tracking-widest text-[#77716B] mb-8 font-medium">
          <Link href="/" className="hover:text-[#740D18] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#740D18] transition-colors">Artworks</Link>
          <span className="mx-2">/</span>
          <span className="text-[#24211F]">{product.title.toUpperCase()}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-[110px] lg:h-[calc(100vh-130px)] lg:overflow-y-auto no-scrollbar pb-10">
            <ProductImages images={product.images} title={product.title} />

            {/* Artist's Message (Placed on Left Column as per reference) */}
            {product.artistMessage && (
              <div className="bg-[#F4F0E9] p-8 mt-10 relative overflow-hidden border border-[#E7E0D7]">
                <div className="absolute top-2 left-6 text-[#D6BC94] font-serif text-[4rem] leading-none opacity-40">“</div>
                <div className="relative z-10 pl-4 mt-4">
                  <h3 className="text-[0.7rem] uppercase tracking-[0.15em] font-semibold text-[#B78646] mb-4">
                    The Artist&apos;s Message
                  </h3>
                  <p className="font-serif text-[1.1rem] leading-[1.6] text-[#510B14] font-medium">
                    {product.artistMessage}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[55%] pt-2 pb-16">
            
            {/* Header Area */}
            <div className="mb-10">
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-[#B78646] font-semibold mb-4">Original Artwork</p>
              <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] leading-[1.1] text-[#24211F] mb-6">
                {product.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-[0.8rem] uppercase tracking-widest text-[#77716B] font-medium mb-6">
                <span>{product.style || product.medium}</span>
                {product.width && product.height && (
                  <>
                    <span className="text-[#B78646]">|</span>
                    <span>{product.width.replace(' inches', '″')} × {product.height.replace(' inches', '″')}</span>
                  </>
                )}
              </div>
              
              <div className="font-serif text-[1.75rem] text-[#24211F] mb-6">
                {formatPriceUSD(product.price)}
              </div>

              {shortIntro && (
                <p className="text-[1.05rem] leading-[1.8] text-[#24211F] font-light mb-8 max-w-[90%]">
                  {shortIntro}
                </p>
              )}

              {/* Purchase Controls */}
              <div className="flex flex-col sm:flex-row gap-4 border-t border-[#E7E0D7] pt-8 mb-12">
                <AddToCartButton 
                  slug={product.slug} 
                  className="inline-flex items-center justify-center px-8 py-[0.9rem] text-[0.7rem] uppercase tracking-[0.15em] font-semibold bg-[#740D18] text-white hover:bg-[#510B14] transition-all"
                />
                <Link 
                  href="/cart" 
                  className="inline-flex items-center justify-center px-8 py-[0.9rem] text-[0.7rem] uppercase tracking-[0.15em] font-semibold border border-[#24211F] text-[#24211F] hover:bg-[#F4F0E9] hover:border-[#740D18] hover:text-[#740D18] transition-all"
                >
                  View Cart
                </Link>
              </div>
            </div>

            {/* Artwork Highlights Box */}
            {highlightText && (
              <div className="mb-12 bg-[#FAF8F4] border border-[#E7E0D7] p-6 md:p-8 relative">
                <h3 className="text-[0.75rem] uppercase tracking-[0.2em] font-semibold text-[#24211F] mb-4">
                  Artwork Highlights
                </h3>
                <p className="text-[0.95rem] leading-[1.7] text-[#24211F] font-light">
                  {highlightText}
                </p>
              </div>
            )}

            {/* Icons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 mb-16 px-2">
              {product.materials && (
                <div className="flex gap-4">
                  <Layers className="text-[#B78646] shrink-0" size={26} strokeWidth={1.5} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[#24211F] font-bold text-[0.85rem] tracking-wide">Materials</span>
                    <span className="text-[#77716B] text-[0.85rem] leading-snug">{product.materials}</span>
                  </div>
                </div>
              )}
              {product.theme && (
                <div className="flex gap-4">
                  <Sparkles className="text-[#B78646] shrink-0" size={26} strokeWidth={1.5} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[#24211F] font-bold text-[0.85rem] tracking-wide">Theme</span>
                    <span className="text-[#77716B] text-[0.85rem] leading-snug">{product.theme}</span>
                  </div>
                </div>
              )}
              {product.width && (
                <div className="flex gap-4">
                  <MoveHorizontal className="text-[#B78646] shrink-0" size={26} strokeWidth={1.5} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[#24211F] font-bold text-[0.85rem] tracking-wide">Width</span>
                    <span className="text-[#77716B] text-[0.85rem] leading-snug">{product.width}</span>
                  </div>
                </div>
              )}
              {product.colours && (
                <div className="flex gap-4">
                  <Palette className="text-[#B78646] shrink-0" size={26} strokeWidth={1.5} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[#24211F] font-bold text-[0.85rem] tracking-wide">Colours</span>
                    <span className="text-[#77716B] text-[0.85rem] leading-snug">{product.colours}</span>
                  </div>
                </div>
              )}
              {product.height && (
                <div className="flex gap-4">
                  <MoveVertical className="text-[#B78646] shrink-0" size={26} strokeWidth={1.5} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[#24211F] font-bold text-[0.85rem] tracking-wide">Height</span>
                    <span className="text-[#77716B] text-[0.85rem] leading-snug">{product.height}</span>
                  </div>
                </div>
              )}
              {product.style && (
                <div className="flex gap-4">
                  <PenTool className="text-[#B78646] shrink-0" size={26} strokeWidth={1.5} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[#24211F] font-bold text-[0.85rem] tracking-wide">Style</span>
                    <span className="text-[#77716B] text-[0.85rem] leading-snug">{product.style}</span>
                  </div>
                </div>
              )}
              {product.depth && (
                <div className="flex gap-4">
                  <Box className="text-[#B78646] shrink-0" size={26} strokeWidth={1.5} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[#24211F] font-bold text-[0.85rem] tracking-wide">Depth</span>
                    <span className="text-[#77716B] text-[0.85rem] leading-snug">{product.depth}</span>
                  </div>
                </div>
              )}
              {product.frame && (
                <div className="flex gap-4">
                  <Square className="text-[#B78646] shrink-0" size={26} strokeWidth={1.5} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[#24211F] font-bold text-[0.85rem] tracking-wide">Frame</span>
                    <span className="text-[#77716B] text-[0.85rem] leading-snug">{product.frame}</span>
                  </div>
                </div>
              )}
            </div>

            {/* About This Painting & Final Quote */}
            <div className="flex flex-col xl:flex-row gap-12 xl:gap-10 border-t border-[#E7E0D7] pt-12">
              <div className="w-full xl:w-[60%]">
                <h3 className="text-[0.7rem] uppercase tracking-[0.2em] font-semibold text-[#740D18] mb-6">
                  About This Painting
                </h3>
                <div className="text-[0.95rem] leading-[1.8] text-[#24211F] space-y-4 font-light">
                  {remainingDescription.map((paragraph, i) => (
                    <p key={i}>{paragraph.trim()}</p>
                  ))}
                </div>
              </div>

              {product.closingQuote && (
                <div className="w-full xl:w-[40%] flex flex-col items-center justify-center text-center xl:border-l xl:border-[#E7E0D7] xl:pl-10">
                  <Sparkles className="text-[#B78646] mb-6" size={32} strokeWidth={1} />
                  <p className="font-serif text-[1.45rem] leading-[1.4] text-[#740D18] font-medium">
                    {product.closingQuote}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
      
      {/* Hide scrollbar for the left sticky column to keep it clean */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </main>
  );
}
