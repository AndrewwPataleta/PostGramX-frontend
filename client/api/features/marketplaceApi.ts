import { post } from "@/api/core/apiClient";
import type {
  MarketplaceListChannelsParams,
  MarketplaceListChannelsResponse,
} from "@/api/types/marketplace";

export const marketplaceListChannels = async (
  params: MarketplaceListChannelsParams
): Promise<MarketplaceListChannelsResponse> =>
  post<MarketplaceListChannelsResponse, MarketplaceListChannelsParams>(
    "/marketplace/channels/list",
    params
  );
