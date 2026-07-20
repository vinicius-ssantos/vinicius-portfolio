import { getTranslations } from "next-intl/server";
import { Terminal, Boxes, Shield, Database, GitCommitVertical, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { stack } from "@/content";
import { getGitHubStats, type LanguageStat } from "@/lib/github";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { SectionHeading } from "./section-heading";

type TFunc = Awaited<ReturnType<typeof getTranslations<"stack">>>;

const stackIcons: Record<string, typeof Server> = {
  Backend: Server,
  Quality: Shield,
  Data: Database,
  DevOps: Boxes,
  Infrastructure: Server,
  Methods: GitCommitVertical,
  Languages: Terminal,
};

function LanguagesBar({ languages, t }: { languages: LanguageStat[]; t: TFunc }) {
  if (languages.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="font-mono text-xs uppercase tracking-wider text-primary">
          {t("languagesLabel")}
        </h3>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {t("languagesLive")}
        </span>
      </div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full border border-border/60">
        {languages.map((lang, i) => (
          <div
            key={lang.name}
            className="lang-bar-segment"
            style={
              {
                width: `${lang.percentage}%`,
                backgroundColor: lang.color,
                "--bar-index": i,
              } as React.CSSProperties
            }
            title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
            <span className="font-mono text-xs text-muted-foreground">
              {lang.name} <span className="text-foreground/60">{lang.percentage.toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackGrid({ entries }: { entries: [string, string[]][] }) {
  return (
    <RevealOnScroll stagger className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(([category, items], idx) => {
        const Icon = stackIcons[category] ?? Terminal;
        return (
          <div key={category} style={{ "--stagger-index": idx } as React.CSSProperties}>
            <Card className="card-lift h-full border-border/60 bg-card/50 hover:border-primary/40">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                    {category}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((label) => (
                    <Badge
                      key={label}
                      variant="secondary"
                      className="font-mono text-xs font-normal"
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </RevealOnScroll>
  );
}

export async function Stack() {
  const t = await getTranslations("stack");
  const gh = await getGitHubStats();
  const professionalEntries = Object.entries(stack.professional);
  const personalEntries = Object.entries(stack.personal);
  return (
    <section id="stack" className="border-y border-border/60 bg-secondary/20">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
        <RevealOnScroll motion="data" className="motion-language-bars mt-8">
          <LanguagesBar languages={gh.languages} t={t} />
        </RevealOnScroll>

        <h3 className="mt-10 font-mono text-xs uppercase tracking-wider text-primary">
          {t("professionalTitle")}
        </h3>
        <StackGrid entries={professionalEntries} />

        <h3 className="mt-10 font-mono text-xs uppercase tracking-wider text-primary">
          {t("personalTitle")}
        </h3>
        <StackGrid entries={personalEntries} />
      </div>
    </section>
  );
}
