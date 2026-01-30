import { mockChannels } from "@/features/marketplace/api/mockChannels";
import { LEGACY_DEAL_STATUS, LEGACY_ESCROW_STATUS } from "@/constants/deals";
import type { CreateDealPayload, Deal } from "./types";

const STORAGE_KEY = "flowgramx.mockDeals";

const now = Date.now();
const minutesAgo = (minutes: number) => new Date(now - minutes * 60_000).toISOString();
const minutesFromNow = (minutes: number) => new Date(now + minutes * 60_000).toISOString();
const hoursFromNow = (hours: number) => new Date(now + hours * 3_600_000).toISOString();

const defaultDeals: Deal[] = [
  {
    id: "DL-2001",
    status: LEGACY_DEAL_STATUS.OWNER_ACCEPTED,
    updatedAt: minutesAgo(8),
    priceTon: 4.2,
    briefText: "Launch teaser for FlowgramX with CTA to beta waitlist.",
    channel: {
      id: mockChannels[0].id,
      title: mockChannels[0].title,
      username: mockChannels[0].username,
      avatarUrl: mockChannels[0].avatarUrl,
      isVerified: mockChannels[0].verified,
      subscribers: mockChannels[0].subscribers,
      language: mockChannels[0].language,
      priceTon: mockChannels[0].priceTon,
    },
    escrow: {
      status: LEGACY_ESCROW_STATUS.AWAITING_PAYMENT,
      amountTon: 4.2,
      network: "TON",
      depositAddress: "EQC2MockDepositAddress1111",
      memo: "FGX-2001",
      updatedAt: minutesAgo(8),
    },
  },
  {
    id: "DL-2002",
    status: LEGACY_DEAL_STATUS.CREATIVE_SUBMITTED,
    updatedAt: minutesAgo(18),
    priceTon: 3.5,
    briefText: "Promote new campaign dashboard with a short CTA to try demo.",
    channel: {
      id: mockChannels[1].id,
      title: mockChannels[1].title,
      username: mockChannels[1].username,
      avatarUrl: mockChannels[1].avatarUrl,
      isVerified: mockChannels[1].verified,
      subscribers: mockChannels[1].subscribers,
      language: mockChannels[1].language,
      priceTon: mockChannels[1].priceTon,
    },
    escrow: {
      status: LEGACY_ESCROW_STATUS.FUNDS_LOCKED,
      amountTon: 3.5,
      network: "TON",
      updatedAt: minutesAgo(20),
    },
    creative: {
      text: "🚀 FlowgramX just launched a smarter way to buy Telegram placements. Try the demo today.",
      submittedAt: minutesAgo(18),
      approvedAt: null,
    },
  },
  {
    id: "DL-2003",
    status: LEGACY_DEAL_STATUS.SCHEDULED,
    updatedAt: minutesAgo(40),
    priceTon: 2.6,
    briefText: "Drive signups for creator waitlist with emphasis on verified channels.",
    channel: {
      id: mockChannels[2].id,
      title: mockChannels[2].title,
      username: mockChannels[2].username,
      avatarUrl: mockChannels[2].avatarUrl,
      isVerified: mockChannels[2].verified,
      subscribers: mockChannels[2].subscribers,
      language: mockChannels[2].language,
      priceTon: mockChannels[2].priceTon,
    },
    escrow: {
      status: LEGACY_ESCROW_STATUS.FUNDS_LOCKED,
      amountTon: 2.6,
      network: "TON",
      updatedAt: minutesAgo(40),
    },
    creative: {
      text: "FlowgramX connects advertisers with top Telegram channels. Join the waitlist today.",
      submittedAt: minutesAgo(60),
      approvedAt: minutesAgo(48),
    },
    schedule: {
      scheduledAt: hoursFromNow(2),
      timezone: "UTC",
    },
  },
  {
    id: "DL-2004",
    status: LEGACY_DEAL_STATUS.POSTED,
    updatedAt: minutesAgo(6),
    priceTon: 5.1,
    briefText: "Highlight escrow safety and bot-assisted messaging for advertisers.",
    channel: {
      id: mockChannels[3].id,
      title: mockChannels[3].title,
      username: mockChannels[3].username,
      avatarUrl: mockChannels[3].avatarUrl,
      isVerified: mockChannels[3].verified,
      subscribers: mockChannels[3].subscribers,
      language: mockChannels[3].language,
      priceTon: mockChannels[3].priceTon,
    },
    escrow: {
      status: LEGACY_ESCROW_STATUS.FUNDS_LOCKED,
      amountTon: 5.1,
      network: "TON",
      updatedAt: minutesAgo(8),
    },
    creative: {
      text: "FlowgramX keeps your TON safe in escrow until the post is verified. Learn more today.",
      submittedAt: minutesAgo(35),
      approvedAt: minutesAgo(30),
    },
    schedule: {
      scheduledAt: minutesAgo(15),
      timezone: "UTC",
    },
    post: {
      messageId: "99421",
      viewUrl: "https://t.me/signalstream/99421",
      verifyUntil: minutesFromNow(22),
      postedAt: minutesAgo(12),
    },
  },
  {
    id: "DL-2005",
    status: LEGACY_DEAL_STATUS.RELEASED,
    updatedAt: minutesAgo(55),
    priceTon: 3.1,
    briefText: "Showcase creative review and scheduling in the mini app.",
    channel: {
      id: mockChannels[4].id,
      title: mockChannels[4].title,
      username: mockChannels[4].username,
      avatarUrl: mockChannels[4].avatarUrl,
      isVerified: mockChannels[4].verified,
      subscribers: mockChannels[4].subscribers,
      language: mockChannels[4].language,
      priceTon: mockChannels[4].priceTon,
    },
    escrow: {
      status: LEGACY_ESCROW_STATUS.RELEASED,
      amountTon: 3.1,
      network: "TON",
      updatedAt: minutesAgo(55),
    },
    creative: {
      text: "Our first FlowgramX campaign is live — thanks to the community!",
      submittedAt: minutesAgo(120),
      approvedAt: minutesAgo(110),
    },
    schedule: {
      scheduledAt: minutesAgo(90),
      timezone: "UTC",
    },
    post: {
      messageId: "99400",
      viewUrl: "https://t.me/web3horizon/99400",
      verifyUntil: minutesAgo(10),
      postedAt: minutesAgo(80),
    },
  },
  {
    id: "DL-2006",
    status: LEGACY_DEAL_STATUS.REFUNDED,
    updatedAt: minutesAgo(90),
    priceTon: 3.8,
    briefText: "Russian audience campaign for product launch update.",
    channel: {
      id: mockChannels[5].id,
      title: mockChannels[5].title,
      username: mockChannels[5].username,
      avatarUrl: mockChannels[5].avatarUrl,
      isVerified: mockChannels[5].verified,
      subscribers: mockChannels[5].subscribers,
      language: mockChannels[5].language,
      priceTon: mockChannels[5].priceTon,
    },
    escrow: {
      status: LEGACY_ESCROW_STATUS.REFUNDED,
      amountTon: 3.8,
      network: "TON",
      updatedAt: minutesAgo(90),
    },
  },
];

