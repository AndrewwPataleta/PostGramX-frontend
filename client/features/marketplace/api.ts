import { mockChannels } from "./mockChannels";
import type { MarketplaceChannel } from "./types";

const USE_MOCK_MARKETPLACE = import.meta.env.VITE_USE_MOCK_MARKETPLACE !== "false";

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

  try {
    const response = await fetch("/api/marketplace/channels");
    if (!response.ok) {
      throw new Error("Failed to load channels");
    }
    return response.json();
  } catch (error) {
    console.warn("Falling back to mock marketplace channels.", error);
    await delay(200, 400);
    return mockChannels;
  }
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

  try {
    const response = await fetch(`/api/marketplace/channels/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load channel");
    }
    return response.json();
  } catch (error) {
    console.warn("Falling back to mock marketplace channel.", error);
    await delay(200, 400);
    const channel = mockChannels.find((item) => item.id === id);
    if (!channel) {
      throw new Error("Channel not found");
    }
    return channel;
  }
};
