import { useMemo, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import ErrorState from "@/components/feedback/ErrorState";
import { useCreateDealMutation } from "@/hooks/use-deals";
import { formatTonString, nanoToTonString } from "@/lib/ton";
import type { ChannelItem } from "@/types/channels";

const formatDuration = (hours: number) => {
  if (hours >= 168 && hours % 24 === 0) {
    return `${hours / 24}d`;
  }
  return `${hours}h`;
};

export default function ChannelDetailsView() {
  const { channelId } = useParams<{ channelId: string }>();
  const location = useLocation();
  const channel = (location.state as { channel?: ChannelItem } | null)?.channel;
  const listingsSectionRef = useRef<HTMLDivElement | null>(null);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const createDealMutation = useCreateDealMutation();
  const activeListings = (channel?.listings ?? []).filter(
    (listing) => listing.isActive !== false
  );
  const minPriceNano = activeListings.reduce<bigint | null>((currentMin, listing) => {
    const price = BigInt(listing.priceNano);
    if (currentMin === null) {
      return price;
    }
    return price < currentMin ? price : currentMin;
  }, null);
  const minPriceTon = minPriceNano ? formatTonString(nanoToTonString(minPriceNano)) : null;
  const primaryListing = activeListings[0];
  const isSubmitting = createDealMutation.isPending;
  const description = channel?.about ?? channel?.description;
  const username = channel?.username ? `@${channel.username}` : null;

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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="px-4 py-6 space-y-4">
        {!channel || channel.id !== channelId ? (
          <ErrorState
            message="Channel not found"
            description="We couldn't load this channel."
          />
        ) : (
          <>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                  {!avatarError && channel.avatarUrl ? (
                    <img
                      src={channel.avatarUrl}
                      alt={channel.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    channel.name?.[0]?.toUpperCase()
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">
                      {channel.name}
                    </h2>
                    {channel.verified ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/20 p-1">
                        <Check size={14} className="text-primary" />
                      </span>
                    ) : null}
                  </div>
                  {username ? (
                    <p className="text-xs text-muted-foreground">{username}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {channel.subscribers
                      ? `${channel.subscribers.toLocaleString()} subscribers`
                      : "-- subscribers"}
                  </p>
                  {description ? (
                    <p className="text-sm text-muted-foreground">{description}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/80 p-6">
              <p className="text-xs text-muted-foreground">Pricing</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-foreground">
                  {minPriceTon ?? "--"}
                </span>
                <span className="text-sm text-muted-foreground">TON per post</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Pricing includes escrow protection and bot-assisted messaging.
              </p>
              <button
                type="button"
                onClick={handlePrimaryCta}
                disabled={!primaryListing || isSubmitting}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {isSubmitting && activeListingId === primaryListing?.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                Create Deal
              </button>
            </div>

            {activeListings.length > 0 ? (
              <div
                ref={listingsSectionRef}
                className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Available placements
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activeListings.length} placements available
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="text-lg font-semibold text-primary">
                      {minPriceTon ?? "--"} TON
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {formattedListings.map((listing) => {
                    const isListingSubmitting =
                      isSubmitting && activeListingId === listing.id;
                    return (
                      <div
                        key={listing.id}
                        className="rounded-xl border border-border/60 bg-card/70 p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Price</p>
                            <p className="mt-1 text-lg font-semibold text-foreground">
                              {listing.priceTon}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCreateDeal(listing.id)}
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
                          >
                            {isListingSubmitting ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : null}
                            Create Deal
                          </button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-lg border border-border/60 bg-card/60 p-3">
                            <p className="text-[11px] text-muted-foreground">Placement</p>
                            <p className="mt-1 text-xs font-semibold text-foreground">
                              {listing.format}
                            </p>
                          </div>
                          <div className="rounded-lg border border-border/60 bg-card/60 p-3">
                            <p className="text-[11px] text-muted-foreground">Pinned</p>
                            <p className="mt-1 text-xs font-semibold text-foreground">
                              {listing.pinDurationHours
                                ? formatDuration(listing.pinDurationHours)
                                : "Not pinned"}
                            </p>
                          </div>
                          <div className="rounded-lg border border-border/60 bg-card/60 p-3">
                            <p className="text-[11px] text-muted-foreground">Visible</p>
                            <p className="mt-1 text-xs font-semibold text-foreground">
                              {formatDuration(listing.visibilityDurationHours ?? 24)}
                            </p>
                          </div>
                        </div>
                        {listing.tags.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-[11px] text-muted-foreground">Tags</p>
                            <div className="flex flex-wrap gap-2 text-[11px] text-foreground">
                              {listing.tags.map((tag) => (
                                <span
                                  key={`${listing.id}-${tag}`}
                                  className="rounded-full border border-border/60 bg-card px-2.5 py-1"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border/60 bg-card/80 p-6 text-center">
                <p className="text-sm font-semibold text-foreground">
                  No listings yet
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  This channel has no active placements available right now.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
