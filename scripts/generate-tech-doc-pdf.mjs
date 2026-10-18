import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const outputDir = path.resolve('public/specs');
await fs.mkdir(outputDir, { recursive: true });

// ═════════════════════════════════════════════════════════════════
// 1. GENERATE MARKED DIAGRAM 1: Home Page "Selected Works" Card
// ═════════════════════════════════════════════════════════════════
const selectedWorksSvg = `
<svg width="1200" height="1350" viewBox="0 0 1200 1350" xmlns="http://www.w3.org/2000/svg" style="background:#161514; font-family:'Inter',system-ui,sans-serif;">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E8D1A7"/>
      <stop offset="100%" stop-color="#B78646"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FAF8F5"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Title Badge -->
  <rect x="60" y="40" width="1080" height="90" rx="10" fill="#24211F" stroke="#3D3732" stroke-width="2"/>
  <text x="90" y="82" fill="#E8D1A7" font-size="20" font-weight="700" letter-spacing="3">BINAARE SPECIFICATION // 01</text>
  <text x="90" y="112" fill="#FFFFFF" font-size="28" font-family="'Playfair Display',serif" font-weight="600">Home Page — "Selected Works" Card Image Specification</text>
  <rect x="940" y="62" width="170" height="46" rx="6" fill="#B78646"/>
  <text x="1025" y="91" fill="#FFFFFF" font-size="16" font-weight="700" text-anchor="middle">ASPECT 4 : 4.5</text>

  <!-- Left: Annotated Card Mockup -->
  <!-- Outer Card Frame -->
  <g transform="translate(80, 170)" filter="url(#shadow)">
    <!-- Card Container -->
    <rect x="0" y="0" width="560" height="920" rx="6" fill="url(#cardGrad)" stroke="#EBE5DA" stroke-width="2"/>
    <text x="25" y="32" fill="#8C704F" font-size="13" font-weight="700" letter-spacing="2">CARD CONTAINER (FLEX-COL)</text>

    <!-- Outer Padding Indicators: p-4 to p-5 (20px) -->
    <rect x="20" y="46" width="520" height="585" rx="4" fill="#FAF8F5" stroke="#B78646" stroke-width="2" stroke-dasharray="6,4"/>
    <text x="280" y="70" fill="#8C704F" font-size="12" font-weight="700" text-anchor="middle">INNER BOX: aspect-[4/4.5] (bg: #FAF8F5, p-3: 12px)</text>

    <!-- Actual Image Render Area -->
    <rect x="36" y="86" width="488" height="528" rx="3" fill="#2A2623" stroke="#B78646" stroke-width="3"/>
    
    <!-- Pattern inside image to simulate artwork -->
    <circle cx="280" cy="350" r="140" fill="#5A4738" opacity="0.6"/>
    <path d="M 120 450 Q 280 200 440 450" fill="none" stroke="#E8D1A7" stroke-width="4"/>
    <text x="280" y="330" fill="#FFFFFF" font-size="24" font-weight="700" text-anchor="middle">ARTWORK IMAGE</text>
    <text x="280" y="365" fill="#E8D1A7" font-size="18" font-weight="600" text-anchor="middle">CSS: object-cover</text>
    <text x="280" y="395" fill="#C4BEB4" font-size="14" text-anchor="middle">fill / responsive container</text>

    <!-- Dimension Overlays on image -->
    <!-- Width indicator -->
    <line x1="46" y1="110" x2="514" y2="110" stroke="#00E5FF" stroke-width="2"/>
    <polygon points="46,110 56,105 56,115" fill="#00E5FF"/>
    <polygon points="514,110 504,105 504,115" fill="#00E5FF"/>
    <rect x="210" y="98" width="140" height="24" rx="4" fill="#161514"/>
    <text x="280" y="115" fill="#00E5FF" font-size="13" font-weight="700" text-anchor="middle">WIDTH RATIO: 4</text>

    <!-- Height indicator -->
    <line x1="500" y1="96" x2="500" y2="604" stroke="#00E5FF" stroke-width="2"/>
    <polygon points="500,96 495,106 505,106" fill="#00E5FF"/>
    <polygon points="500,604 495,594 505,594" fill="#00E5FF"/>
    <rect x="420" y="338" width="160" height="24" rx="4" fill="#161514" transform="rotate(-90 500 350)"/>
    <text x="500" y="354" fill="#00E5FF" font-size="13" font-weight="700" text-anchor="middle" transform="rotate(-90 500 350)">HEIGHT RATIO: 4.5</text>

    <!-- Card Content Info Section -->
    <g transform="translate(0, 645)">
      <!-- Divider -->
      <line x1="264" y1="10" x2="296" y2="10" stroke="#B78646" stroke-width="2"/>
      <text x="280" y="42" fill="#24211F" font-size="20" font-family="'Playfair Display',serif" font-weight="600" text-anchor="middle">Artwork Title</text>
      <text x="280" y="68" fill="#77716B" font-size="12" letter-spacing="2" text-anchor="middle">OIL ON CANVAS · 30" × 40"</text>
      <!-- Circular arrow button -->
      <circle cx="280" cy="120" r="22" fill="none" stroke="#B78646" stroke-width="1.5"/>
      <path d="M 274 120 L 286 120 M 281 115 L 286 120 L 281 125" fill="none" stroke="#B78646" stroke-width="2"/>
    </g>
  </g>

  <!-- Right: Technical Specification Panel -->
  <g transform="translate(680, 170)">
    <!-- Box 1: Exact Pixel Recommendations -->
    <rect x="0" y="0" width="460" height="280" rx="8" fill="#24211F" stroke="#3D3732" stroke-width="1.5"/>
    <rect x="0" y="0" width="460" height="42" rx="8" fill="#2E2A27"/>
    <text x="24" y="27" fill="#E8D1A7" font-size="15" font-weight="700" letter-spacing="1.5">RECOMMENDED REPLACEMENT SIZES</text>
    
    <text x="24" y="75" fill="#77716B" font-size="13">ASPECT RATIO:</text>
    <text x="24" y="100" fill="#00E5FF" font-size="20" font-weight="700">4 : 4.5 (8 : 9)</text>

    <text x="24" y="135" fill="#77716B" font-size="13">RECOMMENDED UPLOAD (2X RETINA):</text>
    <text x="24" y="160" fill="#00FF66" font-size="22" font-weight="700">800 × 900 px</text>

    <text x="24" y="195" fill="#77716B" font-size="13">HIGH-RES ARCHIVAL (3X DISPLAY):</text>
    <text x="24" y="218" fill="#FFFFFF" font-size="16" font-weight="600">1200 × 1350 px</text>

    <text x="24" y="248" fill="#77716B" font-size="13">MINIMUM ACCEPTABLE RESOLUTION:</text>
    <text x="240" y="248" fill="#FFB74D" font-size="14" font-weight="600">600 × 675 px</text>

    <!-- Box 2: CSS & Rendering Rules -->
    <rect x="0" y="310" width="460" height="280" rx="8" fill="#24211F" stroke="#3D3732" stroke-width="1.5"/>
    <rect x="0" y="310" width="460" height="42" rx="8" fill="#2E2A27"/>
    <text x="24" y="337" fill="#E8D1A7" font-size="15" font-weight="700" letter-spacing="1.5">CSS &amp; RENDERING BEHAVIOR</text>

    <text x="24" y="380" fill="#FFFFFF" font-size="14" font-weight="600">• Fitting Mode: <tspan fill="#00E5FF">object-cover</tspan></text>
    <text x="24" y="405" fill="#C4BEB4" font-size="13">Images will fill the 4:4.5 box. If your image</text>
    <text x="24" y="425" fill="#C4BEB4" font-size="13">has a different aspect ratio, outer edges crop.</text>

    <text x="24" y="460" fill="#FFFFFF" font-size="14" font-weight="600">• Container Class: <tspan fill="#E8D1A7">aspect-[4/4.5]</tspan></text>
    <text x="24" y="485" fill="#C4BEB4" font-size="13">Outer padding: p-4 to p-5 (16px to 20px).</text>
    <text x="24" y="505" fill="#C4BEB4" font-size="13">Inner artwork mat: p-3 (12px) with #FAF8F5.</text>

    <text x="24" y="540" fill="#FFFFFF" font-size="14" font-weight="600">• Hover Interaction: <tspan fill="#00FF66">scale-105</tspan></text>
    <text x="24" y="562" fill="#C4BEB4" font-size="13">Smooth 500ms zoom transition on card hover.</text>

    <!-- Box 3: Export & Format Specifications -->
    <rect x="0" y="620" width="460" height="270" rx="8" fill="#24211F" stroke="#3D3732" stroke-width="1.5"/>
    <rect x="0" y="620" width="460" height="42" rx="8" fill="#2E2A27"/>
    <text x="24" y="647" fill="#E8D1A7" font-size="15" font-weight="700" letter-spacing="1.5">FORMAT &amp; PERFORMANCE GUIDE</text>

    <text x="24" y="690" fill="#77716B" font-size="13">RECOMMENDED FORMAT:</text>
    <text x="24" y="714" fill="#00FF66" font-size="18" font-weight="700">WebP (.webp)</text>

    <text x="24" y="748" fill="#77716B" font-size="13">COMPRESSION QUALITY:</text>
    <text x="24" y="770" fill="#FFFFFF" font-size="16" font-weight="600">85% – 90% (Lossy WebP)</text>

    <text x="24" y="805" fill="#77716B" font-size="13">MAX TARGET FILE SIZE:</text>
    <text x="24" y="828" fill="#FFFFFF" font-size="16" font-weight="600">&lt; 180 KB per card image</text>

    <text x="24" y="862" fill="#77716B" font-size="13">COLOR PROFILE:</text>
    <text x="24" y="882" fill="#FFFFFF" font-size="14" font-weight="500">sRGB (Standard Web Profile)</text>
  </g>

  <!-- Bottom Summary Note -->
  <rect x="80" y="1120" width="1040" height="170" rx="8" fill="#1F1C19" stroke="#B78646" stroke-width="1.5"/>
  <text x="110" y="1155" fill="#E8D1A7" font-size="16" font-weight="700">CRITICAL DESIGN ADVICE FOR HOME "SELECTED WORKS":</text>
  <text x="110" y="1185" fill="#FFFFFF" font-size="14" font-weight="500">1. To avoid any unwanted edge cropping, pre-crop your showcase images exactly to a 4:4.5 (8:9) ratio.</text>
  <text x="110" y="1215" fill="#FFFFFF" font-size="14" font-weight="500">2. If using luxury room mockup images (e.g., artwork hanging over a console), center the artwork in the upper 75% of the frame.</text>
  <text x="110" y="1245" fill="#FFFFFF" font-size="14" font-weight="500">3. Always export to WebP format to maintain instant load times and optimal Google Core Web Vitals (LCP).</text>
  <text x="110" y="1270" fill="#77716B" font-size="12">File path reference: public/artworks/[artwork-slug]-showcase.webp or public/artworks/[artwork-slug].webp</text>
</svg>
`;

