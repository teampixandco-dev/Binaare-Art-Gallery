"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  LayoutGrid,
  List,
  Heart,
  Palette,
  Droplets,
  Layers,
  Box,
  Brush,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContent } from "@/context/ContentContext";
import { useCart } from "@/context/CartContext";
import { PRODUCTS as STATIC_PRODUCTS, Product } from "@/data/products";

// Subtitle generator to match: "Oil on Canvas • Floral" / "Acrylic on Canvas • Abstract"
function getArtworkSubtitle(product: Product): string {
  let medium = "Acrylic on Canvas";
  const mLower = (product.medium || product.materials || "").toLowerCase();
  if (mLower.includes("oil")) medium = "Oil on Canvas";
  else if (mLower.includes("water")) medium = "Watercolor";
  else if (mLower.includes("mixed media") || mLower.includes("mix media")) medium = "Mixed Media";
  else if (mLower.includes("acrylic")) medium = "Acrylic on Canvas";
  else if (mLower.includes("texture")) medium = "Textured Canvas";

  let cat = "Original Art";
  const sLower = (product.style + " " + product.title + " " + product.theme).toLowerCase();
  if (sLower.includes("floral") || sLower.includes("flower") || sLower.includes("bloom")) cat = "Floral";
  else if (sLower.includes("landscape") || sLower.includes("cityscape") || sLower.includes("nature")) cat = "Landscape";
  else if (sLower.includes("portrait") || sLower.includes("figurative") || sLower.includes("queen") || sLower.includes("woman")) cat = "Figurative";
  else if (sLower.includes("still life")) cat = "Still Life";
  else if (sLower.includes("abstract") || sLower.includes("texture")) cat = "Abstract";

  return `${medium} • ${cat}`;
}

const ITEMS_PER_PAGE = 12;

