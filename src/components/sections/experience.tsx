import { Briefcase } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { experience, t as tp, type Lang } from "@/content";
import { formatMonthYear } from "@/lib/i18n";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import type { Translation } from "@/lib/translations";
import { SectionHeading } from "./section-heading";

export function Experience({ t, lang }: { t: Translation; lang: Lang }) {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={t.experience.eyebrow}
        title={t.experience.title}
        description={t.experience.description}
      />
      <RevealOnScroll stagger className="mt-10 space-y-4">
        {experience.map((exp, idx) => (
          <div
            key={`${exp.company}-${exp.startDate}`}
            style={{ "--stagger-index": idx } as React.CSSProperties}
          >
            <ExperienceCard exp={exp} t={t} lang={lang} />
          </div>
        ))}
      </RevealOnScroll>
    </section>
  );
}

function ExperienceCard({
  exp,
  t,
  lang,
}: {
  exp: (typeof experience)[number];
  t: Translation;
  lang: Lang;
}) {
  return (
    <Card className="card-lift border-border/60 bg-card/50 hover:border-primary/40">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg font-semibold text-primary">
              {tp(exp.role, lang)}
            </CardTitle>
            {exp.current && (
              <Badge
                variant="outline"
                className="border-primary/40 text-primary font-mono text-[10px] uppercase"
              >
                {t.experience.current}
              </Badge>
            )}
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            <time dateTime={exp.startDate}>{formatMonthYear(exp.startDate, lang)}</time>
            {" — "}
            {exp.current || !exp.endDate ? (
              t.experience.present
            ) : (
              <time dateTime={exp.endDate}>{formatMonthYear(exp.endDate, lang)}</time>
            )}
          </span>
        </div>
        <CardDescription className="text-sm font-medium text-foreground/70">
          {exp.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-foreground/90">{tp(exp.summary, lang)}</p>
        <ul className="space-y-2">
          {exp.bullets.map((b, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
              <CheckCircle2
                className="check-pop mt-0.5 h-4 w-4 flex-shrink-0 text-primary/70"
                style={{ "--check-index": i } as React.CSSProperties}
              />
              <span>{tp(b, lang)}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {exp.stack.map((s) => (
            <Badge key={s} variant="secondary" className="font-mono text-[10px] font-normal">
              {s}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
