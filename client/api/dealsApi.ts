import type {
  CreateDealPayload,
  CreateDealResponse,
  DealListItem,
  DealsListParams,
  DealsListResponse,
} from "@/types/deals";

const resolveBaseUrl = () => {
  const baseUrl =
    typeof import.meta.env.POSTGRAMX_BACKEND_URL === "string"
      ? import.meta.env.POSTGRAMX_BACKEND_URL.trim()
      : "";

  return baseUrl.replace(/\/+$/, "");
};

const API_BASE_URL = resolveBaseUrl();
const isMockMode = import.meta.env.VITE_API_MOCK === "true";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const logDev = (label: string, payload: unknown) => {
  if (!import.meta.env.DEV) {
    return;
  }
  console.info(`[DealsAPI] ${label}`, payload);
};

const extractErrorMessage = (data: unknown, fallback: string) => {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const candidate = data as { message?: string; error?: { message?: string } | string };

  if (typeof candidate.message === "string" && candidate.message.trim().length > 0) {
    return candidate.message;
  }

  if (typeof candidate.error === "string" && candidate.error.trim().length > 0) {
    return candidate.error;
  }

  if (
    candidate.error &&
    typeof candidate.error === "object" &&
    typeof candidate.error.message === "string" &&
    candidate.error.message.trim().length > 0
  ) {
    return candidate.error.message;
  }

  return fallback;
};

const normalizeDealsGroup = (
  group?: Partial<DealsListResponse["pending"]>
): DealsListResponse["pending"] => ({
  items: Array.isArray(group?.items) ? group?.items : [],
  page: typeof group?.page === "number" ? group.page : 1,
  limit: typeof group?.limit === "number" ? group.limit : 10,
  total: typeof group?.total === "number" ? group.total : 0,
});

const buildMockDeal = (overrides: Partial<DealListItem>): DealListItem => ({
  id: `deal_${Math.random().toString(36).slice(2, 8)}`,
  status: "PENDING",
  escrowStatus: "NEGOTIATING",
  initiatorSide: "ADVERTISER",
  userRoleInDeal: "advertiser",
  channel: {
    id: "channel_1",
    name: "PostgramX Updates",
    username: "postgramx",
    avatarUrl: null,
    verified: true,
  },
  listing: {
    id: "listing_1",
    priceNano: "25000000000",
    currency: "TON",
    format: "post",
    tags: ["crypto", "telegram", "growth"],
    placementHours: 24,
    lifetimeHours: 48,
  },
  createdAt: new Date().toISOString(),
  lastActivityAt: new Date().toISOString(),
  ...overrides,
});

const paginate = (items: DealListItem[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
};

const mockDealsList = (params: DealsListParams): DealsListResponse => {
  const pendingItems = [
    buildMockDeal({
      status: "PENDING",
      escrowStatus: "NEGOTIATING",
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
      },
    }),
    buildMockDeal({
      status: "PENDING",
      escrowStatus: "AWAITING_PAYMENT",
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
      },
    }),
    buildMockDeal({
      status: "PENDING",
      escrowStatus: "NEGOTIATING",
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
      },
    }),
  ];

  const activeItems = [
    buildMockDeal({
      status: "ACTIVE",
      escrowStatus: "FUNDS_CONFIRMED",
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
      },
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    }),
    buildMockDeal({
      status: "ACTIVE",
      escrowStatus: "POSTED_VERIFYING",
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
      },
    }),
  ];

  const completedItems = [
    buildMockDeal({
      status: "COMPLETED",
      escrowStatus: "COMPLETED",
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
      },
    }),
    buildMockDeal({
      status: "COMPLETED",
      escrowStatus: "COMPLETED",
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

export const createDeal = async (
  payload: CreateDealPayload
): Promise<CreateDealResponse> => {
  try {
    if (isMockMode) {
      await wait(800);
      const response: CreateDealResponse = {
        id: `deal_${Date.now()}`,
        status: "PENDING",
        escrowStatus: "NEGOTIATING",
        listingId: payload.listingId,
        channelId: "channel_mock",
        initiatorSide: "ADVERTISER",
      };
      logDev("createDeal(mock) response", response);
      return response;
    }

    const requestBody = { data: payload };
    logDev("createDeal request", requestBody);

    const response = await fetch(`${API_BASE_URL}/deals/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = (await response.json()) as CreateDealResponse;
    logDev("createDeal response", data);

    if (!response.ok) {
      throw new Error(extractErrorMessage(data, "Unable to create deal"));
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unable to create deal");
  }
};

export const fetchDealsList = async (
  params: DealsListParams = {}
): Promise<DealsListResponse> => {
  const payload = {
    role: params.role ?? "all",
    pendingPage: params.pendingPage,
    pendingLimit: params.pendingLimit,
    activePage: params.activePage,
    activeLimit: params.activeLimit,
    completedPage: params.completedPage,
    completedLimit: params.completedLimit,
  };

  try {
    if (isMockMode) {
      await wait(800);
      const response = mockDealsList(payload);
      logDev("fetchDealsList(mock) response", response);
      return response;
    }

    const requestBody = { data: payload };
    logDev("fetchDealsList request", requestBody);

    const response = await fetch(`${API_BASE_URL}/deals/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = (await response.json()) as DealsListResponse;
    logDev("fetchDealsList response", data);

    if (!response.ok) {
      throw new Error(extractErrorMessage(data, "Unable to load deals"));
    }

    return {
      pending: normalizeDealsGroup(data.pending),
      active: normalizeDealsGroup(data.active),
      completed: normalizeDealsGroup(data.completed),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unable to load deals");
  }
};
