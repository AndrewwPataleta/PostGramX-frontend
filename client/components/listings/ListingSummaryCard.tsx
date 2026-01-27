import { Check } from "lucide-react";
import type { ManagedChannel } from "@/features/channels/managedChannels";

interface ListingSummaryCardProps {
  channel: ManagedChannel;
  priceTon: number;
  pinDurationHours: number | null;
  visibilityDurationHours: number;
  tags?: string[];
}

const formatDuration = (hours: number) => {
  if (hours >= 168 && hours % 24 === 0) {
    return `${hours / 24}d`;
  }
  return `${hours}h`;
};

export function ListingSummaryCard({
  channel,
  priceTon,
  pinDurationHours,
  visibilityDurationHours,
  tags = [],
}: ListingSummaryCardProps) {
  const pinnedLabel = pinDurationHours ? formatDuration(pinDurationHours) : "Not pinned";
  const visibleLabel = formatDuration(visibilityDurationHours);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/60 text-xl">
          {channel.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{channel.name}</p>
            {channel.verified ? (
              <span className="inline-flex items-center justify-center rounded-full bg-primary/20 p-1">
                <Check size={12} className="text-primary" />
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">{channel.username}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full bg-secondary/60 px-2 py-1">Editable</span>
            <span className="rounded-full bg-secondary/60 px-2 py-1">Verified</span>
            <span className="rounded-full bg-secondary/60 px-2 py-1">Auto-post supported</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Price</p>
          <p className="text-sm font-semibold text-primary">{priceTon} TON / post</p>
        </div>
      </div>
      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
        <p className="text-[13px] font-semibold text-foreground">
          Post • {priceTon} TON
        </p>
        <div className="flex items-center justify-between">
          <span>Pinned</span>
          <span className="text-foreground">{pinnedLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Visible</span>
          <span className="text-foreground">{visibleLabel}</span>
        </div>
      </div>
      {tags.length > 0 ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-muted-foreground">Tags</p>
          <div className="flex flex-wrap gap-2 text-[11px] text-foreground">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border/60 bg-card px-2.5 py-1">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