// ═════════════════════════════════════════════════════════════════
// 2. GENERATE MARKED DIAGRAM 2: Product Detail View Image Container
// ═════════════════════════════════════════════════════════════════
const productDetailSvg = `
<svg width="1200" height="1350" viewBox="0 0 1200 1350" xmlns="http://www.w3.org/2000/svg" style="background:#161514; font-family:'Inter',system-ui,sans-serif;">
  <defs>
    <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E8D1A7"/>
      <stop offset="100%" stop-color="#B78646"/>
    </linearGradient>
    <filter id="shadow2" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Title Badge -->
  <rect x="60" y="40" width="1080" height="90" rx="10" fill="#24211F" stroke="#3D3732" stroke-width="2"/>
  <text x="90" y="82" fill="#E8D1A7" font-size="20" font-weight="700" letter-spacing="3">BINAARE SPECIFICATION // 02</text>
  <text x="90" y="112" fill="#FFFFFF" font-size="28" font-family="'Playfair Display',serif" font-weight="600">Product Detail Page — Artwork Image Container Specification</text>
  <rect x="940" y="62" width="170" height="46" rx="6" fill="#B78646"/>
  <text x="1025" y="91" fill="#FFFFFF" font-size="16" font-weight="700" text-anchor="middle">1 : 1 SQUARE BOX</text>

  <!-- Left: Annotated Container Mockup -->
  <g transform="translate(80, 170)" filter="url(#shadow2)">
    <!-- Outer 1:1 Box (Desktop 560x560px) -->
    <rect x="0" y="0" width="560" height="560" rx="6" fill="#FFFFFF" stroke="#EBE5DA" stroke-width="2"/>
    
    <!-- Outer Margin / Padding Indicators: p-4 to p-8 (32px padding) -->
    <rect x="32" y="32" width="496" height="496" rx="4" fill="#FAF8F5" stroke="#B78646" stroke-width="2" stroke-dasharray="6,4"/>
    <text x="280" y="24" fill="#8C704F" font-size="12" font-weight="700" text-anchor="middle">OUTER CONTAINER: aspect-square (bg-white, p-4 sm:p-8)</text>

    <!-- Landscape Artwork Case -->
    <rect x="48" y="145" width="464" height="270" rx="2" fill="#2A2623" stroke="#00E5FF" stroke-width="3"/>
    <text x="280" y="260" fill="#00E5FF" font-size="18" font-weight="700" text-anchor="middle">LANDSCAPE ARTWORK (e.g. 39" × 27.5")</text>
    <text x="280" y="290" fill="#FFFFFF" font-size="14" font-weight="600" text-anchor="middle">CSS: object-contain (100% width, proportional height)</text>
    <text x="280" y="315" fill="#C4BEB4" font-size="12" text-anchor="middle">White mat appears naturally at top &amp; bottom (NO CROP)</text>

    <!-- Portrait Artwork Outline to illustrate flexibility -->
    <rect x="155" y="48" width="250" height="464" rx="2" fill="none" stroke="#FFB74D" stroke-width="2" stroke-dasharray="4,4"/>
    <text x="280" y="90" fill="#FFB74D" font-size="12" font-weight="700" text-anchor="middle">PORTRAIT ARTWORK (100% height, proportional width)</text>

    <!-- Dimension Overlays -->
    <line x1="48" y1="440" x2="512" y2="440" stroke="#00E5FF" stroke-width="2"/>
    <polygon points="48,440 58,436 58,444" fill="#00E5FF"/>
    <polygon points="512,440 502,436 502,444" fill="#00E5FF"/>
    <text x="280" y="460" fill="#00E5FF" font-size="13" font-weight="700" text-anchor="middle">RECOMMENDED MAX WIDTH: 1440 px</text>

    <!-- Badges Area Below Image -->
    <g transform="translate(0, 580)">
      <rect x="0" y="0" width="560" height="60" rx="4" fill="#FAF8F5" stroke="#EBE5DA"/>
      <text x="140" y="35" fill="#77716B" font-size="12" font-weight="600" letter-spacing="1">★ 100% ORIGINAL ARTWORK</text>
      <circle cx="280" cy="30" r="3" fill="#B78646"/>
      <text x="420" y="35" fill="#77716B" font-size="12" font-weight="600" letter-spacing="1">✔ SIGNED BY ARTIST</text>
    </g>
  </g>

  <!-- Right: Technical Details Panel -->
  <g transform="translate(680, 170)">
    <!-- Box 1: Pixel Recommendations -->
    <rect x="0" y="0" width="460" height="290" rx="8" fill="#24211F" stroke="#3D3732" stroke-width="1.5"/>
    <rect x="0" y="0" width="460" height="42" rx="8" fill="#2E2A27"/>
    <text x="24" y="27" fill="#E8D1A7" font-size="15" font-weight="700" letter-spacing="1.5">MASTER ARTWORK SPECIFICATIONS</text>
    
    <text x="24" y="75" fill="#77716B" font-size="13">CONTAINER BEHAVIOR:</text>
    <text x="24" y="100" fill="#00E5FF" font-size="19" font-weight="700">object-contain (NEVER CROPS)</text>

    <text x="24" y="135" fill="#77716B" font-size="13">RECOMMENDED MASTER DIMENSION:</text>
    <text x="24" y="160" fill="#00FF66" font-size="22" font-weight="700">1440 px on longest edge</text>

    <text x="24" y="195" fill="#77716B" font-size="13">SQUARE ARTWORKS (1:1):</text>
    <text x="240" y="195" fill="#FFFFFF" font-size="15" font-weight="600">1440 × 1440 px</text>

    <text x="24" y="225" fill="#77716B" font-size="13">LANDSCAPE ARTWORKS (3:2):</text>
    <text x="240" y="225" fill="#FFFFFF" font-size="15" font-weight="600">1440 × 960 px</text>

    <text x="24" y="255" fill="#77716B" font-size="13">PORTRAIT ARTWORKS (2:3):</text>
    <text x="240" y="255" fill="#FFFFFF" font-size="15" font-weight="600">960 × 1440 px</text>

    <!-- Box 2: Quality & Presentation -->
    <rect x="0" y="320" width="460" height="320" rx="8" fill="#24211F" stroke="#3D3732" stroke-width="1.5"/>
    <rect x="0" y="320" width="460" height="42" rx="8" fill="#2E2A27"/>
    <text x="24" y="347" fill="#E8D1A7" font-size="15" font-weight="700" letter-spacing="1.5">CANVAS PREPARATION RULES</text>

    <text x="24" y="390" fill="#FFFFFF" font-size="14" font-weight="600">1. Clean Edge-to-Edge Crop</text>
    <text x="24" y="412" fill="#C4BEB4" font-size="13">Crop precisely to the physical edge of the canvas</text>
    <text x="24" y="432" fill="#C4BEB4" font-size="13">or frame. Do not bake in artificial white margins.</text>

    <text x="24" y="470" fill="#FFFFFF" font-size="14" font-weight="600">2. Natural Aspect Ratio Retention</text>
    <text x="24" y="492" fill="#C4BEB4" font-size="13">Because the container uses <tspan fill="#00E5FF">object-contain</tspan>, you can</text>
    <text x="24" y="512" fill="#C4BEB4" font-size="13">upload artworks of ANY aspect ratio without distortion.</text>

    <text x="24" y="550" fill="#FFFFFF" font-size="14" font-weight="600">3. Resolution &amp; Sharpness</text>
    <text x="24" y="572" fill="#C4BEB4" font-size="13">Export at WebP quality 90-92% to preserve intricate</text>
    <text x="24" y="592" fill="#C4BEB4" font-size="13">gold leaf, impasto textures and delicate brushstrokes.</text>
  </g>

  <!-- Bottom Summary Note -->
  <rect x="80" y="850" width="1040" height="220" rx="8" fill="#1F1C19" stroke="#B78646" stroke-width="1.5"/>
  <text x="110" y="885" fill="#E8D1A7" font-size="16" font-weight="700">PRODUCT DETAIL VIEW BEHAVIOR (RECENT UPDATES):</text>
  <text x="110" y="915" fill="#FFFFFF" font-size="14" font-weight="500">• Outer Multi-Layer Artificial Frame Removed: The image is now displayed cleanly in a modern gallery white mat.</text>
  <text x="110" y="945" fill="#FFFFFF" font-size="14" font-weight="500">• Slider/Carousel Removed: Direct presentation of the authentic artwork image only.</text>
  <text x="110" y="975" fill="#FFFFFF" font-size="14" font-weight="500">• Sticky Layout: Left image container remains fixed while the collector scrolls through the artist's narrative and details.</text>
  <text x="110" y="1005" fill="#FFFFFF" font-size="14" font-weight="500">• Responsive Scaling: On mobile devices, the container smoothly scales to 100% viewport width while preserving 1:1 ratio.</text>
  <text x="110" y="1035" fill="#77716B" font-size="12">File path reference: public/artworks/[artwork-slug].webp (referenced in src/data/products.ts &amp; database)</text>
</svg>
`;

