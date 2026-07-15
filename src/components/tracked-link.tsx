"use client";

import { forwardRef } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/**
 * External link with a click-tracked analytics event. Split out as its
 * own client component so server-rendered pages (like the project detail
 * page) can attach an onClick without becoming client components
 * themselves — only this tiny leaf needs the "use client" boundary.
 *
 * Forwards ref and spreads standard anchor props so it works both as a
 * plain `<a>` replacement and as the child of `<Button asChild>` (Radix
 * Slot clones its child's props, which requires ref forwarding).
 */
export const TrackedExternalLink = forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    event: AnalyticsEvent;
    properties?: Record<string, string>;
  }
>(function TrackedExternalLink({ event, properties, onClick, ...props }, ref) {
  return (
    <a
      ref={ref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        trackEvent(event, properties);
        onClick?.(e);
      }}
      {...props}
    />
  );
});
