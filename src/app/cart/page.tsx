"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useCart } from "@/context/CartContext";
import { formatPriceUSD } from "@/data/products";

export default function CartPage() {
  const { lineEntries, setQuantity, removeItem, formatSubtotal, itemCount } = useCart();

  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <PageHero
        title="Cart"
        subtitle={itemCount ? `${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Review your selection"}
        backgroundImage="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&h=800&fit=crop"
      />

      <section className="gallery-section" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
        <div className="cart-layout">
          {lineEntries.length === 0 ? (
            <div className="text-center" style={{ padding: "3rem 1rem" }}>
              <p className="section-text" style={{ marginBottom: "1.5rem" }}>
                Your cart is empty. Browse the shop to add original artworks.
              </p>
              <Link href="/shop" className="btn-primary">
                Continue shopping
              </Link>
            </div>
          ) : (
            <>
              {lineEntries.map(({ line, product }) => {
                const lineTotal = product.price * line.quantity;
                return (
                  <article key={product.slug} className="cart-item">
                    <div className="cart-item-main" style={{ flex: 1 }}>
                      <Link href={`/shop/${product.slug}`} className="cart-item-thumb" style={{ display: "block" }}>
                        <Image
                          src={product.src}
                          alt=""
                          width={100}
                          height={130}
                          sizes="100px"
                          style={{ width: "100%", height: "auto", objectFit: "cover" }}
                        />
                      </Link>
                      <div style={{ minWidth: 0 }}>
                        <Link href={`/shop/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                          <h2 className="artwork-card-title" style={{ marginBottom: "0.35rem" }}>
                            {product.title}
                          </h2>
                        </Link>
                        <p className="artwork-card-medium">
                          {product.medium} · {product.size}
                        </p>
                        <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--muted)" }}>
                          {formatPriceUSD(product.price)} each
                        </p>
                      </div>
                    </div>

                    <div className="cart-item-meta">
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Qty
                        <input
                          type="number"
                          min={1}
                          className="cart-qty-input"
                          value={line.quantity}
                          onChange={(e) => {
                            const v = Number.parseInt(e.target.value, 10);
                            if (Number.isNaN(v)) return;
                            setQuantity(product.slug, v);
                          }}
                          aria-label={`Quantity for ${product.title}`}
                        />
                      </label>
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", minWidth: "5rem" }}>
                        {formatPriceUSD(lineTotal)}
                      </p>
                      <button type="button" className="cart-remove-btn" onClick={() => removeItem(product.slug)}>
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}

              <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "flex-end" }}>
                <p style={{ fontSize: "1.35rem", fontFamily: "var(--font-serif)" }}>
                  Subtotal <span style={{ color: "var(--accent)", marginLeft: "0.75rem" }}>{formatSubtotal()}</span>
                </p>
                <p className="section-text" style={{ maxWidth: "28rem", textAlign: "right", fontSize: "0.85rem" }}>
                  Shipping and insurance are confirmed after you submit your details. No payment is processed on this site until the gallery contacts you.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "flex-end" }}>
                  <Link href="/shop" className="btn-outline">
                    Continue shopping
                  </Link>
                  <Link href="/checkout" className="btn-primary">
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
