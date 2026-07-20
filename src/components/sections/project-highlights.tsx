import { FileCode2 } from "lucide-react";

/** Shared between the home case study and the project detail page. */
export function ProjectHighlights({ highlights }: { highlights: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {highlights.map((h) => (
        <div key={h} className="flex gap-3 rounded-md border border-border/60 bg-secondary/30 p-3">
          <FileCode2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
          <span className="text-sm leading-relaxed text-foreground/90">{h}</span>
        </div>
      ))}
    </div>
  );
}
