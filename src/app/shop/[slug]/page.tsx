import type { Metadata } from "next";
import { getPublicContent } from "@/lib/content-store";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProductDetailView from "@/components/ProductDetailView";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPublicContent().products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublicContent().products.find((p) => p.slug === slug);
  if (!product) return { title: "Artwork | Binaare" };
  return {
    title: `${product.title} | Shop | Binaare Art Gallery`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getPublicContent().products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <main style={{ background: "#FAF8F5", color: "#24211F", minHeight: "100vh" }}>
      <Navbar />
      <PageHero
        title={product.title}
        subtitle="Original Fine Art by Binari Gamage"
        backgroundImage={product.src}
      />
      <ProductDetailView product={product} />
      <Footer />
    </main>
  );
}
