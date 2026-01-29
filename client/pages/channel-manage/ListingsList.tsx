import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useOutletContext, useParams } from "react-router-dom";
import { Edit, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListingCard } from "@/components/listings/ListingCard";
import LoadingSkeleton from "@/components/feedback/LoadingSkeleton";
import { listingsByChannel } from "@/api/features/listingsApi";
import { getErrorMessage } from "@/lib/api/errors";
import type { ChannelManageContext } from "@/pages/channel-manage/ChannelManageLayout";

const ListingsList = () => {
  const { channel } = useOutletContext<ChannelManageContext>();
  const { id: channelIdParam } = useParams<{ id: string }>();
  const location = useLocation();
  const channelId = channelIdParam ?? channel.id;
  const rootBackTo = (location.state as { rootBackTo?: string } | null)?.rootBackTo;
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [onlyActive, setOnlyActive] = useState(true);
  const [sort, setSort] = useState<"recent" | "price_asc" | "price_desc">("recent");

  const listingsQuery = useQuery({
    queryKey: ["listingsByChannel", channelId, { page, limit, onlyActive, sort }],
    queryFn: () =>
      listingsByChannel({
        channelId,
        page,
        limit,
        onlyActive,
        sort,
      }),
  });

  useEffect(() => {
    if (listingsQuery.error) {
      toast.error(getErrorMessage(listingsQuery.error, "Unable to load listings"));
    }
  }, [listingsQuery.error]);

  const listings = listingsQuery.data?.items ?? [];
  const total = listingsQuery.data?.total ?? 0;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);
  const hasListings = listings.length > 0;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 rounded-lg bg-secondary/40 p-1">
          <button
            type="button"
            onClick={() => {
              setOnlyActive(true);
              setPage(1);
            }}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              onlyActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Active only
          </button>
          <button
            type="button"
            onClick={() => {
              setOnlyActive(false);
              setPage(1);
            }}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              !onlyActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All listings
          </button>
        </div>
        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value as "recent" | "price_asc" | "price_desc");
            setPage(1);
          }}
          className="rounded-lg border border-border/60 bg-card px-3 py-2 text-xs text-foreground"
        >
          <option value="recent">Most recent</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      {listingsQuery.isLoading ? (
        <LoadingSkeleton items={3} />
      ) : hasListings ? (
        <div className="space-y-4">
          <div className="space-y-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                variant="full"
                actionSlot={
                  <Link
                    to={`/channel-manage/${channelId}/listings/${listing.id}/edit`}
                    state={rootBackTo ? { rootBackTo } : undefined}
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2 rounded-lg border border-border transition-colors text-sm"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>
                }
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="rounded-lg border border-border/60 px-3 py-1 text-xs disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-border/60 px-3 py-1 text-xs disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">📋</span>
          </div>
          <p className="text-foreground font-semibold mb-2">No listings yet</p>
          <p className="text-muted-foreground text-sm mb-6">
            Create your first listing to start receiving offers
          </p>
          <Link
            to={`/channel-manage/${channelId}/listings/create`}
            state={rootBackTo ? { rootBackTo } : undefined}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            Create listing
          </Link>
        </div>
      )}

      <Link
        to={`/channel-manage/${channelId}/listings/create`}
        state={rootBackTo ? { rootBackTo } : undefined}
        className="fixed bottom-[calc(var(--tg-content-safe-area-inset-bottom)+120px)] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
        aria-label="Create listing"
      >
        <Plus size={18} />
      </Link>
    </>
  );
};

export default ListingsList;
