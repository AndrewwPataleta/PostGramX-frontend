import type { MarketplaceChannelDto } from "@/features/marketplace/types/marketplace";
import { httpClient } from "@/shared/api/httpClient";

export const fetchMarketplaceChannels = async (): Promise<MarketplaceChannelDto[]> => {
  const response = await httpClient.get<MarketplaceChannelDto[]>("/marketplace/channels");
  return response.data;
};

export const fetchMarketplaceChannel = async (id: string): Promise<MarketplaceChannelDto> => {
  const response = await httpClient.get<MarketplaceChannelDto>(`/marketplace/channels/${id}`);
  return response.data;
};

export const marketplaceApi = {
  fetchMarketplaceChannels,
  fetchMarketplaceChannel,
};
