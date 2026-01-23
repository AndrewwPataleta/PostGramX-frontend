import type { Deal } from "./types";

const now = Date.now();
const minutesAgo = (minutes: number) => new Date(now - minutes * 60_000).toISOString();
const minutesFromNow = (minutes: number) => new Date(now + minutes * 60_000).toISOString();
const hoursFromNow = (hours: number) => new Date(now + hours * 3_600_000).toISOString();

export const mockDeals: Deal[] = [
  {
    id: "DL-1001",
    status: "AWAITING_OWNER_ACCEPT",
    role: "ADVERTISER",
    updatedAt: minutesAgo(12),
    price: "18 TON",
    channel: {
      id: "ch-cryptohub",
      title: "Crypto Signals Hub",
      username: "cryptohub",
      avatarUrl: "https://placehold.co/96x96/0f172a/38bdf8?text=C",
      isVerified: true,
    },
  },
  {
    id: "DL-1002",
    status: "ACTIVE",
    role: "ADVERTISER",
    updatedAt: minutesAgo(24),
    price: "40 TON",
    channel: {
      id: "ch-tonlaunchpad",
      title: "TON Launchpad",
      username: "tonlaunchpad",
      avatarUrl: "https://placehold.co/96x96/111827/f97316?text=T",
      isVerified: true,
    },
    escrow: {
      status: "AWAITING_PAYMENT",
      amount: "40 TON",
      network: "TON",
      updatedAt: minutesAgo(24),
    },
  },
  {
    id: "DL-1003",
    status: "ACTIVE",
    role: "OWNER",
    updatedAt: minutesAgo(8),
    price: "35 TON",
    channel: {
      id: "ch-flowgram",
      title: "FlowgramX Daily",
      username: "flowgramx",
      avatarUrl: "https://placehold.co/96x96/0f172a/22d3ee?text=F",
      isVerified: true,
    },
    escrow: {
      status: "HELD",
      amount: "35 TON",
      network: "TON",
      updatedAt: minutesAgo(8),
    },
    creative: {
      text: "Drafting a launch teaser for FlowgramX updates.",
      submittedAt: null,
      approvedAt: null,
    },
  },
  {
    id: "DL-1004",
    status: "ACTIVE",
    role: "ADVERTISER",
    updatedAt: minutesAgo(4),
    price: "27 TON",
    channel: {
      id: "ch-founder",
      title: "Founder Notes",
      username: "foundernotes",
      avatarUrl: "https://placehold.co/96x96/0b1120/a855f7?text=F",
      isVerified: true,
    },
    escrow: {
      status: "HELD",
      amount: "27 TON",
      network: "TON",
      updatedAt: minutesAgo(4),
    },
    creative: {
      text: "Launching the new FlowgramX workflow today. Grab your slot.",
      submittedAt: minutesAgo(9),
      approvedAt: null,
    },
  },
  {
    id: "DL-1005",
    status: "ACTIVE",
    role: "OWNER",
    updatedAt: minutesAgo(16),
    price: "22 TON",
    channel: {
      id: "ch-signalstream",
      title: "Signal Stream",
      username: "signalstream",
      avatarUrl: "https://placehold.co/96x96/0f172a/38bdf8?text=S",
      isVerified: true,
    },
    escrow: {
      status: "HELD",
      amount: "22 TON",
      network: "TON",
      updatedAt: minutesAgo(16),
    },
    creative: {
      text: "Approved creative ready for scheduling.",
      submittedAt: minutesAgo(22),
      approvedAt: minutesAgo(14),
    },
    schedule: {
      scheduledAt: hoursFromNow(2),
      timezone: "UTC",
    },
  },
  {
    id: "DL-1006",
    status: "ACTIVE",
    role: "ADVERTISER",
    updatedAt: minutesAgo(7),
    price: "48 TON",
    channel: {
      id: "ch-cryptoatlas",
      title: "Crypto Atlas",
      username: "cryptoatlas",
      avatarUrl: "https://placehold.co/96x96/111827/2dd4bf?text=C",
      isVerified: true,
    },
    escrow: {
      status: "HELD",
      amount: "48 TON",
      network: "TON",
      updatedAt: minutesAgo(7),
    },
    creative: {
      text: "Post copy approved and now live for verification.",
      submittedAt: minutesAgo(40),
      approvedAt: minutesAgo(30),
    },
    schedule: {
      scheduledAt: minutesAgo(20),
      timezone: "UTC",
    },
    post: {
      messageId: "984521",
      viewUrl: "https://t.me/cryptoatlas/984521",
      verifyUntil: minutesFromNow(30),
    },
  },
  {
    id: "DL-1007",
    status: "COMPLETED",
    role: "ADVERTISER",
    updatedAt: minutesAgo(18),
    price: "52 TON",
    channel: {
      id: "ch-web3",
      title: "Web3 Horizon",
      username: "web3horizon",
      avatarUrl: "https://placehold.co/96x96/111827/22c55e?text=W",
      isVerified: true,
    },
    escrow: {
      status: "RELEASED",
      amount: "52 TON",
      network: "TON",
      updatedAt: minutesAgo(18),
    },
    creative: {
      text: "Thanks for featuring our launch — appreciate the support!",
      submittedAt: minutesAgo(90),
      approvedAt: minutesAgo(80),
    },
    schedule: {
      scheduledAt: minutesAgo(70),
      timezone: "UTC",
    },
    post: {
      messageId: "984502",
      viewUrl: "https://t.me/web3horizon/984502",
      verifyUntil: minutesAgo(5),
    },
  },
  {
    id: "DL-1008",
    status: "CANCELLED",
    role: "ADVERTISER",
    updatedAt: minutesAgo(29),
    price: "14 TON",
    channel: {
      id: "ch-chainupdates",
      title: "Chain Updates",
      username: "chainupdates",
      avatarUrl: "https://placehold.co/96x96/0f172a/f87171?text=C",
      isVerified: true,
    },
    escrow: {
      status: "REFUNDED",
      amount: "14 TON",
      network: "TON",
      updatedAt: minutesAgo(29),
    },
  },
];
