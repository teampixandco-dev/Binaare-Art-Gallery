"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  startTransition,
  type ReactNode,
} from "react";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    let cancelled = false;
    let idleHandle: number | undefined;
    let timerHandle: ReturnType<typeof setTimeout> | undefined;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const [{ default: LenisCtor }, gsapMod, scrollTriggerMod] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) return;

      const gsap = gsapMod.default;
      const ScrollTrigger = scrollTriggerMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const instance = new LenisCtor({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        syncTouch: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.75,
        infinite: false,
      });

      startTransition(() => setLenis(instance));

      instance.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      requestAnimationFrame(() => ScrollTrigger.refresh());

      cleanup = () => {
        window.removeEventListener("resize", onResize);
        instance.destroy();
        gsap.ticker.remove(raf);
        startTransition(() => setLenis(null));
      };
    };

    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(() => init(), { timeout: 1200 });
    } else {
      timerHandle = setTimeout(init, 200);
    }

    return () => {
      cancelled = true;
      if (idleHandle !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleHandle);
      }
      if (timerHandle) clearTimeout(timerHandle);
      cleanup?.();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
