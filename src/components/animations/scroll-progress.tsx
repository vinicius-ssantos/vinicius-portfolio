"use client";

import { useEffect, useState } from "react";

/**
 * Thin emerald bar fixed at the very top of the viewport that grows
 * as the user scrolls down the page. Hidden until the user has scrolled
 * at least 20px (so it doesn't show on the hero for a cleaner first screen).
 *
 * Respects prefers-reduced-motion: the transition is disabled, the bar
 * still updates but instantly.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(pct);
      setVisible(scrollTop > 20);
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update(); // initial state

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="scroll-progress"
      style={{
        width: "100%",
        transform: `scaleX(${progress})`,
        opacity: visible ? 1 : 0,
      }}
      aria-hidden
    />
  );
}
