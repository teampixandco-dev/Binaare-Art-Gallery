"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WORDMARK = "Binaare";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    startedAt.current = performance.now();

    let fontsReady = false;
    if ("fonts" in document) {
      document.fonts.ready
        .then(() => {
          fontsReady = true;
        })
        .catch(() => {
          fontsReady = true;
        });
    } else {
      fontsReady = true;
    }

    const MIN_DURATION = 850;
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - startedAt.current;
      const t = Math.min(1, elapsed / MIN_DURATION);
      const eased = 1 - Math.pow(1 - t, 1.6);
      const cap = fontsReady ? 100 : 88;
      const next = Math.min(cap, Math.round(eased * 100));
      setProgress(next);

      if (next >= 100 && fontsReady) {
        setDone(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      root.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => {
      document.documentElement.style.overflow = "";
    }, 600);
    return () => window.clearTimeout(t);
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          aria-hidden
        >
          <motion.div
            className="preloader-curtain"
            initial={{ y: 0 }}
            exit={{ y: "-101%" }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="preloader-corner preloader-corner--tl" aria-hidden />
            <span className="preloader-corner preloader-corner--tr" aria-hidden />
            <span className="preloader-corner preloader-corner--bl" aria-hidden />
            <span className="preloader-corner preloader-corner--br" aria-hidden />

            <div className="preloader-topbar">
              <span>Binaare</span>
              <span className="preloader-frame">N° 01 / 04</span>
              <span>MMXXVI</span>
            </div>

            <div className="preloader-inner">
              <motion.span
                className="preloader-eyebrow"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="preloader-eyebrow-dot" /> Colors of Love
              </motion.span>

              <h1 className="preloader-wordmark" aria-label={WORDMARK}>
                {WORDMARK.split("").map((ch, i) => (
                  <span key={i} className="preloader-letter-mask">
                    <motion.span
                      className="preloader-letter"
                      initial={{ y: "108%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        delay: 0.12 + i * 0.045,
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {ch}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.span
                className="preloader-rule"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />

              <motion.span
                className="preloader-italic"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                A contemplative creative space
              </motion.span>
            </div>

            <div className="preloader-footer">
              <div className="preloader-bar-row">
                <span>Entering the gallery</span>
                <span className="preloader-counter">
                  {String(progress).padStart(3, "0")} <span aria-hidden>/</span> 100
                </span>
              </div>
              <div className="preloader-bar">
                <span
                  className="preloader-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
