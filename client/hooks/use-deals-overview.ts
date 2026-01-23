import { useQuery } from "@tanstack/react-query";

import { dealsOverviewMock } from "@/api/deals.api";
import { fetchDealsOverview } from "@/services/deals.service";

export const dealsOverviewQueryKey = ["deals-overview"];

export const useDealsOverview = () =>
  useQuery({
    queryKey: dealsOverviewQueryKey,
    queryFn: fetchDealsOverview,
    initialData: dealsOverviewMock,
  });
