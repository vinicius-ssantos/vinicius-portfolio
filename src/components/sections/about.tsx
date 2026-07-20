import { getTranslations } from "next-intl/server";
import { Briefcase, MapPin, Globe, Mail, Server, FileCode2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfile, getSpokenLanguages, type Lang } from "@/content";
import { RevealPhone } from "@/components/reveal-phone";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { SectionHeading } from "./section-heading";

export async function About({ lang }: { lang: Lang }) {
  const t = await getTranslations("about");
  const profile = getProfile(lang);
  const spokenLanguages = getSpokenLanguages(lang);

  return (
    <section id="about" className="border-t border-border/60 bg-secondary/20">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description="" />
        <RevealOnScroll className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-border/60 bg-card/50 lg:col-span-2">
            <CardContent className="space-y-6 pt-6 text-base leading-relaxed text-foreground/90">
              <p>{profile.longPitch}</p>
              <div>
                <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">
                  {t("careerPath")}
                </h3>
                <p>{profile.careerPath}</p>
              </div>
              <div>
                <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">
                  {t("howIThink")}
                </h3>
                <p>{profile.philosophy}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-lift border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
                {t("currently")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Briefcase className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{t("currentlyItems.role")}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{spokenLanguages.join(" · ")}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="break-all">{profile.email}</span>
              </div>
              <RevealPhone showLabel={t("showPhone")} hideLabel={t("hidePhone")} />
              <div className="flex items-start gap-2">
                <Server className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{t("currentlyItems.runningCluster")}</span>
              </div>
              <div className="mt-4 border-t border-border/60 pt-3">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-primary">
                  {t("currentlyLearning")}
                </div>
                <ul className="space-y-2">
                  {profile.currentlyLearning.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FileCode2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
                      <div>
                        <div className="font-medium text-foreground">{item.topic}</div>
                        <div className="text-xs text-muted-foreground">{item.detail}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </RevealOnScroll>
      </div>
    </section>
  );
}
