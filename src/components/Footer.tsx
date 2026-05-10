import Link from "next/link";

export default function Footer() {
  return (
    <footer className="gallery-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>Binaare Art Gallery</h3>
          <p>
            A contemplative creative space where emotion finds form and colour
            becomes a language of the soul. Rooted in the philosophy of Colors
            of Love.
          </p>
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
            <a href="#" aria-label="Instagram" style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.3s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="#" aria-label="Facebook" style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.3s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="Email" style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.3s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Gallery</h4>
          <Link href="/gallery">Online Gallery</Link>
          <Link href="/shop">Shop Artworks</Link>
          <Link href="/exhibitions">Exhibitions</Link>
          <Link href="/blog">Blog</Link>
        </div>

        <div className="footer-col">
          <h4>About</h4>
          <Link href="/about">About the Gallery</Link>
          <Link href="/artist">The Artist</Link>
          <Link href="/contact">Contact Us</Link>
        </div>

        <div className="footer-col">
          <h4>Collections</h4>
          <Link href="/shop">Acrylic Paintings</Link>
          <Link href="/shop">Watercolour</Link>
          <Link href="/shop">Textured Abstraction</Link>
          <Link href="/shop">Mixed Media</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          Copyright {new Date().getFullYear()}, Binaare · PIXANDCO
        </span>
        <span style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
          Colors of Love
        </span>
      </div>

      <div className="footer-massive-text">
        BINAARE
      </div>
    </footer>
  );
}
