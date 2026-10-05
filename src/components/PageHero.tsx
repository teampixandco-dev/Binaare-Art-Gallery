"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { pageHref } from "@/lib/content-types";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
}

export default function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  const pathname = usePathname();
  const page = useContent().pages.find(page => pageHref(page) === pathname);
  title = page?.title ?? title;
  subtitle = page?.subtitle ?? subtitle;
  backgroundImage = page?.hero ?? backgroundImage;
  return (
    <div
      className="page-hero"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="page-hero-content">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
