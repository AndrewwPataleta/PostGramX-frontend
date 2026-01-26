import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import ChannelCard from "@/features/channels/components/ChannelCard";
import ChannelsFilters, {
  ChannelsFiltersState,
} from "@/features/channels/components/ChannelsFilters";
import { useChannelsList } from "@/features/channels/hooks/useChannelsList";
import ErrorState from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { TELEGRAM_MOCK } from "@/config/env";
import { getErrorMessage } from "@/lib/api/errors";
import type {
  ChannelRole,
  ChannelStatus,
  ChannelsListOrder,
  ChannelsListParams,
  ChannelsListSort,
} from "@/types/channels";

const DEFAULT_SORT: ChannelsListSort = "recent";
const DEFAULT_ORDER: ChannelsListOrder = "desc";

const roleValues: ChannelRole[] = ["OWNER", "MANAGER"];
const statusValues: ChannelStatus[] = [
  "DRAFT",
  "PENDING_VERIFY",
  "VERIFIED",
  "FAILED",
  "REVOKED",
];
const sortValues: ChannelsListSort[] = ["recent", "title", "subscribers"];
const orderValues: ChannelsListOrder[] = ["asc", "desc"];

const parseEnum = <T extends string>(
  value: string | null,
  allowed: readonly T[]
): T | undefined => {
  if (!value) {
    return undefined;
  }

  return (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
};

const ChannelCardSkeleton = () => (
  <div className="rounded-2xl border border-border/50 bg-card/80 p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-5 w-24 rounded-full" />
    </div>
    <div className="mt-4 grid grid-cols-3 gap-2">
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-16 rounded-xl" />
    </div>
    <div className="mt-4 flex items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

export default function Channels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") ?? "";
  const roleParam = parseEnum(searchParams.get("role"), roleValues);
  const statusParam = parseEnum(searchParams.get("status"), statusValues);
  const sortParam = parseEnum(searchParams.get("sort"), sortValues) ?? DEFAULT_SORT;
  const orderParam =
    parseEnum(searchParams.get("order"), orderValues) ?? DEFAULT_ORDER;
  const verifiedOnlyParam = searchParams.get("verifiedOnly") === "true";

  const [searchValue, setSearchValue] = useState(qParam);

  useEffect(() => {
    setSearchValue(qParam);
  }, [qParam]);

  const updateSearchParams = useCallback(
    (updates: Partial<ChannelsFiltersState>) => {
      const next = new URLSearchParams(searchParams);

      const applyValue = (
        key: keyof ChannelsFiltersState,
        value: string | boolean | undefined
      ) => {
        if (value === undefined || value === "" || value === false) {
          next.delete(key);
          return;
        }

        next.set(key, String(value));
      };

      if (Object.prototype.hasOwnProperty.call(updates, "q")) {
        applyValue("q", updates.q ?? "");
      }
      if (Object.prototype.hasOwnProperty.call(updates, "verifiedOnly")) {
        applyValue("verifiedOnly", updates.verifiedOnly);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "role")) {
        applyValue("role", updates.role);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "status")) {
        applyValue("status", updates.status);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "sort")) {
        if (updates.sort === DEFAULT_SORT) {
          next.delete("sort");
        } else {
          applyValue("sort", updates.sort);
        }
      }
      if (Object.prototype.hasOwnProperty.call(updates, "order")) {
        if (updates.order === DEFAULT_ORDER) {
          next.delete("order");
        } else {
          applyValue("order", updates.order);
        }
      }

      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const trimmed = searchValue.trim();
      updateSearchParams({ q: trimmed.length ? trimmed : undefined });
    }, 300);

    return () => {
      window.clearTimeout(handle);
    };
  }, [searchValue, updateSearchParams]);

  const filters = useMemo<ChannelsListParams>(
    () => ({
      q: qParam.trim() || undefined,
      role: roleParam,
      status: statusParam,
      verifiedOnly: verifiedOnlyParam || undefined,
      sort: sortParam,
      order: orderParam,
    }),
    [qParam, roleParam, statusParam, verifiedOnlyParam, sortParam, orderParam]
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    error,
  } = useChannelsList(filters, 10);

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );
  const total = data?.pages?.[0]?.total ?? 0;

  useEffect(() => {
    if (error) {
      toast.error(getErrorMessage(error, "Unable to load channels."));
    }
  }, [error]);

  const handleFiltersChange = useCallback(
    (next: Partial<ChannelsFiltersState>) => {
      if (Object.prototype.hasOwnProperty.call(next, "q")) {
        setSearchValue(next.q ?? "");
        return;
      }

      updateSearchParams(next);
    },
    [updateSearchParams]
  );

  const filterState = useMemo<ChannelsFiltersState>(
    () => ({
      q: searchValue,
      verifiedOnly: verifiedOnlyParam,
      role: roleParam,
      status: statusParam,
      sort: sortParam,
      order: orderParam,
    }),
    [
      searchValue,
      verifiedOnlyParam,
      roleParam,
      statusParam,
      sortParam,
      orderParam,
    ]
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pb-16 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-foreground">My Channels</h1>
          <p className="text-xs text-muted-foreground">
            Manage your verified and pending channels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {TELEGRAM_MOCK ? (
            <span className="rounded-full bg-purple-500/20 px-2 py-1 text-[10px] font-semibold uppercase text-purple-200">
              DEV
            </span>
          ) : null}
          <Link
            to="/add-channel/step-1"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus size={14} />
            Add Channel
          </Link>
        </div>
      </div>

      <ChannelsFilters filters={filterState} onChange={handleFiltersChange} />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ChannelCardSkeleton key={`channel-skeleton-${index}`} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          message={getErrorMessage(error, "Unable to load channels")}
          description="Please try again in a moment."
          onRetry={() => refetch()}
        />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/70 p-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
            📡
          </div>
          <p className="text-sm font-semibold text-foreground">No channels yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Connect your first Telegram channel to get started.
          </p>
          <Link
            to="/add-channel/step-1"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            Add Channel
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      )}

      {items.length > 0 ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-muted-foreground">
            Showing {items.length} of {total}
          </p>
          {hasNextPage ? (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-card"
            >
              {isFetchingNextPage ? (
                <Loader2 size={14} className="animate-spin" />
              ) : null}
              {isFetchingNextPage ? "Loading" : "Load more"}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
