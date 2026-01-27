import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import ChannelCard from "@/features/channels/components/ChannelCard";
import { useChannelsList } from "@/features/channels/hooks/useChannelsList";
import ErrorState from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { TELEGRAM_MOCK } from "@/config/env";
import { getErrorMessage } from "@/lib/api/errors";
import type {
  ChannelStatus,
  ChannelsListOrder,
  ChannelsListParams,
  ChannelsListSort,
} from "@/types/channels";

const DEFAULT_SORT: ChannelsListSort = "recent";
const DEFAULT_ORDER: ChannelsListOrder = "desc";

const pendingStatuses: ChannelStatus[] = [
  "DRAFT",
  "PENDING_VERIFY",
  "FAILED",
  "REVOKED",
];

const ChannelCardSkeleton = () => (
  <div className="rounded-2xl border border-border/50 bg-card/80 p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-5 w-24 rounded-full" />
    </div>
    <div className="mt-4 grid grid-cols-3 gap-2">
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-16 rounded-xl" />
    </div>
    <div className="mt-4 flex items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

export default function Channels() {
  const filters = useMemo<ChannelsListParams>(
    () => ({
      sort: DEFAULT_SORT,
      order: DEFAULT_ORDER,
    }),
    []
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    error,
  } = useChannelsList(filters, 10);

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );
  const total = data?.pages?.[0]?.total ?? 0;

  useEffect(() => {
    if (error) {
      toast.error(getErrorMessage(error, "Unable to load channels."));
    }
  }, [error]);

  const verifiedChannels = useMemo(
    () => items.filter((channel) => channel.status === "VERIFIED"),
    [items]
  );
  const pendingChannels = useMemo(
    () => items.filter((channel) => pendingStatuses.includes(channel.status)),
    [items]
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pb-16 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-foreground">My Channels</h1>
          <p className="text-xs text-muted-foreground">
            Manage your verified and pending channels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {TELEGRAM_MOCK ? (
            <span className="rounded-full bg-purple-500/20 px-2 py-1 text-[10px] font-semibold uppercase text-purple-200">
              DEV
            </span>
          ) : null}
          <Link
            to="/add-channel/step-1"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus size={14} />
            Add Channel
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ChannelCardSkeleton key={`channel-skeleton-${index}`} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          message={getErrorMessage(error, "Unable to load channels")}
          description="Please try again in a moment."
          onRetry={() => refetch()}
        />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/70 p-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
            📡
          </div>
          <p className="text-sm font-semibold text-foreground">No channels yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Connect your first Telegram channel to get started.
          </p>
          <Link
            to="/add-channel/step-1"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            Add Channel
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Pending</span>
              <span>{pendingChannels.length}</span>
            </div>
            {pendingChannels.length > 0 ? (
              <div className="space-y-3">
                {pendingChannels.map((channel) => (
                  <ChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border/60 bg-card/70 px-4 py-3 text-xs text-muted-foreground">
                No pending channels right now.
              </p>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Verified</span>
              <span>{verifiedChannels.length}</span>
            </div>
            {verifiedChannels.length > 0 ? (
              <div className="space-y-3">
                {verifiedChannels.map((channel) => (
                  <ChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border/60 bg-card/70 px-4 py-3 text-xs text-muted-foreground">
                No verified channels yet.
              </p>
            )}
          </div>
        </div>
      )}

      {items.length > 0 ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-muted-foreground">
            Showing {items.length} of {total}
          </p>
          {hasNextPage ? (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-card"
            >
              {isFetchingNextPage ? (
                <Loader2 size={14} className="animate-spin" />
              ) : null}
              {isFetchingNextPage ? "Loading" : "Load more"}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
