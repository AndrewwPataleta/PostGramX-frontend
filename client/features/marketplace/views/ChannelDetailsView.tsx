import { useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listingsByChannel } from "@/api/features/listingsApi";
import ErrorState from "@/components/feedback/ErrorState";
import { PageContainer } from "@/components/layout/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateDealMutation } from "@/hooks/use-deals";
import { formatTonString, nanoToTonString } from "@/lib/ton";
import type { ChannelItem } from "@/types/channels";
import type { ListingListItem, ListingsByChannelResponse } from "@/types/listings";
import type { ChannelCardModel } from "@/components/channels/ChannelCard";

const formatDuration = (hours: number) => {
  if (hours >= 168 && hours % 24 === 0) {
    return `${hours / 24}d`;
  }
  return `${hours}h`;
};

export default function ChannelDetailsView() {
  const { channelId } = useParams<{ channelId: string }>();
  const location = useLocation();
  const state = location.state as
    | {
        channel?: ChannelItem | ChannelCardModel;
        listingsPreview?: ListingListItem[] | null;
        placementsCount?: number | null;
        minPriceNano?: string | null;
        tags?: string[] | null;
        subscribers?: number | null;
        avatarUrl?: string | null;
      }
    | null;
  const stateChannel = state?.channel ?? null;
  const listingsSectionRef = useRef<HTMLDivElement | null>(null);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [expandedListingIds, setExpandedListingIds] = useState<string[]>([]);
  const [avatarError, setAvatarError] = useState(false);
  const createDealMutation = useCreateDealMutation();
  const channel = useMemo(() => {
    if (!stateChannel) {
      return null;
    }
    const base = stateChannel as ChannelCardModel & ChannelItem;
    return {
      id: base.id,
      name: base.name,
      username: base.username ?? null,
      about: base.about ?? base.description ?? null,
      description: base.description ?? null,
      avatarUrl: base.avatarUrl ?? null,
      subscribers: base.subscribers ?? null,
      placementsCount: state?.placementsCount ?? base.placementsCount ?? null,
      minPriceNano: state?.minPriceNano ?? (base.minPriceNano ?? null),
      tags: state?.tags ?? base.tags ?? [],
      listingsPreview:
        state?.listingsPreview ?? base.listingsPreview ?? base.listings ?? null,
    };
  }, [state, stateChannel]);
  const resolvedChannel = useMemo(() => {
    if (channel) {
      return channel;
    }
    if (!channelId) {
      return null;
    }
    return {
      id: channelId,
      name: "Channel",
      username: null,
      about: null,
      description: null,
      avatarUrl: null,
      subscribers: null,
      placementsCount: null,
      minPriceNano: null,
      tags: [],
      listingsPreview: null,
    };
  }, [channel, channelId]);
  const previewListings =
    resolvedChannel?.listingsPreview?.filter((listing) => listing.isActive !== false) ?? [];
  const shouldFetchListings = Boolean(channelId) && previewListings.length === 0;
  const listingsQuery = useQuery<ListingsByChannelResponse>({
    queryKey: ["listingsByChannel", "details", channelId],
    queryFn: () =>
      listingsByChannel({
        channelId: channelId ?? "",
        page: 1,
        limit: 10,
        onlyActive: true,
        sort: "price_asc",
      }),
    enabled: shouldFetchListings,
    staleTime: 1000 * 60 * 5,
  });
  const activeListings =
    previewListings.length > 0
      ? previewListings
      : listingsQuery.data?.items.filter((listing) => listing.isActive !== false) ?? [];
  const minPriceFromListings = activeListings.reduce<bigint | null>(
    (currentMin, listing) => {
      try {
        const price = BigInt(listing.priceNano);
        if (currentMin === null || price < currentMin) {
          return price;
        }
        return currentMin;
      } catch {
        return currentMin;
      }
    },
    null
  );
  const resolvedMinPriceNano =
    resolvedChannel?.minPriceNano ?? (minPriceFromListings ? minPriceFromListings.toString() : null);
  const minPriceTon = resolvedMinPriceNano
    ? formatTonString(nanoToTonString(resolvedMinPriceNano))
    : null;
  const primaryListing = activeListings[0];
  const isSubmitting = createDealMutation.isPending;
  const description = resolvedChannel?.about ?? resolvedChannel?.description;
  const username = resolvedChannel?.username ? `@${resolvedChannel.username}` : null;

  const handleCreateDeal = async (listingId: string) => {
    if (isSubmitting) {
      return;
    }
    setActiveListingId(listingId);
    try {
      await createDealMutation.mutateAsync({ listingId });
    } finally {
      setActiveListingId(null);
    }
  };

  const formattedListings = useMemo(
    () =>
      activeListings.map((listing) => ({
        ...listing,
        priceTon: `${formatTonString(nanoToTonString(listing.priceNano))} TON`,
        tags: listing.tags.map((tag) => tag.trim()).filter(Boolean),
      })),
    [activeListings]
  );

  const formattedSubscribers =
    typeof resolvedChannel?.subscribers === "number"
      ? resolvedChannel.subscribers.toLocaleString()
      : "—";

  const buildTagList = (tags: string[]) => {
    const cleaned = tags.map((tag) => tag.trim()).filter(Boolean);
    const unique = Array.from(new Set(cleaned));
    return {
      visible: unique.slice(0, 3),
      hiddenCount: Math.max(unique.length - 3, 0),
    };
  };

  const buildListingTagList = (tags: string[]) => {
    const cleaned = tags.map((tag) => tag.trim()).filter(Boolean);
    const unique = Array.from(new Set(cleaned));
    return {
      visible: unique.slice(0, 2),
      hiddenCount: Math.max(unique.length - 2, 0),
    };
  };

  const channelTags = buildTagList(resolvedChannel?.tags ?? []);

  const handlePrimaryCta = () => {
    if (!primaryListing) {
      return;
    }
    if (activeListings.length === 1) {
      void handleCreateDeal(primaryListing.id);
    } else {
      listingsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleListingExpanded = (listingId: string) => {
    setExpandedListingIds((prev) =>
      prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId]
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <PageContainer className="py-6 space-y-4">
        {!resolvedChannel || (channelId && resolvedChannel.id !== channelId) ? (
          <ErrorState message="Channel not found" description="We couldn't load this channel." />
        ) : (
          <>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                  {!avatarError && resolvedChannel.avatarUrl ? (
                    <img
                      src={resolvedChannel.avatarUrl}
                      alt={resolvedChannel.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    resolvedChannel.name?.[0]?.toUpperCase()
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">
                      {resolvedChannel.name}
                    </h2>
                  </div>
                  {username ? <p className="text-xs text-muted-foreground">{username}</p> : null}
                  <p className="text-xs text-muted-foreground">
                    {resolvedChannel.placementsCount ?? activeListings.length ?? "—"} placements •{" "}
                    {formattedSubscribers} subscribers
                  </p>
                  <p className="text-xs text-muted-foreground">
                    From{" "}
                    <span className="font-semibold text-primary">
                      {minPriceTon ?? "--"} TON
                    </span>
                  </p>
                  {channelTags.visible.length > 0 ? (
                    <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                      {channelTags.visible.map((tag) => (
                        <span
                          key={`${resolvedChannel.id}-${tag}`}
                          className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {channelTags.hiddenCount > 0 ? (
                        <span className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-muted-foreground">
                          +{channelTags.hiddenCount}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  {description ? (
                    <p className="text-sm text-muted-foreground">{description}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div
              ref={listingsSectionRef}
              className="rounded-2xl border border-border/60 bg-card/80 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Available placements</p>
                  <p className="text-xs text-muted-foreground">
                    {resolvedChannel.placementsCount ?? activeListings.length} placements available
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="text-lg font-semibold text-primary">
                    {minPriceTon ?? "--"} TON
                  </p>
                </div>
              </div>

              {listingsQuery.isLoading && shouldFetchListings ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={`listing-skeleton-${index}`}
                      className="rounded-xl border border-border/60 bg-card/70 p-3 space-y-3"
                    >
                      <Skeleton className="h-4 w-32" />
                      <div className="grid gap-3 sm:grid-cols-3">
                        <Skeleton className="h-14 rounded-lg" />
                        <Skeleton className="h-14 rounded-lg" />
                        <Skeleton className="h-14 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : listingsQuery.isError ? (
                <div className="rounded-xl border border-border/60 bg-red-500/5 p-4 text-sm text-red-200">
                  Failed to load placements.
                </div>
              ) : formattedListings.length > 0 ? (
                <div className="space-y-3">
                  {formattedListings.map((listing) => {
                    const isListingSubmitting = isSubmitting && activeListingId === listing.id;
                    const isExpanded = expandedListingIds.includes(listing.id);
                    const tagList = buildListingTagList(listing.tags);
                    const metaParts = [
                      listing.pinDurationHours
                        ? `Pinned ${formatDuration(listing.pinDurationHours)}`
                        : null,
                      listing.visibilityDurationHours
                        ? `Visible ${formatDuration(listing.visibilityDurationHours)}`
                        : null,
                    ].filter(Boolean);
                    const metaLabel = metaParts.join(" • ");
                    return (
                      <div
                        key={listing.id}
                        className="rounded-xl border border-border/60 bg-card/70 p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">
                              {listing.priceTon}
                            </p>
                            {metaLabel ? (
                              <p className="text-[11px] text-muted-foreground">{metaLabel}</p>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCreateDeal(listing.id)}
                              disabled={isSubmitting}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
                            >
                              {isListingSubmitting ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : null}
                              Select
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleListingExpanded(listing.id)}
                              aria-expanded={isExpanded}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-background/70 text-muted-foreground transition hover:text-foreground"
                            >
                              <ChevronDown
                                size={16}
                                className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          </div>
                        </div>
                        {tagList.visible.length > 0 ? (
                          <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                            {tagList.visible.map((tag) => (
                              <span
                                key={`${listing.id}-${tag}`}
                                className="rounded-full border border-border/60 bg-card px-2 py-0.5 text-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                            {tagList.hiddenCount > 0 ? (
                              <span className="rounded-full border border-border/60 bg-card px-2 py-0.5">
                                +{tagList.hiddenCount}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                        {isExpanded ? (
                          <div className="space-y-2 text-[11px] text-muted-foreground">
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5">
                                Edits: {listing.allowEdits ? "Allowed" : "Not allowed"}
                              </span>
                              <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5">
                                Link tracking: {listing.allowLinkTracking ? "Allowed" : "Not allowed"}
                              </span>
                            </div>
                            {listing.tags.length > 0 ? (
                              <div className="flex flex-wrap gap-2 text-[11px] text-foreground">
                                {listing.tags.map((tag) => (
                                  <span
                                    key={`${listing.id}-expanded-${tag}`}
                                    className="rounded-full border border-border/60 bg-card px-2 py-0.5"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                            {listing.contentRulesText ? (
                              <div>
                                <p className="text-[11px] font-semibold text-muted-foreground">
                                  Rules
                                </p>
                                <p className="line-clamp-3">{listing.contentRulesText}</p>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-border/60 bg-card/80 p-6 text-center">
                  <p className="text-sm font-semibold text-foreground">No listings yet</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    This channel has no active placements available right now.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </PageContainer>
    </div>
  );
}
