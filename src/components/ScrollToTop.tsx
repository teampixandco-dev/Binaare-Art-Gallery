"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import type Lenis from "lenis";
import { useLenis } from "@/components/SmoothScroll";

const SHOW_AFTER = 520;

export default function ScrollToTop() {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lenis) return;

    const onScroll = (l: Lenis) => {
      setVisible(l.scroll > SHOW_AFTER);
    };

    onScroll(lenis);
    const unsub = lenis.on("scroll", onScroll);
    return unsub;
  }, [lenis]);

  const goTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.35 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={goTop}
      className="scroll-to-top"
      aria-label="Back to top"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <ChevronUp className="h-5 w-5" strokeWidth={2} aria-hidden />
    </button>
  );
}
