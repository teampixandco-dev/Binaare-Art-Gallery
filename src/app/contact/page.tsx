"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageSections from "@/components/PageSections";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import ModernSelect, { SelectOption } from "@/components/ModernSelect";
import { usePageContent } from "@/context/ContentContext";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import "./contact.css";

const ENQUIRY_OPTIONS: SelectOption[] = [
  {
    value: "Artwork enquiries and purchases",
    label: "Artwork Inquiries & Acquisitions",
    badge: "Collectors",
    description: "Pricing, availability, Certificate of Authenticity & worldwide insured shipping",
  },
  {
    value: "Commission requests",
    label: "Bespoke Commission Requests",
    badge: "Custom",
    description: "Custom original painting crafted specifically for your home or architectural space",
  },
  {
    value: "Exhibition and collaboration opportunities",
    label: "Exhibitions & Collaborations",
    badge: "Curatorial",
    description: "Gallery exhibitions, museum showcases, art fairs & curatorial collaborations",
  },
  {
    value: "Private studio viewing",
    label: "Private Studio Viewing",
    badge: "Private",
    description: "Arrange an in-person or virtual studio consultation with artist Binari Gamage",
  },
  {
    value: "General questions about the gallery",
    label: "General Questions & Press",
    description: "Media features, interviews, press kits & general questions about the gallery",
  },
];

