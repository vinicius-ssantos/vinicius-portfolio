"use client";

import type { ReactNode } from "react";
import { useViewportMotion } from "@/hooks/use-viewport-motion";

export type MotionPattern = "content" | "heading" | "list" | "data" | "diagram";

type RevealTag = "div" | "section" | "article" | "aside" | "figure" | "ul" | "ol" | "li" | "span";

/**
 * Reveals content once it enters the viewport and keeps reporting current
 * visibility so continuous descendant animations can pause offscreen.
 *
 * `motion` describes why the element moves instead of exposing arbitrary
 * durations or distances at call sites. CSS maps each pattern to shared
 * tokens. Staggered collections default to `list`; other content defaults
 * to `content`.
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
  /**
   * Restricted to HTML wrappers rather than a bare `React.ElementType`:
   * @react-three/fiber (#48 spike) augments the global JSX namespace with
   * three.js elements whose `children` type is `never`, which makes an
   * unconstrained element type ambiguous here and fails to typecheck.
   */
  as?: RevealTag;
}) {
  const { ref, hasEntered, inViewport } = useViewportMotion<HTMLElement>({ delay });
  const baseClass = stagger ? "reveal-stagger" : "reveal";
  const visibleClass = hasEntered ? "is-visible" : "";
  const motionPattern = motion ?? (stagger ? "list" : "content");

  return (
    <Tag
      ref={ref as never}
      data-motion={motionPattern}
      data-motion-entered={hasEntered ? "true" : "false"}
      data-motion-in-viewport={inViewport ? "true" : "false"}
      className={`${baseClass} ${visibleClass} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
