"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Wraps children and fades + slides them up when they enter the viewport.
 * Uses IntersectionObserver — fires once per element, then disconnects.
 *
 * Two modes:
 *  - default:     the wrapper itself fades in
 *  - stagger:     children fade in one by one (set --stagger-index on each child)
 *
 * Respects prefers-reduced-motion via CSS (the .reveal classes disable
 * themselves in that media query).
 */
export function RevealOnScroll({
  children,
  stagger = false,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  stagger?: boolean;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver isn't available (very old browsers), show anyway.
    if (typeof IntersectionObserver === "undefined") {
      // Use rAF to avoid the lint rule about setState in effect body.
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Apply optional delay before triggering.
            window.setTimeout(() => setVisible(true), delay);
            observer.disconnect();
            break;
          }
        }
      },
      // Trigger when ~10% of the element is visible — feels snappier than 0.
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const baseClass = stagger ? "reveal-stagger" : "reveal";
  const visibleClass = visible ? "is-visible" : "";

  return (
    <Tag
      ref={ref as never}
      className={`${baseClass} ${visibleClass} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
