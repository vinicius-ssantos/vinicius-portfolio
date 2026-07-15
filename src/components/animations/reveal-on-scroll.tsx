"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type MotionPattern = "content" | "heading" | "list" | "data" | "diagram";

/**
 * Reveals content once it enters the viewport.
 *
 * `motion` describes why the element moves instead of exposing arbitrary
 * durations or distances at call sites. CSS maps each pattern to shared
 * tokens. Staggered collections default to `list`; other content defaults
 * to `content`.
 *
 * prefers-reduced-motion is handled by CSS, which renders every pattern in
 * its final state without spatial or continuous movement.
 */
export function RevealOnScroll({
  children,
  stagger = false,
  delay = 0,
  motion,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  stagger?: boolean;
  delay?: number;
  motion?: MotionPattern;
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const baseClass = stagger ? "reveal-stagger" : "reveal";
  const visibleClass = visible ? "is-visible" : "";
  const motionPattern = motion ?? (stagger ? "list" : "content");

  return (
    <Tag
      ref={ref as never}
      data-motion={motionPattern}
      className={`${baseClass} ${visibleClass} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
