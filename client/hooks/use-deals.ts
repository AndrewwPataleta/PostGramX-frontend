import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDeal, fetchDealsList } from "@/api/dealsApi";
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

  return useMutation<CreateDealResponse, Error, CreateDealPayload>({
    mutationFn: (payload) => createDeal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
};
