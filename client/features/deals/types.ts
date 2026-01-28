export type DealStatus =
  | "REQUESTED"
  | "OWNER_ACCEPTED"
  | "PAYMENT_REQUIRED"
  | "PAYMENT_CONFIRMING"
  | "FUNDS_LOCKED"
  | "CREATIVE_DRAFTING"
  | "CREATIVE_SUBMITTED"
  | "CREATIVE_APPROVED"
  | "SCHEDULED"
  | "POSTED"
  | "VERIFYING"
  | "RELEASED"
  | "REFUNDED";

export type EscrowStatus =
  | "AWAITING_PAYMENT"
  | "PAYMENT_CONFIRMING"
  | "FUNDS_LOCKED"
  | "RELEASED"
  | "REFUNDED";

export interface DealChannel {
  id: string;
  title: string;
  username: string;
  avatarUrl: string;
  isVerified: boolean;
  subscribers: number;
  language: string;
  priceTon: number;
}

export interface DealEscrow {
  status: EscrowStatus;
  amountTon: number;
  network: string;
  depositAddress?: string;
  memo?: string;
  updatedAt: string;
}

export interface DealCreative {
  text?: string;
  submittedAt: string | null;
  approvedAt: string | null;
  lastUpdatedAt?: string | null;
}

export interface DealSchedule {
  scheduledAt: string | null;
  timezone: string;
}

export interface DealPost {
  messageId?: string;
  viewUrl?: string;
  verifyUntil?: string;
  postedAt?: string;
}

export interface Deal {
  id: string;
  status: DealStatus;
  updatedAt: string;
  priceTon: number;
  briefText: string;
  requestedScheduleAt?: string | null;
  channel: DealChannel;
  escrow?: DealEscrow;
  creative?: DealCreative;
  schedule?: DealSchedule;
  post?: DealPost;
}

export interface CreateDealPayload {
  channelId: string;
  briefText: string;
  requestedScheduleAt?: string | null;
  ctaUrl?: string | null;
}
