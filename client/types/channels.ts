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

export type PreviewChannelRequest = {
  data: {
    usernameOrLink: string;
  };
};

export type LinkChannelRequest = {
  data: {
    username: string;
  };
};

export type VerifyChannelRequest = {
  data: {
    id: string;
  };
};

export type PreviewChannelResponse = {
  normalizedUsername: string;
  title: string;
  username: string;
  telegramChatId?: number | null;
  type: string;
  isPublic: boolean;
  nextStep: string;
  memberCount?: number | null;
  avgViews?: number | null;
  photoUrl?: string | null;
  avatarUrl?: string | null;
  // TODO: Align preview response fields with backend DTO when confirmed.
};

export type LinkChannelResponse = {
  id?: string;
  channelId?: string;
  username?: string;
  status: ChannelStatus | string;
  membership?: ChannelListItem["membership"] | null;
  // TODO: Align link response payload with backend.
};

export type VerifyChannelResponse = {
  status: string;
  verifiedAt?: string | null;
  error?: { code?: string; message?: string } | string | null;
  // TODO: Confirm verify response payload with backend.
};
