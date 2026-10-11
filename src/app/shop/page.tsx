"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutGrid, List, Heart, LayoutDashboard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import AddToCartButton from "@/components/AddToCartButton";
import { formatPriceUSD } from "@/data/products";
import { useContent } from "@/context/ContentContext";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ShopPage() {
  const { products: PRODUCTS } = useContent();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const filters = [
    { label: "All", icon: <LayoutDashboard size={24} style={{ color: "var(--accent)" }} /> },
    { label: "Oil Painting", image: "/artworks/together-we-bloom.webp" },
    { label: "Water color", image: "/artworks/reflections-of-a-golden-city.webp" },
    { label: "Mixed Media", image: "/artworks/beauty-in-simplicity.webp" },
    { label: "Texture", image: "/artworks/fields-of-quiet-gold.webp" },
    { label: "Acrylic", image: "/artworks/beauty-beyond-colour.webp" }
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      let matchesFilter = true;
      if (activeFilter !== "All") {
        const matchStr = `${p.medium} ${p.style} ${p.materials} ${p.theme}`.toLowerCase();
        const filterLower = activeFilter.toLowerCase();
        matchesFilter = matchStr.includes(filterLower) || (filterLower === 'water color' && matchStr.includes('watercolor'));
      }
      
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const searchStr = `${p.title} ${p.medium} ${p.theme}`.toLowerCase();
        matchesSearch = searchStr.includes(searchQuery.toLowerCase());
      }

      return matchesFilter && matchesSearch;
    });
  }, [PRODUCTS, activeFilter, searchQuery]);

  return (
    <main style={{ background: "var(--bg)" }} className="min-h-screen flex flex-col">
      <Navbar />

      <PageHero
        title="Shop"
        subtitle="Original Artworks by Binari Gamage"
        backgroundImage="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&h=800&fit=crop"
      />

      {/* Filters (Circles) */}
      <section className="py-12 border-b border-[#E7E0D7]" style={{ background: "var(--bg-alt)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex overflow-x-auto hide-scrollbar gap-6 md:gap-8 md:justify-center px-4 pb-4 items-start">
            {filters.map((filter) => (
              <button
                key={filter.label}
                onClick={() => setActiveFilter(filter.label)}
                className="flex flex-col items-center gap-4 min-w-[70px] group outline-none shrink-0"
              >
                <div 
                  className="w-[70px] h-[70px] rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 border-[3px]"
                  style={{ borderColor: activeFilter === filter.label ? "var(--accent)" : "transparent" }}
                >
                  {filter.icon ? (
                    <div className="w-[64px] h-[64px] bg-white border border-[#E7E0D7] rounded-full flex items-center justify-center shadow-sm">
                      {filter.icon}
                    </div>
                  ) : (
                    <div className="relative w-[64px] h-[64px] rounded-full overflow-hidden shadow-sm">
                      <Image 
                        src={filter.image!} 
                        alt={filter.label} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                  )}
                </div>
                <span 
                  className="text-[0.55rem] md:text-[0.6rem] uppercase tracking-widest font-medium transition-colors"
                  style={{ color: activeFilter === filter.label ? "var(--accent)" : "var(--fg-muted)" }}
                >
                  {filter.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="py-6 sticky top-[70px] z-30 shadow-sm" style={{ background: "var(--bg-alt)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-[0.65rem] uppercase tracking-widest font-medium hidden md:block" style={{ color: "var(--fg-muted)" }}>Sort By</span>
            <select className="bg-transparent border-none py-2 pr-8 text-[0.7rem] uppercase tracking-widest font-medium outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1%201L5%205L9%201%22%20stroke%3D%22%2324211F%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_center]" style={{ color: "var(--fg)" }}>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <div className="flex-1 w-full md:max-w-md relative">
            <input 
              type="text" 
              placeholder="Search artworks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-transparent rounded-full py-2.5 pl-5 pr-12 text-sm outline-none transition-colors"
              style={{ background: "var(--bg-alt)", color: "var(--fg)", border: "1px solid var(--border)" }}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2" size={16} style={{ color: "var(--fg-muted)" }} />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <span className="text-[0.65rem] uppercase tracking-widest font-medium" style={{ color: "var(--fg-muted)" }}>{filteredProducts.length} Artworks</span>
            <div className="flex items-center gap-1 border p-1 rounded-md" style={{ borderColor: "var(--border)" }}>
              <button 
                onClick={() => setLayout("grid")} 
                className="p-1.5 transition-colors rounded-sm"
                style={{ color: layout === "grid" ? "var(--accent)" : "var(--fg-muted)", background: layout === "grid" ? "var(--bg)" : "transparent" }}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setLayout("list")} 
                className="p-1.5 transition-colors rounded-sm"
                style={{ color: layout === "list" ? "var(--accent)" : "var(--fg-muted)", background: layout === "list" ? "var(--bg)" : "transparent" }}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="flex-1 pt-12 pb-24" style={{ background: "var(--bg-alt)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif italic text-xl mb-6" style={{ color: "var(--fg-muted)" }}>No artworks currently match your selection.</p>
              <button onClick={() => {setActiveFilter("All"); setSearchQuery("");}} className="text-[0.7rem] uppercase tracking-widest font-medium transition-colors border-b pb-1" style={{ color: "var(--accent)", borderBottomColor: "var(--accent)" }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={`grid gap-x-8 gap-y-14 ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((item, i) => (
                    <motion.article
                      key={item.slug}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: (i % 4) * 0.1, ease }}
                      className={`group flex ${layout === 'grid' ? 'flex-col h-full' : 'flex-row gap-8 items-center bg-white p-6 shadow-sm border border-[#E7E0D7]/50'}`}
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    >
                      <div className={`relative overflow-hidden ${layout === 'grid' ? 'w-full aspect-[4/5] mb-5' : 'w-48 h-64 shrink-0'}`} style={{ background: "var(--bg-alt)" }}>
                        <Link href={`/shop/${item.slug}`} className="absolute inset-0 z-10">
                          <Image
                            src={item.src}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </Link>
                        <button className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-sm" style={{ color: "var(--fg-muted)" }}>
                          <Heart size={15} strokeWidth={1.5} />
                        </button>
                      </div>
                      
                      <div className={`flex-1 flex flex-col justify-between ${layout === 'grid' ? 'h-full p-4 pt-0' : ''}`}>
                        <div className={`${layout === 'grid' ? 'mb-6' : 'mb-4'}`}>
                          <h3 className="font-serif text-[1.1rem] md:text-[1.15rem] mb-1 leading-snug" style={{ color: "var(--fg)" }}>
                            <Link href={`/shop/${item.slug}`} className="transition-colors hover:text-[color:var(--accent)]">{item.title}</Link>
                          </h3>
                          <p className="text-[0.6rem] uppercase tracking-[0.15em] mb-2" style={{ color: "var(--fg-muted)" }}>{item.width} × {item.height}</p>
                          <p className="font-medium text-[1.05rem] mt-3" style={{ color: "var(--accent)" }}>{formatPriceUSD(item.price)}</p>
                        </div>
                        
                        <div className={`flex items-center gap-2 ${layout === 'grid' ? 'mt-auto' : ''}`}>
                          <AddToCartButton slug={item.slug} showIcon={true} className="flex-[3] btn-primary flex justify-center items-center py-3 text-[0.6rem] uppercase tracking-[0.15em] font-medium" />
                          <Link href={`/shop/${item.slug}`} className="flex-[2] btn-outline flex justify-center items-center py-3 text-[0.6rem] uppercase tracking-[0.15em] font-medium text-center">
                            View
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {/* Promo Banner appended to the end of the products */}
              <motion.div 
                key="promo-banner"
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease }}
                className="mt-20 w-full relative overflow-hidden flex items-center min-h-[350px] md:min-h-[400px] border shadow-sm"
                style={{ background: "var(--bg)", borderColor: "var(--border)" }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-[60%] opacity-90 mix-blend-multiply">
                  <Image src="/artworks/wings-of-golden-courage.webp" alt="Texture" fill className="object-cover object-right" />
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-[80%] md:w-[65%] z-10" style={{ background: "linear-gradient(to right, var(--bg) 15%, transparent 100%)" }}></div>
                
                <div className="relative z-20 p-10 md:p-16 lg:p-24 w-full md:w-[65%]">
                  <h3 className="font-serif text-3xl md:text-5xl mb-6 leading-tight" style={{ color: "var(--fg)" }}>Every Space<br/>Deserves a Story</h3>
                  <div className="w-12 h-[2px] mb-8" style={{ background: "var(--accent)" }}></div>
                  <p className="text-[0.85rem] md:text-[0.95rem] mb-10 leading-relaxed max-w-lg" style={{ color: "var(--fg-muted)" }}>
                    Explore original artworks that bring emotion, elegance, and meaning into your space. Let every brushstroke speak to you and transform your environment into a living reflection of your journey.
                  </p>
                  <Link href="/gallery" className="inline-block btn-primary text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.2em] px-8 py-4 font-medium transition-colors">
                    Explore Gallery &rarr;
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
