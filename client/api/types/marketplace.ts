export type MarketplaceChannelItem = {
  id: string;
  name: string;
  username: string | null;
  about: string | null;
  avatarUrl: string | null;
  verified: boolean;
  subscribers: number | null;
  placementsCount: number;
  minPriceNano: string;
  currency: "TON";
  tags: string[];
};

export type MarketplaceListChannelsParams = {
  q?: string;
  tags?: string[];
  minSubscribers?: number;
  maxSubscribers?: number;
  minPriceTon?: number;
  maxPriceTon?: number;
  verifiedOnly?: boolean;
  page: number;
  limit: number;
  sort?: "recent" | "price_min" | "subscribers";
  order?: "asc" | "desc";
};

export type MarketplaceListChannelsResponse = {
  items: MarketplaceChannelItem[];
  page: number;
  limit: number;
  total: number;
};
