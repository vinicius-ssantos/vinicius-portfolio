import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <RevealOnScroll motion="heading" className="max-w-2xl">
      <div className="font-mono text-xs uppercase tracking-wider text-primary">{eyebrow}</div>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </RevealOnScroll>
  );
}
