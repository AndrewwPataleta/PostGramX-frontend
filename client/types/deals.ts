import type { DealEscrowStatus, DealStatus } from "@/constants/deals";
import type { UserRole } from "@/constants/roles";

export type { DealStatus } from "@/constants/deals";

export type EscrowStatus = DealEscrowStatus;

export type UserRoleInDeal = UserRole;

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
  role?: "all" | UserRole;
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
  status: DealStatus;
  escrowStatus: EscrowStatus;
  listingId: string;
  channelId: string;
  initiatorSide: "ADVERTISER";
}