export default function ContactPage() {
  const page = usePageContent("contact");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [enquiryType, setEnquiryType] = useState(ENQUIRY_OPTIONS[0].value);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [inquiryReference, setInquiryReference] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  function copyEmailToClipboard() {
    navigator.clipboard.writeText("Binari.gamage@binaareartgallery.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = "Please enter your name.";
    if (!email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!subject.trim()) errors.subject = "Please enter a subject line.";
    if (!enquiryType) errors.enquiryType = "Please select an enquiry category.";
    if (!message.trim() || message.trim().length < 10) {
      errors.message = "Please write a message with at least 10 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) {
      setStatus("error");
      setErrorMessage("Please complete all required fields highlighted below.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          enquiryType,
          message: message.trim(),
          honeypot,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch message.");
      }

      setStatus("success");
      setInquiryReference(data.reference || `REF-${Date.now().toString(36).toUpperCase()}`);
      // Clear form inputs
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setFieldErrors({});
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while sending your message. Please reach out directly to Binari.gamage@binaareartgallery.com."
      );
    }
  }

  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <PageHero
        title={page?.title || "Contact Us"}
        subtitle={page?.subtitle || "We Would Love to Hear from You"}
        tag="Inquiries & Commissions"
        backgroundImage={page?.hero || "/artworks/whispers-of-serenity.webp"}
      />

      <SectionReveal>
        <section className="contact-section-container">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-start">
            {/* Left Column — Modern Contact Form */}
            <div className="w-full lg:w-7/12">
              <div className="modern-form-card">
                <div className="modern-form-header">
                  <span className="section-label flex items-center gap-1.5">
                    <Sparkles size={12} className="text-accent" /> Get in Touch
                  </span>
                  <h2 className="modern-form-title">Send Us a Message</h2>
                  <p className="modern-form-subtitle">
                    Whether you are an established collector, commissioning an exclusive original piece,
                    or inquiring about our collections, your message will be forwarded directly to artist
                    and founder <strong>Binari Gamage</strong>.
                  </p>
                </div>

                {/* Status Banners */}
                {status === "success" && (
                  <div className="modern-status-banner success" role="status">
                    <div className="modern-status-icon">
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <h4 className="modern-status-title">Message Sent Successfully</h4>
                      <p className="modern-status-message">
                        Thank you for reaching out. Your inquiry has been delivered directly to{" "}
                        <strong>Binari.gamage@binaareartgallery.com</strong>. We will review your note and respond
                        personally within 24–48 hours.
                      </p>
                      {inquiryReference && (
                        <span className="modern-status-ref">
                          Inquiry Reference: {inquiryReference}
                        </span>
                      )}
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setStatus("idle")}
                          className="modern-submit-btn text-xs py-2 px-4"
                          style={{ padding: "0.6rem 1.25rem" }}
                        >
                          Send Another Message
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {status === "error" && errorMessage && (
                  <div className="modern-status-banner error" role="alert">
                    <div className="modern-status-icon">
                      <AlertCircle size={22} />
                    </div>
                    <div>
                      <h4 className="modern-status-title">Unable to Send Message</h4>
                      <p className="modern-status-message">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {status !== "success" && (
                  <form onSubmit={handleSubmit} className="modern-form-grid" noValidate>
                    {/* Honeypot field (hidden for anti-spam) */}
                    <input
                      type="text"
                      name="honeypot"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      style={{ display: "none" }}
                      aria-hidden="true"
                    />

                    {/* Name & Email Row */}
                    <div className="modern-input-row">
                      <div className="modern-field-group">
                        <label className="modern-field-label">
                          <span>Your Name</span>
                          <span className="modern-required-star">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Eleanor Vance"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                          }}
                          className={`modern-input ${fieldErrors.name ? "has-error" : ""}`}
                          disabled={status === "submitting"}
                          required
                        />
                        {fieldErrors.name && (
                          <span className="modern-field-error">{fieldErrors.name}</span>
                        )}
                      </div>

                      <div className="modern-field-group">
                        <label className="modern-field-label">
                          <span>Your Email</span>
                          <span className="modern-required-star">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. eleanor@vance-art.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                          }}
                          className={`modern-input ${fieldErrors.email ? "has-error" : ""}`}
                          disabled={status === "submitting"}
                          required
                        />
                        {fieldErrors.email && (
                          <span className="modern-field-error">{fieldErrors.email}</span>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="modern-field-group">
                      <label className="modern-field-label">
                        <span>Subject Line</span>
                        <span className="modern-required-star">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Inquiring about 'Together We Bloom' / Private Viewing"
                        value={subject}
                        onChange={(e) => {
                          setSubject(e.target.value);
                          if (fieldErrors.subject) setFieldErrors((prev) => ({ ...prev, subject: "" }));
                        }}
                        className={`modern-input ${fieldErrors.subject ? "has-error" : ""}`}
                        disabled={status === "submitting"}
                        required
                      />
                      {fieldErrors.subject && (
                        <span className="modern-field-error">{fieldErrors.subject}</span>
                      )}
                    </div>

                    {/* Custom Modern Dropdown */}
                    <ModernSelect
                      label="Enquiry Category"
                      required
                      placeholder="Select enquiry category..."
                      options={ENQUIRY_OPTIONS}
                      value={enquiryType}
                      onChange={(val) => {
                        setEnquiryType(val);
                        if (fieldErrors.enquiryType)
                          setFieldErrors((prev) => ({ ...prev, enquiryType: "" }));
                      }}
                      error={fieldErrors.enquiryType}
                    />

                    {/* Message Area */}
                    <div className="modern-field-group">
                      <div className="flex items-center justify-between">
                        <label className="modern-field-label">
                          <span>Your Message</span>
                          <span className="modern-required-star">*</span>
                        </label>
                        <span className="text-xs text-muted">
                          {message.length} characters
                        </span>
                      </div>
                      <textarea
                        placeholder="Share details about the artwork you are interested in, your custom vision, dimensions, or curatorial timeline..."
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: "" }));
                        }}
                        className={`modern-textarea ${fieldErrors.message ? "has-error" : ""}`}
                        disabled={status === "submitting"}
                        required
                      />
                      {fieldErrors.message && (
                        <span className="modern-field-error">{fieldErrors.message}</span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="modern-submit-btn"
                      >
                        {status === "submitting" ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Dispatching to Binari Gamage…
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send size={15} />
                          </>
                        )}
                      </button>

                      <p className="text-xs text-muted m-0 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                        Delivered directly to Binari.gamage@binaareartgallery.com
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column — Modern Information Cards */}
            <div className="w-full lg:w-5/12 flex flex-col gap-6">
              {/* Card 1: Direct Contact Details */}
              <div className="modern-info-card">
                <div className="modern-info-header">
                  <span className="section-label">Direct Studio Channel</span>
                  <h3 className="modern-info-title">Contact Details</h3>
                </div>

                <div className="modern-contact-list">
                  {/* Email */}
                  <div className="modern-contact-item">
                    <div className="modern-contact-icon-box">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="modern-contact-detail-label">Artist & Curator Email</p>
                      <div className="flex flex-wrap items-center gap-1">
                        <a
                          href="mailto:Binari.gamage@binaareartgallery.com"
                          className="modern-contact-link font-medium"
                        >
                          Binari.gamage@binaareartgallery.com
                        </a>
                        <button
                          type="button"
                          onClick={copyEmailToClipboard}
                          className="modern-copy-btn"
                          title="Copy email address"
                        >
                          {copiedEmail ? (
                            <>
                              <Check size={11} /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={11} /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="modern-contact-item">
                    <div className="modern-contact-icon-box">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="modern-contact-detail-label">Studio Telephone & WhatsApp</p>
                      <a href="tel:+94777214696" className="modern-contact-link font-medium">
                        +94 77 721 4696
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="modern-contact-item">
                    <div className="modern-contact-icon-box">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="modern-contact-detail-label">Studio Location</p>
                      <p className="modern-contact-detail-val">Colombo, Sri Lanka</p>
                      <p className="text-xs text-muted mt-0.5">
                        Private gallery visits scheduled by prior appointment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Studio response badge */}
                <div className="modern-response-badge">
                  <span className="modern-pulse-dot" />
                  <span>Curator Response Time: Within 24–48 Hours</span>
                </div>
              </div>

              {/* Card 2: Collector Services */}
              <div className="modern-info-card">
                <div className="modern-info-header">
                  <span className="section-label">Collector Services</span>
                  <h3 className="modern-info-title">Reach Out For</h3>
                </div>

                <ul className="modern-services-list">
                  {[
                    "Original Artwork Sales & Worldwide Secure Insured Transit",
                    "Bespoke Commissions Tailored to Your Color Palette & Interior",
                    "Physical & Virtual Private Studio Viewings with Binari Gamage",
                    "Certificates of Authenticity & Curatorial Provenance Documents",
                    "Exhibition Inquiries, Retrospectives & Solo Presentations",
                  ].map((service) => (
                    <li key={service} className="modern-service-item">
                      <span className="modern-service-bullet" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 3: Artist Reflection Note */}
              <div className="modern-info-card" style={{ background: "var(--bg-alt)" }}>
                <div className="modern-artist-quote">
                  <p className="modern-quote-text">
                    &ldquo;Art is an intimate experience of emotion, light, and silence. Every conversation
                    begins with an open heart. We look forward to sharing this journey of Colors of Love with you.&rdquo;
                  </p>
                  <p className="modern-quote-author">
                    &mdash; Binari Gamage, Lead Artist &amp; Founder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      <PageSections slug="contact" />
      <Footer />
    </main>
  );
}
