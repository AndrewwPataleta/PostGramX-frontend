import { mockChannels } from "./mockChannels";
import type { MarketplaceChannel } from "./types";

const USE_MOCK_MARKETPLACE = import.meta.env.VITE_USE_MOCK_MARKETPLACE === "true";

const delay = async (minMs = 250, maxMs = 500) => {
  const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, duration));
};

if (USE_MOCK_MARKETPLACE) {
  console.info("Marketplace API running in MOCK MODE");
}

export const getChannels = async (): Promise<MarketplaceChannel[]> => {
  if (USE_MOCK_MARKETPLACE) {
    await delay();
    return mockChannels;
  }

  const response = await fetch("/api/marketplace/channels");
  if (!response.ok) {
    throw new Error("Failed to load channels");
  }
  return response.json();
};

export const getChannel = async (id: string): Promise<MarketplaceChannel> => {
  if (USE_MOCK_MARKETPLACE) {
    await delay();
    const channel = mockChannels.find((item) => item.id === id);
    if (!channel) {
      throw new Error("Channel not found");
    }
    return channel;
  }

  const response = await fetch(`/api/marketplace/channels/${id}`);
  if (!response.ok) {
    throw new Error("Failed to load channel");
  }
  return response.json();
};
