"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ArtworkCardProps {
  src: string;
  title: string;
  medium: string;
  index?: number;
}

export default function ArtworkCard({ src, title, medium, index = 0 }: ArtworkCardProps) {
  return (
    <motion.div
      className="artwork-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{ overflow: "hidden" }}>
        <Image
          src={src}
          alt={title}
          width={600}
          height={800}
          className="artwork-card-img"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <div className="artwork-card-info">
        <h3 className="artwork-card-title">{title}</h3>
        <p className="artwork-card-medium">{medium}</p>
      </div>
    </motion.div>
  );
}
