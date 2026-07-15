"use client";

import { useEffect, useRef, useState } from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";
import { observeViewport } from "@/lib/viewport-observer";

type ViewportMotionState = {
  hasEntered: boolean;
  inViewport: boolean;
};

type UseViewportMotionOptions = {
  delay?: number;
  rootMargin?: string;
  threshold?: number;
  trackVisibility?: boolean;
};

/**
 * Coordinates one-time entrance motion and current viewport visibility.
 * Native observers are pooled by option set, delayed work is cancelled when
 * an element leaves early, and every timer/observer is released on unmount.
 */
export function useViewportMotion<T extends Element>({
  delay = 0,
  rootMargin = "0px 0px -40px 0px",
  threshold = 0.1,
  trackVisibility = true,
}: UseViewportMotionOptions = {}) {
  const ref = useRef<T | null>(null);
  const enteredRef = useRef(false);
  const [state, setState] = useState<ViewportMotionState>({
    hasEntered: false,
    inViewport: false,
  });

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    let disposed = false;
    let delayTimer: number | undefined;
    let fallbackTimer: number | undefined;
    let stopObserving = () => undefined;

    const markEntered = () => {
      if (disposed || enteredRef.current) return;
      enteredRef.current = true;
      setState((current) => ({
        hasEntered: true,
        inViewport: current.inViewport || !trackVisibility,
      }));
    };

    const showStaticState = () => {
      fallbackTimer = window.setTimeout(() => {
        if (disposed) return;
        enteredRef.current = true;
        setState({ hasEntered: true, inViewport: true });
      }, 0);
    };

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      showStaticState();
      return () => {
        disposed = true;
        if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      };
    }

    stopObserving = observeViewport(
      target,
      (entry) => {
        if (entry.isIntersecting) {
          setState((current) =>
            current.inViewport ? current : { ...current, inViewport: true },
          );

          if (!enteredRef.current && delayTimer === undefined) {
            if (delay > 0) {
              delayTimer = window.setTimeout(() => {
                delayTimer = undefined;
                markEntered();
                if (!trackVisibility) stopObserving();
              }, delay);
            } else {
              markEntered();
              if (!trackVisibility) stopObserving();
            }
          }
          return;
        }

        if (delayTimer !== undefined) {
          window.clearTimeout(delayTimer);
          delayTimer = undefined;
        }

        if (trackVisibility) {
          setState((current) =>
            current.inViewport ? { ...current, inViewport: false } : current,
          );
        }
      },
      { rootMargin, threshold },
    );

    return () => {
      disposed = true;
      stopObserving();
      if (delayTimer !== undefined) window.clearTimeout(delayTimer);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
    };
  }, [delay, rootMargin, threshold, trackVisibility]);

  return {
    ref,
    hasEntered: state.hasEntered,
    inViewport: state.inViewport,
  };
}
