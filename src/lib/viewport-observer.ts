export type ViewportObserverOptions = {
  rootMargin?: string;
  threshold?: number;
};

type ViewportListener = (entry: IntersectionObserverEntry) => void;

type ObserverPool = {
  observer: IntersectionObserver;
  listeners: Map<Element, Set<ViewportListener>>;
};

const observerPools = new Map<string, ObserverPool>();

function observerKey({ rootMargin = "0px", threshold = 0 }: ViewportObserverOptions): string {
  return `${rootMargin}|${threshold}`;
}

/**
 * Observe an element through a shared IntersectionObserver instance.
 * Elements using equivalent options share one native observer while keeping
 * independent listeners and cleanup.
 */
export function observeViewport(
  target: Element,
  listener: ViewportListener,
  options: ViewportObserverOptions = {},
): () => void {
  if (typeof IntersectionObserver === "undefined") return () => undefined;

  const normalizedOptions = {
    rootMargin: options.rootMargin ?? "0px",
    threshold: options.threshold ?? 0,
  };
  const key = observerKey(normalizedOptions);
  let pool = observerPools.get(key);

  if (!pool) {
    const listeners = new Map<Element, Set<ViewportListener>>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const targetListeners = listeners.get(entry.target);
        if (!targetListeners) continue;

        for (const targetListener of targetListeners) {
          targetListener(entry);
        }
      }
    }, normalizedOptions);

    pool = { observer, listeners };
    observerPools.set(key, pool);
  }

  let targetListeners = pool.listeners.get(target);
  if (!targetListeners) {
    targetListeners = new Set<ViewportListener>();
    pool.listeners.set(target, targetListeners);
    pool.observer.observe(target);
  }
  targetListeners.add(listener);

  let active = true;
  return () => {
    if (!active) return;
    active = false;

    const currentPool = observerPools.get(key);
    const currentListeners = currentPool?.listeners.get(target);
    if (!currentPool || !currentListeners) return;

    currentListeners.delete(listener);
    if (currentListeners.size === 0) {
      currentPool.observer.unobserve(target);
      currentPool.listeners.delete(target);
    }

    if (currentPool.listeners.size === 0) {
      currentPool.observer.disconnect();
      observerPools.delete(key);
    }
  };
}

export function resetViewportObserverPoolsForTests(): void {
  for (const pool of observerPools.values()) {
    pool.observer.disconnect();
  }
  observerPools.clear();
}
