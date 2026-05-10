"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

export default function ContactPage() {
  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <PageHero
        title="Contact Us"
        subtitle="We Would Love to Hear from You"
        backgroundImage="https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1920&h=800&fit=crop"
      />

      <SectionReveal>
        <section className="gallery-section">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left — Form */}
            <div className="lg:w-7/12">
              <p className="section-label">Get in Touch</p>
              <h2 className="section-title">Send Us a Message</h2>
              <div className="section-divider" style={{ marginBottom: "2rem" }} />

              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input type="text" placeholder="Your Name" className="contact-input" />
                  <input type="email" placeholder="Your Email" className="contact-input" />
                </div>
                <input type="text" placeholder="Subject" className="contact-input" />
                <select className="contact-input" defaultValue="">
                  <option value="" disabled>Select enquiry type</option>
                  <option>Artwork enquiries and purchases</option>
                  <option>Commission requests</option>
                  <option>Exhibition and collaboration opportunities</option>
                  <option>General questions about the gallery</option>
                </select>
                <textarea
                  placeholder="Your Message"
                  className="contact-textarea"
                />
                <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
                  Send Message
                </button>
              </form>
            </div>

            {/* Right — Info */}
            <div className="lg:w-5/12">
              <div style={{ background: "var(--bg-alt)", padding: "2.5rem", marginBottom: "2rem" }}>
                <p className="section-label">Connect with Us</p>
                <h3 className="font-serif text-xl mb-4">Contact Details</h3>

                <div className="flex flex-col gap-4" style={{ fontSize: "0.9rem" }}>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: "0.2rem" }}>Email</p>
                    <p style={{ color: "var(--muted)" }}>hello@binaare.com</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: "0.2rem" }}>Phone</p>
                    <p style={{ color: "var(--muted)" }}>+94 77 000 0000</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: "0.2rem" }}>Location</p>
                    <p style={{ color: "var(--muted)" }}>Colombo, Sri Lanka</p>
                  </div>
                </div>
              </div>

              <div style={{ background: "var(--bg-alt)", padding: "2.5rem" }}>
                <p className="section-label">Reach Out For</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.9rem" }}>
                  {[
                    "Artwork enquiries and purchases",
                    "Commission requests",
                    "Exhibition and collaboration opportunities",
                    "General questions about the gallery",
                  ].map((item) => (
                    <li key={item} style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p style={{ marginTop: "2rem", fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7, fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
                Art is a personal experience, and so is every connection we make. Feel free to reach
                out — we look forward to sharing this journey of Colors of Love with you.
              </p>
            </div>
          </div>
        </section>
      </SectionReveal>

      <Footer />
    </main>
  );
}