export default function ShopPage() {
  const { products: contentProducts } = useContent();
  const PRODUCTS =
    contentProducts && contentProducts.length >= STATIC_PRODUCTS.length
      ? contentProducts
      : STATIC_PRODUCTS;

  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("binaare-favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [addedSlugs, setAddedSlugs] = useState<Record<string, boolean>>({});
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem("binaare-favorites", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleAddToCart = (slug: string) => {
    addItem(slug, 1);
    setAddedSlugs((prev) => ({ ...prev, [slug]: true }));
    window.setTimeout(() => {
      setAddedSlugs((prev) => ({ ...prev, [slug]: false }));
    }, 2000);
  };

  // Category Pills (Oil Painting, Water color, Mixed Media, Texture, Acrylic, along with All)
  const categories = [
    { label: "All", icon: <Sparkles size={13} /> },
    { label: "Oil Painting", icon: <Palette size={13} /> },
    { label: "Water color", icon: <Droplets size={13} /> },
    { label: "Mixed Media", icon: <Layers size={13} /> },
    { label: "Texture", icon: <Box size={13} /> },
    { label: "Acrylic", icon: <Brush size={13} /> },
  ];

  // Filtering & Sorting
  const filteredAndSortedProducts = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      let matchesCat = true;
      if (activeCategory !== "All") {
        const s = (
          p.title +
          " " +
          p.medium +
          " " +
          p.materials +
          " " +
          p.style +
          " " +
          p.theme +
          " " +
          p.description
        ).toLowerCase();

        if (activeCategory === "Oil Painting") {
          matchesCat = s.includes("oil");
        } else if (activeCategory === "Water color") {
          matchesCat =
            s.includes("water color") ||
            s.includes("watercolor") ||
            s.includes("watercolour") ||
            s.includes("aquarelle");
        } else if (activeCategory === "Mixed Media") {
          matchesCat =
            s.includes("mixed media") ||
            s.includes("mix media") ||
            s.includes("mixed-media");
        } else if (activeCategory === "Texture") {
          matchesCat = s.includes("texture") || s.includes("textured");
        } else if (activeCategory === "Acrylic") {
          matchesCat = s.includes("acrylic");
        }
      }

      let matchesSearch = true;
      if (searchQuery.trim()) {
        const searchStr = `${p.title} ${p.medium} ${p.theme} ${p.colours}`.toLowerCase();
        matchesSearch = searchStr.includes(searchQuery.toLowerCase());
      }

      return matchesCat && matchesSearch;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "title-asc") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "title-desc") {
      result = [...result].sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [PRODUCTS, activeCategory, searchQuery, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  const scrollToGrid = () => {
    const el = document.getElementById("products-grid-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main style={{ background: "#FAF8F5", color: "#24211F" }} className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Banner (Matching Reference Image) */}
      <section className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pt-4 pb-2">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[360px] md:min-h-[380px] flex items-center justify-center text-center p-6 sm:p-12 shadow-sm border border-[#E7E0D7]">
          {/* Floral Art Background with Dark Vignette Overlay */}
          <Image
            src="/artworks/together-we-bloom.webp"
            alt="Original Artworks by Binari Gamage"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/70" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-[0.68rem] uppercase tracking-[0.24em] font-semibold text-[#D6BC94] mb-3 block">
              Original Artworks
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-[1.18] mb-3">
              Art for a More Beautiful Everyday
            </h1>
            <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed mb-6 max-w-lg">
              Timeless paintings for a more beautiful world.
            </p>
            <button
              onClick={scrollToGrid}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#B78646] hover:bg-[#9E7134] text-white text-[0.7rem] uppercase tracking-[0.16em] font-semibold transition-all duration-300 shadow-md cursor-pointer hover:scale-105"
            >
              Shop Collection <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Categories Toolbar & Search Area (Integrated into Search Section as requested) */}
      <section id="products-grid-section" className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pt-8 pb-4">
        
        {/* Top: Pill Category Buttons */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[#E7E0D7]/70">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1 shrink-0 max-w-full">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.label);
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#B78646] text-white shadow-xs"
                      : "bg-white text-[#555] border border-[#E7E0D7] hover:bg-[#F5F2EB] hover:text-[#24211F]"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Sort & Layout */}
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <span className="text-[0.68rem] uppercase tracking-wider text-[#77716B] font-medium hidden sm:inline-block">
              {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? "Artwork" : "Artworks"}
            </span>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#E7E0D7] text-[#24211F] rounded-full py-1.5 px-3.5 text-xs outline-none cursor-pointer hover:border-[#B78646] transition-colors"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="title-asc">Title: A – Z</option>
              <option value="title-desc">Title: Z – A</option>
            </select>

            {/* View Switcher */}
            <div className="flex items-center gap-1 bg-white border border-[#E7E0D7] rounded-full p-1">
              <button
                type="button"
                onClick={() => setLayout("grid")}
                aria-label="Grid view"
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  layout === "grid" ? "bg-[#B78646] text-white" : "text-[#77716B] hover:text-[#24211F]"
                }`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setLayout("list")}
                aria-label="List view"
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  layout === "list" ? "bg-[#B78646] text-white" : "text-[#77716B] hover:text-[#24211F]"
                }`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Row */}
        <div className="pt-4 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by title, medium, theme..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-[#E7E0D7] rounded-full py-2 pl-4 pr-10 text-xs text-[#24211F] placeholder:text-[#9C948B] outline-none hover:border-[#B78646] focus:border-[#B78646] transition-colors"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9C948B] pointer-events-none" size={14} />
          </div>

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="text-xs text-[#740D18] hover:underline cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>
      </section>

      {/* Product Display Section */}
      <section className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-8 pt-4 pb-20">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-[#E7E0D7] p-8 max-w-xl mx-auto shadow-sm">
            <p className="font-serif italic text-2xl mb-3 text-[#24211F]">No artworks found</p>
            <p className="text-xs text-[#77716B] mb-6 font-light">
              No artworks match your selected criteria.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
                setSortBy("featured");
              }}
              className="px-6 py-2.5 rounded-full bg-[#B78646] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7134] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* GRID VIEW (Modern elevated rounded card buttons matching reference SS) */}
            {layout === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300">
                {paginatedProducts.map((item) => {
                  const isFav = favorites.includes(item.slug);
                  const isAdded = addedSlugs[item.slug];

                  return (
                    <article
                      key={item.slug}
                      className="bg-white rounded-2xl p-4 border border-[#F0EBE1] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                    >
                      {/* Image Area with Heart in Top Right Corner */}
                      <div>
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF8F5] mb-3.5">
                          <Link href={`/shop/${item.slug}`} className="relative w-full h-full block">
                            <Image
                              src={item.src}
                              alt={item.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                          </Link>

                          {/* Small Favorite Heart Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(item.slug);
                            }}
                            aria-label={`Favorite ${item.title}`}
                            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#24211F] shadow-xs flex items-center justify-center transition-transform hover:scale-110 z-10 cursor-pointer"
                          >
                            <Heart
                              size={14}
                              className={isFav ? "fill-[#B78646] text-[#B78646]" : "text-[#77716B]"}
                            />
                          </button>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif font-medium text-[1.05rem] leading-snug text-[#24211F] line-clamp-1 mb-1 transition-colors group-hover:text-[#B78646]">
                          <Link href={`/shop/${item.slug}`}>{item.title}</Link>
                        </h3>

                        {/* Subtitle / Medium */}
                        <p className="text-xs text-[#77716B] mb-4 truncate">
                          {getArtworkSubtitle(item)}
                        </p>
                      </div>

                      {/* Pill-shaped Add to Cart Button (Using Old Golden Color #B78646) */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item.slug)}
                        className="w-full py-2.5 px-4 rounded-full bg-[#B78646] hover:bg-[#9E7134] text-white text-[0.7rem] uppercase tracking-[0.14em] font-semibold transition-all duration-200 text-center shadow-xs whitespace-nowrap cursor-pointer mt-auto"
                      >
                        {isAdded ? "Added to Cart ✓" : "Add to Cart"}
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW (Smooth transition, zero lag) */
              <div className="flex flex-col gap-5 max-w-4xl mx-auto transition-opacity duration-300">
                {paginatedProducts.map((item) => {
                  const isFav = favorites.includes(item.slug);
                  const isAdded = addedSlugs[item.slug];

                  return (
                    <article
                      key={item.slug}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-[#F0EBE1] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] flex flex-col sm:flex-row gap-5 items-stretch transition-all duration-300 group"
                    >
                      {/* Left Image Area */}
                      <div className="relative w-full sm:w-56 aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0">
                        <Link href={`/shop/${item.slug}`} className="relative w-full h-full block">
                          <Image
                            src={item.src}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 240px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(item.slug);
                          }}
                          aria-label={`Favorite ${item.title}`}
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#24211F] shadow-xs flex items-center justify-center transition-transform hover:scale-110 z-10 cursor-pointer"
                        >
                          <Heart
                            size={14}
                            className={isFav ? "fill-[#B78646] text-[#B78646]" : "text-[#77716B]"}
                          />
                        </button>
                      </div>

                      {/* Right Details */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-serif text-[1.2rem] font-medium leading-snug text-[#24211F] mb-1 transition-colors group-hover:text-[#B78646]">
                            <Link href={`/shop/${item.slug}`}>{item.title}</Link>
                          </h3>
                          <p className="text-xs text-[#77716B] mb-2 font-medium">
                            {getArtworkSubtitle(item)} · {item.width && item.height ? `${item.width} × ${item.height}` : item.size}
                          </p>
                          <p className="text-xs text-[#77716B] leading-relaxed line-clamp-2 mb-4 font-light">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item.slug)}
                            className="py-2.5 px-6 rounded-full bg-[#B78646] hover:bg-[#9E7134] text-white text-[0.7rem] uppercase tracking-[0.14em] font-semibold transition-all duration-200 text-center shadow-xs whitespace-nowrap cursor-pointer"
                          >
                            {isAdded ? "Added to Cart ✓" : "Add to Cart"}
                          </button>

                          <Link
                            href={`/shop/${item.slug}`}
                            className="py-2.5 px-5 rounded-full border border-[#E7E0D7] text-[#24211F] hover:border-[#B78646] text-[0.7rem] uppercase tracking-[0.14em] font-semibold transition-colors whitespace-nowrap"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination (Matching Reference Image < 1 2 >) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-[#E7E0D7]/70">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="w-8 h-8 rounded-full border border-[#E7E0D7] bg-white flex items-center justify-center text-xs text-[#24211F] hover:border-[#B78646] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => {
                      setCurrentPage(page);
                      scrollToGrid();
                    }}
                    className={`w-8 h-8 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-[#B78646] text-white shadow-xs"
                        : "bg-white border border-[#E7E0D7] text-[#555] hover:border-[#B78646] hover:text-[#24211F]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="w-8 h-8 rounded-full border border-[#E7E0D7] bg-white flex items-center justify-center text-xs text-[#24211F] hover:border-[#B78646] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* Newsletter Promotional Banner (Matching Reference Image bottom section) */}
            <div className="rounded-2xl border border-[#E7E0D7] bg-white p-6 sm:p-8 mt-16 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Room Preview Image */}
              <div className="relative w-full md:w-36 h-28 rounded-xl overflow-hidden shrink-0 bg-[#FAF8F5]">
                <Image
                  src="/artworks/wings-of-golden-courage.webp"
                  alt="Art in interior space"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>

              {/* Middle Text */}
              <div className="flex-1 text-center md:text-left">
                <span className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-[#B78646] mb-1 block">
                  Stay in the loop
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#24211F] font-normal mb-1.5">
                  Art Inspires a Kinder, Brighter World
                </h3>
                <p className="text-xs text-[#77716B] font-light leading-relaxed max-w-lg">
                  Be the first to know about new artworks, featured stories, and exclusive gallery events.
                </p>
              </div>

              {/* Right Subscribe Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (emailInput.trim()) {
                    setSubscribed(true);
                    setEmailInput("");
                  }
                }}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                {subscribed ? (
                  <span className="text-xs font-semibold text-[#B78646] px-4 py-2 bg-[#FAF8F5] rounded-full border border-[#B78646]">
                    Thank you for subscribing!
                  </span>
                ) : (
                  <>
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="bg-[#FAF8F5] border border-[#E7E0D7] rounded-full py-2.5 px-4 text-xs text-[#24211F] outline-none focus:border-[#B78646] w-full sm:w-60"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#B78646] hover:bg-[#9E7134] text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-xs"
                    >
                      Subscribe
                    </button>
                  </>
                )}
              </form>
            </div>
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}
