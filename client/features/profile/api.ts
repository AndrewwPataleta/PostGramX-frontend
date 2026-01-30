import type { ProfileOverview, WalletBalance } from "./types";
import { post } from "@/api/core/apiClient";

const USE_MOCK_PROFILE = import.meta.env.VITE_USE_MOCK_PROFILE !== "false";

const delay = async (minMs = 250, maxMs = 500) => {
  const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, duration));
};

const mockProfile: ProfileOverview = {
  balance: {
    available: 124.5,
    locked: 35,
    pendingRelease: 12,
    instantWithdraw: 18,
  },
  transactions: [
    {
      type: "Deposit",
      amount: "+50 TON",
      status: "Confirmed",
      time: "Today · 12:08",
    },
    {
      type: "Escrow Lock",
      amount: "-35 TON",
      status: "Pending",
      time: "Today · 11:42",
    },
    {
      type: "Escrow Release",
      amount: "+35 TON",
      status: "Confirmed",
      time: "Yesterday · 18:20",
    },
    {
      type: "Withdrawal",
      amount: "-12 TON",
      status: "Processing",
      time: "Yesterday · 16:05",
    },
    {
      type: "Refund",
      amount: "+8 TON",
      status: "Confirmed",
      time: "Aug 20 · 09:45",
    },
  ],
  topUpAddress: "EQABc7p8sT1h8Q8p2x9K4Qx9nX9z1q8Qx0Qx9nX9z1q8Qx0Qx",
  topUpMemo: "PGX-TOPUP",
};

if (USE_MOCK_PROFILE) {
  console.info("MOCK MODE ENABLED for Profile");
}

export const getProfileOverview = async (): Promise<ProfileOverview> => {
  if (USE_MOCK_PROFILE) {
    await delay();
    return mockProfile;
  }

  try {
    return post<ProfileOverview, Record<string, never>>("/profile", { data: {} });
  } catch (error) {
    console.warn("Falling back to mock profile.", error);
    await delay();
    return mockProfile;
  }
};

export const getBalance = async (): Promise<WalletBalance> => {
  if (USE_MOCK_PROFILE) {
    await delay();
    return mockProfile.balance;
  }

  try {
    return post<WalletBalance, Record<string, never>>("/profile/balance", { data: {} });
  } catch (error) {
    console.warn("Falling back to mock balance.", error);
    await delay();
    return mockProfile.balance;
  }
};

export const profileApi = {
  getProfileOverview,
  getBalance,
};
