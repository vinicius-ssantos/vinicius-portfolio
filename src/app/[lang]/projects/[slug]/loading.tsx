/**
 * Loading UI for project detail pages. Same fade+spinner as /[lang]/loading.tsx.
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
          Carregando…
        </span>
      </div>
    </div>
  );
}
