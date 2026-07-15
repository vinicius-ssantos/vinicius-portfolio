import { Badge } from "@/components/ui/badge";

/** Shared between the home project cards and the project detail page. */
export function ProjectStackBadges({
  stack,
  limit,
  size = "sm",
}: {
  stack: string[];
  limit?: number;
  size?: "sm" | "xs";
}) {
  const shown = limit ? stack.slice(0, limit) : stack;
  const overflow = limit && stack.length > limit ? stack.length - limit : 0;
  const textSize = size === "xs" ? "text-[10px]" : "text-xs";

  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((s) => (
        <Badge key={s} variant="secondary" className={`font-mono ${textSize} font-normal`}>
          {s}
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge
          variant="outline"
          className={`font-mono ${textSize} font-normal text-muted-foreground`}
        >
          +{overflow}
        </Badge>
      )}
    </div>
  );
}
