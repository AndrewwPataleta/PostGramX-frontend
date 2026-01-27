import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createDeal, fetchDealsList } from "@/api/features/dealsApi";
import { getTelegramWebApp } from "@/lib/telegram";
import type {
  CreateDealPayload,
  CreateDealResponse,
  DealsListParams,
  DealsListResponse,
} from "@/types/deals";

export const useDealsListQuery = (params: DealsListParams) =>
  useQuery<DealsListResponse>({
    queryKey: [
      "deals",
      params.role ?? "all",
      params.pendingPage ?? 1,
      params.activePage ?? 1,
      params.completedPage ?? 1,
    ],
    queryFn: () => fetchDealsList(params),
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });

export const useCreateDealMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<CreateDealResponse, Error, CreateDealPayload>({
    mutationFn: (payload) => createDeal(payload),
    onSuccess: () => {
      toast.success("Deal created");
      const webApp = getTelegramWebApp();
      webApp?.HapticFeedback?.notificationOccurred?.("success");
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      navigate("/deals", { state: { activeTab: "pending" }, replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
