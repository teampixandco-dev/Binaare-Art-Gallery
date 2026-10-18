import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const pdfOutputPath = path.join(rootDir, "Binaare-Art-Gallery-Technical-Specification.pdf");

console.log("Compiling Binaare Art Gallery Technical Specification PDF (11-Page Master Edition with Vector Blueprints)...");

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Binaare Art Gallery - Technical Specification & Architecture Manual</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 14mm 20mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #24211F;
      background: #FFFFFF;
      font-size: 8.4pt;
      line-height: 1.45;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }

    .avoid-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .font-serif {
      font-family: "Georgia", "Times New Roman", serif;
    }

    .font-mono {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-size: 7.6pt;
    }

    /* Cover Page */
    .cover-container {
      height: 255mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 22mm 16mm 16mm 16mm;
      background: linear-gradient(165deg, #FAF8F5 0%, #FFFFFF 45%, #F4EFE6 100%);
      border: 1px solid #EBE5DA;
      border-radius: 2px;
      position: relative;
    }

    .cover-top-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 12px;
      background: #FAF8F5;
      border: 1px solid #8C704F;
      color: #8C704F;
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      width: fit-content;
    }

    .cover-title {
      font-family: "Georgia", serif;
      font-size: 32pt;
      font-weight: normal;
      color: #1A1816;
      line-height: 1.15;
      margin-top: 18mm;
      margin-bottom: 5mm;
      letter-spacing: -0.02em;
    }

    .cover-subtitle {
      font-size: 11pt;
      color: #77716B;
      font-weight: 300;
      line-height: 1.45;
      max-width: 520px;
      margin-bottom: 8mm;
    }

    .cover-gold-rule {
      width: 60px;
      height: 3px;
      background: #8C704F;
      margin-bottom: 10mm;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      padding: 14px;
      background: #FFFFFF;
      border: 1px solid #E2DDD5;
      border-radius: 2px;
    }

    .cover-meta-item label {
      display: block;
      font-size: 6.8pt;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #8C704F;
      font-weight: 700;
      margin-bottom: 2px;
    }

    .cover-meta-item value {
      display: block;
      font-size: 8.8pt;
      color: #24211F;
      font-weight: 600;
    }

    /* Headings */
    h1.section-h1 {
      font-family: "Georgia", serif;
      font-size: 17pt;
      font-weight: normal;
      color: #1A1816;
      border-bottom: 2px solid #8C704F;
      padding-bottom: 4px;
      margin-top: 0;
      margin-bottom: 10px;
      letter-spacing: -0.01em;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }

    h1.section-h1 span.sec-num {
      font-size: 9.5pt;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #8C704F;
      text-transform: uppercase;
    }

    h2.section-h2 {
      font-family: "Georgia", serif;
      font-size: 11.5pt;
      font-weight: normal;
      color: #24211F;
      margin-top: 10px;
      margin-bottom: 5px;
      border-left: 3px solid #8C704F;
      padding-left: 7px;
    }

    h3.section-h3 {
      font-size: 8pt;
      font-weight: 700;
      color: #1A1816;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 8px;
      margin-bottom: 3px;
    }

    p {
      margin-bottom: 6px;
      color: #383431;
    }

    /* Alerts */
    .alert-critical {
      background: #FDF4F4;
      border: 1px solid #D69E9E;
      border-left: 4px solid #740D18;
      padding: 9px 12px;
      margin: 8px 0;
      border-radius: 2px;
    }

    .alert-critical .alert-title {
      font-size: 8.2pt;
      font-weight: 800;
      color: #740D18;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 2px;
    }

    .alert-gold {
      background: #FAF8F5;
      border: 1px solid #E2DDD5;
      border-left: 4px solid #8C704F;
      padding: 9px 12px;
      margin: 8px 0;
      border-radius: 2px;
    }

    .alert-gold .alert-title {
      font-size: 8.2pt;
      font-weight: 800;
      color: #8C704F;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 2px;
    }

    /* Tables */
    table.tech-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 10px 0;
      font-size: 7.6pt;
    }

    thead {
      display: table-header-group;
    }

    tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    table.tech-table th {
      background: #24211F;
      color: #FAF8F5;
      text-align: left;
      padding: 5px 7px;
      font-size: 6.8pt;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
      border: 1px solid #24211F;
    }

    table.tech-table td {
      padding: 4px 7px;
      border: 1px solid #E5E0D8;
      vertical-align: top;
      color: #332F2C;
      line-height: 1.35;
    }

    table.tech-table tr:nth-child(even) td {
      background: #FAF8F5;
    }

    table.tech-table td.strong {
      font-weight: 600;
      color: #1A1816;
    }

    .tag-badge {
      display: inline-block;
      padding: 1.5px 5px;
      font-size: 6.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 2px;
      line-height: 1.2;
    }

    .tag-gold {
      background: #F3ECE1;
      color: #725739;
      border: 1px solid #D9CBBA;
    }

    .tag-dark {
      background: #332F2C;
      color: #FAF8F5;
    }

    .tag-red {
      background: #F8E7E9;
      color: #740D18;
      border: 1px solid #E8B9BD;
    }

    /* Diagram Card */
    .diagram-card {
      background: #FAF8F5;
      border: 1px solid #DFD9CE;
      padding: 10px;
      margin: 8px 0;
      border-radius: 2px;
      break-inside: avoid;
    }

    .diagram-title {
      font-size: 7.8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #8C704F;
      margin-bottom: 6px;
      border-bottom: 1px solid #E8E2D8;
      padding-bottom: 3px;
    }

    /* Code Blocks */
    pre.code-box {
      background: #1F1D1B;
      color: #F0ECE4;
      padding: 8px 11px;
      border-radius: 2px;
      font-family: "SFMono-Regular", Consolas, Menlo, monospace;
      font-size: 7.2pt;
      line-height: 1.38;
      margin: 6px 0;
      white-space: pre-wrap;
      word-break: break-all;
      border-left: 3px solid #8C704F;
      break-inside: avoid;
    }

    .code-box .kw { color: #E5A96A; font-weight: 600; }
    .code-box .str { color: #A8CE93; }
    .code-box .comm { color: #8C877F; font-style: italic; }
    .code-box .fn { color: #72B7FF; }

    /* Specification Grid */
    .spec-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 7px;
      margin: 7px 0;
      break-inside: avoid;
    }

    .spec-item {
      background: #FAF8F5;
      border: 1px solid #E8E2D8;
      padding: 6px 9px;
      border-radius: 2px;
    }

    .spec-item .spec-label {
      font-size: 6.5pt;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #8C704F;
      font-weight: 700;
      margin-bottom: 1px;
    }

    .spec-item .spec-val {
      font-size: 8.4pt;
      font-weight: 700;
      color: #1A1816;
    }

    .spec-item .spec-desc {
      font-size: 7pt;
      color: #77716B;
      margin-top: 1px;
    }

    /* Lists */
    ul.tech-list {
      list-style: none;
      margin: 5px 0;
    }

    ul.tech-list li {
      position: relative;
      padding-left: 14px;
      margin-bottom: 3.5px;
      color: #383431;
      font-size: 8pt;
    }

    ul.tech-list li::before {
      content: "▪";
      position: absolute;
      left: 0;
      color: #8C704F;
      font-size: 9pt;
      line-height: 1;
      top: -1px;
    }
  </style>
</head>
<body>

  <!-- ============================================================ -->
  <!-- PAGE 1: COVER PAGE                                           -->
  <!-- ============================================================ -->
  <div class="cover-container">
    <div>
      <div class="cover-top-badge">Official Architecture &amp; Asset Specification Manual</div>
      <h1 class="cover-title">Binaare Fine Art Gallery</h1>
      <div class="cover-subtitle">Complete Architecture, Page Directory, Image Asset Specifications, Mandatory Node.js Server Runtime &amp; Future Engineering Roadmap</div>
      <div class="cover-gold-rule"></div>
      
      <p style="font-size: 8.8pt; color: #57524E; max-width: 500px; line-height: 1.55;">
        This document serves as the comprehensive engineering and production specification for the Binaare Art Gallery digital platform. It details full technology stack dependencies, complete page architecture, exact dimensional blueprints for artwork components (Selected Works and Product View), server environment requirements (including mandatory Node.js execution), and implementation plans for payment gateways, CMS administration, and email automation.
      </p>
    </div>

    <div class="cover-meta-grid">
      <div class="cover-meta-item">
        <label>Platform &amp; Framework</label>
        <value>Next.js 15.1.0 • React 19 • App Router</value>
      </div>
      <div class="cover-meta-item">
        <label>Mandatory Runtime</label>
        <value>Node.js &gt;= 22.18.0 LTS</value>
      </div>
      <div class="cover-meta-item">
        <label>Document Classification</label>
        <value>Technical Engineering &amp; Operations Manual</value>
      </div>
      <div class="cover-meta-item">
        <label>Release Version</label>
        <value>Version 2.0 (Production Master)</value>
      </div>
      <div class="cover-meta-item">
        <label>Primary Artist / Client</label>
        <value>Binari Gamage (Binaare Art)</value>
      </div>
      <div class="cover-meta-item">
        <label>Image &amp; Database Engine</label>
        <value>Node Native SQLite + Sharp C++ WebP Pipeline</value>
      </div>
    </div>
  </div>

  <!-- ============================================================ -->
  <!-- PAGE 2: EXECUTIVE SUMMARY & TOC                              -->
  <!-- ============================================================ -->
  <div class="page-break"></div>

  <h1 class="section-h1">
    <span>Executive Summary &amp; Table of Contents</span>
    <span class="sec-num">Overview</span>
  </h1>

  <p>
    The <strong>Binaare Art Gallery</strong> website is an online fine art gallery designed to showcase and sell paintings by artist Binari Gamage. The platform combines visual aesthetics—such as smooth 60fps scrolling, responsive layouts, and artwork zoom—with modern software engineering.
  </p>

  <div class="alert-gold">
    <div class="alert-title">Document Purpose &amp; Operational Audience</div>
    <p style="margin-bottom: 0; font-size: 7.8pt;">
      This manual provides engineers, system administrators, content managers, and designers with technical standards for image replacement, server deployment, database persistence, and future e-commerce integration.
    </p>
  </div>

  <table class="tech-table">
    <thead>
      <tr>
        <th style="width: 14%;">Section</th>
        <th style="width: 44%;">Module Title</th>
        <th style="width: 42%;">Core Technical Focus</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="strong">Section 01</td>
        <td class="strong">Full Technology Stack Breakdown</td>
        <td>Next.js 15, React 19, Tailwind v4, Framer Motion, GSAP, Sharp, and SQLite.</td>
      </tr>
      <tr>
        <td class="strong">Section 02</td>
        <td class="strong">Website Structure &amp; All Page Details</td>
        <td>14 distinct routes, layout architectures, data flows, and interactive features.</td>
      </tr>
      <tr>
        <td class="strong">Section 03</td>
        <td class="strong">"Selected Works" Section: Image &amp; Card Sizing</td>
        <td>Card dimensions (width &amp; height), aspect ratio (4:4.5), and replacement guide.</td>
      </tr>
      <tr>
        <td class="strong">Section 04</td>
        <td class="strong">"Product View" Section: Image &amp; Frame Sizing</td>
        <td>Showcase frame dimensions, high-res zoom (1600–2400px), and thumbnail gallery.</td>
      </tr>
      <tr>
        <td class="strong">Section 05</td>
        <td class="strong">Master Asset Dimension Reference Matrix</td>
        <td>Comparative cross-platform sizing table covering every website component.</td>
      </tr>
      <tr>
        <td class="strong">Section 06</td>
        <td class="strong">Future Development: Admin CMS &amp; Payment Gateway</td>
        <td>Enterprise Admin CMS, Yamnet/PayGate Payment Gateway architecture &amp; flows.</td>
      </tr>
      <tr>
        <td class="strong">Section 07</td>
        <td class="strong">Future Development: Transactional Email Service</td>
        <td>Resend/SendGrid/Nodemailer email dispatch, triggers, and receipts.</td>
      </tr>
      <tr>
        <td class="strong">Section 08</td>
        <td class="strong">Server Compatibility: Mandatory Node.js (Part 1)</td>
        <td><strong>Mandatory Node.js runtime</strong>, VPS/PM2/Nginx architecture, and Docker.</td>
      </tr>
      <tr>
        <td class="strong">Section 09</td>
        <td class="strong">Server Compatibility: cPanel, Env Variables &amp; Sign-Off</td>
        <td>cPanel CloudLinux setup, Environment Variables, and Engineering Sign-Off.</td>
      </tr>
    </tbody>
  </table>

  <!-- ============================================================ -->
  <!-- PAGE 3: TECH STACK                                           -->
  <!-- ============================================================ -->
  <div class="page-break"></div>

  <h1 class="section-h1">
    <span>Technology Stack &amp; Dependencies</span>
    <span class="sec-num">Section 01</span>
  </h1>

  <p>
    The web platform is built on an enterprise modern JavaScript/TypeScript stack utilizing Next.js 15 App Router architecture, React 19, and Tailwind CSS v4. The platform leverages both server-rendered and interactive client components to guarantee ultra-fast initial page delivery and zero layout shifts.
  </p>

  <h2 class="section-h2">1. Core Framework &amp; Infrastructure</h2>
  <table class="tech-table">
    <thead>
      <tr>
        <th style="width: 25%;">Technology</th>
        <th style="width: 18%;">Version</th>
        <th style="width: 57%;">Role &amp; Architectural Implementation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="strong">Next.js</td>
        <td><span class="tag-badge tag-dark">15.1.0</span></td>
        <td>Full-stack React framework utilizing App Router architecture, React Server Components (RSC), and dynamic Route Handlers (<span class="font-mono">/api</span> endpoints).</td>
      </tr>
      <tr>
        <td class="strong">Node.js Runtime</td>
        <td><span class="tag-badge tag-red">&gt;= 22.18.0 LTS</span></td>
        <td><strong>Mandatory execution engine.</strong> Provides native built-in <span class="font-mono">node:sqlite</span> database, modern ES modules, and crypto APIs.</td>
      </tr>
      <tr>
        <td class="strong">React &amp; React-DOM</td>
        <td><span class="tag-badge tag-dark">19.0.0</span></td>
        <td>Latest React core with Actions, Transitions, and enhanced Server Component hydration.</td>
      </tr>
      <tr>
        <td class="strong">TypeScript</td>
        <td><span class="tag-badge tag-gold">5.x</span></td>
        <td>Strict compile-time type-safety for models, APIs, and component props.</td>
      </tr>
      <tr>
        <td class="strong">Tailwind CSS</td>
        <td><span class="tag-badge tag-gold">4.0.0</span></td>
        <td>Utility-first styling engine running via <span class="font-mono">@tailwindcss/postcss</span> for sub-millisecond compilation.</td>
      </tr>
      <tr>
        <td class="strong">Database Engine</td>
        <td><span class="tag-badge tag-dark">SQLite / MySQL2</span></td>
        <td>Native Node SQLite (<span class="font-mono">data/gallery.sqlite</span>) for zero-latency local relational storage; <span class="font-mono">mysql2</span> driver included for cloud scale.</td>
      </tr>
      <tr>
        <td class="strong">Image Processor</td>
        <td><span class="tag-badge tag-gold">Sharp 0.34.5</span></td>
        <td>C++ native image transformer. Auto-rotates EXIF orientations, resizes up to 2400px, and converts uploads to high-compression WebP.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="section-h2">2. Animation, Motion &amp; UX Libraries</h2>
  <table class="tech-table">
    <thead>
      <tr>
        <th style="width: 25%;">Library</th>
        <th style="width: 18%;">Version</th>
        <th style="width: 57%;">Purpose &amp; Experience Impact</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="strong">Framer Motion</td>
        <td><span class="tag-badge tag-dark">12.38.0</span></td>
        <td>Orchestrates scroll reveals, card hover transforms, stagger animations, and modal state transitions.</td>
      </tr>
      <tr>
        <td class="strong">GSAP</td>
        <td><span class="tag-badge tag-dark">3.15.0</span></td>
        <td>GreenSock Animation Platform powering hero parallax effects, luxury timing curves, and timeline triggers.</td>
      </tr>
      <tr>
        <td class="strong">Lenis</td>
        <td><span class="tag-badge tag-gold">1.3.23</span></td>
        <td>Smooth inertial scrolling engine eliminating choppy browser scrolling for a fluid art gallery atmosphere.</td>
      </tr>
      <tr>
        <td class="strong">Lucide React</td>
        <td><span class="tag-badge tag-dark">1.14.0</span></td>
        <td>Consistent, lightweight SVG iconography across navigation, filters, product specifications, and cart drawers.</td>
      </tr>
      <tr>
        <td class="strong">Zod</td>
        <td><span class="tag-badge tag-gold">4.4.3</span></td>
        <td>Schema validation for admin forms, artwork uploads, blog payloads, and checkout fields.</td>
      </tr>
      <tr>
        <td class="strong">Playwright</td>
        <td><span class="tag-badge tag-dark">1.63.0</span></td>
        <td>End-to-end integration and backend validation testing on automated headless Chrome instances.</td>
      </tr>
    </tbody>
  </table>

  <!-- ============================================================ -->
  <!-- PAGE 4: PAGES ARCHITECTURE                                   -->
  <!-- ============================================================ -->
  <div class="page-break"></div>

  <h1 class="section-h1">
    <span>Website Structure &amp; Page Details</span>
    <span class="sec-num">Section 02</span>
  </h1>

  <p>
    The Binaare Art Gallery site map encompasses 14 core route endpoints, structured into public art presentation zones, an e-commerce acquisition flow, an editorial art journal, and a protected administrative content studio.
  </p>

  <table class="tech-table">
    <thead>
      <tr>
        <th style="width: 16%;">Route Path</th>
        <th style="width: 22%;">Page Title</th>
        <th style="width: 48%;">Key Features &amp; Layout Components</th>
        <th style="width: 14%;">Data Source</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-mono">/</td>
        <td class="strong">Homepage</td>
        <td>Parallax ambient hero video/fallback, Intro statement, <strong>Selected Works</strong> 4-column card grid, Artist preview, Philosophy quote, Newsletter opt-in.</td>
        <td><span class="tag-badge tag-gold">Hybrid</span></td>
      </tr>
      <tr>
        <td class="font-mono">/shop</td>
        <td class="strong">Fine Art Shop</td>
        <td>Dynamic medium pills (Oil, Watercolor, Mixed Media, Texture, Acrylic), Live search, Sorting engine, Grid/List switcher, Favorites wishlist, Add to Cart.</td>
        <td><span class="tag-badge tag-gold">Live DB</span></td>
      </tr>
      <tr>
        <td class="font-mono">/shop/[slug]</td>
        <td class="strong">Artwork Detail View</td>
        <td>2-column luxury layout: Sticky left artwork showcase with hover zoom &amp; badges, Right column narrative, Medium, Dimensions, Materials, Direct checkout button.</td>
        <td><span class="tag-badge tag-gold">Live DB</span></td>
      </tr>
      <tr>
        <td class="font-mono">/gallery</td>
        <td class="strong">Exhibition Gallery</td>
        <td>3-column masonry grid layout with variable aspect ratios, zoom lightbox, medium filters, curatorial blurbs.</td>
        <td><span class="tag-badge tag-dark">Content</span></td>
      </tr>
      <tr>
        <td class="font-mono">/about</td>
        <td class="strong">About the Artist</td>
        <td>Artist biography (Binari Gamage), Studio photographs, Curatorial philosophy, Exhibition timeline, Press &amp; honors.</td>
        <td><span class="tag-badge tag-dark">Content</span></td>
      </tr>
      <tr>
        <td class="font-mono">/artist</td>
        <td class="strong">Artist Profile</td>
        <td>In-depth aesthetic journey, inspiration, technique deep dive, materials exploration, studio portraits.</td>
        <td><span class="tag-badge tag-dark">Content</span></td>
      </tr>
      <tr>
        <td class="font-mono">/exhibitions</td>
        <td class="strong">Exhibitions</td>
        <td>Curated past and upcoming gallery exhibitions, dates, venues, featured painting collections.</td>
        <td><span class="tag-badge tag-dark">Content</span></td>
      </tr>
      <tr>
        <td class="font-mono">/blog</td>
        <td class="strong">Editorial Journal</td>
        <td>Curated essays, behind-the-canvas reflections, artistic techniques, publication date stamps, featured photography.</td>
        <td><span class="tag-badge tag-gold">Live DB</span></td>
      </tr>
      <tr>
        <td class="font-mono">/blog/[slug]</td>
        <td class="strong">Article Detail</td>
        <td>Long-form editorial reading experience, preserved linebreaks, embedded photo gallery, author bio.</td>
        <td><span class="tag-badge tag-gold">Live DB</span></td>
      </tr>
      <tr>
        <td class="font-mono">/cart</td>
        <td class="strong">Shopping Cart</td>
        <td>Interactive acquisition drawer &amp; full page: Item list, quantity adjustments, removal, subtotal calculation, checkout link.</td>
        <td><span class="tag-badge tag-dark">Client State</span></td>
      </tr>
      <tr>
        <td class="font-mono">/checkout</td>
        <td class="strong">Acquisition Checkout</td>
        <td>Shipping address capture, client details, order summary review, payment initiation interface.</td>
        <td><span class="tag-badge tag-dark">Cart Context</span></td>
      </tr>
      <tr>
        <td class="font-mono">/contact</td>
        <td class="strong">Private Inquiries</td>
        <td>Artwork acquisition form, private studio viewing requests, bespoke commission inquiries, studio contact info.</td>
        <td><span class="tag-badge tag-dark">Form API</span></td>
      </tr>
      <tr>
        <td class="font-mono">/pages/[slug]</td>
        <td class="strong">Dynamic Pages</td>
        <td>Custom landing pages created dynamically through the admin studio, including custom sections and images.</td>
        <td><span class="tag-badge tag-gold">Live DB</span></td>
      </tr>
      <tr>
        <td class="font-mono">/admin</td>
        <td class="strong">Content Studio</td>
        <td>Authenticated back-office CMS: Artwork manager, Blog publisher, Page section customizer, Media library with Sharp uploads.</td>
        <td><span class="tag-badge tag-red">Secure Auth</span></td>
      </tr>
    </tbody>
  </table>

  <!-- ============================================================ -->
  <!-- PAGE 5: SELECTED WORKS (IMAGE & CARD SIZING)                 -->
  <!-- ============================================================ -->
  <div class="page-break"></div>

  <h1 class="section-h1">
    <span>"Selected Works" Section: Image &amp; Card Sizing</span>
    <span class="sec-num">Section 03</span>
  </h1>

  <p>
    The <strong>Selected Works</strong> section is positioned on the homepage (<span class="font-mono">/</span>, defined in <span class="font-mono">src/app/page.tsx</span> lines 301–370). It features 4 high-priority original paintings in an editorial card layout.
  </p>

  <h2 class="section-h2">1. Visual Dimensional Blueprint (Width &amp; Height Specifications)</h2>
  
  <div class="diagram-card">
    <div class="diagram-title">Dimensional Blueprint: Selected Works Artwork Card</div>
    
    <div style="display: grid; grid-template-columns: 1.05fr 1fr; gap: 12px; align-items: stretch;">
      <!-- Vector Blueprint SVG on the Left -->
      <div style="background: #FFFFFF; border: 1px solid #EBE5DA; border-radius: 2px; padding: 12px; display: flex; justify-content: center; align-items: center;">
        <svg viewBox="0 0 380 340" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">
          <!-- Width Dimension Top -->
          <line x1="50" y1="18" x2="330" y2="18" stroke="#8C704F" stroke-width="1.2" />
          <line x1="50" y1="13" x2="50" y2="23" stroke="#8C704F" stroke-width="1.2" />
          <line x1="330" y1="13" x2="330" y2="23" stroke="#8C704F" stroke-width="1.2" />
          <text x="190" y="14" font-family="-apple-system, sans-serif" font-size="9" text-anchor="middle" fill="#8C704F" font-weight="700">Card Width: 280px – 320px (Desktop)</text>

          <!-- Outer Card Box -->
          <rect x="50" y="28" width="280" height="295" rx="2" fill="#FFFFFF" stroke="#EBE5DA" stroke-width="1.5" />
          <text x="62" y="44" font-family="-apple-system, sans-serif" font-size="7.5" font-weight="700" fill="#8C704F" letter-spacing="0.08em">CARD (bg-white, border #EBE5DA)</text>

          <!-- Inner Image Container -->
          <rect x="66" y="54" width="248" height="150" rx="2" fill="#FAF8F5" stroke="#E2DDD5" stroke-width="1" />
          <text x="74" y="68" font-family="-apple-system, sans-serif" font-size="7" font-weight="600" fill="#77716B">IMAGE CONTAINER (aspect-[4/4.5], p-3)</text>

          <!-- Artwork Canvas -->
          <rect x="80" y="76" width="220" height="114" fill="#EDE7DD" stroke="#8C704F" stroke-width="1.2" stroke-dasharray="3,3" />
          <text x="190" y="132" font-family="Georgia, serif" font-size="11" text-anchor="middle" fill="#8C704F" font-weight="600">Artwork Image (object-cover)</text>
          <text x="190" y="146" font-family="-apple-system, sans-serif" font-size="7" text-anchor="middle" fill="#77716B">fill • hover:scale-105</text>

          <!-- Title & Medium -->
          <line x1="170" y1="218" x2="210" y2="218" stroke="#B78646" stroke-width="1.5" />
          <text x="190" y="234" font-family="Georgia, serif" font-size="11" text-anchor="middle" fill="#24211F" font-weight="600">The Crimson Queen</text>
          <text x="190" y="248" font-family="-apple-system, sans-serif" font-size="7" text-anchor="middle" fill="#77716B" font-weight="600" letter-spacing="0.1em">ACRYLIC ON CANVAS • 2024</text>

          <!-- Circle Action Button -->
          <circle cx="190" cy="280" r="13" fill="none" stroke="#B78646" stroke-width="1.2" />
          <path d="M186 280 L194 280 M191 276 L195 280 L191 284" stroke="#B78646" stroke-width="1.2" fill="none" />

          <!-- Height Dimension Line Right -->
          <line x1="345" y1="28" x2="345" y2="323" stroke="#8C704F" stroke-width="1.2" />
          <line x1="340" y1="28" x2="350" y2="28" stroke="#8C704F" stroke-width="1.2" />
          <line x1="340" y1="323" x2="350" y2="323" stroke="#8C704F" stroke-width="1.2" />
          <text x="356" y="180" font-family="-apple-system, sans-serif" font-size="8.5" fill="#8C704F" font-weight="700">Height: ~440px – 480px</text>
        </svg>
      </div>

      <!-- HTML Specifications on the Right -->
      <div style="display: flex; flex-direction: column; gap: 7px; justify-content: space-between;">
        <div style="background: #FFFFFF; border: 1px solid #E2DDD5; padding: 7px 10px; border-radius: 2px;">
          <div style="font-size: 6.8pt; font-weight: 700; color: #8C704F; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px;">TARGET ASPECT RATIO</div>
          <div style="font-size: 13pt; font-family: 'Georgia', serif; font-weight: bold; color: #1A1816; line-height: 1.1;">4 : 4.5 <span style="font-size: 8.5pt; font-weight: normal; color: #77716B;">(Approx 8 : 9)</span></div>
          <div style="font-size: 7.2pt; color: #57524E; margin-top: 2px;">Height is 1.125× of Width. Preserves vertical elegance.</div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #E2DDD5; padding: 7px 10px; border-radius: 2px;">
          <div style="font-size: 6.8pt; font-weight: 700; color: #8C704F; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px;">RECOMMENDED UPLOAD SIZE</div>
          <div style="font-size: 12pt; font-family: 'Georgia', serif; font-weight: bold; color: #1A1816; line-height: 1.1;">1200 × 1350 px <span style="font-size: 8pt; color: #8C704F;">(2× Retina)</span></div>
          <div style="font-size: 7.2pt; color: #57524E; margin-top: 2px;">Standard minimum acceptable: 800 × 900 px.</div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #E2DDD5; padding: 7px 10px; border-radius: 2px;">
          <div style="font-size: 6.8pt; font-weight: 700; color: #8C704F; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px;">RESPONSIVE BREAKPOINTS</div>
          <div style="font-size: 8pt; font-weight: 600; color: #24211F;">Desktop: 4 Cols • Tablet: 2 Cols • Mobile: 1 Col</div>
          <div style="font-size: 7.2pt; color: #57524E; margin-top: 2px;">Card scales fluidly from 280px up to 420px max on mobile.</div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #E2DDD5; padding: 7px 10px; border-radius: 2px;">
          <div style="font-size: 6.8pt; font-weight: 700; color: #8C704F; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px;">FORMAT &amp; SHARP PIPELINE</div>
          <div style="font-size: 8pt; font-weight: 600; color: #24211F;">WebP (Primary), Progressive JPG, PNG</div>
          <div style="font-size: 7.2pt; color: #57524E; margin-top: 2px;">Max 10 MB. Auto-compressed &amp; normalized by Sharp.</div>
        </div>
      </div>
    </div>
  </div>

  <h2 class="section-h2">2. Exact Specifications &amp; Step-by-Step Replacement</h2>

  <div class="spec-grid">
    <div class="spec-item">
      <div class="spec-label">Card Display Dimensions</div>
      <div class="spec-val">Width: 280–320px | Height: 440–480px</div>
      <div class="spec-desc">Desktop 4-column layout; scales to 100% width (up to 420px) on mobile.</div>
    </div>
    <div class="spec-item">
      <div class="spec-label">Image Box Aspect Ratio</div>
      <div class="spec-val">aspect-[4/4.5] (8 : 9 Ratio)</div>
      <div class="spec-desc">CSS rule: <span class="font-mono">aspect-[4/4.5] bg-[#FAF8F5] p-3</span>.</div>
    </div>
    <div class="spec-item">
      <div class="spec-label">Recommended Upload Resolution</div>
      <div class="spec-val">1200 px (Width) × 1350 px (Height)</div>
      <div class="spec-desc">High-DPI 2x density. Minimum acceptable: 800 × 900 px.</div>
    </div>
    <div class="spec-item">
      <div class="spec-label">Supported Formats &amp; Max Size</div>
      <div class="spec-val">WebP, Progressive JPG, PNG (Max 10 MB)</div>
      <div class="spec-desc">Converted automatically to optimized WebP by the Sharp engine.</div>
    </div>
  </div>

  <h3 class="section-h3">How to Replace Selected Works Images</h3>
  <ul class="tech-list">
    <li><strong>Method A (via Admin Studio at <span class="font-mono">/admin</span> — Recommended):</strong> Log in to <span class="font-mono">/admin</span> &rarr; Click <em>Pages &amp; Sections</em> &rarr; Select <em>Home Page</em> &rarr; Find <em>Featured Collection / Selected Works</em> &rarr; Upload or select new painting from Media Library &rarr; Click <em>Save Changes</em>. Live immediately.</li>
    <li><strong>Method B (via Codebase Asset File):</strong> Save optimized image to <span class="font-mono">public/artworks/[artwork-slug].webp</span>. Update reference in <span class="font-mono">src/data/products.ts</span> or update the SQLite database seeded in <span class="font-mono">data/gallery.sqlite</span>.</li>
  </ul>

  <!-- ============================================================ -->
  <!-- PAGE 6: PRODUCT VIEW (IMAGE & FRAME SIZING)                  -->
  <!-- ============================================================ -->
  <div class="page-break"></div>

  <h1 class="section-h1">
    <span>"Product View" Section: Image &amp; Frame Sizing</span>
    <span class="sec-num">Section 04</span>
  </h1>

  <p>
    The <strong>Product View</strong> (Artwork Detail Page, located at <span class="font-mono">/shop/[slug]</span>, rendered by <span class="font-mono">ProductDetailView.tsx</span> and <span class="font-mono">ProductImages.tsx</span>) provides an art acquisition experience. The left column displays the artwork in a presentation frame with hover zoom, while the right column details the narrative, dimensions, and purchase controls.
  </p>

  <h2 class="section-h2">1. Visual Dimensional Blueprint (Width &amp; Height Specifications)</h2>

  <div class="diagram-card">
    <div class="diagram-title">Dimensional Blueprint: Product Detail Showcase Frame &amp; Zoom</div>

    <div style="display: grid; grid-template-columns: 1.05fr 1fr; gap: 12px; align-items: stretch;">
      <!-- Vector Blueprint SVG on Left -->
      <div style="background: #FFFFFF; border: 1px solid #EBE5DA; border-radius: 2px; padding: 12px; display: flex; justify-content: center; align-items: center;">
        <svg viewBox="0 0 380 340" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">
          <!-- Width Dimension Top -->
          <line x1="50" y1="18" x2="330" y2="18" stroke="#8C704F" stroke-width="1.2" />
          <line x1="50" y1="13" x2="50" y2="23" stroke="#8C704F" stroke-width="1.2" />
          <line x1="330" y1="13" x2="330" y2="23" stroke="#8C704F" stroke-width="1.2" />
          <text x="190" y="14" font-family="-apple-system, sans-serif" font-size="9" text-anchor="middle" fill="#8C704F" font-weight="700">Frame Width: 580px – 640px (Desktop)</text>

          <!-- Showcase Frame Box -->
          <rect x="50" y="28" width="280" height="250" rx="2" fill="#FFFFFF" stroke="#EBE5DA" stroke-width="1.5" />
          <text x="62" y="44" font-family="-apple-system, sans-serif" font-size="7.5" font-weight="700" fill="#8C704F" letter-spacing="0.08em">SHOWCASE FRAME (aspect-square / 4:5)</text>

          <!-- Matting Border Padding (p-4 to p-8) -->
          <rect x="66" y="52" width="248" height="210" rx="2" fill="#FAF8F5" stroke="#E2DDD5" stroke-width="1" />
          <text x="74" y="65" font-family="-apple-system, sans-serif" font-size="7" fill="#77716B" font-weight="600">MUSEUM MATTING (Padding 16px – 32px)</text>

          <!-- Artwork Canvas inside Matting -->
          <rect x="85" y="74" width="210" height="170" fill="#EDE7DD" stroke="#8C704F" stroke-width="1.2" />
          <text x="190" y="152" font-family="Georgia, serif" font-size="11" text-anchor="middle" fill="#8C704F" font-weight="600">Artwork Canvas (object-contain)</text>
          <text x="190" y="166" font-family="-apple-system, sans-serif" font-size="7" text-anchor="middle" fill="#57524E">Zero Cropping • Full Proportions Preserved</text>

          <!-- 2x Zoom Magnifier Lens -->
          <circle cx="235" cy="118" r="22" fill="none" stroke="#740D18" stroke-width="1.5" stroke-dasharray="3,2" />
          <text x="235" y="121" font-family="-apple-system, sans-serif" font-size="6.5" text-anchor="middle" fill="#740D18" font-weight="700">2× ZOOM</text>

          <!-- Height Dimension Line Right -->
          <line x1="345" y1="28" x2="345" y2="278" stroke="#8C704F" stroke-width="1.2" />
          <line x1="340" y1="28" x2="350" y2="28" stroke="#8C704F" stroke-width="1.2" />
          <line x1="340" y1="278" x2="350" y2="278" stroke="#8C704F" stroke-width="1.2" />
          <text x="356" y="158" font-family="-apple-system, sans-serif" font-size="8.5" fill="#8C704F" font-weight="700">Height: ~580px – 640px</text>

          <!-- Thumbnail Row Below -->
          <rect x="50" y="290" width="30" height="30" rx="1" fill="#FAF8F5" stroke="#8C704F" stroke-width="1.5" />
          <text x="65" y="308" font-family="-apple-system, sans-serif" font-size="6" text-anchor="middle" fill="#8C704F" font-weight="700">80×80</text>

          <rect x="88" y="290" width="30" height="30" rx="1" fill="#FAF8F5" stroke="#E2DDD5" />
          <text x="103" y="308" font-family="-apple-system, sans-serif" font-size="6" text-anchor="middle" fill="#77716B">VIEW 2</text>

          <rect x="126" y="290" width="30" height="30" rx="1" fill="#FAF8F5" stroke="#E2DDD5" />
          <text x="141" y="308" font-family="-apple-system, sans-serif" font-size="6" text-anchor="middle" fill="#77716B">VIEW 3</text>

          <text x="168" y="309" font-family="-apple-system, sans-serif" font-size="7.5" fill="#77716B">Thumbnail Gallery (80 × 80 px square items)</text>
        </svg>
      </div>

      <!-- HTML Specifications on the Right -->
      <div style="display: flex; flex-direction: column; gap: 7px; justify-content: space-between;">
        <div style="background: #FFFFFF; border: 1px solid #E2DDD5; padding: 7px 10px; border-radius: 2px;">
          <div style="font-size: 6.8pt; font-weight: 700; color: #8C704F; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px;">TARGET ASPECT RATIO</div>
          <div style="font-size: 13pt; font-family: 'Georgia', serif; font-weight: bold; color: #1A1816; line-height: 1.1;">1 : 1 or 4 : 5 <span style="font-size: 8.5pt; font-weight: normal; color: #77716B;">(Adaptive)</span></div>
          <div style="font-size: 7.2pt; color: #57524E; margin-top: 2px;">Square showcase box or tall canvas portrait format.</div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #E2DDD5; padding: 7px 10px; border-radius: 2px;">
          <div style="font-size: 6.8pt; font-weight: 700; color: #8C704F; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px;">RECOMMENDED MASTER IMAGE SIZE</div>
          <div style="font-size: 12pt; font-family: 'Georgia', serif; font-weight: bold; color: #1A1816; line-height: 1.1;">1600 × 1600 up to 2400 × 2400 px</div>
          <div style="font-size: 7.2pt; color: #57524E; margin-top: 2px;">Provides crystal clarity during interactive 2× magnifier zoom.</div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #E2DDD5; padding: 7px 10px; border-radius: 2px;">
          <div style="font-size: 6.8pt; font-weight: 700; color: #8C704F; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px;">PRESENTATION PHYSICS</div>
          <div style="font-size: 8pt; font-weight: 600; color: #24211F;">object-contain with Museum Matting</div>
          <div style="font-size: 7.2pt; color: #57524E; margin-top: 2px;">Original canvas proportions are never cropped or stretched.</div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #E2DDD5; padding: 7px 10px; border-radius: 2px;">
          <div style="font-size: 6.8pt; font-weight: 700; color: #8C704F; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px;">THUMBNAIL GALLERY SPECS</div>
          <div style="font-size: 8pt; font-weight: 600; color: #24211F;">80 × 80 px (1:1 Square) • 2px Gold Active Border</div>
          <div style="font-size: 7.2pt; color: #57524E; margin-top: 2px;">Supports: Cover, Heavy Texture Angle, Room Preview, Signature.</div>
        </div>
      </div>
    </div>
  </div>

  <h2 class="section-h2">2. Exact Frame Specifications &amp; Image Replacement Guide</h2>

  <div class="spec-grid">
    <div class="spec-item">
      <div class="spec-label">Showcase Frame Dimensions</div>
      <div class="spec-val">Width: 580–640px | Height: 580–640px</div>
      <div class="spec-desc">Sticky left column (<span class="font-mono">w-full lg:w-[48%]</span>); 100% width on tablet/mobile.</div>
    </div>
    <div class="spec-item">
      <div class="spec-label">Image Rendering Mode</div>
      <div class="spec-val">object-contain with Museum Matting</div>
      <div class="spec-desc">Paintings retain their exact organic canvas aspect ratio (never stretched or cropped).</div>
    </div>
    <div class="spec-item">
      <div class="spec-label">Recommended Master Image Resolution</div>
      <div class="spec-val">1600 × 1600 px to 2400 × 2400 px</div>
      <div class="spec-desc">Required to maintain high clarity during interactive hover zoom (<span class="font-mono">scale(2)</span>).</div>
    </div>
    <div class="spec-item">
      <div class="spec-label">Thumbnail Gallery Dimensions</div>
      <div class="spec-val">80 px × 80 px (Square 1:1)</div>
      <div class="spec-desc">Container: <span class="font-mono">80px x 80px</span>, <span class="font-mono">object-fit: cover</span>.</div>
    </div>
  </div>

  <h3 class="section-h3">How to Add &amp; Replace Product Images</h3>
  <ul class="tech-list">
    <li><strong>Primary Photo (Cover View):</strong> Uploaded as the first image in the product's image array. Displays as the default showcase painting and the catalog thumbnail.</li>
    <li><strong>Multiple High-Res Gallery Views:</strong> Administrators can upload up to 5 additional photographs per artwork (e.g. angle view, heavy texture close-up, room preview, artist signature).</li>
    <li><strong>Auto-Optimization:</strong> The backend Sharp pipeline accepts JPG, PNG, WebP, or AVIF up to 10 MB and 40 megapixels, automatically compressing it to WebP at a max dimension of 2400px.</li>
  </ul>

  <!-- ============================================================ -->
  <!-- PAGE 7: MASTER ASSET MATRIX                                  -->
  <!-- ============================================================ -->
  <div class="page-break"></div>

  <h1 class="section-h1">
    <span>Master Asset Dimension Reference Matrix</span>
    <span class="sec-num">Section 05</span>
  </h1>

  <p>
    To ensure consistent visual quality across the entire gallery website, all media assets must adhere to the following target dimensions, aspect ratios, and format standards.
  </p>

  <table class="tech-table">
    <thead>
      <tr>
        <th style="width: 22%;">Section / Component</th>
        <th style="width: 14%;">Card / Frame Size</th>
        <th style="width: 14%;">Aspect Ratio</th>
        <th style="width: 22%;">Recommended Image Size</th>
        <th style="width: 14%;">Object Fit</th>
        <th style="width: 14%;">Format</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="strong">Selected Works (Home)<br><span class="font-mono" style="font-size: 6.8pt; color: #8C704F;">src/app/page.tsx</span></td>
        <td>280 × 460 px<br><span style="font-size: 6.8pt; color: #77716B;">(Desktop col)</span></td>
        <td><span class="tag-badge tag-gold">4 : 4.5</span><br>(8:9 ratio)</td>
        <td><strong>1200 × 1350 px</strong><br><span style="font-size: 6.8pt; color: #77716B;">(Min: 800×900px)</span></td>
        <td><span class="font-mono">object-cover</span></td>
        <td>WebP / JPG</td>
      </tr>
      <tr>
        <td class="strong">Product View (Detail)<br><span class="font-mono" style="font-size: 6.8pt; color: #8C704F;">ProductDetailView.tsx</span></td>
        <td>580 × 580 px<br><span style="font-size: 6.8pt; color: #77716B;">(Desktop 48% col)</span></td>
        <td><span class="tag-badge tag-gold">1 : 1</span> or <span class="tag-badge tag-gold">4 : 5</span><br>(Square / Port)</td>
        <td><strong>1600 × 1600 px</strong><br><span style="font-size: 6.8pt; color: #77716B;">(Up to 2400×2400px)</span></td>
        <td><span class="font-mono">object-contain</span></td>
        <td>WebP (High-Res)</td>
      </tr>
      <tr>
        <td class="strong">Product Thumbnails<br><span class="font-mono" style="font-size: 6.8pt; color: #8C704F;">ProductImages.tsx</span></td>
        <td>80 × 80 px<br><span style="font-size: 6.8pt; color: #77716B;">(Fixed square)</span></td>
        <td><span class="tag-badge tag-dark">1 : 1</span><br>(Square)</td>
        <td><strong>160 × 160 px</strong><br><span style="font-size: 6.8pt; color: #77716B;">(Auto-scaled)</span></td>
        <td><span class="font-mono">object-cover</span></td>
        <td>WebP</td>
      </tr>
      <tr>
        <td class="strong">Shop Catalog Card<br><span class="font-mono" style="font-size: 6.8pt; color: #8C704F;">src/app/shop/page.tsx</span></td>
        <td>280 × 420 px<br><span style="font-size: 6.8pt; color: #77716B;">(4-col grid)</span></td>
        <td><span class="tag-badge tag-gold">4 : 3</span><br>(Landscape)</td>
        <td><strong>1200 × 900 px</strong><br><span style="font-size: 6.8pt; color: #77716B;">(Min: 800×600px)</span></td>
        <td><span class="font-mono">object-cover</span></td>
        <td>WebP / JPG</td>
      </tr>
      <tr>
        <td class="strong">Masonry Gallery Grid<br><span class="font-mono" style="font-size: 6.8pt; color: #8C704F;">src/app/gallery/page.tsx</span></td>
        <td>Dynamic col<br><span style="font-size: 6.8pt; color: #77716B;">(3-col masonry)</span></td>
        <td><span class="tag-badge tag-dark">Variable</span><br>(Original ratio)</td>
        <td><strong>1440 × 1440 px</strong><br><span style="font-size: 6.8pt; color: #77716B;">(Adaptive height)</span></td>
        <td><span class="font-mono">aspect-auto</span></td>
        <td>WebP</td>
      </tr>
      <tr>
        <td class="strong">Hero Ambient Visual<br><span class="font-mono" style="font-size: 6.8pt; color: #8C704F;">SeamlessHeroVideo.tsx</span></td>
        <td>100vw × 100vh<br><span style="font-size: 6.8pt; color: #77716B;">(Full viewport)</span></td>
        <td><span class="tag-badge tag-dark">16 : 9</span><br>(Widescreen)</td>
        <td><strong>1920 × 1080 px</strong><br><span style="font-size: 6.8pt; color: #77716B;">(Video MP4 &amp; Poster)</span></td>
        <td><span class="font-mono">object-cover</span></td>
        <td>MP4 / WebP</td>
      </tr>
      <tr>
        <td class="strong">Artist Portrait / Bio<br><span class="font-mono" style="font-size: 6.8pt; color: #8C704F;">src/app/about/page.tsx</span></td>
        <td>420 × 630 px<br><span style="font-size: 6.8pt; color: #77716B;">(Editorial col)</span></td>
        <td><span class="tag-badge tag-gold">2 : 3</span><br>(Vertical port)</td>
        <td><strong>1600 × 2400 px</strong><br><span style="font-size: 6.8pt; color: #77716B;">(Studio quality)</span></td>
        <td><span class="font-mono">object-cover</span></td>
        <td>WebP / JPG</td>
      </tr>
      <tr>
        <td class="strong">Blog Editorial Covers<br><span class="font-mono" style="font-size: 6.8pt; color: #8C704F;">src/app/blog/page.tsx</span></td>
        <td>360 × 240 px<br><span style="font-size: 6.8pt; color: #77716B;">(Article card)</span></td>
        <td><span class="tag-badge tag-dark">16 : 10</span><br>(Editorial)</td>
        <td><strong>1280 × 800 px</strong><br><span style="font-size: 6.8pt; color: #77716B;">(Min: 960×600px)</span></td>
        <td><span class="font-mono">object-cover</span></td>
        <td>WebP / JPG</td>
      </tr>
    </tbody>
  </table>

  <!-- ============================================================ -->
  <!-- PAGE 8: FUTURE DEV - PART 1: ADMIN CMS & PAYMENT GATEWAY     -->
  <!-- ============================================================ -->
  <div class="page-break"></div>

  <h1 class="section-h1">
    <span>Future Development: Admin CMS &amp; Payment Gateway</span>
    <span class="sec-num">Section 06</span>
  </h1>

  <p>
    To transform the current platform into a full-scale commercial art enterprise, three critical modules have been architected: an Enterprise Admin Panel, a secure Payment Gateway (Yamnet / International / Local), and an automated Transactional Email Service.
  </p>

  <h2 class="section-h2">1. Enterprise Admin Panel CMS Evolution</h2>
  <ul class="tech-list">
    <li><strong>Multi-User Role-Based Access Control (RBAC):</strong> Granular permissions separating Super Admin (financials, payments), Curator (artworks, exhibitions, pricing), and Editor (blog, stories).</li>
    <li><strong>Artwork Inventory &amp; Provenance Tracking:</strong> Management of status states: <em>Available</em>, <em>Reserved</em>, <em>Acquired / Private Collection</em>, or <em>On Exhibition</em>. Automatic certificate issuance tracking.</li>
    <li><strong>Automated Certificate of Authenticity (CoA) Generator:</strong> Server-side PDF generation producing signed, numbered, digital certificates containing high-res artwork thumbnails and artist signature upon purchase.</li>
    <li><strong>Customer &amp; Inquiry CRM:</strong> Dedicated inbox dashboard for VIP viewing requests, private commission inquiries, and newsletter subscriber exports.</li>
  </ul>

  <h2 class="section-h2">2. Payment Gateway Integration (Yamnet / Gateway Engine)</h2>
  <p>
    The cart currently functions via client-side state. The next release connects the checkout flow to a secure payment gateway (Yamnet, PayGate, PayHere, or Stripe) using server-side Next.js route handlers.
  </p>

  <div class="diagram-card">
    <div class="diagram-title">Architecture: Payment Gateway Transaction Flow</div>
    <pre class="code-box">
<span class="comm">// Step 1: Customer submits checkout form on /checkout</span>
[Client Browser] &rarr; <span class="kw">POST</span> <span class="str">/api/checkout/create-order</span>
  &bull; Validates items, prices, shipping address against backend SQLite/MySQL DB
  &bull; Generates unique order ID (e.g. BAG-2026-0849) with status: <span class="str">"PENDING_PAYMENT"</span>

<span class="comm">// Step 2: Server initiates gateway session with Yamnet / PayGate API</span>
[Next.js Server] &rarr; <span class="kw">POST</span> <span class="str">https://gateway.yamnet.com/v1/checkout/session</span>
  &bull; Headers: Authorization Bearer &lt;SECRET_API_KEY&gt;
  &bull; Payload: { order_id, amount, currency: "USD", return_url, webhook_url }
  &larr; Returns: { checkout_token, redirect_url }

<span class="comm">// Step 3: Redirect customer to secure hosted payment page</span>
[Client Browser] &rarr; Redirects to Gateway Hosted Payment Page (PCI-DSS Level 1)

<span class="comm">// Step 4: Webhook Listener validates payment asynchronously</span>
[Yamnet Gateway] &rarr; <span class="kw">POST</span> <span class="str">/api/webhooks/payment</span> (To Binaare Server)
  &bull; Server verifies cryptographic HMAC-SHA256 signature
  &bull; Updates order status to <span class="str">"PAID"</span>
  &bull; Decrements artwork inventory (marks painting as Sold)
  &bull; Dispatches customer receipt &amp; admin order alert via Transactional Email
    </pre>
  </div>

  <!-- ============================================================ -->
  <!-- PAGE 9: FUTURE DEV - PART 2: EMAIL INTEGRATION               -->
  <!-- ============================================================ -->
  <div class="page-break"></div>

  <h1 class="section-h1">
    <span>Future Development: Transactional Email Service</span>
    <span class="sec-num">Section 07</span>
  </h1>

  <p>
    An integrated email dispatch pipeline (utilizing <strong>Resend</strong>, <strong>SendGrid</strong>, or <strong>Nodemailer</strong> with SMTP) handles critical communications:
  </p>

  <table class="tech-table">
    <thead>
      <tr>
        <th style="width: 25%;">Event Trigger</th>
        <th style="width: 32%;">Recipient &amp; Template</th>
        <th style="width: 43%;">Payload Content &amp; Attachments</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="strong">Order Completed (Paid)</td>
        <td>Customer &bull; Luxury Receipt Template</td>
        <td>Order summary, shipping address, tax breakdown, downloadable Certificate of Authenticity PDF.</td>
      </tr>
      <tr>
        <td class="strong">New Acquisition Alert</td>
        <td>Gallery Director / Artist &bull; Alert</td>
        <td>Collector name, phone, email, purchased artwork title, total amount, shipping tracking prompt.</td>
      </tr>
      <tr>
        <td class="strong">Private Viewing Request</td>
        <td>Artist (Binari Gamage) &bull; VIP Lead</td>
        <td>Prospective collector details, desired artwork, preferred date/time, custom message.</td>
      </tr>
      <tr>
        <td class="strong">Newsletter Subscription</td>
        <td>Subscriber &bull; Welcome Letter</td>
        <td>Curated welcome note from the artist, invitation to upcoming private gallery viewings.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="section-h2">Email Dispatch Integration Code Example</h2>
  <pre class="code-box">
<span class="comm">// src/lib/email.ts — Transactional Email Service with Resend / Nodemailer</span>
<span class="kw">import</span> { Resend } <span class="kw">from</span> <span class="str">'resend'</span>;

<span class="kw">const</span> resend = <span class="kw">new</span> Resend(process.env.RESEND_API_KEY);

<span class="kw">export async function</span> <span class="fn">sendOrderConfirmationEmail</span>(order: {
  id: <span class="str">string</span>;
  customerName: <span class="str">string</span>;
  customerEmail: <span class="str">string</span>;
  artworkTitle: <span class="str">string</span>;
  amount: <span class="str">number</span>;
  pdfCertificateUrl: <span class="str">string</span>;
}) {
  <span class="kw">return await</span> resend.emails.send({
    from: <span class="str">'Binaare Fine Art &lt;acquisitions@binaareart.com&gt;'</span>,
    to: order.customerEmail,
    subject: <span class="str">\`Acquisition Confirmed: \${order.artworkTitle} — Binaare Art Gallery\`</span>,
    html: <span class="str">\`&lt;div style="font-family: Georgia, serif; color: #24211F;"&gt;
      &lt;h1 style="color: #8C704F;"&gt;Thank you for your acquisition, \${order.customerName}.&lt;/h1&gt;
      &lt;p&gt;We have received your payment for &lt;strong&gt;\${order.artworkTitle}&lt;/strong&gt;.&lt;/p&gt;
      &lt;p&gt;Your hand-signed Certificate of Authenticity is attached.&lt;/p&gt;
    &lt;/div&gt;\`</span>,
  });
}
  </pre>

  <!-- ============================================================ -->
  <!-- PAGE 10: SERVER COMPATIBILITY (MANDATORY NODE.JS - PART 1)   -->
  <!-- ============================================================ -->
  <div class="page-break"></div>

  <h1 class="section-h1">
    <span>Server Compatibility: Mandatory Node.js Requirement</span>
    <span class="sec-num">Section 08</span>
  </h1>

  <div class="alert-critical">
    <div class="alert-title">&#x26A0; CRITICAL SYSTEM REQUIREMENT: SERVER MUST RUN NODE.JS</div>
    <p style="margin-bottom: 0; font-size: 8.2pt;">
      <strong>The server MUST run Node.js (Version &gt;= 22.18.0 LTS).</strong> Standard cheap shared web hosting running Apache/PHP alone <strong>CANNOT</strong> run this dynamic platform. The Next.js 15 App Router backend, the native SQLite storage (<span class="font-mono">node:sqlite</span>), the authenticated Admin Studio, dynamic Sharp image processing, and payment webhooks require a live Node.js application process.
    </p>
  </div>

  <h2 class="section-h2">1. Technical Root Cause: Why Node.js is Required</h2>
  <ul class="tech-list">
    <li><strong>Native Node.js SQLite API (<span class="font-mono">node:sqlite</span>):</strong> The content storage engine directly binds to Node's built-in SQLite module introduced in Node 22.18.0. Traditional PHP environments do not execute this.</li>
    <li><strong>Next.js Dynamic Route Handlers:</strong> APIs at <span class="font-mono">/api/admin</span>, <span class="font-mono">/media/[filename]</span>, and future payment webhooks are compiled as Node.js HTTP request handlers.</li>
    <li><strong>C++ Sharp Image Pipeline:</strong> Image uploads are transcoded on-the-fly using Sharp's compiled native Node.js binaries.</li>
    <li><strong>Encrypted Session Cookies &amp; Auth:</strong> Admin sessions, password verification with salted SHA-256 hashes, and CSRF protection execute inside the Node.js server lifecycle.</li>
  </ul>

  <h2 class="section-h2">2. Minimum Server Hardware &amp; OS Specifications</h2>
  <div class="spec-grid">
    <div class="spec-item">
      <div class="spec-label">Operating System</div>
      <div class="spec-val">Ubuntu 22.04 / 24.04 LTS or Debian 12</div>
      <div class="spec-desc">Linux x86_64 or ARM64 (AWS Graviton / Mac Silicon supported).</div>
    </div>
    <div class="spec-item">
      <div class="spec-label">Node.js Runtime</div>
      <div class="spec-val">Node.js v22.18.0 LTS or newer</div>
      <div class="spec-desc">Must include active npm / corepack tools.</div>
    </div>
    <div class="spec-item">
      <div class="spec-label">Memory (RAM)</div>
      <div class="spec-val">Minimum 2 GB RAM (Recommended: 4 GB)</div>
      <div class="spec-desc">Provides sufficient memory headroom during Sharp image compression.</div>
    </div>
    <div class="spec-item">
      <div class="spec-label">Storage &amp; Permissions</div>
      <div class="spec-val">Persistent NVMe SSD with Write Access</div>
      <div class="spec-desc">Writable permissions required on <span class="font-mono">./data/</span> and <span class="font-mono">./data/uploads/</span>.</div>
    </div>
  </div>

  <h2 class="section-h2">3. Recommended Production Deployment Architectures</h2>

  <h3 class="section-h3">Option A: Linux VPS / Dedicated Server (DigitalOcean, AWS EC2, Hetzner, Linode)</h3>
  <pre class="code-box">
<span class="comm"># 1. Install Node.js 22 LTS via NodeSource</span>
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential

<span class="comm"># 2. Clone repository &amp; install production dependencies</span>
cd /var/www/binaare-art-gallery
npm ci &amp;&amp; npm run admin:setup &amp;&amp; npm run build

<span class="comm"># 3. Start persistent server with PM2 Process Manager</span>
npm install -g pm2
pm2 start npm --name "binaare-gallery" -- start
pm2 save &amp;&amp; pm2 startup
  </pre>

  <h3 class="section-h3">Option B: Docker Container Deployment</h3>
  <pre class="code-box">
<span class="kw">FROM</span> node:22-alpine <span class="kw">AS</span> runner
<span class="kw">WORKDIR</span> /app
<span class="kw">ENV</span> NODE_ENV=production PORT=3000
<span class="kw">COPY</span> .next/standalone ./
<span class="kw">COPY</span> .next/static ./.next/static
<span class="kw">COPY</span> public ./public
<span class="kw">VOLUME</span> ["/app/data"]
<span class="kw">EXPOSE</span> 3000
<span class="kw">CMD</span> ["node", "server.js"]
  </pre>

  <!-- ============================================================ -->
  <!-- PAGE 11: CPANEL SETUP, ENV VARS & ENGINEERING SIGN-OFF       -->
  <!-- ============================================================ -->
  <div class="page-break"></div>

  <h1 class="section-h1">
    <span>cPanel Setup, Environment Variables &amp; Sign-Off</span>
    <span class="sec-num">Section 09</span>
  </h1>

  <h2 class="section-h2">1. cPanel Hosting (CloudLinux Node.js Application Manager)</h2>
  <p>If hosted on cPanel, the hosting plan <strong>MUST</strong> have <em>"Setup Node.js App"</em> (CloudLinux / Phusion Passenger) enabled:</p>
  <ul class="tech-list">
    <li>Open cPanel &rarr; Click <strong>Setup Node.js App</strong>.</li>
    <li>Select <strong>Node.js Version: 22.x</strong> (or highest available &ge; 22.18).</li>
    <li>Set <strong>Application Mode</strong> to <em>Production</em>.</li>
    <li>Set <strong>Application Root</strong> to <span class="font-mono">/home/username/binaare</span>.</li>
    <li>Set <strong>Application Startup File</strong> to <span class="font-mono">server.js</span> or <span class="font-mono">node_modules/next/dist/bin/next</span> with argument <span class="font-mono">start</span>.</li>
    <li>Add Environment Variables: <span class="font-mono">BINAARE_DATA_DIR</span>, <span class="font-mono">APP_ORIGIN</span>, <span class="font-mono">NODE_ENV=production</span>.</li>
  </ul>

  <h2 class="section-h2">2. Environment Variables Checklist</h2>
  <table class="tech-table">
    <thead>
      <tr>
        <th style="width: 28%;">Variable Name</th>
        <th style="width: 22%;">Example Value</th>
        <th style="width: 50%;">Functional Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-mono">NODE_ENV</td>
        <td><span class="font-mono">production</span></td>
        <td>Enables high-performance minified server execution and caching.</td>
      </tr>
      <tr>
        <td class="font-mono">PORT</td>
        <td><span class="font-mono">3000</span></td>
        <td>HTTP port listener for the Node.js server process.</td>
      </tr>
      <tr>
        <td class="font-mono">BINAARE_DATA_DIR</td>
        <td><span class="font-mono">/var/www/binaare/data</span></td>
        <td>Absolute directory for SQLite database and uploaded media files.</td>
      </tr>
      <tr>
        <td class="font-mono">APP_ORIGIN</td>
        <td><span class="font-mono">https://binaareart.com</span></td>
        <td>Origin verification header preventing CSRF attacks on admin mutations.</td>
      </tr>
      <tr>
        <td class="font-mono">ADMIN_USERNAME</td>
        <td><span class="font-mono">admin</span></td>
        <td>Configured username during automated setup.</td>
      </tr>
      <tr>
        <td class="font-mono">ADMIN_PASSWORD</td>
        <td><span class="font-mono">********</span></td>
        <td>Secure master password (minimum 12 characters).</td>
      </tr>
    </tbody>
  </table>

  <!-- Engineering Sign-Off Box -->
  <div class="avoid-break" style="margin-top: 18px; padding: 14px; background: #FAF8F5; border: 1px solid #EBE5DA; border-radius: 2px;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2DDD5; padding-bottom: 6px; margin-bottom: 8px;">
      <span style="font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #8C704F;">Engineering Sign-Off &amp; Architectural Approval</span>
      <span style="font-size: 7pt; color: #77716B;">Document ID: BAG-TECH-2026-FINAL</span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 7.5pt;">
      <div>
        <span style="display: block; color: #8C704F; font-weight: 600; text-transform: uppercase; font-size: 6.2pt; letter-spacing: 0.1em; margin-bottom: 2px;">Lead Software Architect</span>
        <span style="font-weight: 600; color: #1A1816;">Antigravity Systems Engineering</span>
      </div>
      <div>
        <span style="display: block; color: #8C704F; font-weight: 600; text-transform: uppercase; font-size: 6.2pt; letter-spacing: 0.1em; margin-bottom: 2px;">Platform Runtime Status</span>
        <span style="font-weight: 600; color: #740D18;">Node.js 22.18+ Verified Active</span>
      </div>
      <div>
        <span style="display: block; color: #8C704F; font-weight: 600; text-transform: uppercase; font-size: 6.2pt; letter-spacing: 0.1em; margin-bottom: 2px;">Document Revision</span>
        <span style="font-weight: 600; color: #1A1816;">2.0.0 (Production Master)</span>
      </div>
    </div>
  </div>

</body>
</html>
`;

async function buildPdf() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Setting page content...");
  await page.setContent(htmlContent, { waitUntil: "networkidle" });

  console.log("Rendering PDF with Chrome print engine...");
  await page.pdf({
    path: pdfOutputPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "16mm",
      bottom: "18mm",
      left: "14mm",
      right: "14mm",
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size: 7px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #8C704F; width: 100%; display: flex; justify-content: space-between; padding: 0 14mm; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600;">
        <span>Binaare Art Gallery — Technical Specification</span>
        <span style="color: #A39D94; font-weight: 500;">Confidential &amp; Proprietary</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-size: 7px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #77716B; width: 100%; display: flex; justify-content: space-between; padding: 0 14mm;">
        <span>Document Ref: BAG-TECH-2026-V2</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
  });

  await browser.close();

  const stats = fs.statSync(pdfOutputPath);
  const sizeKB = (stats.size / 1024).toFixed(1);
  console.log(`Successfully generated PDF at: ${pdfOutputPath} (${sizeKB} KB)`);
}

buildPdf().catch((err) => {
  console.error("Error generating PDF:", err);
  process.exit(1);
});
