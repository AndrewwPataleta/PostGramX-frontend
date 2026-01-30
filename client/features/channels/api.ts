import type { Channel } from "./types";
import { CHANNEL_VERIFICATION_STATUS } from "@/constants/channels";
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
    verificationStatus: CHANNEL_VERIFICATION_STATUS.VERIFIED,
    subscribers: 45000,
    activeListings: 1,
  },
  {
    id: "2",
    name: "Tech News Daily",
    username: "@technewsdaily",
    avatar: "💻",
    verified: true,
    verificationStatus: CHANNEL_VERIFICATION_STATUS.VERIFIED,
    subscribers: 32000,
    activeListings: 0,
  },
  {
    id: "3",
    name: "Web3 Hub",
    username: "@web3hub",
    avatar: "🔗",
    verified: false,
    verificationStatus: CHANNEL_VERIFICATION_STATUS.PENDING,
    subscribers: 18000,
    activeListings: 0,
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
