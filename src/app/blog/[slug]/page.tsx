import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicContent } from "@/lib/content-store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPublicContent().posts.find(p => p.slug === slug);
  return { title: post ? `${post.title} | Binaare Journal` : "Story not found", description: post?.excerpt };
}
export default async function BlogArticle({ params }: Props) {
  const { slug } = await params;
  const post = getPublicContent().posts.find(p => p.slug === slug);
  if (!post) notFound();
  return <main style={{ background: "var(--bg)" }}><Navbar />
    <PageHero title={post.title} subtitle={post.excerpt} backgroundImage={post.cover} />
    <article className="gallery-section" style={{ maxWidth: 1000 }}>
      <time dateTime={post.date} className="section-label">{post.date}</time>
      <div className="section-text" style={{ maxWidth: "100%", whiteSpace: "pre-wrap", margin: "2rem 0" }}>{post.body}</div>
      <div className="grid gap-8">{post.images.map((src, index) => <Image key={`${src}-${index}`} src={src} alt={`${post.title} — photograph ${index + 1}`} width={1400} height={1000} sizes="(max-width: 1000px) 100vw, 1000px" style={{ width: "100%", height: "auto" }} />)}</div>
      <Link href="/blog" className="btn-outline mt-10">Back to journal</Link>
    </article><Footer /></main>;
}
