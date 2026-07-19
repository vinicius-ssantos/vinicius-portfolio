"use client";

import { useEffect, useRef, useState } from "react";
import { MOTION_DURATION_MS } from "@/lib/motion";
import type { NavSectionId } from "@/lib/nav-sections";
import { observeViewport } from "@/lib/viewport-observer";

// How long observer-driven updates are ignored after an anchor/hash jump,
// so the target link doesn't flicker through sections scrolled past in transit.
const NAVIGATION_LOCK_MS = MOTION_DURATION_MS.expressive;

// Band under the sticky header where a section counts as "current": starts
// just below the header and covers the upper portion of the viewport, so at
// most one section is realistically active at a time.
const SPY_ROOT_MARGIN = "-84px 0px -55% 0px";

function sectionIdFromHash(hash: string, sectionIds: readonly NavSectionId[]): NavSectionId | null {
  const id = hash.replace(/^#/, "");
  return (sectionIds as readonly string[]).includes(id) ? (id as NavSectionId) : null;
}

/**
 * Tracks which section is predominant in the viewport via a shared
 * IntersectionObserver band, and keeps it in sync with anchor clicks,
 * browser history, and direct hash loads. Never writes to the URL/history
 * itself — only click/hashchange (native anchor behavior) do that.
 *
 * State always starts `null` (matching the server-rendered markup) and the
 * hash-derived value, if any, is applied inside the effect rather than in
 * the initializer — a value that's already correct on the hydration render
 * never goes through a real update, and React's production hydration path
 * does not reliably patch custom attributes (data-active/aria-current) in
 * that case.
 */
export function useScrollSpy(sectionIds: readonly NavSectionId[]): NavSectionId | null {
  const [active, setActive] = useState<NavSectionId | null>(null);
  const visibleRef = useRef(new Set<NavSectionId>());
  const lockedUntilRef = useRef(0);

  useEffect(() => {
    // On a direct hash load, the browser still needs to scroll to the
    // anchor. Lock immediately so the observer's first report — whatever
    // happens to be in the band before that scroll completes — doesn't
    // stomp the hash-derived initial state.
    const initialId = sectionIdFromHash(window.location.hash, sectionIds);
    if (initialId) {
      lockedUntilRef.current = Date.now() + NAVIGATION_LOCK_MS;
      // Deferred rather than called synchronously: a value already correct
      // on the hydration render itself doesn't reliably reach the DOM (React's
      // production hydration path skips patching data-*/aria-* attributes
      // that were "already right"), so this needs a genuine post-mount update.
      queueMicrotask(() => setActive(initialId));
    }

    const onHashChange = () => {
      const id = sectionIdFromHash(window.location.hash, sectionIds);
      if (!id) return;
      lockedUntilRef.current = Date.now() + NAVIGATION_LOCK_MS;
      setActive(id);
    };
    window.addEventListener("hashchange", onHashChange);

    const stopObservers = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
      .map((el) =>
        observeViewport(
          el,
          (entry) => {
            const id = el.id as NavSectionId;
            if (entry.isIntersecting) visibleRef.current.add(id);
            else visibleRef.current.delete(id);

            if (Date.now() < lockedUntilRef.current) return;

            const predominant = sectionIds
              .filter((sectionId) => visibleRef.current.has(sectionId))
              .at(-1);
            if (predominant)
              setActive((current) => (current === predominant ? current : predominant));
          },
          { rootMargin: SPY_ROOT_MARGIN, threshold: 0 },
        ),
      );

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      for (const stop of stopObservers) stop();
    };
  }, [sectionIds]);

  return active;
}
