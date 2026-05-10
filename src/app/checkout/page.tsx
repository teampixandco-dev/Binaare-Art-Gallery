"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useCart } from "@/context/CartContext";
import { formatPriceUSD } from "@/data/products";

export default function CheckoutPage() {
  const { lineEntries, formatSubtotal, clearCart, itemCount } = useCart();
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lineEntries.length) return;
    setSubmitted(true);
    clearCart();
  };

  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <PageHero
        title="Checkout"
        subtitle="Shipping details & order summary"
        backgroundImage="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=800&fit=crop"
      />

      <section className="gallery-section" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
        {submitted ? (
          <div className="cart-layout text-center" style={{ padding: "2rem 1rem 4rem" }}>
            <h2 className="section-title" style={{ marginBottom: "1rem" }}>
              Thank you
            </h2>
            <p className="section-text" style={{ maxWidth: "36rem", margin: "0 auto 2rem" }}>
              Your request has been noted. The gallery will reach out by email to confirm availability,
              shipping options, and payment. This demo does not charge a card or send real orders.
            </p>
            <Link href="/shop" className="btn-primary">
              Back to shop
            </Link>
          </div>
        ) : itemCount === 0 ? (
          <div className="cart-layout text-center" style={{ padding: "2rem 1rem" }}>
            <p className="section-text" style={{ marginBottom: "1.5rem" }}>
              Your cart is empty. Add artworks before checking out.
            </p>
            <Link href="/shop" className="btn-primary">
              Browse shop
            </Link>
          </div>
        ) : (
          <div className="checkout-grid">
            <form onSubmit={handleSubmit}>
              <p className="section-label" style={{ marginBottom: "0.75rem" }}>
                Delivery
              </p>
              <h2 className="section-title" style={{ marginBottom: "1.5rem", fontSize: "1.75rem" }}>
                Your details
              </h2>

              <div className="checkout-field">
                <label htmlFor="chk-name">Full name</label>
                <input
                  id="chk-name"
                  name="name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="checkout-field">
                <label htmlFor="chk-email">Email</label>
                <input
                  id="chk-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="checkout-field">
                <label htmlFor="chk-phone">Phone</label>
                <input
                  id="chk-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="checkout-field">
                <label htmlFor="chk-address">Street address</label>
                <input
                  id="chk-address"
                  name="address"
                  required
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="checkout-field">
                <label htmlFor="chk-city">City</label>
                <input
                  id="chk-city"
                  name="city"
                  required
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="checkout-field">
                <label htmlFor="chk-postal">Postal code</label>
                <input
                  id="chk-postal"
                  name="postal"
                  autoComplete="postal-code"
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                />
              </div>
              <div className="checkout-field">
                <label htmlFor="chk-notes">Notes (optional)</label>
                <textarea
                  id="chk-notes"
                  name="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Framing, delivery window, questions about the work…"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem" }}>
                Place order
              </button>
            </form>

            <aside className="order-summary-box">
              <p className="section-label" style={{ marginBottom: "0.75rem" }}>
                Order summary
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem" }}>
                {lineEntries.map(({ line, product }) => (
                  <li key={product.slug} className="order-summary-row">
                    <span style={{ paddingRight: "0.5rem" }}>
                      {product.title} × {line.quantity}
                    </span>
                    <span>{formatPriceUSD(product.price * line.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="order-summary-row total">
                <span>Subtotal</span>
                <span>{formatSubtotal()}</span>
              </div>
              <p className="section-text" style={{ marginTop: "1.25rem", fontSize: "0.8rem" }}>
                Final total may include shipping and taxes after the gallery confirms your order.
              </p>
              <Link href="/cart" className="btn-outline" style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}>
                Edit cart
              </Link>
            </aside>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
