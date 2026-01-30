import { useMemo, useState } from "react";
import type { DealListItem } from "@/types/deals";
import { cn } from "@/lib/utils";

interface DealHeaderCardProps {
  deal: DealListItem;
}

const formatTonPrice = (priceNano: string) => {
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

const formatListingFormat = (format?: string) => {
  if (!format) {
    return "Post";
  }
  return format
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function DealHeaderCard({ deal }: DealHeaderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const priceLabel = `${formatTonPrice(deal.listing.priceNano)} TON`;
  const listingFormat = formatListingFormat(deal.listing.format);
  const tags = deal.listing.tags ?? [];
  const pinDurationHours = deal.listing.pinDurationHours ?? deal.listing.placementHours;
  const lifetimeHours = deal.listing.visibilityDurationHours ?? deal.listing.lifetimeHours;

  const detailItems = useMemo(
    () => [
      {
        label: "Pin hours",
        value: pinDurationHours ? `${pinDurationHours}h` : "None",
      },
      {
        label: "Lifetime hours",
        value: lifetimeHours ? `${lifetimeHours}h` : "—",
      },
      {
        label: "Edits",
        value:
          deal.listing.allowEdits === undefined
            ? "—"
            : deal.listing.allowEdits
            ? "Allowed"
            : "No edits",
      },
      {
        label: "Link tracking",
        value:
          deal.listing.allowLinkTracking === undefined
            ? "—"
            : deal.listing.allowLinkTracking
            ? "Enabled"
            : "Disabled",
      },
    ],
    [deal.listing.allowEdits, deal.listing.allowLinkTracking, pinDurationHours, lifetimeHours]
  );

  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
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
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="truncate">{deal.channel.name}</span>
            {deal.channel.verified ? (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                Verified
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">@{deal.channel.username}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{priceLabel}</p>
          <p className="text-xs text-muted-foreground">{listingFormat}</p>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
        >
          <span>{expanded ? "Hide details" : "More"}</span>
          <span className={cn("text-xs", expanded ? "text-foreground" : "text-muted-foreground")}>
            {expanded ? "▴" : "▾"}
          </span>
        </button>
      </div>

      {expanded ? (
        <div className="mt-4 space-y-3 text-xs text-muted-foreground">
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2">
            {detailItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-2">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </span>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>

          {deal.listing.contentRulesText ? (
            <div className="rounded-lg border border-border/60 bg-background/50 p-3 text-xs text-muted-foreground">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                Content rules
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{deal.listing.contentRulesText}</p>
            </div>
          ) : null}

        </div>
      ) : null}
    </div>
  );
}
