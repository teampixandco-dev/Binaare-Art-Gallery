"use client";

import React, { useEffect, useRef, useState } from "react";

interface SeamlessHeroVideoProps {
  src: string;
  className?: string;
}

export default function SeamlessHeroVideo({
  src,
  className = "absolute inset-0 h-full w-full object-cover",
}: SeamlessHeroVideoProps) {
  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);
  const [activePlayer, setActivePlayer] = useState<"A" | "B">("A");

  useEffect(() => {
    const vA = videoRefA.current;
    const vB = videoRefB.current;
    if (!vA || !vB) return;

    vA.defaultMuted = true;
    vA.muted = true;
    vB.defaultMuted = true;
    vB.muted = true;

    // Start video A immediately with zero delay
    vA.play().catch(() => {});

    // Seamless crossfade window in seconds before video ends
    const CROSSFADE_TIME = 0.45;

    const handleTimeUpdateA = () => {
      if (vA.duration && vA.currentTime >= vA.duration - CROSSFADE_TIME) {
        if (vB.paused) {
          vB.currentTime = 0;
          vB.play().catch(() => {});
          setActivePlayer("B");
        }
      }
    };

    const handleEndedA = () => {
      vA.pause();
      vA.currentTime = 0;
    };

    const handleTimeUpdateB = () => {
      if (vB.duration && vB.currentTime >= vB.duration - CROSSFADE_TIME) {
        if (vA.paused) {
          vA.currentTime = 0;
          vA.play().catch(() => {});
          setActivePlayer("A");
        }
      }
    };

    const handleEndedB = () => {
      vB.pause();
      vB.currentTime = 0;
    };

    vA.addEventListener("timeupdate", handleTimeUpdateA);
    vA.addEventListener("ended", handleEndedA);
    vB.addEventListener("timeupdate", handleTimeUpdateB);
    vB.addEventListener("ended", handleEndedB);

    return () => {
      vA.removeEventListener("timeupdate", handleTimeUpdateA);
      vA.removeEventListener("ended", handleEndedA);
      vB.removeEventListener("timeupdate", handleTimeUpdateB);
      vB.removeEventListener("ended", handleEndedB);
    };
  }, [src]);

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none">
      <video
        ref={videoRefA}
        className={`${className} transition-opacity duration-500 ease-in-out`}
        style={{
          opacity: activePlayer === "A" ? 1 : 0,
          zIndex: activePlayer === "A" ? 2 : 1,
        }}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        suppressHydrationWarning
      />
      <video
        ref={videoRefB}
        className={`${className} transition-opacity duration-500 ease-in-out`}
        style={{
          opacity: activePlayer === "B" ? 1 : 0,
          zIndex: activePlayer === "B" ? 2 : 1,
        }}
        src={src}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        suppressHydrationWarning
      />
    </div>
  );
}
