import type { Paginated } from "./channels";

export type ListingListItem = {
  id: string;
  priceNano: string;
  currency: "TON";
  format: "POST";
  tags: string[];
  pinDurationHours: number | null;
  visibilityDurationHours: number;
  allowEdits: boolean;
  allowLinkTracking: boolean;
  allowPinnedPlacement: boolean;
  requiresApproval: boolean;
  contentRulesText?: string;
  isActive: boolean;
};

export type ListingsByChannelParams = {
  channelId: string;
  page: number;
  limit: number;
  onlyActive?: boolean;
  sort?: "recent" | "price_asc" | "price_desc";
};

export type ListingsByChannelResponse = import("./channels").Paginated<ListingListItem>;
