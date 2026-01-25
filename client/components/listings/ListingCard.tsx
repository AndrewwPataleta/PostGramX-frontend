import type { ReactNode } from "react";
import type { Listing } from "@/features/listings/types";

type ListingCardVariant = "compact" | "full";

interface ListingCardProps {
  listing: Listing;
  variant?: ListingCardVariant;
  actionSlot?: ReactNode;
}

const formatDateLabel = (value: string) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const formatRangeLabel = (listing: Listing) => {
  const fromLabel = formatDateLabel(listing.availabilityFrom);
  const toLabel = formatDateLabel(listing.availabilityTo);
  return `${fromLabel} – ${toLabel}`;
};

const formatAvailabilityBadge = (listing: Listing) => {
  const from = new Date(listing.availabilityFrom);
  const to = new Date(listing.availabilityTo);
  const diffMs = to.getTime() - from.getTime();
  const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  if (diffDays <= 14) {
    return `Next ${diffDays} day${diffDays === 1 ? "" : "s"}`;
  }
  return formatRangeLabel(listing);
};

const formatListingFormat = (format: Listing["format"]) =>
  format === "POST" ? "Post" : format.toLowerCase();

export function ListingCard({ listing, variant = "full", actionSlot }: ListingCardProps) {
  const tags = listing.tags ?? [];
  const maxTags = variant === "compact" ? 3 : tags.length;
  const visibleTags = tags.slice(0, maxTags);
  const remainingTags = Math.max(0, tags.length - visibleTags.length);

  return (
    <div
      className={`rounded-2xl border border-border/60 bg-card/80 p-4 ${
        variant === "compact" ? "space-y-3" : "space-y-4"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {formatListingFormat(listing.format)} • {listing.priceTon} TON
          </p>
          <p className="text-xs text-muted-foreground">
            {variant === "compact" ? "Per post" : "Per post offer"}
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
          {variant === "compact" ? formatAvailabilityBadge(listing) : formatRangeLabel(listing)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-full bg-secondary/60 px-2.5 py-1 text-foreground">
          {listing.allowEdits ? "Edits allowed" : "No edits"}
        </span>
        <span className="rounded-full bg-secondary/60 px-2.5 py-1 text-foreground">
          {listing.requiresApproval ? "Approval required" : "No approval"}
        </span>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 text-[11px] text-foreground">
          {visibleTags.map((tag) => (
            <span key={tag} className="rounded-full border border-border/60 bg-card px-2.5 py-1">
              {tag}
            </span>
          ))}
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
