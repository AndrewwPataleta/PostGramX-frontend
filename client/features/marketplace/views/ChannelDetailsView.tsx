import { Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import LoadingSkeleton from "@/components/feedback/LoadingSkeleton";
import ErrorState from "@/components/feedback/ErrorState";
import { getErrorMessage } from "@/lib/api/errors";
import { useMarketplaceChannelViewModel } from "@/features/marketplace/viewmodels/useMarketplaceChannelViewModel";

const formatDuration = (hours: number) => {
  if (hours >= 168 && hours % 24 === 0) {
    return `${hours / 24}d`;
  }
  return `${hours}h`;
};

export default function ChannelDetailsView() {
  const { channelId } = useParams<{ channelId: string }>();
  const { state, actions } = useMarketplaceChannelViewModel(channelId);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="px-4 py-6 space-y-4">
        {state.isLoading ? (
          <LoadingSkeleton items={3} />
        ) : state.error || !state.channel ? (
          <ErrorState
            message={getErrorMessage(state.error, "Channel not found")}
            description="We couldn't load this channel."
            onRetry={actions.refetch}
          />
        ) : (
          <>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                  {state.channel.avatarUrl}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">
                      {state.channel.title}
                    </h2>
                    {state.channel.verified ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/20 p-1">
                        <Check size={14} className="text-primary" />
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    @{state.channel.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {state.channel.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-center">
                <p className="text-xs text-muted-foreground">Subscribers</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {(state.channel.subscribers / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-center">
                <p className="text-xs text-muted-foreground">Avg views</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {(state.channel.averageViews / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-center">
                <p className="text-xs text-muted-foreground">Engagement</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {state.channel.engagementRate}%
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/80 p-6">
              <p className="text-xs text-muted-foreground">Pricing</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-foreground">
                  {state.channel.priceTon}
                </span>
                <span className="text-sm text-muted-foreground">TON per post</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Pricing includes escrow protection and bot-assisted messaging.
              </p>
              <Link
                to={`/marketplace/channels/${state.channel.id}/request`}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Request Placement
              </Link>
            </div>

            {state.channel.listing ? (
              <div className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Active listing
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Listing active
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold text-primary">
                      {state.channel.listing.priceTon} TON
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-card/70 p-4">
                    <p className="text-xs text-muted-foreground">Pinned</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {state.channel.listing.pinDurationHours
                        ? formatDuration(state.channel.listing.pinDurationHours)
                        : "Not pinned"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card/70 p-4">
                    <p className="text-xs text-muted-foreground">Visible</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatDuration(
                        state.channel.listing.visibilityDurationHours ?? 24,
                      )}
                    </p>
                  </div>
                </div>

                {state.channel.listing.tags.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-foreground">
                      {state.channel.listing.tags.map((tag) => (
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

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs font-semibold text-primary">Content rules</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {state.channel.listing.contentRulesText || "No extra rules"}
                  </p>
                </div>
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
