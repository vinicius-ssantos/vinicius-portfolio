/** @vitest-environment jsdom */

import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { resetViewportObserverPoolsForTests } from "@/lib/viewport-observer";

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds: readonly number[];
  readonly targets = new Set<Element>();
  disconnected = false;

  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
    this.callback = callback;
    this.rootMargin = options.rootMargin ?? "0px";
    this.thresholds = [typeof options.threshold === "number" ? options.threshold : 0];
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element) {
    this.targets.add(target);
  }

  unobserve(target: Element) {
    this.targets.delete(target);
  }

  disconnect() {
    this.disconnected = true;
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

function stubMotionPreference(matches = false) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((media: string) => ({
      matches,
      media,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  MockIntersectionObserver.instances = [];
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  stubMotionPreference();
});

afterEach(() => {
  cleanup();
  resetViewportObserverPoolsForTests();
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("RevealOnScroll", () => {
  it("shares one native observer and keeps entrance state after leaving", () => {
    render(
      <>
        <RevealOnScroll>first</RevealOnScroll>
        <RevealOnScroll>second</RevealOnScroll>
      </>,
    );

    expect(MockIntersectionObserver.instances).toHaveLength(1);
    const observer = currentObserver();
    const first = screen.getByText("first");
    const second = screen.getByText("second");

    act(() => observer.trigger(first, true));
    expect(first).toHaveClass("is-visible");
    expect(first).toHaveAttribute("data-motion-in-viewport", "true");
    expect(second).not.toHaveClass("is-visible");

    act(() => observer.trigger(first, false));
    expect(first).toHaveClass("is-visible");
    expect(first).toHaveAttribute("data-motion-in-viewport", "false");

    act(() => observer.trigger(first, true));
    expect(first).toHaveClass("is-visible");
  });

  it("cancels delayed entrance work and observation on unmount", () => {
    const { unmount } = render(<RevealOnScroll delay={250}>delayed</RevealOnScroll>);
    const observer = currentObserver();
    const target = screen.getByText("delayed");

    act(() => observer.trigger(target, true));
    expect(vi.getTimerCount()).toBe(1);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(observer.disconnected).toBe(true);
  });

  it("shows the final state when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<RevealOnScroll>fallback</RevealOnScroll>);

    act(() => vi.runAllTimers());
    expect(screen.getByText("fallback")).toHaveClass("is-visible");
  });

  it("shows the final state immediately for reduced motion", () => {
    stubMotionPreference(true);
    render(<RevealOnScroll>reduced</RevealOnScroll>);

    act(() => vi.runAllTimers());
    expect(screen.getByText("reduced")).toHaveClass("is-visible");
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });
});
