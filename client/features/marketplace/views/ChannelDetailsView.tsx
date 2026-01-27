import { Check } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import ErrorState from "@/components/feedback/ErrorState";
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
  const hasPinnedOptions = activeListings.some((listing) => listing.pinDurationHours !== null);
  const aggregatedTags = Array.from(
    new Set(
      activeListings.flatMap((listing) =>
        listing.tags.map((tag) => tag.trim()).filter(Boolean)
      )
    )
  );

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
                  {channel.avatarUrl ? (
                    <img
                      src={channel.avatarUrl}
                      alt={channel.name}
                      className="h-16 w-16 rounded-2xl object-cover"
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
                  <p className="text-xs text-muted-foreground">
                    @{channel.username}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-center">
                <p className="text-xs text-muted-foreground">Subscribers</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {channel.subscribers ? `${Math.round(channel.subscribers / 1000)}K` : "--"}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-center">
                <p className="text-xs text-muted-foreground">Placements</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {activeListings.length}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-center">
                <p className="text-xs text-muted-foreground">Pinned options</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {hasPinnedOptions ? "Yes" : "No"}
                </p>
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
              <Link
                to={`/marketplace/channels/${channel.id}/request`}
                state={{ listingId: primaryListing?.id }}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Request Placement
              </Link>
            </div>

            {activeListings.length > 0 ? (
              <div className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Active listings</p>
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

                {primaryListing ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border/60 bg-card/70 p-4">
                      <p className="text-xs text-muted-foreground">Pinned</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {primaryListing.pinDurationHours
                          ? formatDuration(primaryListing.pinDurationHours)
                          : "Not pinned"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-card/70 p-4">
                      <p className="text-xs text-muted-foreground">Visible</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatDuration(primaryListing.visibilityDurationHours ?? 24)}
                      </p>
                    </div>
                  </div>
                ) : null}

                {aggregatedTags.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-foreground">
                      {aggregatedTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border/60 bg-card px-2.5 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-border/60 bg-card/80 p-6 text-center">
                <p className="text-sm font-semibold text-foreground">
                  No listings yet
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Create a listing to start receiving marketplace requests.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
