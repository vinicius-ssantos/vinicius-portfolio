import { GraduationCap } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { education, t as tp, type Lang } from "@/content";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import type { Translation } from "@/lib/translations";
import { SectionHeading } from "./section-heading";

export function EducationSection({ t, lang }: { t: Translation; lang: Lang }) {
  return (
    <section id="education" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={t.education.eyebrow}
        title={t.education.title}
        description={t.education.description}
      />
      <RevealOnScroll stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {education.map((e, idx) => (
          <div
            key={`${e.institution}-${tp(e.degree, lang)}`}
            style={{ "--stagger-index": idx } as React.CSSProperties}
          >
            <Card className="card-lift h-full border-border/60 bg-card/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {tp(e.period, lang)}
                  </span>
                </div>
                <CardTitle className="mt-2 text-base">{tp(e.degree, lang)}</CardTitle>
                <CardDescription>{e.institution}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
      </RevealOnScroll>
    </section>
  );
}