// ═════════════════════════════════════════════════════════════════
// 3. GENERATE MARKED DIAGRAM 3: Shop Catalog Card Image
// ═════════════════════════════════════════════════════════════════
const shopCardSvg = `
<svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" style="background:#161514; font-family:'Inter',system-ui,sans-serif;">
  <defs>
    <linearGradient id="cardGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FAF8F5"/>
    </linearGradient>
    <filter id="shadow3" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Title Badge -->
  <rect x="60" y="40" width="1080" height="90" rx="10" fill="#24211F" stroke="#3D3732" stroke-width="2"/>
  <text x="90" y="82" fill="#E8D1A7" font-size="20" font-weight="700" letter-spacing="3">BINAARE SPECIFICATION // 03</text>
  <text x="90" y="112" fill="#FFFFFF" font-size="28" font-family="'Playfair Display',serif" font-weight="600">Shop Catalog Grid — Artwork Card Image Specification</text>
  <rect x="940" y="62" width="170" height="46" rx="6" fill="#B78646"/>
  <text x="1025" y="91" fill="#FFFFFF" font-size="16" font-weight="700" text-anchor="middle">ASPECT 4 : 3</text>

  <!-- Left: Annotated Card Mockup -->
  <g transform="translate(80, 170)" filter="url(#shadow3)">
    <!-- Outer Card Frame -->
    <rect x="0" y="0" width="560" height="660" rx="4" fill="url(#cardGrad3)" stroke="#EBE5DA" stroke-width="1.5"/>
    <text x="20" y="24" fill="#8C704F" font-size="12" font-weight="700" letter-spacing="1">SHOP CARD CONTAINER (p-3.5: 14px)</text>

    <!-- 4:3 Image Box -->
    <rect x="14" y="36" width="532" height="399" rx="2" fill="#2A2623" stroke="#B78646" stroke-width="3"/>
    
    <!-- Pattern inside image -->
    <ellipse cx="280" cy="235" rx="190" ry="120" fill="#4A3B2F" opacity="0.7"/>
    <text x="280" y="225" fill="#FFFFFF" font-size="22" font-weight="700" text-anchor="middle">CATALOG ARTWORK</text>
    <text x="280" y="255" fill="#E8D1A7" font-size="16" font-weight="600" text-anchor="middle">aspect-[4/3] · object-cover</text>

    <!-- Heart button in top right -->
    <rect x="495" y="48" width="38" height="38" rx="4" fill="#FFFFFF" opacity="0.9"/>
    <path d="M 514 62 C 510 56 500 58 500 66 C 500 73 514 80 514 80 C 514 80 528 73 528 66 C 528 58 518 56 514 62 Z" fill="#8C704F"/>

    <!-- Dimension Overlays -->
    <line x1="24" y1="58" x2="480" y2="58" stroke="#00E5FF" stroke-width="2"/>
    <polygon points="24,58 34,54 34,62" fill="#00E5FF"/>
    <polygon points="480,58 470,54 470,62" fill="#00E5FF"/>
    <rect x="190" y="46" width="140" height="24" rx="4" fill="#161514"/>
    <text x="260" y="63" fill="#00E5FF" font-size="13" font-weight="700" text-anchor="middle">RATIO WIDTH: 4</text>

    <line x1="475" y1="95" x2="475" y2="425" stroke="#00E5FF" stroke-width="2"/>
    <polygon points="475,95 471,105 479,105" fill="#00E5FF"/>
    <polygon points="475,425 471,415 479,415" fill="#00E5FF"/>
    <rect x="400" y="250" width="140" height="24" rx="4" fill="#161514" transform="rotate(-90 475 260)"/>
    <text x="475" y="266" fill="#00E5FF" font-size="13" font-weight="700" text-anchor="middle" transform="rotate(-90 475 260)">RATIO HEIGHT: 3</text>

    <!-- Card Info Details -->
    <g transform="translate(14, 450)">
      <text x="10" y="24" fill="#24211F" font-size="18" font-family="'Playfair Display',serif" font-weight="600">Unfolding in Gold</text>
      <text x="10" y="48" fill="#77716B" font-size="12" font-weight="600" letter-spacing="1.5">39" × 27.5" · MIXED MEDIA</text>
      
      <!-- Action Buttons Row -->
      <rect x="10" y="70" width="370" height="44" rx="3" fill="#8C704F"/>
      <text x="195" y="97" fill="#FFFFFF" font-size="13" font-weight="700" letter-spacing="1.5" text-anchor="middle">ADD TO CART</text>

      <rect x="390" y="70" width="130" height="44" rx="3" fill="none" stroke="#D1C9BE"/>
      <text x="455" y="97" fill="#24211F" font-size="13" font-weight="600" letter-spacing="1" text-anchor="middle">VIEW ↗</text>
    </g>
  </g>

  <!-- Right: Technical Details Panel -->
  <g transform="translate(680, 170)">
    <!-- Box 1: Pixel Recommendations -->
    <rect x="0" y="0" width="460" height="280" rx="8" fill="#24211F" stroke="#3D3732" stroke-width="1.5"/>
    <rect x="0" y="0" width="460" height="42" rx="8" fill="#2E2A27"/>
    <text x="24" y="27" fill="#E8D1A7" font-size="15" font-weight="700" letter-spacing="1.5">SHOP CARD IMAGE SIZING</text>
    
    <text x="24" y="75" fill="#77716B" font-size="13">ASPECT RATIO:</text>
    <text x="24" y="100" fill="#00E5FF" font-size="20" font-weight="700">4 : 3 (Landscape Standard)</text>

    <text x="24" y="135" fill="#77716B" font-size="13">RECOMMENDED UPLOAD (HIGH QUALITY):</text>
    <text x="24" y="160" fill="#00FF66" font-size="22" font-weight="700">1200 × 900 px</text>

    <text x="24" y="195" fill="#77716B" font-size="13">STANDARD CARD UPLOAD:</text>
    <text x="24" y="218" fill="#FFFFFF" font-size="16" font-weight="600">800 × 600 px</text>

    <text x="24" y="248" fill="#77716B" font-size="13">DISPLAYED RENDER SIZE:</text>
    <text x="240" y="248" fill="#FFB74D" font-size="14" font-weight="600">~320 × 240 px (Desktop)</text>

    <!-- Box 2: Layout & Filtering -->
    <rect x="0" y="310" width="460" height="280" rx="8" fill="#24211F" stroke="#3D3732" stroke-width="1.5"/>
    <rect x="0" y="310" width="460" height="42" rx="8" fill="#2E2A27"/>
    <text x="24" y="337" fill="#E8D1A7" font-size="15" font-weight="700" letter-spacing="1.5">CATALOG DISPLAY BEHAVIOR</text>

    <text x="24" y="380" fill="#FFFFFF" font-size="14" font-weight="600">• Responsive Grid Breakdown:</text>
    <text x="24" y="405" fill="#C4BEB4" font-size="13">1 col (mobile), 2 cols (sm), 3 cols (lg), 4 cols (xl).</text>

    <text x="24" y="445" fill="#FFFFFF" font-size="14" font-weight="600">• Fitting Mode: <tspan fill="#00E5FF">object-cover</tspan></text>
    <text x="24" y="470" fill="#C4BEB4" font-size="13">Fills the 4:3 frame edge-to-edge. Best suited</text>
    <text x="24" y="490" fill="#C4BEB4" font-size="13">for landscape artworks and centered focal points.</text>

    <text x="24" y="530" fill="#FFFFFF" font-size="14" font-weight="600">• List View Alternate Layout:</text>
    <text x="24" y="552" fill="#C4BEB4" font-size="13">When user toggles List View, thumbnail is 140×140 px.</text>
  </g>

  <!-- Bottom Summary Note -->
  <rect x="80" y="870" width="1040" height="200" rx="8" fill="#1F1C19" stroke="#B78646" stroke-width="1.5"/>
  <text x="110" y="905" fill="#E8D1A7" font-size="16" font-weight="700">SHOP CATALOG BEST PRACTICES:</text>
  <text x="110" y="935" fill="#FFFFFF" font-size="14" font-weight="500">1. For landscape artworks (like "Unfolding in Gold"), the 4:3 crop aligns naturally with the composition.</text>
  <text x="110" y="965" fill="#FFFFFF" font-size="14" font-weight="500">2. For tall portrait paintings, ensure the focal point of the artwork is centered horizontally and vertically.</text>
  <text x="110" y="995" fill="#FFFFFF" font-size="14" font-weight="500">3. Clicking anywhere on the image or title navigates seamlessly to the full Product Detail View.</text>
  <text x="110" y="1025" fill="#77716B" font-size="12">File path reference: public/artworks/[slug].webp or public/artworks/[slug]-landscape.webp</text>
</svg>
`;

