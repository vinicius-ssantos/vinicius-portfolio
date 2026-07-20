"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type RenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
};

type TurnstileApi = {
  render: (container: HTMLElement, options: RenderOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
let scriptLoadPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptLoadPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Turnstile script"));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

type UseTurnstileResult = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  token: string | null;
  /** A recoverable error occurred (load/render/expire) — the widget has
   * already reinitialized itself and a fresh token can still arrive. */
  error: boolean;
  reset: () => void;
};

/**
 * Loads the Turnstile script once (shared across every mount) and renders a
 * Managed-mode widget into `containerRef`. `theme` should track the app's
 * current theme so the widget doesn't visually clash with the modal.
 */
export function useTurnstile(
  siteKey: string,
  theme: "light" | "dark" = "light",
): UseTurnstileResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const reset = useCallback(() => {
    setToken(null);
    setError(false);
    if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size: "flexible",
          callback: (t) => {
            setToken(t);
            setError(false);
          },
          "error-callback": () => {
            // Widget reinitializes itself on a recoverable error; clearing
            // the token just blocks submission until a new one arrives.
            setToken(null);
            setError(true);
          },
          "expired-callback": () => setToken(null),
          "timeout-callback": () => setToken(null),
        });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-render on theme change intentionally excluded: recreating the widget on every theme toggle would be jarring mid-fill.
  }, [siteKey]);

  return { containerRef, token, error, reset };
}
