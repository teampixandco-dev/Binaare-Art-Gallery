import { notFound } from "next/navigation";
import { getPublicContent } from "@/lib/content-store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageSections from "@/components/PageSections";
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return getPublicContent().pages.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = getPublicContent().pages.find(p => !p.builtin && p.slug === slug);
  return { title: page ? `${page.title} | Binaare` : "Page not found", description: page?.subtitle };
}
export default async function CustomPage({ params }: Props) {
  const { slug } = await params;
  const page = getPublicContent().pages.find(p => !p.builtin && p.slug === slug);
  if (!page) notFound();
  return <main style={{ background: "var(--bg)" }}><Navbar /><PageHero title={page.title} subtitle={page.subtitle} backgroundImage={page.hero} /><PageSections slug={page.slug} all /><Footer /></main>;
}
