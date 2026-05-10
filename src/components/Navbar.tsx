"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/artist", label: "Artist" },
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`gallery-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-left">
          <Link href="/" className="nav-logo">
            Binaare
          </Link>
        </div>

        <div className="nav-center">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={pathname === l.href ? "active" : ""}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-right">
          <div className="nav-actions">
            <button aria-label="Search" className="nav-action-btn">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/shop" aria-label="Shop" className="nav-action-link">
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>

          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button
          onClick={() => setMenuOpen(false)}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            background: "none",
            border: "none",
            fontSize: "1.8rem",
            cursor: "pointer",
            color: "var(--fg)",
          }}
          aria-label="Close menu"
        >
          ✕
        </button>
        <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
