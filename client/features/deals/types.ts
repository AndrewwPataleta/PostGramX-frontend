export type DealRole = "ADVERTISER" | "OWNER";
export type DealStatus =
  | "AWAITING_OWNER_ACCEPT"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export type EscrowStatus = "AWAITING_PAYMENT" | "HELD" | "RELEASED" | "REFUNDED";

export interface DealChannel {
  id: string;
  title: string;
  username: string;
  avatarUrl: string;
  isVerified: boolean;
}

export interface DealEscrow {
  status: EscrowStatus;
  amount: string;
  network: string;
  updatedAt: string;
}

export interface DealCreative {
  text: string;
  submittedAt: string | null;
  approvedAt: string | null;
}

export interface DealSchedule {
  scheduledAt: string | null;
  timezone: string;
}

export interface DealPost {
  messageId?: string;
  viewUrl?: string;
  verifyUntil?: string;
}

export interface Deal {
  id: string;
  status: DealStatus;
  role: DealRole;
  updatedAt: string;
  price: string;
  channel: DealChannel;
  escrow?: DealEscrow;
  creative?: DealCreative;
  schedule?: DealSchedule;
  post?: DealPost;
}
