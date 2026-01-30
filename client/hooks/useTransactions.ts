import { useInfiniteQuery } from "@tanstack/react-query";
import type { TransactionsListFilters } from "@/api/types/payments";
import { listTransactionsForUser } from "@/api/features/paymentsApi";

export function useTransactions(filters: TransactionsListFilters) {
  return useInfiniteQuery({
    queryKey: ["payments", "transactions", filters],
    queryFn: ({ pageParam }) =>
      listTransactionsForUser({ ...filters, page: pageParam }),
    initialPageParam: filters.page ?? 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    keepPreviousData: true,
    staleTime: 15_000,
  });
}
