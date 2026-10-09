"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageSections from "@/components/PageSections";
import { useContent } from "@/context/ContentContext";

export default function BlogPage() {
  const posts = [...useContent().posts].sort((a, b) => b.date.localeCompare(a.date));
  return <main style={{ background: "var(--bg)" }}>
    <Navbar />
    <PageHero title="Blog" subtitle="A journal of art, emotion, and creative reflections" backgroundImage="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1920&h=800&fit=crop" />
    <section className="gallery-section">
      <p className="section-label">From the studio</p>
      <h2 className="section-title">Art, Emotion &amp; Creative Reflections</h2>
      {!posts.length && <p className="section-text">New stories are on their way. Visit again soon.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {posts.map(post => <article className="blog-card" key={post.id}>
          <Link href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}><Image src={post.cover} alt={post.title} width={900} height={600} sizes="(max-width: 640px) 100vw, 33vw" style={{ width: "100%", aspectRatio: "3 / 2", objectFit: "cover" }} /></Link>
          <div className="blog-card-body">
            <time dateTime={post.date} className="section-label">{new Date(`${post.date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time>
            <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
            <p>{post.excerpt}</p>
            <Link className="btn-outline mt-5" href={`/blog/${post.slug}`}>Read story</Link>
          </div>
        </article>)}
      </div>
    </section>
    <PageSections slug="blog" /><Footer />
  </main>;
}
