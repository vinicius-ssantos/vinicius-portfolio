/** @vitest-environment jsdom */

import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import type { NavSectionId } from "@/lib/nav-sections";
import { resetViewportObserverPoolsForTests } from "@/lib/viewport-observer";

const SECTION_IDS: readonly NavSectionId[] = [
  "experience",
  "stack",
  "projects",
  "case-study",
  "about",
];

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly targets = new Set<Element>();
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element) {
    this.targets.add(target);
  }

  unobserve(target: Element) {
    this.targets.delete(target);
  }

  disconnect() {
    this.targets.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(target: Element, isIntersecting: boolean) {
    const entry = {
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: target.getBoundingClientRect(),
      isIntersecting,
      rootBounds: null,
      target,
      time: performance.now(),
    } as IntersectionObserverEntry;

    this.callback([entry], this as unknown as IntersectionObserver);
  }
}

function currentObserver(): MockIntersectionObserver {
  const observer = MockIntersectionObserver.instances[0];
  if (!observer) throw new Error("Expected a shared IntersectionObserver instance");
  return observer;
}

function elementFor(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Expected #${id} to exist`);
  return el;
}

beforeEach(() => {
  MockIntersectionObserver.instances = [];
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  window.location.hash = "";
  document.body.innerHTML = SECTION_IDS.map((id) => `<section id="${id}"></section>`).join("");
});

afterEach(() => {
  cleanup();
  resetViewportObserverPoolsForTests();
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

describe("useScrollSpy", () => {
  it("has no active section before anything enters the viewport band", () => {
    const { result } = renderHook(() => useScrollSpy(SECTION_IDS));
    expect(result.current).toBeNull();
  });

  it("tracks the predominant section across two section changes", () => {
    const { result } = renderHook(() => useScrollSpy(SECTION_IDS));
    const observer = currentObserver();

    act(() => observer.trigger(elementFor("experience"), true));
    expect(result.current).toBe("experience");

    act(() => {
      observer.trigger(elementFor("experience"), false);
      observer.trigger(elementFor("stack"), true);
    });
    expect(result.current).toBe("stack");

    act(() => {
      observer.trigger(elementFor("stack"), false);
      observer.trigger(elementFor("projects"), true);
    });
    expect(result.current).toBe("projects");
  });

  it("keeps the last known section active instead of flickering to none between sections", () => {
    const { result } = renderHook(() => useScrollSpy(SECTION_IDS));
    const observer = currentObserver();

    act(() => observer.trigger(elementFor("experience"), true));
    expect(result.current).toBe("experience");

    act(() => observer.trigger(elementFor("experience"), false));
    expect(result.current).toBe("experience");
  });

  it("marks the section from the URL hash on direct load", async () => {
    window.location.hash = "#case-study";
    const { result } = renderHook(() => useScrollSpy(SECTION_IDS));
    // The hash-derived initial value is applied via a microtask (see hook
    // comment) instead of the render's own state initializer.
    await act(() => Promise.resolve());
    expect(result.current).toBe("case-study");
  });

  it("jumps to the section targeted by anchor/history navigation without flickering through sections passed in transit", () => {
    const { result } = renderHook(() => useScrollSpy(SECTION_IDS));
    const observer = currentObserver();

    act(() => observer.trigger(elementFor("experience"), true));
    expect(result.current).toBe("experience");

    act(() => {
      window.location.hash = "#about";
      window.dispatchEvent(new Event("hashchange"));
    });
    expect(result.current).toBe("about");

    // Sections between "experience" and "about" briefly intersect the band
    // during the smooth-scroll transit; the navigation lock must ignore them.
    act(() => observer.trigger(elementFor("projects"), true));
    expect(result.current).toBe("about");
  });

  it("disconnects observers on unmount", () => {
    const { unmount } = renderHook(() => useScrollSpy(SECTION_IDS));
    const observer = currentObserver();

    unmount();

    expect(observer.targets.size).toBe(0);
  });
});
