import type { Channel } from "./types";
import { post } from "@/api/core/apiClient";

const USE_MOCK_CHANNELS = import.meta.env.VITE_USE_MOCK_CHANNELS !== "false";

const delay = async (minMs = 250, maxMs = 500) => {
  const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, duration));
};

const mockChannels: Channel[] = [
  {
    id: "1",
    name: "My Crypto Channel",
    username: "@mycryptocha",
    avatar: "📰",
    verified: true,
    verificationStatus: "verified",
    subscribers: 45000,
    averageViews: 18000,
    engagement: 40,
    activeListings: 1,
    earnings: 230,
    lastUpdated: "2h",
    viewsTrend: [17000, 17800, 18200, 18500, 18100, 18900, 18500, 18200, 18800, 18000],
  },
  {
    id: "2",
    name: "Tech News Daily",
    username: "@technewsdaily",
    avatar: "💻",
    verified: true,
    verificationStatus: "verified",
    subscribers: 32000,
    averageViews: 12000,
    engagement: 38,
    activeListings: 0,
    earnings: 145,
    lastUpdated: "4h",
    viewsTrend: [11500, 12000, 11800, 12300, 12100, 12500, 12200, 12000, 12400, 12000],
  },
  {
    id: "3",
    name: "Web3 Hub",
    username: "@web3hub",
    avatar: "🔗",
    verified: false,
    verificationStatus: "pending",
    subscribers: 18000,
    averageViews: 6500,
    engagement: 36,
    activeListings: 0,
    earnings: 0,
    lastUpdated: "6h",
    viewsTrend: [6000, 6300, 6500, 6200, 6400, 6600, 6300, 6500, 6400, 6500],
  },
];

if (USE_MOCK_CHANNELS) {
  console.info("MOCK MODE ENABLED for Channels");
}

export const getMyChannels = async (): Promise<Channel[]> => {
  if (USE_MOCK_CHANNELS) {
    await delay();
    return mockChannels;
  }

  try {
    return post<Channel[], Record<string, never>>("/channels", {});
  } catch (error) {
    console.warn("Falling back to mock channels.", error);
    await delay();
    return mockChannels;
  }
};

export const linkChannel = async (payload: { username: string }) => {
  if (USE_MOCK_CHANNELS) {
    await delay();
    return { success: true };
  }

  try {
    return post<{ success: boolean }, { username: string }>(
      "/channels/link",
      payload
    );
  } catch (error) {
    console.warn("Falling back to mock link channel.", error);
    await delay();
    return { success: true };
  }
};

export const verifyChannel = async (id: string) => {
  if (USE_MOCK_CHANNELS) {
    await delay();
    return { success: true };
  }

  try {
    return post<{ success: boolean }, { id: string }>(`/channels/${id}/verify`, {
      id,
    });
  } catch (error) {
    console.warn("Falling back to mock channel verification.", error);
    await delay();
    return { success: true };
  }
};

export const channelsApi = {
  getMyChannels,
  linkChannel,
  verifyChannel,
};
