export type DealStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELED";

export type EscrowStatus =
  | "SCHEDULING_PENDING"
  | "CREATIVE_AWAITING_SUBMIT"
  | "CREATIVE_AWAITING_CONFIRM"
  | "CREATIVE_AWAITING_ADMIN_REVIEW"
  | "ADMIN_REVIEW"
  | "PAYMENT_AWAITING"
  | "FUNDS_PENDING"
  | "FUNDS_CONFIRMED"
  | "APPROVED_SCHEDULED"
  | "POSTED_VERIFYING"
  | "COMPLETED"
  | "CANCELED"
  | "REFUNDED"
  | "DISPUTED";

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
    pinDurationHours?: number | null;
    visibilityDurationHours?: number | null;
    allowEdits?: boolean;
    allowLinkTracking?: boolean;
    contentRulesText?: string | null;
    requiresApproval?: boolean;
  };
  createdAt: string;
  lastActivityAt: string;
  scheduledAt?: string;
  escrowExpiresAt?: string | null;
  creativeText?: string | null;
  postUrl?: string | null;
  postMessageId?: string | null;
  escrowWalletId?: string | null;
  escrowAmountNano?: string | null;
  escrowCurrency?: string | null;
  escrowPaymentAddress?: string | null;
  paymentExpiresAt?: string | null;
  paymentDeadlineAt?: string | null;
  adminReviewDeadlineAt?: string | null;
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
  escrowStatus: "SCHEDULING_PENDING";
  listingId: string;
  channelId: string;
  initiatorSide: "ADVERTISER";
}
