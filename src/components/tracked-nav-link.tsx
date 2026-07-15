"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/**
 * Internal next/link with a click-tracked analytics event. Same rationale
 * as TrackedExternalLink — server-rendered sections (project cards, the
 * case study) can't attach onClick handlers directly since they aren't
 * client components; this leaf is.
 */
export const TrackedLink = forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link> & {
    event: AnalyticsEvent;
    properties?: Record<string, string>;
  }
>(function TrackedLink({ event, properties, onClick, ...props }, ref) {
  return (
    <Link
      ref={ref}
      onClick={(e) => {
        trackEvent(event, properties);
        onClick?.(e);
      }}
      {...props}
    />
  );
});
