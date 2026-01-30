import { memo, useState } from "react";
import { ChevronDown } from "lucide-react";
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

const formatDateTime = (value?: string) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const roleLabelMap: Record<DealListItem["userRoleInDeal"], string> = {
  advertiser: "You are advertiser",
  publisher: "You are publisher",
  publisher_manager: "You manage this channel",
};

const roleToneMap: Record<DealListItem["userRoleInDeal"], string> = {
  advertiser: "bg-emerald-500/10 text-emerald-400",
  publisher: "bg-emerald-500/10 text-emerald-400",
  publisher_manager: "bg-emerald-500/10 text-emerald-400",
};

const statusLabel = (value: string) => value.replace(/_/g, " ");

interface DealListCardProps {
  deal: DealListItem;
  onSelect: (deal: DealListItem) => void;
}

const DealListCard = ({ deal, onSelect }: DealListCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const visibilityLabel = deal.listing.lifetimeHours
    ? `Visible ${deal.listing.lifetimeHours}h`
    : null;
  const pinnedLabel = deal.listing.placementHours
    ? `Pinned ${deal.listing.placementHours}h`
    : null;
  const detailLine = [visibilityLabel, pinnedLabel].filter(Boolean).join(" • ");
  const escrowText = statusLabel(deal.escrowStatus);

  return (
    <div
      className={`w-full rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm transition ${
        onSelect ? "cursor-pointer hover:border-primary/40 hover:bg-card" : ""
      }`}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect(deal)}
      onKeyDown={(event) => {
        if (!onSelect) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(deal);
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
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
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="truncate">{deal.channel.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">@{deal.channel.username}</p>
          </div>
        </div>
        <span
          className={`max-w-[160px] truncate whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${roleToneMap[deal.userRoleInDeal]}`}
          style={{ textOverflow: "ellipsis" }}
        >
          {roleLabelMap[deal.userRoleInDeal]}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2 overflow-hidden">
        <span
          className="max-w-[200px] truncate whitespace-nowrap rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs font-semibold text-muted-foreground"
          style={{ textOverflow: "ellipsis" }}
        >
          {escrowText}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatTon(deal.listing.priceNano)} TON
        </span>
      </div>

      <div className="mt-3 space-y-1">
        {detailLine ? (
          <p className="text-xs text-muted-foreground">{detailLine}</p>
        ) : null}
        {deal.scheduledAt ? (
          <p className="text-xs text-muted-foreground">
            Scheduled: {formatDateTime(deal.scheduledAt)}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setExpanded((prev) => !prev);
        }}
        className="mt-3 flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
      >
        <span>{expanded ? "Hide details" : "Show details"}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded ? (
        <div className="mt-3 space-y-3 text-xs text-muted-foreground">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <span className="font-medium text-foreground">Created:</span>{" "}
              {formatDate(deal.createdAt)}
            </div>
            <div>
              <span className="font-medium text-foreground">Scheduled:</span>{" "}
              {formatDate(deal.scheduledAt)}
            </div>
          </div>
          {deal.listing.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
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
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground">
              Format: {deal.listing.format}
            </span>
            <span className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground">
              {pinnedLabel ?? "No pin"}
            </span>
            <span className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground">
              {visibilityLabel ?? "No visibility info"}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default memo(DealListCard);
