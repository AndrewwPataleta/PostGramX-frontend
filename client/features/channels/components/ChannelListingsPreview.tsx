import { memo, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PencilLine, RefreshCcw } from "lucide-react";
import { listingsByChannel } from "@/api/features/listingsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import type { ListingListItem, ListingsByChannelResponse } from "@/types/listings";

const PREVIEW_LIMIT = 5;
const PREVIEW_COUNT = 3;
const TON_NANO = 1_000_000_000n;

const formatTon = (priceNano: string) => {
  try {
    const nano = BigInt(priceNano);
    const whole = nano / TON_NANO;
    const fraction = nano % TON_NANO;
    if (fraction === 0n) {
      return `${whole.toString()} TON`;
    }
    const fractionString = fraction.toString().padStart(9, "0");
    const trimmed = fractionString.slice(0, 2).replace(/0+$/, "");
    const display = trimmed ? `${whole.toString()}.${trimmed}` : whole.toString();
    return `${display} TON`;
  } catch {
    return `${priceNano} TON`;
  }
};

const buildTags = (tags: string[]) => {
  const shown = tags.slice(0, 2);
  const remaining = tags.length - shown.length;
  return {
    shown,
    remaining,
  };
};

type ListingPreviewMode = "viewer" | "owner";

interface ListingPreviewRowProps {
  channelId: string;
  listing: ListingListItem;
  rootBackTo?: string;
  mode: ListingPreviewMode;
}

const ListingPreviewRow = memo(
  ({ channelId, listing, rootBackTo, mode }: ListingPreviewRowProps) => {
  const pinLabel = listing.pinDurationHours
    ? `Pinned ${listing.pinDurationHours}h`
    : "No pin";
  const visibilityLabel = `Visible ${listing.visibilityDurationHours}h`;
  const tags = buildTags(listing.tags ?? []);
  const isInactive = listing.isActive === false;

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3",
        mode === "owner" && isInactive && "opacity-60"
      )}
    >
      <div className="flex-1 space-y-1">
        <div className="text-sm font-semibold text-foreground">
          {formatTon(listing.priceNano)}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {pinLabel} • {visibilityLabel}
        </div>
        {tags.shown.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-1">
            {tags.shown.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {tags.remaining > 0 ? (
              <span className="rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
                +{tags.remaining}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {mode === "owner" ? (
        <Link
          to={`/channel-manage/${channelId}/listings/${listing.id}/edit`}
          state={rootBackTo ? { rootBackTo } : undefined}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground transition hover:text-foreground"
          aria-label="Edit listing"
        >
          <PencilLine size={14} />
        </Link>
      ) : null}
    </div>
  );
});

ListingPreviewRow.displayName = "ListingPreviewRow";

interface ChannelListingsPreviewProps {
  channelId: string;
  isExpanded: boolean;
  onSummaryChange?: (summary: { placementsCount: number; minPriceNano: string | null }) => void;
  mode?: ListingPreviewMode;
}

const ChannelListingsPreview = memo(
  ({ channelId, isExpanded, onSummaryChange, mode = "owner" }: ChannelListingsPreviewProps) => {
  const location = useLocation();
  const rootBackTo = (location.state as { rootBackTo?: string } | null)?.rootBackTo;
  const query = useQuery<ListingsByChannelResponse>({
    queryKey: ["channelListingsPreview", channelId],
    queryFn: () =>
      listingsByChannel({
        channelId,
        page: 1,
        limit: PREVIEW_LIMIT,
        onlyActive: true,
        sort: "recent",
      }),
    enabled: isExpanded,
    staleTime: 1000 * 60 * 5,
  });

  const items = query.data?.items ?? [];
  const totalCount = query.data?.total ?? items.length;

  useEffect(() => {
    if (!query.data) {
      return;
    }
    const minPriceNano = items.reduce<bigint | null>((currentMin, listing) => {
      try {
        const price = BigInt(listing.priceNano);
        if (currentMin === null || price < currentMin) {
          return price;
        }
        return currentMin;
      } catch {
        return currentMin;
      }
    }, null);
    onSummaryChange?.({
      placementsCount: totalCount,
      minPriceNano: minPriceNano ? minPriceNano.toString() : null,
    });
  }, [items, onSummaryChange, query.data, totalCount]);

  const previewItems = useMemo(
    () => items.slice(0, PREVIEW_COUNT),
    [items]
  );

  return (
    <div className="space-y-3">


      {query.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`listing-skeleton-${index}`}
              className="rounded-xl border border-border/50 bg-background/60 px-3 py-3"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-3 w-40" />
              <Skeleton className="mt-2 h-3 w-28" />
            </div>
          ))}
        </div>
      ) : query.isError ? (
        <div className="rounded-xl border border-border/60 bg-red-500/5 px-4 py-3 text-xs text-red-200">
          <p>{getErrorMessage(query.error, "Unable to load placements.")}</p>
          <button
            type="button"
            onClick={() => query.refetch()}
            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1 text-[11px] font-semibold text-red-200"
          >
            <RefreshCcw size={12} />
            Retry
          </button>
        </div>
      ) : previewItems.length > 0 ? (
        <div className="rounded-xl border border-border/60 bg-background/60 px-3 divide-y divide-border/40">
          {previewItems.map((listing) => (
            <ListingPreviewRow
              key={listing.id}
              channelId={channelId}
              listing={listing}
              rootBackTo={rootBackTo}
              mode={mode}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/60 bg-background/50 px-4 py-4 text-center">
          <p className="text-xs font-semibold text-foreground">No placements yet</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Create your first listing to start earning.
          </p>
        </div>
      )}
    </div>
  );
});

ChannelListingsPreview.displayName = "ChannelListingsPreview";

export default ChannelListingsPreview;
