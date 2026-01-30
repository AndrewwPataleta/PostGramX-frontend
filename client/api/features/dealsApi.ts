import type {
  CreateDealPayload,
  CreateDealResponse,
  DealListItem,
  DealsListParams,
  DealsListResponse,
} from "@/types/deals";
import { post } from "@/api/core/apiClient";
import { DEAL_ESCROW_STATUS, DEAL_STATUS } from "@/constants/deals";
import { USER_ROLE } from "@/constants/roles";
import type { DealCardData } from "@/components/deals/DealCard";
import type { TimelineItem } from "@/components/deals/Timeline";

export interface DealsOverviewResponse {
  active: DealCardData[];
  pending: DealCardData[];
  completed: DealCardData[];
  timeline: TimelineItem[];
  timelineVerifying: TimelineItem[];
  quickFilters: string[];
}

const isMockMode = import.meta.env.VITE_API_MOCK === "true";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeDealsGroup = (
  group?: Partial<DealsListResponse["pending"]>
): DealsListResponse["pending"] => ({
  items: Array.isArray(group?.items) ? group?.items : [],
  page: typeof group?.page === "number" ? group.page : 1,
  limit: typeof group?.limit === "number" ? group.limit : 10,
  total: typeof group?.total === "number" ? group.total : 0,
});

const buildMockDeal = (overrides: Partial<DealListItem>): DealListItem => {
  const baseListing: DealListItem["listing"] = {
    id: "listing_1",
    priceNano: "25000000000",
    currency: "TON",
    format: "post",
    tags: ["crypto", "telegram", "growth"],
    placementHours: 24,
    lifetimeHours: 48,
    pinDurationHours: 24,
    visibilityDurationHours: 48,
    allowEdits: true,
    allowLinkTracking: true,
    contentRulesText: "Avoid misleading claims or urgent calls to action.",
    requiresApproval: true,
  };
  const listing = { ...baseListing, ...(overrides.listing ?? {}) };

  return {
    id: `deal_${Math.random().toString(36).slice(2, 8)}`,
    status: DEAL_STATUS.PENDING,
    escrowStatus: DEAL_ESCROW_STATUS.DRAFT,
    initiatorSide: "ADVERTISER",
    userRoleInDeal: USER_ROLE.ADVERTISER,
    channel: {
      id: "channel_1",
      name: "PostgramX Updates",
      username: "postgramx",
      avatarUrl: null,
      verified: true,
    },
    listing,
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    escrowWalletId: "escrow_wallet_1",
    escrowAmountNano: listing.priceNano,
    escrowCurrency: "TON",
    paymentAddress: "EQB7qQH2rXq4d9NfkY3H3aXk7kqfYjQ7ZVt2m9xkT8m0fLr",
    paymentExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    paymentDeadlineAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    adminReviewDeadlineAt: null,
    ...overrides,
    listing,
  };
};

