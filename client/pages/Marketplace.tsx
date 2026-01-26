import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ChannelCard from "@/components/marketplace/ChannelCard";
import { ActiveFiltersChips } from "@/components/ActiveFiltersChips";
import { FilterModal, type FilterState } from "@/components/FilterModal";
import { onMockListingsUpdate } from "@/features/marketplace/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketplaceChannels } from "@/features/marketplace/hooks";
import ErrorState from "@/components/feedback/ErrorState";
import { getErrorMessage } from "@/lib/api/errors";

const defaultFilters: FilterState = {
  priceRange: [0, 100],
  subscribersRange: [0, 1_000_000],
  viewsRange: [0, 1_000_000],
  engagementRange: [0, 100],
  languages: [],
  categories: [],
  tags: [],
  verifiedOnly: false,
  dateRange: ["", ""],
};

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const {
    data: channels = [],
    isLoading,
    error,
    refetch,
  } = useMarketplaceChannels();

  useEffect(() => {
    const unsubscribe = onMockListingsUpdate(() => refetch());

    return () => {
      unsubscribe();
    };
  }, [refetch]);

  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      const matchesQuery =
        channel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice =
        channel.priceTon >= filters.priceRange[0] && channel.priceTon <= filters.priceRange[1];
      const matchesSubscribers =
        channel.subscribers >= filters.subscribersRange[0] &&
        channel.subscribers <= filters.subscribersRange[1];
      const matchesViews =
        channel.averageViews >= filters.viewsRange[0] &&
        channel.averageViews <= filters.viewsRange[1];
      const engagementRange = filters.engagementRange ?? [0, 100];
      const matchesEngagement =
        channel.engagementRate >= engagementRange[0] &&
        channel.engagementRate <= engagementRange[1];
      const matchesLanguage =
        filters.languages.length === 0 || filters.languages.includes(channel.language);
      const matchesVerified = !filters.verifiedOnly || channel.verified;
      const channelTags = channel.listing?.tags ?? [];
      const matchesTags =
        filters.tags.length === 0 || channelTags.some((tag) => filters.tags.includes(tag));

      return (
        matchesQuery &&
        matchesPrice &&
        matchesSubscribers &&
        matchesViews &&
        matchesEngagement &&
        matchesLanguage &&
        matchesVerified &&
        matchesTags
      );
    });
  }, [channels, filters, searchQuery]);

  const handleRemoveFilter = (filterType: string, value?: string) => {
    setFilters((prev) => {
      switch (filterType) {
        case "priceRange":
          return { ...prev, priceRange: defaultFilters.priceRange };
        case "subscribersRange":
          return { ...prev, subscribersRange: defaultFilters.subscribersRange };
        case "viewsRange":
          return { ...prev, viewsRange: defaultFilters.viewsRange };
        case "engagementRange":
          return { ...prev, engagementRange: defaultFilters.engagementRange };
        case "verifiedOnly":
          return { ...prev, verifiedOnly: false };
        case "languages":
          return {
            ...prev,
            languages: prev.languages.filter((lang) => lang !== value),
          };
        case "categories":
          return {
            ...prev,
            categories: prev.categories.filter((cat) => cat !== value),
          };
        case "tags":
          return {
            ...prev,
            tags: prev.tags.filter((tag) => tag !== value),
          };
        default:
          return prev;
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="px-4 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-foreground">Marketplace</h1>
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-2">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search channels or @username"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <ActiveFiltersChips filters={filters} onRemoveFilter={handleRemoveFilter} />
      </div>

      <div className="px-4 py-6 space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={`marketplace-skeleton-${index}`} className="rounded-2xl border border-border/50 bg-card/80 p-4">
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
          : filteredChannels.map((channel) => <ChannelCard key={channel.id} channel={channel} />)}

        {!isLoading && error ? (
          <ErrorState
            message={getErrorMessage(error, "Unable to load channels")}
            description="Please try again when you have a stable connection."
            onRetry={() => refetch()}
          />
        ) : null}

        {!isLoading && !error && filteredChannels.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 text-center text-sm text-muted-foreground">
            No channels found. Try a new search.
          </div>
        ) : null}
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApply={(nextFilters) => setFilters(nextFilters)}
        onReset={() => setFilters(defaultFilters)}
      />
    </div>
  );
}
