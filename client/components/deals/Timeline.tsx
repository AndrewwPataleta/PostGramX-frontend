export interface TimelineItem {
  label: string;
  state: "completed" | "current" | "upcoming";
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/80 p-4">
      <p className="text-sm font-semibold text-foreground">Timeline</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                item.state === "completed"
                  ? "bg-emerald-500/80 text-emerald-950"
                  : item.state === "current"
                  ? "bg-primary/80 text-primary-foreground"
                  : "border border-border/70 text-muted-foreground"
              }`}
            >
              {item.state === "completed" ? "✓" : item.state === "current" ? "•" : ""}
            </div>
            <p
              className={`text-sm ${
                item.state === "upcoming" ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
