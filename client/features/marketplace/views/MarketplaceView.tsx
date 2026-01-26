import { Search, SlidersHorizontal } from "lucide-react";
import ChannelCard from "@/components/marketplace/ChannelCard";
import { ActiveFiltersChips } from "@/components/ActiveFiltersChips";
import { FilterModal } from "@/components/FilterModal";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/feedback/ErrorState";
import { getErrorMessage } from "@/lib/api/errors";
import { useMarketplaceViewModel } from "@/features/marketplace/viewmodels/useMarketplaceViewModel";

export default function MarketplaceView() {
  const { state, computed, actions } = useMarketplaceViewModel();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="px-4 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-foreground">Marketplace</h1>
          <button
            type="button"
            onClick={actions.openFilters}
            className="inline-flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-2">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={state.searchQuery}
            onChange={(event) => actions.setSearchQuery(event.target.value)}
            placeholder="Search channels or @username"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <ActiveFiltersChips filters={state.filters} onRemoveFilter={actions.removeFilter} />
      </div>

      <div className="px-4 py-6 space-y-3">
        {state.isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`marketplace-skeleton-${index}`}
                className="rounded-2xl border border-border/50 bg-card/80 p-4"
              >
                <div className="flex items-start gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))
          : computed.channels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}

        {!state.isLoading && state.error ? (
          <ErrorState
            message={getErrorMessage(state.error, "Unable to load channels")}
            description="Please try again when you have a stable connection."
            onRetry={actions.refetch}
          />
        ) : null}

        {!state.isLoading && !state.error && computed.channels.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 text-center text-sm text-muted-foreground">
            No channels found. Try a new search.
          </div>
        ) : null}
      </div>

      <FilterModal
        isOpen={state.isFilterOpen}
        onClose={actions.closeFilters}
        filters={state.filters}
        onApply={actions.applyFilters}
        onReset={actions.resetFilters}
      />
    </div>
  );
}
