"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts from 0 to `value` when the element scrolls into view.
 * Uses requestAnimationFrame with easeOutExpo so the count decelerates
 * towards the end — feels more natural than linear.
 *
 * Respects prefers-reduced-motion: jumps straight to the final value.
 */
export function StatCounter({
  value,
  duration = 1400,
  format = "auto",
  className = "",
}: {
  value: number;
  duration?: number;
  // "auto" uses formatStat logic (k for thousands), "plain" renders raw
  format?: "auto" | "plain";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const runCount = () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        requestAnimationFrame(() => setDisplay(value));
        return;
      }

      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setDisplay(Math.round(value * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      // Very old browsers: just show the final value, no animation.
      // Using rAF avoids the lint rule about setState in effect.
      requestAnimationFrame(() => setDisplay(value));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            runCount();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

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