const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;

const readDeals = () => {
  if (!hasStorage()) {
    return [...defaultDeals];
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDeals));
    return [...defaultDeals];
  }
  try {
    const parsed = JSON.parse(stored) as Deal[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (error) {
    console.warn("Failed to parse mock deals", error);
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDeals));
  return [...defaultDeals];
};

const writeDeals = (deals: Deal[]) => {
  if (!hasStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
};

export const getMockDeals = () => readDeals();

export const getMockDeal = (id: string) => readDeals().find((deal) => deal.id === id) ?? null;

const updateDeal = (id: string, updater: (deal: Deal) => Deal) => {
  const deals = readDeals();
  const index = deals.findIndex((deal) => deal.id === id);
  if (index === -1) {
    return null;
  }
  const updated = updater({ ...deals[index] });
  deals[index] = updated;
  writeDeals(deals);
  return updated;
};

const createDealId = () => `DL-${Math.floor(1000 + Math.random() * 9000)}`;

export const createMockDeal = (payload: CreateDealPayload) => {
  const channel = mockChannels.find((item) => item.id === payload.channelId) ?? mockChannels[0];
  const createdAt = new Date().toISOString();

  const baseDeal: Deal = {
    id: createDealId(),
    status: LEGACY_DEAL_STATUS.REQUESTED,
    updatedAt: createdAt,
    priceTon: channel.priceTon,
    briefText: payload.briefText,
    requestedScheduleAt: payload.requestedScheduleAt ?? null,
    channel: {
      id: channel.id,
      title: channel.title,
      username: channel.username,
      avatarUrl: channel.avatarUrl,
      isVerified: channel.verified,
      subscribers: channel.subscribers,
      language: channel.language,
      priceTon: channel.priceTon,
    },
  };

  const acceptedDeal: Deal = {
    ...baseDeal,
    status: LEGACY_DEAL_STATUS.OWNER_ACCEPTED,
    escrow: {
      status: LEGACY_ESCROW_STATUS.AWAITING_PAYMENT,
      amountTon: channel.priceTon,
      network: "TON",
      depositAddress: "EQC2MockDepositAddress2222",
      memo: `FGX-${baseDeal.id}`,
      updatedAt: createdAt,
    },
  };

  const deals = readDeals();
  const nextDeals = [acceptedDeal, ...deals];
  writeDeals(nextDeals);
  return acceptedDeal;
};

export const approveMockCreative = (id: string) =>
  updateDeal(id, (deal) => {
    const approvedAt = new Date().toISOString();
    const hasSchedule = Boolean(deal.schedule?.scheduledAt);
    return {
      ...deal,
      status: hasSchedule ? LEGACY_DEAL_STATUS.SCHEDULED : LEGACY_DEAL_STATUS.CREATIVE_APPROVED,
      updatedAt: approvedAt,
      creative: {
        ...deal.creative,
        approvedAt,
      },
    };
  });

export const requestMockEdits = (id: string, note?: string) =>
  updateDeal(id, (deal) => {
    const updatedAt = new Date().toISOString();
    return {
      ...deal,
      status: LEGACY_DEAL_STATUS.CREATIVE_DRAFTING,
      updatedAt,
      creative: {
        ...deal.creative,
        text: note ? `${deal.creative?.text ?? ""}\n\nEdits: ${note}`.trim() : deal.creative?.text,
        submittedAt: null,
        approvedAt: null,
        lastUpdatedAt: updatedAt,
      },
    };
  });

export const simulateMockPayment = (id: string) =>
  updateDeal(id, (deal) => {
    const updatedAt = new Date().toISOString();
    if (deal.escrow?.status === LEGACY_ESCROW_STATUS.AWAITING_PAYMENT) {
      return {
        ...deal,
        status: LEGACY_DEAL_STATUS.PAYMENT_CONFIRMING,
        updatedAt,
        escrow: {
          ...deal.escrow,
          status: LEGACY_ESCROW_STATUS.PAYMENT_CONFIRMING,
          updatedAt,
        },
      };
    }

    if (deal.escrow?.status === LEGACY_ESCROW_STATUS.PAYMENT_CONFIRMING) {
      return {
        ...deal,
        status: LEGACY_DEAL_STATUS.FUNDS_LOCKED,
        updatedAt,
        escrow: {
          ...deal.escrow,
          status: LEGACY_ESCROW_STATUS.FUNDS_LOCKED,
          updatedAt,
        },
        creative: deal.creative ?? {
          text: "",
          submittedAt: null,
          approvedAt: null,
        },
      };
    }

    return { ...deal, updatedAt };
  });

export const simulateMockPost = (id: string) =>
  updateDeal(id, (deal) => {
    const updatedAt = new Date().toISOString();
    return {
      ...deal,
      status: LEGACY_DEAL_STATUS.POSTED,
      updatedAt,
      post: {
        messageId: "10101",
        viewUrl: `https://t.me/${deal.channel.username}/10101`,
        verifyUntil: minutesFromNow(25),
        postedAt: updatedAt,
      },
    };
  });

export const simulateMockVerifyPass = (id: string) =>
  updateDeal(id, (deal) => {
    const updatedAt = new Date().toISOString();
    return {
      ...deal,
      status: LEGACY_DEAL_STATUS.RELEASED,
      updatedAt,
      escrow: deal.escrow
        ? {
          ...deal.escrow,
          status: LEGACY_ESCROW_STATUS.RELEASED,
          updatedAt,
        }
        : undefined,
    };
  });

export const simulateMockVerifyFail = (id: string) =>
  updateDeal(id, (deal) => {
    const updatedAt = new Date().toISOString();
    return {
      ...deal,
      status: LEGACY_DEAL_STATUS.REFUNDED,
      updatedAt,
      escrow: deal.escrow
        ? {
          ...deal.escrow,
          status: LEGACY_ESCROW_STATUS.REFUNDED,
          updatedAt,
        }
        : undefined,
    };
  });
