"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function ProductImages({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="artwork-gallery">
      <div 
        ref={imgRef}
        className="artwork-main-image-container"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 5",
          backgroundColor: "#FAF8F4",
          overflow: "hidden",
          cursor: isZoomed ? "zoom-in" : "default"
        }}
      >
        <Image 
          src={images[selected] || images[0]} 
          alt={`${title} — main view`} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw" 
          className="object-contain" 
          priority 
          style={{
            transform: isZoomed ? "scale(2)" : "scale(1)",
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transition: isZoomed ? "none" : "transform 0.3s ease-out",
            opacity: isZoomed ? 1 : 1
          }}
        />
      </div>

      {images.length > 1 && (
        <div className="artwork-thumbnails" style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
          {images.map((src, i) => (
            <button 
              key={`${src}-${i}`} 
              onClick={() => setSelected(i)} 
              aria-label={`View image ${i + 1}`} 
              aria-pressed={selected === i} 
              style={{
                border: selected === i ? "2px solid #740D18" : "2px solid transparent",
                padding: "2px",
                flexShrink: 0,
                background: "transparent",
                cursor: "pointer",
                transition: "border-color 0.3s"
              }}
            >
              <div style={{ position: "relative", width: "80px", height: "80px", backgroundColor: "#FAF8F4" }}>
                <Image src={src} alt={`Thumbnail ${i + 1}`} fill style={{ objectFit: "cover" }} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
