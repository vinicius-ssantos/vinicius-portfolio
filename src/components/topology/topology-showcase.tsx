"use client";

import dynamic from "next/dynamic";
import { useMemo, useSyncExternalStore } from "react";
import type { Architecture } from "@/content";
import { useViewportMotion } from "@/hooks/use-viewport-motion";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";
import { toScene } from "@/lib/topology";

// Keeps three.js out of the initial bundle: the chunk is only requested once
// this component decides the scene should exist at all (#48 requires the 3D
// bundle never load when the experience isn't visible).
const Topology3D = dynamic(() => import("./topology-3d"), {
  ssr: false,
  loading: () => null,
});

// These are all reads of external browser state, so they use
// useSyncExternalStore rather than an effect that immediately setStates —
// that pattern cascades renders and the server snapshot keeps hydration
// honest instead of guessing a client value on the server.

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** True while the document is visible — a hidden tab must not render frames. */
function useTabVisible(): boolean {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );
}

function subscribeReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () =>
      typeof window.matchMedia === "function" && window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/**
 * WebGL can be unavailable (old device, disabled flag, exhausted contexts) or
 * fail outright. Probing lets the caller keep the accessible 2.5D diagram as
 * the only thing on screen instead of leaving a dead canvas behind.
 *
 * Cached module-side: creating a throwaway canvas per render would be
 * wasteful, and `getSnapshot` must return a stable value or React loops.
 */
let webglSupport: boolean | undefined;

function probeWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

function noopSubscribe() {
  return () => {};
}

/**
 * #48's fallback table routes mobile and limited-budget devices to the 2.5D
 * topology rather than WebGL. Matching the site's own `lg` breakpoint keeps
 * that consistent with where the Hero already swaps to its compact variant —
 * and the scene genuinely doesn't fit below it: labels clip and overlap.
 */
const WIDE_VIEWPORT_QUERY = "(min-width: 1024px)";

function subscribeWideViewport(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(WIDE_VIEWPORT_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useWideViewport(): boolean {
  return useSyncExternalStore(
    subscribeWideViewport,
    () => typeof window.matchMedia === "function" && window.matchMedia(WIDE_VIEWPORT_QUERY).matches,
    () => false,
  );
}

/** `null` on the server, where the probe can't run. */
function useWebGLSupported(): boolean | null {
  return useSyncExternalStore(noopSubscribe, probeWebGL, () => null);
}

/**
 * The #48 Phase A prototype surface.
 *
 * Renders the experimental canvas above whatever the caller already shows —
 * it never replaces the accessible HTML topology, so no information lives
 * only inside WebGL. Returns nothing at all when WebGL is missing, which is
 * the same end state as the flag being off.
 */
export function TopologyShowcase({
  architecture,
  label,
}: {
  architecture: Architecture;
  label: string;
}) {
  const { ref, inViewport } = useViewportMotion<HTMLDivElement>({
    rootMargin: "0px",
    threshold: 0,
  });
  const tabVisible = useTabVisible();
  const reducedMotion = usePrefersReducedMotion();
  const webglSupported = useWebGLSupported();
  const wideViewport = useWideViewport();

  const scene = useMemo(() => toScene(architecture), [architecture]);

  // Both paths leave the accessible 2.5D diagram as the whole experience,
  // which is the documented fallback rather than a degraded state.
  if (webglSupported === false || !wideViewport) return null;

  return (
    <div
      ref={ref}
      data-topology-3d="true"
      aria-hidden="true"
      className="relative mb-4 h-64 overflow-hidden rounded-lg border border-border/60 bg-secondary/20 sm:h-80"
    >
      <div className="absolute left-3 top-2 z-10 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {/* `null` until the probe resolves, so the canvas never mounts on a
          device that turns out not to support it. */}
      {webglSupported ? (
        <Topology3D scene={scene} active={inViewport && tabVisible} reducedMotion={reducedMotion} />
      ) : null}
    </div>
  );
}
