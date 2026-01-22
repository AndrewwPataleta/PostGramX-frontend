import type { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  children: ReactNode;
}

export default function InfoCard({ title, children }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{title}</p>
        <button className="text-xs text-slate-500">Details</button>
      </div>
      <div className="mt-3 space-y-2 text-xs text-slate-300">{children}</div>
    </div>
  );
}
