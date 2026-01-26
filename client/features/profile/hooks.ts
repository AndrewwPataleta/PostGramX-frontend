import { useQuery } from "@tanstack/react-query";
import { getBalance, getProfileOverview } from "./api";

const profileKeys = {
  all: ["profile"] as const,
  overview: () => ["profile", "overview"] as const,
  balance: () => ["profile", "balance"] as const,
};

export const useProfile = () =>
  useQuery({
    queryKey: profileKeys.overview(),
    queryFn: getProfileOverview,
  });

export const useBalance = () =>
  useQuery({
    queryKey: profileKeys.balance(),
    queryFn: getBalance,
  });

export const profileQueryKeys = profileKeys;
