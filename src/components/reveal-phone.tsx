"use client";

import { useState } from "react";
import { Phone, Eye, EyeOff } from "lucide-react";
import { profile } from "@/lib/portfolio-data";

/**
 * Phone number is not rendered in plain text by default — visitors must
 * click to reveal it. Reduces automated scraping for spam.
 *
 * The phone is still in the DOM after reveal (and remains in the PDF CV
 * at /cv-vinicius-santos.pdf), so this is a soft barrier, not a hard one.
 *
 * The reveal/collapse uses a slide+fade so the action is acknowledged.
 */
export function RevealPhone({ showLabel, hideLabel }: { showLabel: string; hideLabel: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
      {revealed ? (
        <span
          key="revealed"
          className="inline-flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300"
        >
          <span>{profile.phone}</span>
          <button
            type="button"
            onClick={() => setRevealed(false)}
            aria-label={hideLabel}
            title={hideLabel}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <EyeOff className="h-3.5 w-3.5" />
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary/80"
        >
          <Eye className="h-3.5 w-3.5" />
          {showLabel}
        </button>
      )}
    </div>
  );
}
