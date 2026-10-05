"use client";
import { useState } from "react";
import Image from "next/image";
export default function ProductImages({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);
  return <div>
    <div style={{ position: "relative", aspectRatio: "5 / 6.5", maxHeight: "85vh", background: "var(--bg-alt)" }}>
      <Image src={images[selected] || images[0]} alt={`${title} — image ${selected + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" priority />
    </div>
    {images.length > 1 && <div className="flex flex-wrap gap-3 mt-4">{images.map((src, i) => <button key={`${src}-${i}`} onClick={() => setSelected(i)} aria-label={`View image ${i + 1}`} aria-pressed={selected === i} style={{ border: selected === i ? "2px solid var(--accent)" : "2px solid transparent", padding: 2 }}><Image src={src} alt="" width={80} height={80} style={{ width: 80, height: 80, objectFit: "cover" }} /></button>)}</div>}
  </div>;
}
