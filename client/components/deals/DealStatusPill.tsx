import { cn } from "@/lib/utils";

const toneStyles = {
  primary: "bg-primary/20 text-primary",
  warning: "bg-yellow-500/20 text-yellow-300",
  info: "bg-sky-500/15 text-sky-200",
  success: "bg-emerald-500/20 text-emerald-300",
  neutral: "bg-muted text-muted-foreground",
  danger: "bg-rose-500/20 text-rose-300",
};

export type DealStatusTone = keyof typeof toneStyles;

interface DealStatusPillProps {
  label: string;
  tone: DealStatusTone;
  className?: string;
}

export default function DealStatusPill({ label, tone, className }: DealStatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        toneStyles[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
