import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ChannelCard from "@/components/marketplace/ChannelCard";
import { ActiveFiltersChips } from "@/components/ActiveFiltersChips";
import { FilterModal, type FilterState } from "@/components/FilterModal";
import { getChannels, onMockListingsUpdate } from "@/features/marketplace/api";
import type { MarketplaceChannel } from "@/features/marketplace/types";
import { Skeleton } from "@/components/ui/skeleton";

const defaultFilters: FilterState = {
  priceRange: [0, 100],
  subscribersRange: [0, 1_000_000],
  viewsRange: [0, 1_000_000],
  engagementRange: [0, 100],
  languages: [],
  categories: [],
  verifiedOnly: false,
  dateRange: ["", ""],
};

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [channels, setChannels] = useState<MarketplaceChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    const loadChannels = () => {
      setIsLoading(true);
      getChannels()
        .then((data) => {
          if (!mounted) {
            return;
          }
          setChannels(data);
        })
        .finally(() => {
          if (!mounted) {
            return;
          }
          setIsLoading(false);
        });
    };

    loadChannels();
    const unsubscribe = onMockListingsUpdate(() => loadChannels());

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }

    const updateHeaderHeight = () => {
      setHeaderHeight(header.offsetHeight);
    };

    updateHeaderHeight();

    const observer = new ResizeObserver(() => updateHeaderHeight());
    observer.observe(header);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

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

      return (
        matchesQuery &&
        matchesPrice &&
        matchesSubscribers &&
        matchesViews &&
        matchesEngagement &&
        matchesLanguage &&
        matchesVerified
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
        default:
          return prev;
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        ref={headerRef}
        className="fixed left-0 right-0 z-30 border-b border-border/50 bg-background/90 backdrop-blur-glass"
        style={{
          top: "calc(var(--tg-content-safe-area-inset-top) + var(--wallet-banner-height, 0px))",
        }}
      >
        <div className="mx-auto w-full max-w-2xl px-4 py-3">
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
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-2">
            <Search size={16} className="text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search channels or @username"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>
        <ActiveFiltersChips filters={filters} onRemoveFilter={handleRemoveFilter} />
      </div>

      <div style={{ paddingTop: headerHeight }} className="px-4 py-6 space-y-3">
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

        {!isLoading && filteredChannels.length === 0 ? (
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
