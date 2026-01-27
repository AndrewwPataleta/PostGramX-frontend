export type DealStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELED";

export type EscrowStatus =
  | "NEGOTIATING"
  | "AWAITING_PAYMENT"
  | "FUNDS_CONFIRMED"
  | "POSTED_VERIFYING"
  | "COMPLETED"
  | "CANCELED";

export type UserRoleInDeal = "advertiser" | "publisher" | "publisher_manager";

export interface DealListItem {
  id: string;
  status: DealStatus;
  escrowStatus: EscrowStatus;
  initiatorSide: "ADVERTISER" | "PUBLISHER";
  userRoleInDeal: UserRoleInDeal;
  channel: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
    verified: boolean;
  };
  listing: {
    id: string;
    priceNano: string;
    currency: string;
    format: string;
    tags: string[];
    placementHours: number;
    lifetimeHours: number;
  };
  createdAt: string;
  lastActivityAt: string;
  scheduledAt?: string;
}

export interface DealsListGroup<TItem> {
  items: TItem[];
  page: number;
  limit: number;
  total: number;
}

export interface DealsListResponse {
  pending: DealsListGroup<DealListItem>;
  active: DealsListGroup<DealListItem>;
  completed: DealsListGroup<DealListItem>;
}

export interface DealsListParams {
  role?: "all" | "advertiser" | "publisher";
  pendingPage?: number;
  pendingLimit?: number;
  activePage?: number;
  activeLimit?: number;
  completedPage?: number;
  completedLimit?: number;
}

export interface CreateDealPayload {
  listingId: string;
  brief?: string;
  scheduledAt?: string;
}

export interface CreateDealResponse {
  id: string;
  status: "PENDING";
  escrowStatus: "NEGOTIATING";
  listingId: string;
  channelId: string;
  initiatorSide: "ADVERTISER";
}
