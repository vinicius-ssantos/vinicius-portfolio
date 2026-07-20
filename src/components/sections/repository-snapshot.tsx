import { Tag, Scale, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProjectRepositorySnapshot } from "@/lib/github-repos";
import type { Lang } from "@/lib/i18n";

const dateFormatters: Record<Lang, Intl.DateTimeFormat> = {
  pt: new Intl.DateTimeFormat("pt-BR", { year: "numeric", month: "short", day: "numeric" }),
  en: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }),
};

function formatDate(iso: string, lang: Lang): string {
  return dateFormatters[lang].format(new Date(iso));
}

type Labels = {
  latestRelease: string;
  license: string;
  languages: string;
  lastActivity: string;
  archived: string;
  viaGitHub: string;
};

/**
 * Verifiable, GitHub-sourced signals only — never a substitute for the
 * editorial problem/approach/outcomes content above it. Renders nothing
 * (not a skeleton, not an error state) for any field the snapshot doesn't
 * have, so a fallback/partial response degrades silently instead of
 * showing empty or zeroed-out UI.
 */
export function RepositorySnapshot({
  snapshot,
  lang,
  labels,
}: {
  snapshot: ProjectRepositorySnapshot;
  lang: Lang;
  labels: Labels;
}) {
  const hasAnySignal =
    snapshot.latestRelease ||
    snapshot.license ||
    (snapshot.languages && snapshot.languages.length > 0) ||
    snapshot.pushedAt ||
    snapshot.isArchived;

  if (!hasAnySignal) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {snapshot.isArchived && (
          <Badge
            variant="outline"
            className="font-mono text-[10px] uppercase text-muted-foreground"
          >
            {labels.archived}
          </Badge>
        )}
        {snapshot.latestRelease && (
          <a
            href={snapshot.latestRelease.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-secondary/30 px-2.5 py-1 font-mono text-xs text-foreground/90 transition-colors hover:border-primary/40"
          >
            <Tag className="h-3 w-3 text-primary" aria-hidden />
            {labels.latestRelease}: {snapshot.latestRelease.tag}
          </a>
        )}
        {snapshot.license && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-secondary/30 px-2.5 py-1 font-mono text-xs text-foreground/90">
            <Scale className="h-3 w-3 text-primary" aria-hidden />
            {snapshot.license.spdxId ?? snapshot.license.name}
          </span>
        )}
        {snapshot.pushedAt && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-secondary/30 px-2.5 py-1 font-mono text-xs text-foreground/90">
            <Clock className="h-3 w-3 text-primary" aria-hidden />
            {labels.lastActivity}: {formatDate(snapshot.pushedAt, lang)}
          </span>
        )}
      </div>

      {snapshot.languages && snapshot.languages.length > 0 && (
        <div>
          <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {labels.languages}
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full border border-border/60">
            {snapshot.languages.map((l) => (
              <div
                key={l.name}
                style={{ width: `${l.percentage}%`, backgroundColor: l.color ?? "#6b7280" }}
                title={`${l.name}: ${l.percentage.toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {snapshot.languages.slice(0, 5).map((l) => (
              <span
                key={l.name}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: l.color ?? "#6b7280" }}
                  aria-hidden
                />
                {l.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {labels.viaGitHub}
      </p>
    </div>
  );
}
