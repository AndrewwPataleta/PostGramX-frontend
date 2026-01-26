import { useQuery } from "@tanstack/react-query";
import { marketplaceRepository } from "@/features/marketplace/repositories/marketplaceRepository";

const marketplaceKeys = {
  channel: (id: string) => ["marketplace", "channels", id] as const,
};

export const useMarketplaceChannelViewModel = (id?: string) => {
  const query = useQuery({
    queryKey: id ? marketplaceKeys.channel(id) : marketplaceKeys.channel("unknown"),
    queryFn: () => {
      if (!id) {
        throw new Error("Missing channel ID");
      }
      return marketplaceRepository.getMarketplaceChannel(id);
    },
    enabled: Boolean(id),
  });

  return {
    state: {
      channel: query.data,
      isLoading: query.isLoading,
      error: query.error,
    },
    computed: {},
    actions: {
      refetch: () => query.refetch(),
    },
  };
};
