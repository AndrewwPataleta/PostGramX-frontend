import type { Listing } from "@/features/listings/types";

export interface MarketplaceChannel {
  id: string;
  title: string;
  username: string;
  avatarUrl: string;
  verified: boolean;
  subscribers: number;
  averageViews: number;
  engagementRate: number;
  language: string;
  priceTon: number;
  description: string;
  listing?: Listing;
}

export type MarketplaceChannelDto = MarketplaceChannel;
