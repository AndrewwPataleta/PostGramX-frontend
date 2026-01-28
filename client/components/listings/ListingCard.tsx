import type { ReactNode } from "react";
import { formatTonString, nanoToTonString } from "@/lib/ton";
import type { Listing } from "@/features/listings/types";
import type { ListingListItem } from "@/types/listings";

type ListingCardVariant = "compact" | "full";

interface ListingCardProps {
  listing: ListingListItem | Listing;
  variant?: ListingCardVariant;
  actionSlot?: ReactNode;
}

const formatDuration = (hours: number) => {
  if (hours >= 168 && hours % 24 === 0) {
    return `${hours / 24}d`;
  }
  return `${hours}h`;
};

export function ListingCard({ listing, variant = "full", actionSlot }: ListingCardProps) {
  const tags = listing.tags ?? [];
  const normalizedTags = [
    ...new Set([
      ...tags.filter((tag) => tag === "Must be pre-approved"),
      ...tags.filter((tag) => tag !== "Must be pre-approved"),
    ]),
  ];
  const maxTags = variant === "compact" ? 3 : normalizedTags.length;
  const visibleTags = normalizedTags.slice(0, maxTags);
  const remainingTags = Math.max(0, normalizedTags.length - visibleTags.length);
  const visibilityDuration = listing.visibilityDurationHours ?? 24;
  const pinnedDurationLabel = listing.pinDurationHours
    ? formatDuration(listing.pinDurationHours)
    : null;
  const visibleDurationLabel = formatDuration(visibilityDuration);
  const priceTonLabel = (() => {
    if ("priceNano" in listing) {
      try {
        return formatTonString(nanoToTonString(listing.priceNano));
      } catch {
        return listing.priceNano;
      }
    }
    return String(listing.priceTon);
  })();

  return (
    <div
      className={`rounded-2xl border border-border/60 bg-card/80 p-4 ${
        variant === "compact" ? "space-y-3" : "space-y-4"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Post • {priceTonLabel} TON
          </p>
          <p className="text-xs text-muted-foreground">
            {variant === "compact" ? "Per post" : "Per post offer"}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            listing.isActive
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-rose-500/15 text-rose-400"
          }`}
        >
          {listing.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-full bg-secondary/60 px-2.5 py-1 text-foreground">
          {listing.allowEdits ? "Edits allowed" : "No edits"}
        </span>
        <span className="rounded-full bg-secondary/60 px-2.5 py-1 text-foreground">
          {listing.allowLinkTracking ? "Tracking allowed" : "No tracking"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px] text-foreground">
        {pinnedDurationLabel ? (
          <span className="rounded-full bg-secondary/60 px-2.5 py-1">
            Pinned: {pinnedDurationLabel}
          </span>
        ) : (
          <span className="rounded-full bg-secondary/60 px-2.5 py-1">Pinned: none</span>
        )}
        <span className="rounded-full bg-secondary/60 px-2.5 py-1">
          Visible: {visibleDurationLabel}
        </span>
      </div>

      {normalizedTags.length > 0 ? (
        <div className="flex flex-wrap gap-2 text-[11px] text-foreground">
          {visibleTags.map((tag) => {
            const isLocked = tag === "Must be pre-approved";
            return (
              <span
                key={tag}
                className={`rounded-full border px-2.5 py-1 ${
                  isLocked
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/60 bg-card text-foreground"
                }`}
              >
                {tag}
              </span>
            );
          })}
          {remainingTags > 0 ? (
            <span className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-muted-foreground">
              +{remainingTags}
            </span>
          ) : null}
        </div>
      ) : null}

      {variant === "full" && actionSlot ? (
        <div className="flex gap-2">{actionSlot}</div>
      ) : null}
    </div>
  );
}
