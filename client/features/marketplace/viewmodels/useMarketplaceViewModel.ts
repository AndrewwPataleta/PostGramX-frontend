import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { FilterState } from "@/components/FilterModal";
import { channelsApi } from "@/api/features/channelsApi";
import { getErrorMessage } from "@/lib/api/errors";
import type { ChannelItem, ListChannelsParams, Paginated } from "@/types/channels";

const defaultFilters: FilterState = {
  priceRange: [0, 100],
  subscribersRange: [0, 1_000_000],
  languages: [],
  categories: [],
  tags: [],
  verifiedOnly: true,
  dateRange: ["", ""],
};

const marketplaceKeys = {
  channels: (filters: ListChannelsParams) => ["channels", filters] as const,
};

export const useMarketplaceViewModel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [sort] = useState<ListChannelsParams["sort"]>("recent");
  const [order] = useState<ListChannelsParams["order"]>("desc");

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);

    return () => {
      window.clearTimeout(handler);
    };
  }, [searchQuery]);

  const queryFilters = useMemo<ListChannelsParams>(
    () => ({
      q: debouncedQuery || undefined,
      verifiedOnly: filters.verifiedOnly || undefined,
      page,
      limit,
      sort,
      order,
      includeListings: false,
    }),
    [debouncedQuery, filters.verifiedOnly, limit, order, page, sort]
  );

  const query = useQuery<Paginated<ChannelItem>>({
    queryKey: marketplaceKeys.channels(queryFilters),
    queryFn: () => channelsApi.listChannels(queryFilters),
  });

  useEffect(() => {
    if (query.error) {
      toast.error(getErrorMessage(query.error, "Unable to load channels"));
    }
  }, [query.error]);

  const filteredChannels = useMemo(
    () => query.data?.items ?? [],
    [query.data?.items]
  );

  const handleRemoveFilter = (filterType: string, value?: string) => {
    setFilters((prev) => {
      switch (filterType) {
        case "priceRange":
          return { ...prev, priceRange: defaultFilters.priceRange };
        case "subscribersRange":
          return { ...prev, subscribersRange: defaultFilters.subscribersRange };
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
      refetch: () => query.refetch(),
      setPage,
    },
  };
};
