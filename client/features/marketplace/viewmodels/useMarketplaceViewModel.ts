import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { FilterState } from "@/components/FilterModal";
import { marketplaceRepository } from "@/features/marketplace/repositories/marketplaceRepository";

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

const marketplaceKeys = {
  channels: () => ["marketplace", "channels"] as const,
};

export const useMarketplaceViewModel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const query = useQuery({
    queryKey: marketplaceKeys.channels(),
    queryFn: marketplaceRepository.getMarketplaceChannels,
  });
  const { refetch } = query;

  useEffect(() => {
    const unsubscribe = marketplaceRepository.subscribeToMarketplaceListings(() => {
      void refetch();
    });

    return () => {
      unsubscribe();
    };
  }, [refetch]);

  const filteredChannels = useMemo(() => {
    const channels = query.data ?? [];
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
  }, [filters, query.data, searchQuery]);

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

  const openFilters = () => setIsFilterOpen(true);
  const closeFilters = () => setIsFilterOpen(false);
  const applyFilters = (nextFilters: FilterState) => setFilters(nextFilters);
  const resetFilters = () => setFilters(defaultFilters);

  return {
    state: {
      searchQuery,
      isFilterOpen,
      filters,
      isLoading: query.isLoading,
      error: query.error,
    },
    computed: {
      channels: filteredChannels,
    },
    actions: {
      setSearchQuery,
      openFilters,
      closeFilters,
      applyFilters,
      resetFilters,
      removeFilter: handleRemoveFilter,
      refetch: () => refetch(),
    },
  };
};
