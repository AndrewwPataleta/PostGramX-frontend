export interface TimelineItem {
  label: string;
  state: "completed" | "current" | "upcoming";
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <p className="text-sm font-semibold text-white">Timeline</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                item.state === "completed"
                  ? "bg-emerald-500 text-slate-950"
                  : item.state === "current"
                  ? "bg-sky-500 text-slate-950"
                  : "border border-white/10 text-slate-500"
              }`}
            >
              {item.state === "completed" ? "✓" : item.state === "current" ? "•" : ""}
            </div>
            <p
              className={`text-sm ${
                item.state === "upcoming" ? "text-slate-500" : "text-slate-100"
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
