import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import AddToCartButton from "@/components/AddToCartButton";
import {
  PRODUCTS,
  formatPriceUSD,
  getProductBySlug,
} from "@/data/products";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Artwork | Binaare" };
  return {
    title: `${product.title} | Shop | Binaare`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <PageHero
        title={product.title}
        subtitle={`${product.medium} · ${product.size}`}
        backgroundImage={product.src}
      />

      <section className="gallery-section" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
        <div className="product-detail-grid">
          <div
            style={{
              position: "relative",
              aspectRatio: "5 / 6.5",
              maxHeight: "85vh",
              overflow: "hidden",
              background: "var(--bg-alt)",
            }}
          >
            <Image
              src={product.src}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="product-detail-copy">
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>
              Original artwork
            </p>
            <h1 className="section-title" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>
              {product.title}
            </h1>
            <p className="artwork-card-medium" style={{ marginBottom: "1.5rem" }}>
              {product.medium} · {product.size}
            </p>
            <p className="product-price-tag" style={{ marginBottom: "1.5rem" }}>
              {formatPriceUSD(product.price)}
            </p>
            <p className="section-text" style={{ marginBottom: "2rem", maxWidth: "36rem" }}>
              {product.description}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
              <AddToCartButton slug={product.slug} />
              <Link href="/cart" className="btn-outline" style={{ padding: "0.65rem 1.4rem", fontSize: "0.7rem" }}>
                View cart
              </Link>
            </div>

            <p className="section-text" style={{ marginTop: "2.5rem", fontSize: "0.85rem", opacity: 0.75 }}>
              Shipping and insurance are quoted after checkout. For questions before you buy,{" "}
              <Link href="/contact" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
                contact the gallery
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
