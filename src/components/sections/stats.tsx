import { profile, t as tp, type Lang, type LocalizedText } from "@/content";
import { getGitHubStats, formatStat, type ContributionDay } from "@/lib/github";
import { StatCounter } from "@/components/animations/stat-counter";
import type { Translation } from "@/lib/translations";

function intensityClass(count: number): string {
  if (count === 0) return "bg-secondary";
  if (count <= 2) return "bg-primary/20";
  if (count <= 5) return "bg-primary/40";
  if (count <= 9) return "bg-primary/65";
  return "bg-primary";
}

function ContributionHeatmap({
  weeks,
  total,
  t,
}: {
  weeks: ContributionDay[][];
  total: number;
  t: Translation;
}) {
  if (weeks.length === 0) return null;
  const days = weeks.flat();

  return (
    <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6">
      <div className="rounded-lg border border-border/60 bg-background/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs text-foreground">
            <span className="font-bold text-primary">{formatStat(total)}</span>{" "}
            <span className="text-muted-foreground">{t.stats.heatmapTitle}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">{t.stats.heatmapLess}</span>
            <span className="h-2.5 w-2.5 rounded-[2px] bg-secondary" />
            <span className="h-2.5 w-2.5 rounded-[2px] bg-primary/20" />
            <span className="h-2.5 w-2.5 rounded-[2px] bg-primary/40" />
            <span className="h-2.5 w-2.5 rounded-[2px] bg-primary/65" />
            <span className="h-2.5 w-2.5 rounded-[2px] bg-primary" />
            <span className="text-[10px] text-muted-foreground">{t.stats.heatmapMore}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div
            className="grid gap-[3px]"
            style={{
              gridTemplateRows: "repeat(7, 1fr)",
              gridAutoFlow: "column",
              width: "max-content",
            }}
            role="img"
            aria-label={`${formatStat(total)} ${t.stats.heatmapTitle}`}
          >
            {days.map((day, i) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} contributions`}
                className={`heatmap-cell h-[11px] w-[11px] rounded-[2px] ${intensityClass(day.count)}`}
                style={{ "--cell-delay": `${Math.min(i * 4, 800)}ms` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function StatsBar({ t, lang }: { t: Translation; lang: Lang }) {
  const gh = await getGitHubStats();

  // Each stat carries its label + a numeric value for the animated counter,
  // plus its own `live` flag — only the repo count is ever GitHub-sourced,
  // and only when the API call actually succeeded (gh.isLive), never just
  // because GITHUB_TOKEN is set. The years-based stats are always derived
  // from the Experience timeline, so they're never marked live.
  const stats: { label: LocalizedText; numeric: number; fallback: string; live: boolean }[] = [
    {
      label: profile.stats[0].label,
      numeric: parseInt(profile.stats[0].value, 10) || 0,
      fallback: profile.stats[0].value,
      live: false,
    },
    {
      label: profile.stats[1].label,
      numeric: parseInt(profile.stats[1].value, 10) || 0,
      fallback: profile.stats[1].value,
      live: false,
    },
    {
      label: profile.stats[2].label,
      numeric: gh.isLive ? gh.publicRepos : parseInt(profile.stats[2].value, 10) || 0,
      fallback: gh.isLive ? formatStat(gh.publicRepos) : profile.stats[2].value,
      live: gh.isLive,
    },
  ];

  return (
    <section className="border-y border-border/60 bg-secondary/20">
      <div className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-border/60 px-4 sm:px-6">
        {stats.map((s) => (
          <div key={tp(s.label, lang)} className="relative px-3 py-6 text-center sm:px-6">
            {s.live && (
              <span
                className="absolute right-2 top-2 inline-flex h-1.5 w-1.5 rounded-full bg-primary sm:right-4 sm:top-4"
                title="Live data"
                aria-label="Live data"
              />
            )}
            <div className="font-mono text-2xl font-bold tabular-nums sm:text-3xl">
              <StatCounter value={s.numeric} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{tp(s.label, lang)}</div>
          </div>
        ))}
      </div>
      {gh.isLive && <ContributionHeatmap weeks={gh.weeks} total={gh.contributions} t={t} />}
    </section>
  );
}
