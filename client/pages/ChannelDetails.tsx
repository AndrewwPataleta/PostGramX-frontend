import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getChannel } from "@/features/marketplace/api";
import type { MarketplaceChannel } from "@/features/marketplace/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChannelDetails() {
  const { channelId } = useParams<{ channelId: string }>();
  const [channel, setChannel] = useState<MarketplaceChannel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!channelId) {
      setError("Channel not found");
      setIsLoading(false);
      return;
    }

    let mounted = true;
    setIsLoading(true);
    getChannel(channelId)
      .then((data) => {
        if (!mounted) {
          return;
        }
        setChannel(data);
      })
      .catch((err) => {
        if (!mounted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Unable to load channel");
      })
      .finally(() => {
        if (!mounted) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [channelId]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 border-b border-border/50 bg-card/80 backdrop-blur-glass">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to="/marketplace">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">
              {channel?.title ?? "Channel details"}
            </h1>
            <p className="text-xs text-muted-foreground">Channel overview</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : error || !channel ? (
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 text-sm text-destructive">
            {error ?? "Channel not found"}
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
                {channel.avatarUrl}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <h2 className="text-xl font-semibold text-foreground">{channel.title}</h2>
                {channel.verified ? (
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/20 p-1">
                    <Check size={14} className="text-primary" />
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">@{channel.username}</p>
              <p className="mt-3 text-sm text-muted-foreground">{channel.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-center">
                <p className="text-xs text-muted-foreground">Subscribers</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {(channel.subscribers / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-center">
                <p className="text-xs text-muted-foreground">Avg views</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {(channel.averageViews / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-center">
                <p className="text-xs text-muted-foreground">Engagement</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {channel.engagementRate}%
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/80 p-6">
              <p className="text-xs text-muted-foreground">Pricing</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-foreground">{channel.priceTon}</span>
                <span className="text-sm text-muted-foreground">TON per post</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Pricing includes escrow protection and bot-assisted messaging.
              </p>
              <Link
                to={`/marketplace/channels/${channel.id}/request`}
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
