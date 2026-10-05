"use client";
import Image from "next/image";
import { usePageContent } from "@/context/ContentContext";

export default function PageSections({ slug, all = false }: { slug: string; all?: boolean }) {
  const page = usePageContent(slug);
  if (!page) return null;
  return <>
    {page.body && <section className="gallery-section"><p className="section-text" style={{ whiteSpace: "pre-wrap", maxWidth: "100%" }}>{page.body}</p></section>}
    {page.sections.filter(section => all || !section.builtin).map(section => <section className="gallery-section" key={section.id}>
      <h2 className="section-title">{section.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {section.items.map(item => <figure key={item.id}>
          <Image src={item.src} alt={item.title || section.title} width={900} height={700} sizes="(max-width: 640px) 100vw, 33vw" style={{ width: "100%", height: "auto" }} />
          {item.title && <h3 className="font-serif text-2xl mt-4">{item.title}</h3>}
          {item.description && <figcaption className="section-text" style={{ whiteSpace: "pre-wrap" }}>{item.description}</figcaption>}
        </figure>)}
      </div>
    </section>)}
  </>;
}
