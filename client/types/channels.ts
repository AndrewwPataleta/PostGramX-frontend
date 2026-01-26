export type ChannelStatus =
  | "DRAFT"
  | "PENDING_VERIFY"
  | "VERIFIED"
  | "FAILED"
  | "REVOKED";

export type ChannelRole = "OWNER" | "MANAGER";

export type ChannelsListSort = "recent" | "title" | "subscribers";

export type ChannelsListOrder = "asc" | "desc";

export type ChannelsListParams = {
  q?: string;
  username?: string;
  status?: ChannelStatus;
  role?: ChannelRole;
  verifiedOnly?: boolean;
  sort?: ChannelsListSort;
  order?: ChannelsListOrder;
  page?: number;
  limit?: number;
};

export type ChannelListItem = {
  id: string;
  username: string;
  title: string;
  status: ChannelStatus;
  telegramChatId?: number | null;
  memberCount?: number | null;
  avgViews?: number | null;
  verifiedAt?: string | null;
  lastCheckedAt?: string | null;
  membership: {
    role: ChannelRole;
    telegramAdminStatus: "creator" | "administrator";
    lastRecheckAt?: string | null;
  };
};

export type ChannelsListResponse = {
  items: ChannelListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
