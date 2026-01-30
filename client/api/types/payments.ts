export type TransactionType =
  | "DEPOSIT"
  | "WITHDRAW"
  | "ESCROW_HOLD"
  | "ESCROW_RELEASE"
  | "ESCROW_REFUND"
  | "FEE";

export type TransactionStatus =
  | "PENDING"
  | "AWAITING_CONFIRMATION"
  | "CONFIRMED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELED";

export type TransactionDirection = "IN" | "OUT" | "INTERNAL";

export type TransactionsListFilters = {
  page?: number;
  limit?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  direction?: TransactionDirection;
  dealId?: string;
  q?: string;
  from?: string;
  to?: string;
  sort?: "recent" | "amount";
  order?: "asc" | "desc";
};

export type TransactionListItem = {
  id: string;
  type: TransactionType;
  direction: TransactionDirection;
  status: TransactionStatus;
  amountNano: string;
  currency: string;
  description: string | null;
  dealId: string | null;
  channelId: string | null;
  externalTxHash: string | null;
  createdAt: string;
  confirmedAt: string | null;
  completedAt: string | null;
};

export type TransactionsListResponse = {
  items: TransactionListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
