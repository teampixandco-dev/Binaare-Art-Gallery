"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  X,
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
  ArrowUpRight,
  ChevronDown,
  Check
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContent } from "@/context/ContentContext";
import { useCart } from "@/context/CartContext";
import { PRODUCTS as STATIC_PRODUCTS, Product } from "@/data/products";

// Subtitle generator: "Oil on Canvas • Floral" / "Acrylic on Canvas • Abstract"
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

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "title-asc", label: "Title: A – Z" },
  { value: "title-desc", label: "Title: Z – A" },
];

const ITEMS_PER_PAGE = 12;

export default function ShopPage() {
  const { products: contentProducts, pages } = useContent();
  const shopPage = pages?.find((p) => p.slug === "shop");
  const heroImage = shopPage?.hero || "/artworks/together-we-bloom.webp";
  const heroTitle = shopPage?.title && shopPage.title !== "Shop" ? shopPage.title : "Art for a More Beautiful Everyday";
  const heroSubtitle = shopPage?.subtitle || "Timeless paintings celebrating resilience, friendship, and the quiet richness of life.";
  const PRODUCTS =
    contentProducts && contentProducts.length >= STATIC_PRODUCTS.length
      ? contentProducts
      : STATIC_PRODUCTS;

  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Category Pills: All, Water color, Mixed Media, Texture, Acrylic, Oil Painting
  const categories = [
    { label: "All", icon: <Sparkles size={13} /> },
    { label: "Water color", icon: <Droplets size={13} /> },
    { label: "Mixed Media", icon: <Layers size={13} /> },
    { label: "Texture", icon: <Box size={13} /> },
    { label: "Acrylic", icon: <Brush size={13} /> },
    { label: "Oil Painting", icon: <Palette size={13} /> },
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

        if (p.category) {
          if (activeCategory === "Water color") {
            matchesCat = p.category.toLowerCase().includes("water");
          } else {
            matchesCat = p.category.toLowerCase() === activeCategory.toLowerCase();
          }
        } else if (activeCategory === "Oil Painting") {
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
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#24211F] flex flex-col font-sans">
      <Navbar />

      {/* Reduced Height Full-Width Hero Banner (No Curves, One-Line Title) */}
      <section className="relative w-full overflow-hidden min-h-[220px] sm:min-h-[250px] md:min-h-[270px] flex items-center justify-center text-center px-4 py-8 sm:py-10">
        <Image
          src={heroImage}
          alt={heroTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <span className="text-[0.65rem] uppercase tracking-[0.26em] font-semibold text-[#D6BC94] mb-2 block">
            Original Artworks
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-normal text-white leading-tight mb-2 whitespace-nowrap">
            {heroTitle}
          </h1>
          <p className="text-white/85 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Categories Toolbar & Interactive Expandable Search */}
      <section id="products-grid-section" className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pt-6 pb-4">
        
        {/* Top Toolbar Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap pb-4 border-b border-[#E7E0D7]/70">
          
          {/* Left: Category Pills (Extra Small Radius, Old Project Golden-Brown #8C704F) */}
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
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xs text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#8C704F] text-white shadow-xs font-semibold"
                      : "bg-white text-[#555] border border-[#E7E0D7] hover:bg-[#F5F2EB] hover:text-[#24211F]"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Expandable Search, Sort & Layout Switcher */}
          <div className="flex items-center gap-2.5 shrink-0 ml-auto">
            
            {/* Expandable Search Button */}
            {isSearchOpen ? (
              <div className="relative flex items-center transition-all duration-300">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search title, medium..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-44 sm:w-60 bg-white border border-[#E7E0D7] rounded-xs py-1.5 pl-3 pr-8 text-xs text-[#24211F] outline-none focus:border-[#8C704F] transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  aria-label="Close search"
                  className="absolute right-2 text-[#77716B] hover:text-[#24211F] p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search artworks"
                title="Search"
                className="h-8 px-2.5 bg-white border border-[#E7E0D7] hover:border-[#8C704F] text-[#555] hover:text-[#24211F] rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1 text-xs"
              >
                <Search size={14} />
                <span className="hidden sm:inline text-[0.7rem] uppercase tracking-wider font-medium">Search</span>
              </button>
            )}

            <span className="text-[0.68rem] uppercase tracking-wider text-[#77716B] font-medium hidden md:inline-block">
              {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? "Artwork" : "Artworks"}
            </span>

            {/* Shadcn-Style Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
                className="h-8 px-2.5 sm:px-3 bg-white border border-[#E7E0D7] hover:border-[#8C704F] text-[#24211F] rounded-xs text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <span className="text-[#77716B] text-[0.68rem] uppercase tracking-wider font-medium">Sort:</span>
                <span className="font-medium">
                  {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "Featured"}
                </span>
                <ChevronDown size={13} className={`text-[#77716B] transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
              </button>

              {isSortOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-[#E7E0D7] rounded-xs shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = sortBy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSortBy(opt.value);
                          setCurrentPage(1);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#FAF8F5] text-[#8C704F] font-semibold"
                            : "text-[#24211F] hover:bg-[#FAF8F5] hover:text-[#8C704F]"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check size={13} className="text-[#8C704F]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-1 bg-white border border-[#E7E0D7] rounded-xs p-0.5">
              <button
                type="button"
                onClick={() => setLayout("grid")}
                aria-label="Grid view"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                  layout === "grid" ? "bg-[#8C704F] text-white" : "text-[#77716B] hover:text-[#24211F]"
                }`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setLayout("list")}
                aria-label="List view"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                  layout === "list" ? "bg-[#8C704F] text-white" : "text-[#77716B] hover:text-[#24211F]"
                }`}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Search Badge (if search query is active and input closed) */}
        {searchQuery && !isSearchOpen && (
          <div className="pt-3 flex items-center gap-2">
            <span className="text-xs text-[#77716B]">Filtering by: &ldquo;{searchQuery}&rdquo;</span>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-[#8C704F] font-semibold hover:underline cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}
      </section>

      {/* Product Display Section */}
      <section className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-8 pt-2 pb-20">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xs border border-[#E7E0D7] p-8 max-w-xl mx-auto shadow-xs">
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
              className="px-6 py-2.5 rounded-xs bg-[#8C704F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#785E3E] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* GRID VIEW */}
            {layout === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300">
                {paginatedProducts.map((item) => {
                  const isFav = favorites.includes(item.slug);
                  const isAdded = addedSlugs[item.slug];

                  return (
                    <article
                      key={item.slug}
                      className="bg-white rounded-xs p-3.5 border border-[#EBE5DA] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Image Area with Heart in Top Right Corner */}
                      <div>
                        <div className="relative aspect-[4/3] rounded-[2px] overflow-hidden bg-[#FAF8F5] mb-3">
                          <Link href={`/shop/${item.slug}`} className="relative w-full h-full block">
                            <Image
                              src={item.src}
                              alt={item.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                          </Link>

                          {/* Multiple Images Indicator Badge */}
                          {item.images && item.images.length > 1 && (
                            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-[2px] bg-black/60 text-white text-[0.6rem] font-medium tracking-wider backdrop-blur-xs flex items-center gap-1 z-10 pointer-events-none">
                              <Layers size={10} /> {item.images.length} views
                            </span>
                          )}

                          {/* Favorite Heart Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(item.slug);
                            }}
                            aria-label={`Favorite ${item.title}`}
                            className="absolute top-2 right-2 w-7 h-7 rounded-xs bg-white/90 hover:bg-white text-[#24211F] shadow-xs flex items-center justify-center transition-transform hover:scale-110 z-10 cursor-pointer"
                          >
                            <Heart
                              size={13}
                              className={isFav ? "fill-[#8C704F] text-[#8C704F]" : "text-[#77716B]"}
                            />
                          </button>
                        </div>

                        {/* Title & Optional Price Row */}
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <h3 className="font-serif font-medium text-[1.02rem] leading-snug text-[#24211F] line-clamp-1 transition-colors group-hover:text-[#8C704F]">
                            <Link href={`/shop/${item.slug}`}>{item.title}</Link>
                          </h3>
                          {item.price && item.price > 0 ? (
                            <span className="text-[0.88rem] font-medium text-[#8C704F] whitespace-nowrap">
                              ${item.price.toLocaleString()}
                            </span>
                          ) : null}
                        </div>

                        {/* Dimensions / Subtitle */}
                        <p className="text-[0.68rem] uppercase tracking-[0.14em] text-[#77716B] mb-3 truncate font-medium">
                          {item.width && item.height ? `${item.width.replace(' inches', '″')} × ${item.height.replace(' inches', '″')}` : getArtworkSubtitle(item)}
                        </p>
                      </div>

                      {/* Button Row: [ INQUIRE / ADD TO CART ] [ VIEW ↗ ] */}
                      <div className="grid grid-cols-[1fr_auto] gap-2 pt-1 mt-auto">
                        {item.price && item.price > 0 ? (
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item.slug)}
                            className={`h-9 min-h-[36px] px-3 btn-glass-cart text-[0.68rem] tracking-[0.16em] ${isAdded ? "btn-glass-added" : ""}`}
                          >
                            {isAdded ? "Added ✓" : "Add to Cart"}
                          </button>
                        ) : (
                          <Link
                            href={`/contact?enquiry=Artwork+enquiries+and+purchases&artwork=${encodeURIComponent(item.title)}`}
                            className="h-9 min-h-[36px] px-3 btn-glass-cart text-[0.68rem] tracking-[0.16em]"
                          >
                            Inquire
                          </Link>
                        )}

                        <Link
                          href={`/shop/${item.slug}`}
                          className="h-9 min-h-[36px] px-3 bg-white border border-[#D5CEC2] hover:border-[#8C704F] text-[#24211F] hover:text-[#8C704F] text-[0.68rem] uppercase tracking-[0.16em] font-semibold transition-colors inline-flex items-center justify-center gap-1 rounded-xs whitespace-nowrap"
                        >
                          View <ArrowUpRight size={13} />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="flex flex-col gap-4 max-w-4xl mx-auto transition-opacity duration-300">
                {paginatedProducts.map((item) => {
                  const isFav = favorites.includes(item.slug);
                  const isAdded = addedSlugs[item.slug];

                  return (
                    <article
                      key={item.slug}
                      className="bg-white rounded-xs p-4 border border-[#EBE5DA] shadow-xs hover:shadow-md flex flex-col sm:flex-row gap-5 items-stretch transition-all duration-300 group"
                    >
                      {/* Left Image Area */}
                      <div className="relative w-full sm:w-56 aspect-[4/3] rounded-[2px] overflow-hidden bg-[#FAF8F5] shrink-0">
                        <Link href={`/shop/${item.slug}`} className="relative w-full h-full block">
                          <Image
                            src={item.src}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 240px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>

                          {/* Multiple Images Indicator Badge */}
                          {item.images && item.images.length > 1 && (
                            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-[2px] bg-black/60 text-white text-[0.6rem] font-medium tracking-wider backdrop-blur-xs flex items-center gap-1 z-10 pointer-events-none">
                              <Layers size={10} /> {item.images.length} views
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(item.slug);
                            }}
                            aria-label={`Favorite ${item.title}`}
                            className="absolute top-2 right-2 w-7 h-7 rounded-xs bg-white/90 hover:bg-white text-[#24211F] shadow-xs flex items-center justify-center transition-transform hover:scale-110 z-10 cursor-pointer"
                          >
                            <Heart
                              size={13}
                              className={isFav ? "fill-[#8C704F] text-[#8C704F]" : "text-[#77716B]"}
                            />
                          </button>
                        </div>

                        {/* Right Details */}
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-baseline justify-between gap-3 mb-1">
                              <h3 className="font-serif text-[1.18rem] font-medium leading-snug text-[#24211F] transition-colors group-hover:text-[#8C704F]">
                                <Link href={`/shop/${item.slug}`}>{item.title}</Link>
                              </h3>
                              {item.price && item.price > 0 && (
                                <span className="text-base font-semibold text-[#8C704F] whitespace-nowrap">
                                  ${item.price.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <p className="text-[0.7rem] uppercase tracking-[0.14em] text-[#77716B] mb-2 font-medium">
                              {getArtworkSubtitle(item)} · {item.width && item.height ? `${item.width} × ${item.height}` : item.size}
                            </p>
                          <p className="text-xs text-[#77716B] leading-relaxed line-clamp-2 mb-4 font-light">
                            {item.description.replace(/\*\*/g, "").replace(/\*/g, "")}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.price && item.price > 0 ? (
                            <button
                              type="button"
                              onClick={() => handleAddToCart(item.slug)}
                              className={`h-9 min-h-[36px] px-5 btn-glass-cart text-[0.68rem] tracking-[0.16em] ${isAdded ? "btn-glass-added" : ""}`}
                            >
                              {isAdded ? "Added to Cart ✓" : "Add to Cart"}
                            </button>
                          ) : (
                            <Link
                              href={`/contact?enquiry=Artwork+enquiries+and+purchases&artwork=${encodeURIComponent(item.title)}`}
                              className="h-9 min-h-[36px] px-5 btn-glass-cart text-[0.68rem] tracking-[0.16em]"
                            >
                              Inquire
                            </Link>
                          )}

                          <Link
                            href={`/shop/${item.slug}`}
                            className="h-9 min-h-[36px] px-4 bg-white border border-[#D5CEC2] hover:border-[#8C704F] text-[#24211F] hover:text-[#8C704F] text-[0.68rem] uppercase tracking-[0.16em] font-semibold transition-colors inline-flex items-center justify-center gap-1 rounded-xs whitespace-nowrap"
                          >
                            View <ArrowUpRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination (< 1 2 >) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-[#E7E0D7]/70">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="w-8 h-8 rounded-xs border border-[#E7E0D7] bg-white flex items-center justify-center text-xs text-[#24211F] hover:border-[#8C704F] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xs text-xs font-semibold transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-[#8C704F] text-white shadow-xs"
                        : "bg-white border border-[#E7E0D7] text-[#555] hover:border-[#8C704F] hover:text-[#24211F]"
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
                  className="w-8 h-8 rounded-xs border border-[#E7E0D7] bg-white flex items-center justify-center text-xs text-[#24211F] hover:border-[#8C704F] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* Newsletter Promotional Banner */}
            <div className="rounded-xs border border-[#E7E0D7] bg-white p-6 sm:p-8 mt-14 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="relative w-full md:w-36 h-28 rounded-[2px] overflow-hidden shrink-0 bg-[#FAF8F5]">
                <Image
                  src="/artworks/wings-of-golden-courage.webp"
                  alt="Art in interior space"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <span className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-[#8C704F] mb-1 block">
                  Stay in the loop
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#24211F] font-normal mb-1.5">
                  Art Inspires a Kinder, Brighter World
                </h3>
                <p className="text-xs text-[#77716B] font-light leading-relaxed max-w-lg">
                  Be the first to know about new artworks, featured stories, and exclusive gallery events.
                </p>
              </div>

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
                  <span className="text-xs font-semibold text-[#8C704F] px-4 py-2 bg-[#FAF8F5] rounded-xs border border-[#8C704F]">
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
                      className="bg-[#FAF8F5] border border-[#E7E0D7] rounded-xs py-2 px-3 text-xs text-[#24211F] outline-none focus:border-[#8C704F] w-full sm:w-60"
                    />
                    <button
                      type="submit"
                      className="py-2 px-5 bg-[#8C704F] hover:bg-[#785E3E] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors whitespace-nowrap cursor-pointer"
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
    </div>
  );
}