// Render SVGs to PNG
console.log('Rendering marked blueprint diagram images...');
await sharp(Buffer.from(selectedWorksSvg)).png().toFile('public/specs/selected-works-card-spec.png');
await sharp(Buffer.from(productDetailSvg)).png().toFile('public/specs/product-detail-view-spec.png');
await sharp(Buffer.from(shopCardSvg)).png().toFile('public/specs/shop-card-spec.png');
console.log('✓ Marked diagram images generated in public/specs/');

// Convert PNGs to base64 for self-contained HTML embedding in PDF
const selectedWorksBase64 = (await fs.readFile('public/specs/selected-works-card-spec.png')).toString('base64');
const productDetailBase64 = (await fs.readFile('public/specs/product-detail-view-spec.png')).toString('base64');
const shopCardBase64 = (await fs.readFile('public/specs/shop-card-spec.png')).toString('base64');

// ═════════════════════════════════════════════════════════════════
// 4. BUILD THE COMPLETE TECHNICAL DOCUMENTATION HTML
// ═════════════════════════════════════════════════════════════════
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Binaare Art Gallery — Technical Architecture & Asset Specification</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&display=swap');

  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
    @bottom-right {
      content: counter(page);
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      color: #8C704F;
    }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: #24211F;
    background: #FFFFFF;
    font-size: 9.5pt;
    line-height: 1.55;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page-break { page-break-after: always; break-after: page; }
  .no-break { page-break-inside: avoid; break-inside: avoid; }

  /* ── Header & Cover ── */
  .cover {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 20px;
    background: linear-gradient(145deg, #161514 0%, #24211F 60%, #1A1816 100%);
    color: #FAF8F5;
    border-radius: 4px;
    border: 1px solid #3D3732;
  }

  .cover-brand {
    font-family: 'Playfair Display', serif;
    font-size: 38pt;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #FAF8F5;
  }
  .cover-tagline {
    font-size: 10pt;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #B78646;
    margin-top: 6px;
    font-weight: 600;
  }

  .cover-main { margin: auto 0; }
  .cover-title {
    font-family: 'Playfair Display', serif;
    font-size: 32pt;
    font-weight: 500;
    line-height: 1.15;
    color: #FAF8F5;
    margin-bottom: 14px;
  }
  .cover-subtitle {
    font-size: 12pt;
    color: #D1C9BE;
    line-height: 1.5;
    max-width: 600px;
    font-weight: 300;
  }

  .cover-meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    border-top: 1px solid rgba(183, 134, 70, 0.4);
    padding-top: 24px;
  }
  .cover-meta-item h4 {
    font-size: 7.5pt;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #B78646;
    margin-bottom: 4px;
    font-weight: 700;
  }
  .cover-meta-item p {
    font-size: 9.5pt;
    color: #FAF8F5;
    font-weight: 500;
  }

  /* ── Typography & Headings ── */
  h1.section-header {
    font-family: 'Playfair Display', serif;
    font-size: 20pt;
    color: #1F1C19;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 2px solid #B78646;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  h1.section-header span.tag {
    font-family: 'Inter', sans-serif;
    font-size: 8.5pt;
    letter-spacing: 0.2em;
    color: #8C704F;
    font-weight: 700;
    text-transform: uppercase;
  }

  h2.sub-header {
    font-family: 'Playfair Display', serif;
    font-size: 13pt;
    color: #24211F;
    margin: 16px 0 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  h2.sub-header::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 16px;
    background: #B78646;
    border-radius: 2px;
  }

  p { margin-bottom: 8px; color: #423E3A; }
  strong { color: #1F1C19; font-weight: 600; }

  /* ── Tables ── */
  table.spec-table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 18px 0;
    font-size: 8.5pt;
    background: #FFFFFF;
    border: 1px solid #EBE5DA;
  }
  table.spec-table th {
    background: #24211F;
    color: #FAF8F5;
    padding: 8px 10px;
    text-align: left;
    font-size: 8pt;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
    border: 1px solid #332F2B;
  }
  table.spec-table td {
    padding: 8px 10px;
    border: 1px solid #EBE5DA;
    color: #423E3A;
    vertical-align: middle;
  }
  table.spec-table tr:nth-child(even) td {
    background: #FAF8F5;
  }
  table.spec-table td.highlight {
    font-weight: 700;
    color: #8C704F;
  }

  /* ── Badges & Cards ── */
  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 3px;
    font-size: 7.5pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .badge-gold { background: #FAF3E8; color: #8C704F; border: 1px solid #E8D1A7; }
  .badge-dark { background: #24211F; color: #FAF8F5; }
  .badge-green { background: #E8F5E9; color: #2E7D32; border: 1px solid #C8E6C9; }
  .badge-blue { background: #E1F5FE; color: #0277BD; border: 1px solid #B3E5FC; }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 12px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 12px;
  }

  .card-box {
    background: #FAF8F5;
    border: 1px solid #EBE5DA;
    border-radius: 4px;
    padding: 12px 14px;
  }
  .card-box.dark {
    background: #24211F;
    border-color: #383430;
    color: #FAF8F5;
  }
  .card-box.dark p { color: #D1C9BE; }
  .card-box.dark strong { color: #FAF8F5; }

  .card-box h3 {
    font-family: 'Playfair Display', serif;
    font-size: 11pt;
    color: #1F1C19;
    margin-bottom: 4px;
  }
  .card-box.dark h3 { color: #E8D1A7; }

  .diagram-img {
    width: 100%;
    height: auto;
    border-radius: 4px;
    border: 1px solid #3D3732;
    margin: 10px 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .callout-box {
    background: #FDF9F3;
    border-left: 4px solid #B78646;
    padding: 10px 14px;
    margin: 12px 0;
    border-radius: 0 4px 4px 0;
  }
  .callout-box p { margin: 0; color: #5A4738; font-size: 9pt; }

  .page-number-footer {
    position: fixed;
    bottom: -10px;
    right: 0;
    font-size: 8pt;
    color: #8C704F;
    font-weight: 600;
  }
</style>
</head>
<body>

<!-- ═════════════════════════════════════════════════════════════════
     COVER PAGE
═════════════════════════════════════════════════════════════════ -->
<div class="cover page-break">
  <div>
    <div class="cover-brand">BINAARE</div>
    <div class="cover-tagline">ART GALLERY · TECHNICAL SPECIFICATION &amp; ASSET MANUAL</div>
  </div>

  <div class="cover-main">
    <div class="cover-title">Website Architecture &amp;<br>Artwork Image Sizing Guide</div>
    <div class="cover-subtitle">
      Comprehensive technical handbook detailing modern architecture, component models, pages inventory, and exact card image specifications for replacement and curation.
    </div>
  </div>

  <div class="cover-meta">
    <div class="cover-meta-item">
      <h4>System Architecture</h4>
      <p>Next.js 15 · React 19 · SQLite</p>
    </div>
    <div class="cover-meta-item">
      <h4>Scope Exclusion</h4>
      <p>Gallery (/gallery) Excluded</p>
    </div>
    <div class="cover-meta-item">
      <h4>Release &amp; Version</h4>
      <p>Version 2.0 (Production Verified)</p>
    </div>
  </div>
</div>

<!-- ═════════════════════════════════════════════════════════════════
     SECTION 1: TECH STACK & SYSTEM ARCHITECTURE
═════════════════════════════════════════════════════════════════ -->
<div class="page-break">
  <h1 class="section-header">
    <span>01. System Architecture &amp; Tech Stack</span>
    <span class="tag">TECHNOLOGY BLUEPRINT</span>
  </h1>

  <p>
    <strong>Binaare Art Gallery</strong> is architected as an ultra-luxury, high-performance web application built with modern web standards, fine-tuned typography, and responsive micro-animations. It operates with zero external server dependencies for static deployment, ensuring high speed and resilience.
  </p>

  <h2 class="sub-header">Core Technology Stack</h2>
  <div class="grid-2">
    <div class="card-box">
      <h3>Frontend Framework &amp; Runtime</h3>
      <p><strong>Next.js 15.5+ (App Router):</strong> Modern hybrid rendering model utilizing Server Components where advantageous and Client Components for smooth interactivity.</p>
      <p><strong>React 19:</strong> State management, hooks, and responsive lifecycle handlers.</p>
      <p><strong>TypeScript 5.9:</strong> Full strict type safety across all artwork models, context states, and API routes.</p>
    </div>
    <div class="card-box">
      <h3>Styling &amp; Luxury Aesthetics</h3>
      <p><strong>Tailwind CSS 3 + Vanilla Design Tokens:</strong> Curated palette featuring luxury warm tones (<code>#B78646</code> Gold, <code>#FAF8F5</code> Warm Canvas, <code>#1F1C19</code> Deep Umber).</p>
      <p><strong>Typography System:</strong> Bespoke pairing of Google Fonts serif titles (<em>Playfair Display</em>, <em>Cormorant Garamond</em>) with clean sans-serif body (<em>Inter</em>).</p>
      <p><strong>Framer Motion:</strong> Staggered scroll reveals, hover lifts, and page transitions.</p>
    </div>
  </div>

  <div class="grid-2">
    <div class="card-box">
      <h3>Database &amp; Content Engine</h3>
      <p><strong>SQLite 3 Engine:</strong> Integrated via Node.js native <code>node:sqlite</code> module in <code>src/lib/database.mjs</code>. Stores live CMS content, custom pages, products, and admin credentials in <code>data/gallery.sqlite</code>.</p>
      <p><strong>Fallback Static Dataset:</strong> Strict fallback architecture in <code>src/data/products.ts</code> ensuring 100% uptime even if database initialization is deferred.</p>
    </div>
    <div class="card-box">
      <h3>Image Pipeline &amp; Assets</h3>
      <p><strong>Next.js Image Component:</strong> Automatic generation of responsive <code>srcset</code> attributes, WebP delivery, and lazy-loading.</p>
      <p><strong>Sharp Image Engine:</strong> High-performance Node.js asset optimization script pipeline (<code>scripts/process-images.mjs</code>) producing pristine, lossy-optimized WebP files.</p>
    </div>
  </div>

  <h2 class="sub-header">Application Architecture Flow</h2>
  <table class="spec-table">
    <thead>
      <tr>
        <th style="width: 25%;">Layer</th>
        <th style="width: 40%;">Implementation</th>
        <th style="width: 35%;">Key Role / Responsibility</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Presentation Layer</strong></td>
        <td><code>src/app/*</code>, <code>src/components/*</code></td>
        <td>Next.js App Router pages, luxury header/footer, artwork cards, editorial layouts.</td>
      </tr>
      <tr>
        <td><strong>State &amp; Context</strong></td>
        <td><code>src/context/CartContext.tsx</code><br><code>src/context/ContentContext.tsx</code></td>
        <td>Cart management, wishlist/favorites persistence, live CMS content provider.</td>
      </tr>
      <tr>
        <td><strong>Data Layer</strong></td>
        <td><code>src/data/products.ts</code><br><code>data/gallery.sqlite</code></td>
        <td>Artwork records (slug, title, dimensions, price, medium, images, stories).</td>
      </tr>
      <tr>
        <td><strong>Build &amp; Deployment</strong></td>
        <td>Static Site Generation (SSG)<br><code>npm run build</code> (52 static pages)</td>
        <td>Full pre-rendered static export ready for cPanel, Apache, Nginx, or Vercel.</td>
      </tr>
    </tbody>
  </table>

  <div class="callout-box">
    <p><strong>Special Commercial Gallery Policy:</strong> In line with exclusive fine art acquisition standards, artwork prices in the cart are concealed and the automated checkout button is disabled to redirect collectors to direct curatorial inquiries.</p>
  </div>
</div>

<!-- ═════════════════════════════════════════════════════════════════
     SECTION 2: PAGES DIRECTORY & DESCRIPTIONS (OMITTING GALLERY)
═════════════════════════════════════════════════════════════════ -->
<div class="page-break">
  <h1 class="section-header">
    <span>02. Pages Directory &amp; Functional Breakdown</span>
    <span class="tag">PAGE ARCHITECTURE</span>
  </h1>

  <p>
    The following directory outlines all user-facing and administrative pages in the Binaare Art Gallery system. <em>Note: As instructed, the legacy Gallery section (/gallery) has been intentionally omitted from this specification.</em>
  </p>

  <table class="spec-table">
    <thead>
      <tr>
        <th style="width: 20%;">Route / Path</th>
        <th style="width: 25%;">Page Name</th>
        <th style="width: 55%;">Functional Purpose &amp; Key Components</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/</code></td>
        <td><strong>Home Page</strong></td>
        <td>Flagship entrance. Features Hero Banner, artist philosophy, 4 curated <strong>Selected Works</strong> cards, Artistic Process video teaser, Collector Testimonials, and Newsletter subscription.</td>
      </tr>
      <tr>
        <td><code>/shop</code></td>
        <td><strong>Shop / Catalog</strong></td>
        <td>Complete artwork discovery catalog. Features real-time category filtering (<em>All, Oil Painting, Water color, Mixed Media, Texture, Acrylic</em>), live search, sorting, Grid/List views, and bookmark favorites.</td>
      </tr>
      <tr>
        <td><code>/shop/[slug]</code></td>
        <td><strong>Product Detail View</strong></td>
        <td>Immersive single-artwork showcase. Features a 1:1 square artwork presentation frame (<code>object-contain</code>), authenticity badges, physical dimensions, medium, artist narrative, and acquisition actions.</td>
      </tr>
      <tr>
        <td><code>/about</code></td>
        <td><strong>About Us</strong></td>
        <td>Gallery heritage and philosophy. Features the "Colors of Love" studio story, founder portrait, artistic medium breakdown, mission statement, and core cultural values.</td>
      </tr>
      <tr>
        <td><code>/artist</code></td>
        <td><strong>The Artist</strong></td>
        <td>Artist profile dedicated to <strong>Binari Gamage</strong>. Displays studio painting portraits, artist statement, career retrospective, creative process reflections, and exhibition history.</td>
      </tr>
      <tr>
        <td><code>/exhibitions</code></td>
        <td><strong>Exhibitions</strong></td>
        <td>Chronicle of solo and group exhibitions. Details dates, venue locations, curatorial summaries, and high-resolution installation photographs.</td>
      </tr>
      <tr>
        <td><code>/blog</code><br><code>/blog/[slug]</code></td>
        <td><strong>Journal &amp; Stories</strong></td>
        <td>Art essays, technique guides, and studio journal entries. Detailed markdown rendering with author metadata, reading time, and related artwork links.</td>
      </tr>
      <tr>
        <td><code>/contact</code></td>
        <td><strong>Contact Us</strong></td>
        <td>Collector inquiry portal. Direct communication form, private consultation booking details, gallery email, telephone, studio hours, and interactive location guide.</td>
      </tr>
      <tr>
        <td><code>/cart</code></td>
        <td><strong>Acquisition Cart</strong></td>
        <td>Collector's chosen artwork review. Displays artwork thumbnail, title, medium, dimensions, and quantity adjustment. Prices and automated checkout are discreetly disabled in favor of gallery inquiry.</td>
      </tr>
      <tr>
        <td><code>/checkout</code></td>
        <td><strong>Inquiry Submission</strong></td>
        <td>Shipping details and collector acquisition request form. Transmits customer information directly to gallery management for personalized shipping and insurance invoicing.</td>
      </tr>
      <tr>
        <td><code>/admin</code></td>
        <td><strong>CMS Portal</strong></td>
        <td>Secure management interface for gallery curators. Enables direct editing of artwork records, dimensions, categories, and page content stored in SQLite.</td>
      </tr>
    </tbody>
  </table>

  <div class="grid-2">
    <div class="card-box">
      <h3>Editorial &amp; Navigation Flow</h3>
      <p>The primary navigation bar links: <strong>Home, Shop, About Us, Artist, Exhibitions, Blog, Contact Us</strong> with right-aligned shopping bag badge displaying real-time cart counts.</p>
    </div>
    <div class="card-box">
      <h3>Responsive Form Factor</h3>
      <p>All pages feature fluid scaling from mobile (375px) through high-density 4K displays (2560px), adapting grid columns, font scales, and spacing dynamically.</p>
    </div>
  </div>
</div>

<!-- ═════════════════════════════════════════════════════════════════
     SECTION 3: MASTER IMAGE SIZING SPECIFICATIONS
═════════════════════════════════════════════════════════════════ -->
<div class="page-break">
  <h1 class="section-header">
    <span>03. Master Artwork &amp; Card Image Sizes</span>
    <span class="tag">ASSET SPECIFICATIONS</span>
  </h1>

  <p>
    To ensure pristine visual elegance without distortion, stretching, or unexpected cropping, replacement images must strictly adhere to the aspect ratios, resolutions, and CSS rules documented in the table below.
  </p>

  <table class="spec-table">
    <thead>
      <tr>
        <th>Component / Section</th>
        <th>Aspect Ratio</th>
        <th>CSS Object-Fit</th>
        <th>Recommended Upload (px)</th>
        <th>Target Size &amp; Format</th>
        <th>Replacement Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Home "Selected Works" Cards</strong><br><code>src/app/page.tsx</code></td>
        <td class="highlight">4 : 4.5<br>(8 : 9)</td>
        <td><code>object-cover</code></td>
        <td class="highlight"><strong>800 × 900 px</strong><br><small>(Hi-res: 1200×1350)</small></td>
        <td>WebP<br>&lt; 180 KB</td>
        <td>Pre-crop artwork to 4:4.5 ratio. Centered focal point is essential.</td>
      </tr>
      <tr>
        <td><strong>Product Detail View Frame</strong><br><code>ProductDetailView.tsx</code></td>
        <td class="highlight">1 : 1 Box<br>(Any Artwork Ratio)</td>
        <td><code>object-contain</code></td>
        <td class="highlight"><strong>1440 px</strong><br><small>on longest edge</small></td>
        <td>WebP<br>&lt; 280 KB</td>
        <td><strong>NEVER CROPS</strong>. Square (1440×1440), Landscape (1440×960), Portrait (960×1440).</td>
      </tr>
      <tr>
        <td><strong>Shop Catalog Grid Cards</strong><br><code>src/app/shop/page.tsx</code></td>
        <td class="highlight">4 : 3<br>(Landscape)</td>
        <td><code>object-cover</code></td>
        <td class="highlight"><strong>1200 × 900 px</strong><br><small>(Min: 800×600)</small></td>
        <td>WebP<br>&lt; 180 KB</td>
        <td>Fills card frame edge-to-edge. Ideal for landscape art and floral centers.</td>
      </tr>
      <tr>
        <td><strong>Global Page Heroes (Banners)</strong><br><code>PageHero.tsx</code></td>
        <td class="highlight">16 : 5 to 16 : 6<br>(Panoramic)</td>
        <td><code>object-cover</code></td>
        <td class="highlight"><strong>1920 × 720 px</strong><br><small>(Min: 1440×540)</small></td>
        <td>WebP<br>&lt; 250 KB</td>
        <td>Used across Contact, Cart, Checkout, Exhibitions headers with dark gradient overlay.</td>
      </tr>
      <tr>
        <td><strong>About Us Portrait ("Colors of Love")</strong><br><code>public/about-portrait.webp</code></td>
        <td class="highlight">4 : 5<br>(Vertical)</td>
        <td><code>object-cover</code></td>
        <td class="highlight"><strong>1000 × 1250 px</strong><br><small>(Min: 800×1000)</small></td>
        <td>WebP<br>&lt; 200 KB</td>
        <td>Warm studio portrait showing artist with natural illumination.</td>
      </tr>
      <tr>
        <td><strong>Artist Profile Hero &amp; Studio</strong><br><code>public/binari-gamage-painting.webp</code></td>
        <td class="highlight">4 : 5<br>(Vertical)</td>
        <td><code>object-cover</code></td>
        <td class="highlight"><strong>1000 × 1250 px</strong><br><small>(Min: 800×1000)</small></td>
        <td>WebP<br>&lt; 200 KB</td>
        <td>Artist painting in studio. Fills right editorial column on /artist.</td>
      </tr>
      <tr>
        <td><strong>Blog Article Featured Images</strong><br><code>src/data/blog.ts</code></td>
        <td class="highlight">16 : 9<br>(Widescreen)</td>
        <td><code>object-cover</code></td>
        <td class="highlight"><strong>1280 × 720 px</strong><br><small>(Min: 960×540)</small></td>
        <td>WebP<br>&lt; 160 KB</td>
        <td>Featured header image for journal articles and blog post cards.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="sub-header">Key Architectural Differences in Image Fitting</h2>
  <div class="grid-2">
    <div class="card-box">
      <h3>object-cover (Used in Cards &amp; Heroes)</h3>
      <p>The image expands to completely cover the container. If the aspect ratio of the uploaded image does not match the container's ratio, pixels on the outer edges are trimmed. <em>Always pre-crop images to the exact ratio specified!</em></p>
    </div>
    <div class="card-box">
      <h3>object-contain (Used in Product Detail View)</h3>
      <p>The entire artwork is rendered without losing a single pixel. It scales to fit within the square frame while preserving its natural proportions. Clean white gallery padding appears naturally around non-square canvases.</p>
    </div>
  </div>
</div>

<!-- ═════════════════════════════════════════════════════════════════
     SECTION 4: MARKED BLUEPRINTS (SELECTED WORKS & PRODUCT VIEW)
═════════════════════════════════════════════════════════════════ -->
<div class="page-break">
  <h1 class="section-header">
    <span>04. Marked Blueprint: Home "Selected Works"</span>
    <span class="tag">VISUAL SPECIFICATION // 01</span>
  </h1>

  <p>
    The visual diagram below illustrates the exact structural anatomy, aspect ratio constraints, inner padding measurements, and recommended replacement resolution for the <strong>Home Page Selected Works</strong> cards.
  </p>

  <img class="diagram-img" src="data:image/png;base64,${selectedWorksBase64}" alt="Selected Works Card Spec">

  <div class="grid-3" style="margin-top: 10px;">
    <div class="card-box">
      <strong style="color: #8C704F;">Aspect Ratio: 4 : 4.5</strong>
      <p style="font-size: 8.5pt; margin-top: 4px;">Slightly vertical proportion giving artworks a tall, elegant presentation in the 4-column desktop grid.</p>
    </div>
    <div class="card-box">
      <strong style="color: #8C704F;">Optimal: 800 × 900 px</strong>
      <p style="font-size: 8.5pt; margin-top: 4px;">Provides sharp rendering on 2x and 3x Retina mobile devices without unnecessary bandwidth overhead.</p>
    </div>
    <div class="card-box">
      <strong style="color: #8C704F;">Showcase Mockup Tip</strong>
      <p style="font-size: 8.5pt; margin-top: 4px;">For room mockups (e.g. wall art above furniture), ensure the framed artwork sits in the upper 70% of the image.</p>
    </div>
  </div>
</div>

<div class="page-break">
  <h1 class="section-header">
    <span>05. Marked Blueprint: Product Detail View</span>
    <span class="tag">VISUAL SPECIFICATION // 02</span>
  </h1>

  <p>
    The visual diagram below demonstrates the sticky 1:1 square artwork presentation frame in <strong>ProductDetailView.tsx</strong>. Notice that because <code>object-contain</code> is used, artworks of <em>any</em> canvas shape (landscape, square, portrait) display completely.
  </p>

  <img class="diagram-img" src="data:image/png;base64,${productDetailBase64}" alt="Product Detail View Spec">

  <div class="grid-3" style="margin-top: 10px;">
    <div class="card-box">
      <strong style="color: #8C704F;">Container: 1 : 1 Square</strong>
      <p style="font-size: 8.5pt; margin-top: 4px;">White gallery presentation box with 32px padding, subtle border (<code>#EBE5DA</code>), and soft shadow.</p>
    </div>
    <div class="card-box">
      <strong style="color: #8C704F;">Master Size: 1440 px</strong>
      <p style="font-size: 8.5pt; margin-top: 4px;">Set the longest edge to 1440px. Landscape: 1440×960. Square: 1440×1440. Portrait: 960×1440.</p>
    </div>
    <div class="card-box">
      <strong style="color: #8C704F;">Zero Edge Cropping</strong>
      <p style="font-size: 8.5pt; margin-top: 4px;">Collectors see 100% of the canvas from corner to corner. Authenticity badges appear directly below.</p>
    </div>
  </div>
</div>

<div class="page-break">
  <h1 class="section-header">
    <span>06. Marked Blueprint: Shop Catalog Card</span>
    <span class="tag">VISUAL SPECIFICATION // 03</span>
  </h1>

  <p>
    The visual diagram below illustrates the <strong>Shop Catalog Card</strong> layout used on <code>/shop</code>. The card features a standard landscape 4:3 image ratio, heart bookmark icon, artwork title, dimensions subtitle, and dual action buttons.
  </p>

  <img class="diagram-img" src="data:image/png;base64,${shopCardBase64}" alt="Shop Card Spec">

  <div class="grid-3" style="margin-top: 10px;">
    <div class="card-box">
      <strong style="color: #8C704F;">Aspect Ratio: 4 : 3</strong>
      <p style="font-size: 8.5pt; margin-top: 4px;">Standard landscape art ratio matching floral centerpieces and panoramic canvases.</p>
    </div>
    <div class="card-box">
      <strong style="color: #8C704F;">Optimal: 1200 × 900 px</strong>
      <p style="font-size: 8.5pt; margin-top: 4px;">Ensures instant, crystal-clear rendering across mobile single columns and desktop 4-column grids.</p>
    </div>
    <div class="card-box">
      <strong style="color: #8C704F;">Interactive Overlay</strong>
      <p style="font-size: 8.5pt; margin-top: 4px;">Favorite heart button anchored top-right; subtle <code>scale-105</code> transition on card hover.</p>
    </div>
  </div>
</div>

<!-- ═════════════════════════════════════════════════════════════════
     SECTION 5: ASSET PREPARATION & OPTIMIZATION WORKFLOW
═════════════════════════════════════════════════════════════════ -->
<div>
  <h1 class="section-header">
    <span>07. Image Replacement Workflow &amp; Best Practices</span>
    <span class="tag">OPERATIONAL GUIDE</span>
  </h1>

  <h2 class="sub-header">Step-by-Step Replacement Checklist</h2>
  <ol style="margin-left: 20px; margin-bottom: 16px; color: #423E3A; font-size: 9.5pt; line-height: 1.8;">
    <li><strong>Photograph or Scan Artwork:</strong> Capture artworks under diffused 5000K daylight illumination to minimize glare and capture physical paint texture accurately.</li>
    <li><strong>Determine Destination:</strong> Check whether the image is intended for the Home Page (4:4.5), Shop Catalog (4:3), or Product Detail View (Master 1440px).</li>
    <li><strong>Crop to Target Ratio:</strong> Using Photoshop, Lightroom, or Figma, crop precisely to the ratio specified in the Master Sizing Table.</li>
    <li><strong>Convert to WebP Format:</strong> Use Sharp or <code>cwebp</code> with quality set to <code>88-92%</code>. Verify file size is under 200–250 KB.</li>
    <li><strong>Store in Asset Directory:</strong> Place the new asset in <code>public/artworks/[slug].webp</code>.</li>
    <li><strong>Update Data &amp; Database:</strong> Update the entry in <code>src/data/products.ts</code> and synchronize with SQLite (<code>data/gallery.sqlite</code>).</li>
    <li><strong>Bypass Browser Cache:</strong> If updating an existing artwork image, append a version or landscape suffix (e.g., <code>[slug]-landscape.webp</code>) to force collectors' browsers to immediately display the fresh artwork.</li>
  </ol>

  <h2 class="sub-header">Standard Shell / Sharp Optimization Script</h2>
  <div class="card-box dark" style="font-family: monospace; font-size: 8pt; line-height: 1.6; margin-bottom: 16px;">
    // Quick Node.js optimization snippet<br>
    import sharp from 'sharp';<br><br>
    // 1. For Home "Selected Works" (800 × 900 px):<br>
    await sharp('raw-image.jpg')<br>
    &nbsp;&nbsp;.resize(800, 900, { fit: 'cover', position: 'center' })<br>
    &nbsp;&nbsp;.webp({ quality: 88 })<br>
    &nbsp;&nbsp;.toFile('public/artworks/my-artwork-showcase.webp');<br><br>
    // 2. For Master Product Detail (1440 px longest edge):<br>
    await sharp('raw-canvas.jpg')<br>
    &nbsp;&nbsp;.resize({ width: 1440, withoutEnlargement: true })<br>
    &nbsp;&nbsp;.webp({ quality: 90 })<br>
    &nbsp;&nbsp;.toFile('public/artworks/my-artwork.webp');
  </div>

  <div class="card-box">
    <h3>Summary &amp; Quality Checklist</h3>
    <table class="spec-table" style="margin-top: 8px; margin-bottom: 0;">
      <tbody>
        <tr>
          <td style="width: 30%;"><strong>Color Profile</strong></td>
          <td>sRGB (ensures identical color gamut across iOS, macOS, Windows, Android)</td>
        </tr>
        <tr>
          <td><strong>File Naming</strong></td>
          <td>kebab-case (e.g. <code>petals-of-serenity.webp</code>, <code>unfolding-in-gold-landscape.webp</code>)</td>
        </tr>
        <tr>
          <td><strong>Performance Budget</strong></td>
          <td>LCP element &lt; 200 KB, Total page weight &lt; 1.5 MB for initial load</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

</body>
</html>
`;

await fs.writeFile('public/specs/technical-documentation.html', htmlContent);
console.log('✓ HTML documentation written to public/specs/technical-documentation.html');

// ═════════════════════════════════════════════════════════════════
// 5. RENDER PDF VIA HEADLESS CHROME
// ═════════════════════════════════════════════════════════════════
console.log('Generating high-resolution PDF with Google Chrome...');
const htmlPath = path.resolve('public/specs/technical-documentation.html');
const pdfDestRoot = path.resolve('Binaare-Art-Gallery-Technical-Documentation.pdf');
const pdfDestPublic = path.resolve('public/Binaare-Art-Gallery-Technical-Documentation.pdf');

execSync(\`google-chrome --headless --disable-gpu --no-sandbox --print-to-pdf="\${pdfDestRoot}" "file://\${htmlPath}"\`);
await fs.copyFile(pdfDestRoot, pdfDestPublic);

console.log('✓ Master PDF generated successfully at:');
console.log('  -> ' + pdfDestRoot);
console.log('  -> ' + pdfDestPublic);
