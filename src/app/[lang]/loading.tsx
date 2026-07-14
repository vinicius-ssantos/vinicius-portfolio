/**
 * Loading UI shown by Next.js App Router when the /[lang] segment is
 * suspending (e.g. on first navigation, during streaming). Provides a
 * subtle fade-in so route changes don't feel jarring.
 *
 * This file is rendered by the framework — it must be a server component.
 */
export default function Loading() {
  return (
    <div
      className="page-transition flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-full border-2 border-secondary" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {/* Server component — no access to translations. Neutral label. */}
          Carregando…
        </span>
      </div>
    </div>
  );
}
