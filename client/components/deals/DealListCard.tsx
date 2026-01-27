import { memo } from "react";
import type { DealListItem } from "@/types/deals";

const formatTon = (priceNano: string) => {
  try {
    const value = BigInt(priceNano);
    const ton = value / 1_000_000_000n;
    const remainder = value % 1_000_000_000n;
    if (remainder === 0n) {
      return ton.toString();
    }
    const decimals = remainder.toString().padStart(9, "0").slice(0, 2);
    return `${ton.toString()}.${decimals}`;
  } catch {
    return priceNano;
  }
};

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const roleLabelMap: Record<DealListItem["userRoleInDeal"], string> = {
  advertiser: "You are advertiser",
  publisher: "You are publisher",
  publisher_manager: "You manage this channel",
};

const statusLabel = (value: string) => value.replace(/_/g, " ");

interface DealListCardProps {
  deal: DealListItem;
  onSelect: (id: string) => void;
}

const DealListCard = ({ deal, onSelect }: DealListCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(deal.id)}
      className="w-full rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm transition hover:border-primary/40 hover:bg-card"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-secondary/60 text-lg font-semibold text-muted-foreground">
          {deal.channel.avatarUrl ? (
            <img
              src={deal.channel.avatarUrl}
              alt={deal.channel.name}
              className="h-full w-full object-cover"
            />
          ) : (
            deal.channel.name.slice(0, 1)
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span>{deal.channel.name}</span>
            {deal.channel.verified ? (
              <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Verified
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">@{deal.channel.username}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide">Price</p>
          <p className="text-base font-semibold text-foreground">
            {formatTon(deal.listing.priceNano)} TON
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide">Format</p>
          <p className="text-sm font-semibold text-foreground">{deal.listing.format}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide">Placement</p>
          <p className="text-sm font-semibold text-foreground">
            Pinned {deal.listing.placementHours}h
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide">Lifetime</p>
          <p className="text-sm font-semibold text-foreground">
            Visible {deal.listing.lifetimeHours}h
          </p>
        </div>
      </div>

      {deal.listing.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {deal.listing.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {statusLabel(deal.status)}
        </span>
        <span className="rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground">
          {statusLabel(deal.escrowStatus)}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        <div>
          <span className="font-medium text-foreground">Created:</span> {formatDate(deal.createdAt)}
        </div>
        <div>
          <span className="font-medium text-foreground">Scheduled:</span> {formatDate(deal.scheduledAt)}
        </div>
        <div className="sm:col-span-2">
          <span className="font-medium text-foreground">Role:</span> {roleLabelMap[deal.userRoleInDeal]}
        </div>
      </div>
    </button>
  );
};

export default memo(DealListCard);
