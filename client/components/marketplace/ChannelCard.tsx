import { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listingsByChannel } from "@/api/features/listingsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTonString, nanoToTonString } from "@/lib/ton";
import { cn } from "@/lib/utils";
import type { ChannelItem } from "@/types/channels";
import type { ListingListItem, ListingsByChannelResponse } from "@/types/listings";

interface ChannelCardProps {
  channel: ChannelItem;
}

const PRE_APPROVAL_TAG = "Must be pre-approved";
const MAX_VISIBLE_TAGS = 3;
const MAX_TAG_LENGTH = 24;
const LISTINGS_PREVIEW_LIMIT = 5;

const parsePriceNano = (value: string) => {
  try {
    return BigInt(value);
  } catch {
    return null;
  }
};

const formatDuration = (hours: number) => {
  if (hours >= 168 && hours % 24 === 0) {
    return `${hours / 24}d`;
  }
  return `${hours}h`;
};

const formatListingPrice = (priceNano: string) => {
  try {
    return formatTonString(nanoToTonString(priceNano));
  } catch {
    return priceNano;
  }
};

const buildTagList = (tags: string[]) => {
  const normalizedTags = tags
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0 && tag.length <= MAX_TAG_LENGTH);
  const lockedTags = normalizedTags.filter(
    (tag) => tag.toLowerCase() === PRE_APPROVAL_TAG.toLowerCase()
  );
  const restTags = normalizedTags.filter(
    (tag) => tag.toLowerCase() !== PRE_APPROVAL_TAG.toLowerCase()
  );
  const deduped = Array.from(new Set([...lockedTags, ...restTags]));
  return {
    visible: deduped.slice(0, MAX_VISIBLE_TAGS),
    hiddenCount: Math.max(deduped.length - MAX_VISIBLE_TAGS, 0),
  };
};

const buildAllowedRules = (listing: ListingListItem) => {
  const allowed = [
    ...(listing.allowEdits ? ["Edits allowed"] : []),
    ...(listing.allowLinkTracking ? ["Tracking allowed"] : []),
    ...(listing.allowPinnedPlacement || listing.pinDurationHours !== null
      ? ["Pinned available"]
      : []),
  ];

  if (allowed.length === 0) {
    return ["Standard placement"];
  }

  return allowed;
};

const buildRestrictedRules = (listing: ListingListItem) => {
  return [
    ...(listing.requiresApproval ? ["Pre-approval required"] : []),
    `Pinned: ${listing.pinDurationHours ? formatDuration(listing.pinDurationHours) : "none"}`,
    `Visible: ${formatDuration(listing.visibilityDurationHours)}`,
  ];
};

