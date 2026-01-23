import { mockDeals } from "./mockDeals";
import type { Deal } from "./types";

const USE_MOCK_DEALS = import.meta.env.VITE_USE_MOCK_DEALS === "true";

const delay = async (minMs = 300, maxMs = 600) => {
  const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, duration));
};

if (USE_MOCK_DEALS) {
  console.info("Deals API running in MOCK MODE");
}

export const getDeals = async (): Promise<Deal[]> => {
  if (USE_MOCK_DEALS) {
    await delay();
    return mockDeals;
  }

  const response = await fetch("/api/deals");
  if (!response.ok) {
    throw new Error("Failed to load deals");
  }
  return response.json();
};

export const getDeal = async (id: string): Promise<Deal> => {
  if (USE_MOCK_DEALS) {
    await delay();
    const deal = mockDeals.find((item) => item.id === id);
    if (!deal) {
      throw new Error("Deal not found");
    }
    return deal;
  }

  const response = await fetch(`/api/deals/${id}`);
  if (!response.ok) {
    throw new Error("Failed to load deal");
  }
  return response.json();
};