const paginate = (items: DealListItem[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
};

const mockDealsList = (params: DealsListParams): DealsListResponse => {
  const pendingItems = [
    buildMockDeal({
      status: DEAL_STATUS.PENDING,
      escrowStatus: DEAL_ESCROW_STATUS.DRAFT,
      channel: {
        id: "channel_1",
        name: "TON Signals",
        username: "tonsig",
        avatarUrl: null,
        verified: true,
      },
      listing: {
        id: "listing_1",
        priceNano: "18000000000",
        currency: "TON",
        format: "post",
        tags: ["trading", "alerts"],
        placementHours: 24,
        lifetimeHours: 48,
        pinDurationHours: 24,
        visibilityDurationHours: 48,
        allowEdits: false,
        allowLinkTracking: true,
        contentRulesText: "No financial guarantees. Avoid spam emojis.",
        requiresApproval: true,
      },
    }),
    buildMockDeal({
      status: DEAL_STATUS.PENDING,
      escrowStatus: DEAL_ESCROW_STATUS.AWAITING_PAYMENT,
      channel: {
        id: "channel_2",
        name: "Web3 Pulse",
        username: "web3pulse",
        avatarUrl: null,
        verified: false,
      },
      listing: {
        id: "listing_2",
        priceNano: "24000000000",
        currency: "TON",
        format: "post",
        tags: ["web3", "defi"],
        placementHours: 12,
        lifetimeHours: 36,
        pinDurationHours: 12,
        visibilityDurationHours: 36,
        allowEdits: true,
        allowLinkTracking: false,
        requiresApproval: false,
      },
    }),
    buildMockDeal({
      status: DEAL_STATUS.PENDING,
      escrowStatus: DEAL_ESCROW_STATUS.AWAITING_PAYMENT,
      channel: {
        id: "channel_3",
        name: "TON Launchpad",
        username: "tonlaunchpad",
        avatarUrl: null,
        verified: true,
      },
      listing: {
        id: "listing_3",
        priceNano: "2500000000",
        currency: "TON",
        format: "post",
        tags: ["launch", "nft"],
        placementHours: 24,
        lifetimeHours: 48,
        pinDurationHours: 24,
        visibilityDurationHours: 48,
        allowEdits: true,
        allowLinkTracking: false,
        contentRulesText: "Share clear launch details. Avoid fake scarcity.",
        requiresApproval: true,
      },
      paymentExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }),
    buildMockDeal({
      status: DEAL_STATUS.PENDING,
      escrowStatus: DEAL_ESCROW_STATUS.CREATIVE_AWAITING_SUBMIT,
      channel: {
        id: "channel_3",
        name: "NFT Radar",
        username: "nftradar",
        avatarUrl: null,
        verified: true,
      },
      listing: {
        id: "listing_3",
        priceNano: "32000000000",
        currency: "TON",
        format: "post",
        tags: ["nft", "drops"],
        placementHours: 48,
        lifetimeHours: 72,
        pinDurationHours: 48,
        visibilityDurationHours: 72,
        allowEdits: true,
        allowLinkTracking: true,
        requiresApproval: true,
      },
      creativeText: "Launching the NFT Radar spotlight — drop your collection now.",
      adminReviewDeadlineAt: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
    }),
  ];

  const activeItems = [
    buildMockDeal({
      status: DEAL_STATUS.ACTIVE,
      escrowStatus: DEAL_ESCROW_STATUS.FUNDS_CONFIRMED,
      channel: {
        id: "channel_4",
        name: "Startup Digest",
        username: "startupdigest",
        avatarUrl: null,
        verified: true,
      },
      listing: {
        id: "listing_4",
        priceNano: "40000000000",
        currency: "TON",
        format: "post",
        tags: ["startup", "founder"],
        placementHours: 24,
        lifetimeHours: 48,
        pinDurationHours: 24,
        visibilityDurationHours: 48,
        allowEdits: true,
        allowLinkTracking: true,
        requiresApproval: false,
      },
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    }),
    buildMockDeal({
      status: DEAL_STATUS.ACTIVE,
      escrowStatus: DEAL_ESCROW_STATUS.POSTED_VERIFYING,
      channel: {
        id: "channel_5",
        name: "Crypto Atlas",
        username: "cryptoatlas",
        avatarUrl: null,
        verified: false,
      },
      listing: {
        id: "listing_5",
        priceNano: "29000000000",
        currency: "TON",
        format: "post",
        tags: ["analysis", "market"],
        placementHours: 24,
        lifetimeHours: 48,
        pinDurationHours: 24,
        visibilityDurationHours: 48,
        allowEdits: false,
        allowLinkTracking: true,
        requiresApproval: false,
      },
      postUrl: "https://t.me/cryptoatlas/123",
    }),
  ];

  const completedItems = [
    buildMockDeal({
      status: DEAL_STATUS.COMPLETED,
      escrowStatus: DEAL_ESCROW_STATUS.COMPLETED,
      channel: {
        id: "channel_6",
        name: "Product Launches",
        username: "launches",
        avatarUrl: null,
        verified: true,
      },
      listing: {
        id: "listing_6",
        priceNano: "50000000000",
        currency: "TON",
        format: "post",
        tags: ["product", "growth"],
        placementHours: 24,
        lifetimeHours: 48,
        pinDurationHours: 24,
        visibilityDurationHours: 48,
        allowEdits: true,
        allowLinkTracking: true,
        requiresApproval: false,
      },
    }),
    buildMockDeal({
      status: DEAL_STATUS.COMPLETED,
      escrowStatus: DEAL_ESCROW_STATUS.COMPLETED,
      channel: {
        id: "channel_7",
        name: "DeFi Radar",
        username: "defiradar",
        avatarUrl: null,
        verified: false,
      },
      listing: {
        id: "listing_7",
        priceNano: "21000000000",
        currency: "TON",
        format: "post",
        tags: ["defi", "yield"],
        placementHours: 12,
        lifetimeHours: 36,
        pinDurationHours: 12,
        visibilityDurationHours: 36,
        allowEdits: true,
        allowLinkTracking: true,
        requiresApproval: false,
      },
    }),
  ];

  const pendingPage = params.pendingPage ?? 1;
  const activePage = params.activePage ?? 1;
  const completedPage = params.completedPage ?? 1;
  const pendingLimit = params.pendingLimit ?? 10;
  const activeLimit = params.activeLimit ?? 10;
  const completedLimit = params.completedLimit ?? 10;

  return {
    pending: {
      items: paginate(pendingItems, pendingPage, pendingLimit),
      page: pendingPage,
      limit: pendingLimit,
      total: pendingItems.length,
    },
    active: {
      items: paginate(activeItems, activePage, activeLimit),
      page: activePage,
      limit: activeLimit,
      total: activeItems.length,
    },
    completed: {
      items: paginate(completedItems, completedPage, completedLimit),
      page: completedPage,
      limit: completedLimit,
      total: completedItems.length,
    },
  };
};

export const dealsOverviewMock: DealsOverviewResponse = {
  active: [
    {
      id: "FGX-10291",
      name: "FlowgramX Daily",
      username: "@flowgramx",
      verified: true,
      status: "Funds Locked",
      statusKey: "fundsLocked",
      icon: "🔒",
      price: "35 TON",
      meta: "Updated 2h ago",
      secondary: "Posting: Jan 30, 18:00",
      action: "View Schedule",
    },
    {
      id: "FGX-10292",
      name: "Crypto Atlas",
      username: "@cryptoatlas",
      verified: false,
      status: "Post Live — Verifying",
      statusKey: "verifying",
      icon: "👁️",
      price: "48 TON",
      meta: "Updated 32m ago",
      secondary: "Release in: 45m",
      action: "View Post",
    },
    {
      id: "FGX-10293",
      name: "Signal Stream",
      username: "@signalstream",
      verified: true,
      status: "Scheduled",
      statusKey: "scheduled",
      icon: "📅",
      price: "22 TON",
      meta: "Updated 1h ago",
      secondary: "Posting: Feb 2, 09:00",
      action: "View Schedule",
    },
  ],
  pending: [
    {
      id: "FGX-10294",
      name: "Market Pulse",
      username: "@marketpulse",
      verified: false,
      status: "Awaiting Channel Approval",
      statusKey: "awaitingApproval",
      icon: "⏳",
      price: "18 TON",
      meta: "Updated 10m ago",
      secondary: "Awaiting approval",
      action: "Open",
    },
    {
      id: "FGX-10295",
      name: "TON Launchpad",
      username: "@tonlaunchpad",
      verified: true,
      status: "Payment Required",
      statusKey: "paymentRequired",
      icon: "💳",
      price: "40 TON",
      meta: "Updated 3h ago",
      secondary: "Awaiting payment",
      action: "Pay Now",
    },
    {
      id: "FGX-10296",
      name: "Founder Notes",
      username: "@foundernotes",
      verified: false,
      status: "Creative Review",
      statusKey: "creativeReview",
      icon: "✏️",
      price: "27 TON",
      meta: "Updated 15m ago",
      secondary: "Creative submitted",
      action: "Review",
    },
  ],
  completed: [
    {
      id: "FGX-10288",
      name: "Web3 Horizon",
      username: "@web3horizon",
      verified: true,
      status: "Completed",
      statusKey: "completed",
      icon: "✅",
      price: "52 TON",
      meta: "Updated yesterday",
      secondary: "Receipt available",
      action: "Receipt",
    },
    {
      id: "FGX-10287",
      name: "Chain Updates",
      username: "@chainupdates",
      verified: false,
      status: "Refunded",
      statusKey: "refunded",
      icon: "↩️",
      price: "14 TON",
      meta: "Updated 2d ago",
      secondary: "Refund sent",
      action: "Details",
    },
  ],
  timeline: [
    { label: "Accepted", state: "completed" },
    { label: "Payment", state: "current" },
    { label: "Creative", state: "upcoming" },
    { label: "Scheduled", state: "upcoming" },
    { label: "Posted", state: "upcoming" },
    { label: "Released", state: "upcoming" },
    { label: "Completed", state: "upcoming" },
  ],
  timelineVerifying: [
    { label: "Accepted", state: "completed" },
    { label: "Payment", state: "completed" },
    { label: "Creative", state: "completed" },
    { label: "Scheduled", state: "completed" },
    { label: "Posted", state: "current" },
    { label: "Released", state: "upcoming" },
    { label: "Completed", state: "upcoming" },
  ],
  quickFilters: ["Payment Required", "Creative Review", "Scheduled", "Verifying"],
};

export const getDealsOverview = async (): Promise<DealsOverviewResponse> =>
  Promise.resolve(dealsOverviewMock);

export const createDeal = async (
  payload: CreateDealPayload
): Promise<CreateDealResponse> => {
  if (isMockMode) {
    await wait(800);
    return {
      id: `deal_${Date.now()}`,
      status: DEAL_STATUS.PENDING,
      escrowStatus: DEAL_ESCROW_STATUS.DRAFT,
      listingId: payload.listingId,
      channelId: "channel_mock",
      initiatorSide: "ADVERTISER",
    };
  }

  return post<CreateDealResponse, CreateDealPayload>("/deals/create", { data: payload });
};

export const fetchDealsList = async (
  params: DealsListParams = {}
): Promise<DealsListResponse> => {
  const payload: DealsListParams = {
    role: params.role ?? "all",
    pendingPage: params.pendingPage,
    pendingLimit: params.pendingLimit,
    activePage: params.activePage,
    activeLimit: params.activeLimit,
    completedPage: params.completedPage,
    completedLimit: params.completedLimit,
  };

  if (isMockMode) {
    await wait(800);
    return mockDealsList(payload);
  }

  const data = await post<DealsListResponse, DealsListParams>("/deals/list", {
    data: payload,
  });
  return {
    pending: normalizeDealsGroup(data.pending),
    active: normalizeDealsGroup(data.active),
    completed: normalizeDealsGroup(data.completed),
  };
};

export const fetchDealDetails = async (dealId: string): Promise<DealListItem> => {
  if (isMockMode) {
    await wait(600);
    const snapshot = mockDealsList({
      role: "all",
      pendingLimit: 20,
      activeLimit: 20,
      completedLimit: 20,
    });
    const allDeals = [
      ...snapshot.pending.items,
      ...snapshot.active.items,
      ...snapshot.completed.items,
    ];
    return allDeals.find((deal) => deal.id === dealId) ?? buildMockDeal({ id: dealId });
  }

  return post<DealListItem, { dealId: string }>("/deals/get", { data: { dealId } });
};

export const dealsApi = {
  createDeal,
  fetchDealsList,
  fetchDealDetails,
  getDealsOverview,
};