export default function ChannelCard({ channel }: ChannelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const listingsQuery = useQuery<ListingsByChannelResponse>({
    queryKey: ["marketplaceListingsByChannel", channel.id],
    queryFn: () =>
      listingsByChannel({
        channelId: channel.id,
        page: 1,
        limit: LISTINGS_PREVIEW_LIMIT,
        onlyActive: true,
        sort: "price_asc",
      }),
    enabled: isExpanded,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
  });

  const listings = listingsQuery.data?.items ?? channel.listings ?? [];
  const totalListings = useMemo(() => {
    if (typeof channel.placementsCount === "number") {
      return channel.placementsCount;
    }
    if (typeof channel.listingsCount === "number") {
      return channel.listingsCount;
    }
    if (listingsQuery.data) {
      return listingsQuery.data.total ?? listingsQuery.data.items.length;
    }
    if (channel.listings) {
      return channel.listings.length;
    }
    return null;
  }, [channel.listings, channel.placementsCount, listingsQuery.data]);

  const minPriceNano = useMemo(() => {
    if (listings.length === 0) {
      return null;
    }
    return listings.reduce<bigint | null>((currentMin, listing) => {
      const price = parsePriceNano(listing.priceNano);
      if (price === null) {
        return currentMin;
      }
      if (currentMin === null) {
        return price;
      }
      return price < currentMin ? price : currentMin;
    }, null);
  }, [listings]);

  const minPriceTon = minPriceNano ? formatTonString(nanoToTonString(minPriceNano)) : null;
  const formattedSubscribers =
    typeof channel.subscribers === "number"
      ? `${channel.subscribers.toLocaleString()} subscribers`
      : "— subscribers";
  const fallbackAvatar = channel.name?.[0]?.toUpperCase() ?? channel.username?.[0]?.toUpperCase();
  const username = channel.username ? `@${channel.username}` : null;

  return (
    <div className="rounded-2xl border border-border/50 bg-card/80 p-4 transition-colors hover:border-primary/40">
      <div className="flex items-start gap-3">
        {channel.avatarUrl ? (
          <img
            src={channel.avatarUrl}
            alt={channel.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 via-secondary/50 to-secondary text-lg text-foreground">
            {fallbackAvatar ?? "?"}
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">{channel.name}</h3>
                {channel.verified ? (
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/20 p-1">
                    <Check size={12} className="text-primary" />
                  </span>
                ) : null}
              </div>
              {username ? <span className="text-xs text-muted-foreground">{username}</span> : null}
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-secondary/40 text-muted-foreground transition hover:text-foreground"
            >
              <ChevronDown
                size={16}
                className={cn("transition-transform duration-200", isExpanded && "rotate-180")}
              />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>
              {typeof totalListings === "number"
                ? `${totalListings} placements`
                : "— placements"}
            </span>
            <span>·</span>
            <span>{formattedSubscribers}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>
              From <span className="font-semibold text-primary">{minPriceTon ?? "--"} TON</span>
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "mt-4 max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="rounded-2xl border border-border/60 bg-background/60 p-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Placements
            </h4>
            <Link
              to={`/marketplace/channels/${channel.id}`}
              state={{ channel }}
              className="text-[11px] font-semibold text-primary"
            >
              Open channel
            </Link>
          </div>

          {listingsQuery.isLoading ? (
            <div className="mt-3 space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`listing-skeleton-${channel.id}-${index}`}
                  className="rounded-xl border border-border/50 bg-card/80 p-3"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-2 h-3 w-40" />
                  <Skeleton className="mt-2 h-3 w-28" />
                </div>
              ))}
            </div>
          ) : listingsQuery.isError ? (
            <div className="mt-3 rounded-xl border border-border/60 bg-red-500/5 p-3 text-xs text-red-200">
              Failed to load placements.
            </div>
          ) : listings.length > 0 ? (
            <div className="mt-3 space-y-3">
              {listings.map((listing) => {
                const tags = buildTagList(listing.tags ?? []);
                const allowedRules = buildAllowedRules(listing);
                const restrictedRules = buildRestrictedRules(listing);
                const requirementsText = listing.contentRulesText?.trim();
                return (
                  <div
                    key={listing.id}
                    className="rounded-xl border border-border/60 bg-card/80 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {formatListingPrice(listing.priceNano)} TON
                      </span>
                      <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {listing.format}
                      </span>
                      {listing.isActive ? (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          Active
                        </span>
                      ) : null}
                    </div>

                    {tags.visible.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-foreground">
                        {tags.visible.map((tag) => (
                          <span
                            key={tag}
                            className={cn(
                              "rounded-full border px-2.5 py-1",
                              tag.toLowerCase() === PRE_APPROVAL_TAG.toLowerCase()
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : "border-border/60 bg-card text-foreground"
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                        {tags.hiddenCount > 0 ? (
                          <span className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-muted-foreground">
                            +{tags.hiddenCount}
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-3 grid gap-3 text-[11px] text-muted-foreground sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80">
                          Allowed
                        </p>
                        <div className="mt-1 space-y-1">
                          {allowedRules.map((rule) => (
                            <p key={rule}>{rule}</p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80">
                          Requires
                        </p>
                        <div className="mt-1 space-y-1">
                          {restrictedRules.map((rule) => (
                            <p key={rule}>{rule}</p>
                          ))}
                          {requirementsText ? (
                            <div className="pt-1">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                                Requirements
                              </p>
                              <p className="truncate text-[11px] text-muted-foreground">
                                {requirementsText}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-border/60 bg-card/60 p-4 text-center text-xs text-muted-foreground">
              No placements available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
