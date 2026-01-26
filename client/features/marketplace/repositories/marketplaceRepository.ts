import {
  getActiveListingForChannel,
  isMockListingsEnabled,
  subscribeToMockListings,
} from "@/features/listings/mockStore";
import { mockChannels } from "@/features/marketplace/api/mockChannels";
import { marketplaceApi } from "@/features/marketplace/api/marketplaceApi";
import type { MarketplaceChannel, MarketplaceChannelDto } from "@/features/marketplace/types/marketplace";

const USE_MOCK_MARKETPLACE = import.meta.env.VITE_USE_MOCK_MARKETPLACE !== "false";

const delay = async (minMs = 250, maxMs = 500) => {
  const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, duration));
};

if (USE_MOCK_MARKETPLACE) {
  console.info("MOCK MODE ENABLED for Marketplace");
}

const mapChannel = (channel: MarketplaceChannelDto): MarketplaceChannel => channel;

const attachMockListing = (channel: MarketplaceChannel): MarketplaceChannel => {
  const listing = isMockListingsEnabled ? getActiveListingForChannel(channel.id) : undefined;
  return listing ? { ...channel, priceTon: listing.priceTon, listing } : channel;
};

const getMockChannels = async (): Promise<MarketplaceChannel[]> => {
  await delay();
  return mockChannels.map((channel) => attachMockListing(channel));
};

const getMockChannel = async (id: string): Promise<MarketplaceChannel> => {
  await delay();
  const channel = mockChannels.find((item) => item.id === id);
  if (!channel) {
    throw new Error("Channel not found");
  }
  return attachMockListing(channel);
};

export const getMarketplaceChannels = async (): Promise<MarketplaceChannel[]> => {
  if (USE_MOCK_MARKETPLACE) {
    return getMockChannels();
  }

  try {
    const channels = await marketplaceApi.fetchMarketplaceChannels();
    return channels.map(mapChannel);
  } catch (error) {
    console.warn("Falling back to mock marketplace channels.", error);
    return getMockChannels();
  }
};

export const getMarketplaceChannel = async (id: string): Promise<MarketplaceChannel> => {
  if (USE_MOCK_MARKETPLACE) {
    return getMockChannel(id);
  }

  try {
    const channel = await marketplaceApi.fetchMarketplaceChannel(id);
    return mapChannel(channel);
  } catch (error) {
    console.warn("Falling back to mock marketplace channel.", error);
    return getMockChannel(id);
  }
};

export const subscribeToMarketplaceListings = (callback: () => void) => {
  if (!isMockListingsEnabled) {
    return () => undefined;
  }

  return subscribeToMockListings(callback);
};

export const marketplaceRepository = {
  getMarketplaceChannels,
  getMarketplaceChannel,
  subscribeToMarketplaceListings,
};
