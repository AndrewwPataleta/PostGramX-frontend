import type { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  children: ReactNode;
}

export default function InfoCard({ title, children }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-border/30 bg-card/70 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <button className="text-xs text-muted-foreground">Details</button>
      </div>
      <div className="mt-3 space-y-2 text-xs text-muted-foreground">{children}</div>
    </div>
  );
}
