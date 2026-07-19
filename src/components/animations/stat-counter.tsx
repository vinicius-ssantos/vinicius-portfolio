"use client";

import { useEffect, useRef, useState } from "react";
import { useViewportMotion } from "@/hooks/use-viewport-motion";
import { MOTION_DURATION_MS, REDUCED_MOTION_QUERY } from "@/lib/motion";

/**
 * Counts from 0 to `value` once the element enters the viewport.
 * The observer is shared with other motion components and every scheduled
 * frame is cancelled when the component unmounts or its inputs change.
 */
export function StatCounter({
  value,
  duration = MOTION_DURATION_MS.count,
  format = "auto",
  className = "",
}: {
  value: number;
  duration?: number;
  format?: "auto" | "plain";
  className?: string;
}) {
  const { ref, hasEntered } = useViewportMotion<HTMLSpanElement>({
    threshold: 0.5,
    rootMargin: "0px",
    trackVisibility: false,
  });
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hasEntered) return;

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const canAnimate =
      !prefersReducedMotion && typeof IntersectionObserver !== "undefined" && duration > 0;

    if (!canAnimate) {
      frameRef.current = window.requestAnimationFrame(() => setDisplay(value));
      return () => {
        if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      };
    }

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(value * eased));

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [duration, hasEntered, value]);

  const formatted =
    format === "plain"
      ? String(display)
      : display >= 1000
        ? `${(display / 1000).toFixed(display % 1000 === 0 ? 0 : 1)}k`
        : String(display);

  return (
    <span ref={ref} className={`tabular-nums ${className}`.trim()}>
      {formatted}
    </span>
  );
}
