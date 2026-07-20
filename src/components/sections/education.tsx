import { getTranslations } from "next-intl/server";
import { GraduationCap } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEducation, type Lang } from "@/content";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { SectionHeading } from "./section-heading";

export async function EducationSection({ lang }: { lang: Lang }) {
  const t = await getTranslations("education");
  const education = getEducation(lang);

  return (
    <section id="education" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      <RevealOnScroll stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {education.map((e, idx) => (
          <div key={e.id} style={{ "--stagger-index": idx } as React.CSSProperties}>
            <Card className="card-lift h-full border-border/60 bg-card/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {e.period}
                  </span>
                </div>
                <CardTitle className="mt-2 text-base">{e.degree}</CardTitle>
                <CardDescription>{e.institution}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
      </RevealOnScroll>
    </section>
  );
}
