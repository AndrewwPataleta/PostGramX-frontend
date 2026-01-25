import type { CreateDealPayload, Deal } from "./types";
import {
  approveMockCreative,
  createMockDeal,
  getMockDeal,
  getMockDeals,
  requestMockEdits,
  simulateMockPayment,
  simulateMockPost,
  simulateMockVerifyFail,
  simulateMockVerifyPass,
} from "./mockDeals";

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
    return getMockDeals();
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
    const deal = getMockDeal(id);
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

export const createDeal = async (payload: CreateDealPayload): Promise<Deal> => {
  if (USE_MOCK_DEALS) {
    await delay();
    return createMockDeal(payload);
  }

  const response = await fetch("/api/deals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create deal");
  }
  return response.json();
};

export const approveCreative = async (id: string): Promise<Deal> => {
  if (USE_MOCK_DEALS) {
    await delay();
    const updated = approveMockCreative(id);
    if (!updated) {
      throw new Error("Deal not found");
    }
    return updated;
  }

  const response = await fetch(`/api/deals/${id}/creative/approve`, { method: "POST" });
  if (!response.ok) {
    throw new Error("Failed to approve creative");
  }
  return response.json();
};

export const requestEdits = async (id: string, note?: string): Promise<Deal> => {
  if (USE_MOCK_DEALS) {
    await delay();
    const updated = requestMockEdits(id, note);
    if (!updated) {
      throw new Error("Deal not found");
    }
    return updated;
  }

  const response = await fetch(`/api/deals/${id}/creative/edits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  if (!response.ok) {
    throw new Error("Failed to request edits");
  }
  return response.json();
};

export const simulatePayment = async (id: string): Promise<Deal> => {
  if (!USE_MOCK_DEALS) {
    throw new Error("Simulation is only available in mock mode");
  }
  await delay();
  const updated = simulateMockPayment(id);
  if (!updated) {
    throw new Error("Deal not found");
  }
  return updated;
};

export const simulatePost = async (id: string): Promise<Deal> => {
  if (!USE_MOCK_DEALS) {
    throw new Error("Simulation is only available in mock mode");
  }
  await delay();
  const updated = simulateMockPost(id);
  if (!updated) {
    throw new Error("Deal not found");
  }
  return updated;
};

export const simulateVerifyPass = async (id: string): Promise<Deal> => {
  if (!USE_MOCK_DEALS) {
    throw new Error("Simulation is only available in mock mode");
  }
  await delay();
  const updated = simulateMockVerifyPass(id);
  if (!updated) {
    throw new Error("Deal not found");
  }
  return updated;
};

export const simulateVerifyFail = async (id: string): Promise<Deal> => {
  if (!USE_MOCK_DEALS) {
    throw new Error("Simulation is only available in mock mode");
  }
  await delay();
  const updated = simulateMockVerifyFail(id);
  if (!updated) {
    throw new Error("Deal not found");
  }
  return updated;
};
