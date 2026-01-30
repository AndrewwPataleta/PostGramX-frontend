import { post } from "@/api/core/apiClient";
import type {
  TransactionsListFilters,
  TransactionsListResponse,
} from "@/api/types/payments";

const stripUndefined = <T extends Record<string, unknown>>(value: T) =>
  Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)
  ) as T;

export async function listTransactionsForUser(
  filters: TransactionsListFilters
): Promise<TransactionsListResponse> {
  return post<TransactionsListResponse, TransactionsListFilters>(
    "/payments/transactions/list",
    {
      data: stripUndefined({
        page: filters.page ?? 1,
        limit: Math.min(filters.limit ?? 20, 50),
        type: filters.type,
        status: filters.status,
        direction: filters.direction,
        dealId: filters.dealId,
        q: filters.q,
        from: filters.from,
        to: filters.to,
        sort: filters.sort ?? "recent",
        order: filters.order ?? "desc",
      }),
    }
  );
}
