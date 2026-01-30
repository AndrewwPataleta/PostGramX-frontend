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
import { post } from "@/api/core/apiClient";

export const USE_MOCK_DEALS = import.meta.env.VITE_USE_MOCK_DEALS !== "false";

const delay = async (minMs = 300, maxMs = 600) => {
  const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, duration));
};

if (USE_MOCK_DEALS) {
  console.info("MOCK MODE ENABLED for Deals");
}

export const getDeals = async (): Promise<Deal[]> => {
  if (USE_MOCK_DEALS) {
    await delay();
    return getMockDeals();
  }

  try {
    return post<Deal[], Record<string, never>>("/deals", {});
  } catch (error) {
    console.warn("Falling back to mock deals.", error);
    await delay();
    return getMockDeals();
  }
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

  try {
    return post<Deal, { id: string }>(`/deals/${id}`, { id });
  } catch (error) {
    console.warn("Falling back to mock deal.", error);
    await delay();
    const deal = getMockDeal(id);
    if (!deal) {
      throw new Error("Deal not found");
    }
    return deal;
  }
};

export const createDeal = async (payload: CreateDealPayload): Promise<Deal> => {
  if (USE_MOCK_DEALS) {
    await delay();
    return createMockDeal(payload);
  }

  try {
    return post<Deal, CreateDealPayload>("/deals", payload);
  } catch (error) {
    console.warn("Falling back to mock deal creation.", error);
    await delay();
    return createMockDeal(payload);
  }
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

  try {
    return post<Deal, { id: string }>(`/deals/${id}/creative/approve`, { id });
  } catch (error) {
    console.warn("Falling back to mock creative approval.", error);
    await delay();
    const updated = approveMockCreative(id);
    if (!updated) {
      throw new Error("Deal not found");
    }
    return updated;
  }
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

  try {
    return post<Deal, { id: string; note?: string }>(
      `/deals/${id}/creative/edits`,
      {
        id,
        note,
      }
    );
  } catch (error) {
    console.warn("Falling back to mock edit request.", error);
    await delay();
    const updated = requestMockEdits(id, note);
    if (!updated) {
      throw new Error("Deal not found");
    }
    return updated;
  }
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

export const dealsApi = {
  getDeals,
  getDeal,
  createDeal,
  approveCreative,
  requestEdits,
  simulatePayment,
  simulatePost,
  simulateVerifyPass,
  simulateVerifyFail,
};
