import { Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import LoadingSkeleton from "@/components/feedback/LoadingSkeleton";
import ErrorState from "@/components/feedback/ErrorState";
import { getErrorMessage } from "@/lib/api/errors";
import { useMarketplaceChannelViewModel } from "@/features/marketplace/viewmodels/useMarketplaceChannelViewModel";

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
            <div className="rounded-2xl border border-border/60 bg-card/80 p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
                {state.channel.avatarUrl}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <h2 className="text-xl font-semibold text-foreground">
                  {state.channel.title}
                </h2>
                {state.channel.verified ? (
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/20 p-1">
                    <Check size={14} className="text-primary" />
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">@{state.channel.username}</p>
              <p className="mt-3 text-sm text-muted-foreground">{state.channel.description}</p>
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
          </>
        )}
      </div>
    </div>
  );
}
