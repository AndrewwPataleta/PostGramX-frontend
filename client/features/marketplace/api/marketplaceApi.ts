import type { MarketplaceChannelDto } from "@/features/marketplace/types/marketplace";
import { post } from "@/api/core/apiClient";

export const fetchMarketplaceChannels = async (): Promise<MarketplaceChannelDto[]> => {
  return post<MarketplaceChannelDto[], Record<string, never>>(
    "/marketplace/channels",
    {}
  );
};

export const fetchMarketplaceChannel = async (id: string): Promise<MarketplaceChannelDto> => {
  return post<MarketplaceChannelDto, { id: string }>(
    `/marketplace/channels/${id}`,
    { id }
  );
};

export const marketplaceApi = {
  fetchMarketplaceChannels,
  fetchMarketplaceChannel,
};
