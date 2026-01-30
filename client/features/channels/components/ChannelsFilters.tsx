import { ArrowDownUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CHANNEL_ROLE, CHANNEL_STATUS } from "@/constants/channels";
import { CHANNEL_STATUS_LABELS } from "@/constants/ui";
import type {
  ChannelRole,
  ChannelStatus,
  ChannelsListOrder,
  ChannelsListSort,
} from "@/types/channels";

export type ChannelsFiltersState = {
  q: string;
  verifiedOnly: boolean;
  role?: ChannelRole;
  status?: ChannelStatus;
  sort: ChannelsListSort;
  order: ChannelsListOrder;
};

interface ChannelsFiltersProps {
  filters: ChannelsFiltersState;
  onChange: (next: Partial<ChannelsFiltersState>) => void;
}

const roleOptions: Array<{ label: string; value: ChannelRole | "all" }> = [
  { label: "All roles", value: "all" },
  { label: "Owner", value: CHANNEL_ROLE.OWNER },
  { label: "Manager", value: CHANNEL_ROLE.MANAGER },
];

const statusOptions: Array<{ label: string; value: ChannelStatus | "all" }> = [
  { label: "All statuses", value: "all" },
  { label: CHANNEL_STATUS_LABELS.DRAFT, value: CHANNEL_STATUS.DRAFT },
  { label: CHANNEL_STATUS_LABELS.PENDING_VERIFY, value: CHANNEL_STATUS.PENDING_VERIFY },
  { label: CHANNEL_STATUS_LABELS.VERIFIED, value: CHANNEL_STATUS.VERIFIED },
  { label: CHANNEL_STATUS_LABELS.FAILED, value: CHANNEL_STATUS.FAILED },
  { label: CHANNEL_STATUS_LABELS.REVOKED, value: CHANNEL_STATUS.REVOKED },
];

const sortOptions: Array<{ label: string; value: ChannelsListSort }> = [
  { label: "Recent", value: "recent" },
  { label: "Title", value: "title" },
  { label: "Subscribers", value: "subscribers" },
];

const ChannelsFilters = ({ filters, onChange }: ChannelsFiltersProps) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={filters.q}
            onChange={(event) => onChange({ q: event.target.value })}
            placeholder="Search channels"
            className="h-10 rounded-xl bg-background/60 pl-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5">
            <Switch
              checked={filters.verifiedOnly}
              onCheckedChange={(checked) => onChange({ verifiedOnly: checked })}
              className="data-[state=checked]:bg-emerald-500"
            />
            <Label className="text-xs text-muted-foreground">Verified only</Label>
          </div>

          <div className="min-w-[140px] flex-1">
            <Select
              value={filters.role ?? "all"}
              onValueChange={(value) =>
                onChange({
                  role: value === "all" ? undefined : (value as ChannelRole),
                })
              }
            >
              <SelectTrigger className="h-9 rounded-xl bg-background/60 text-xs">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[160px] flex-1">
            <Select
              value={filters.status ?? "all"}
              onValueChange={(value) =>
                onChange({
                  status: value === "all" ? undefined : (value as ChannelStatus),
                })
              }
            >
              <SelectTrigger className="h-9 rounded-xl bg-background/60 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[160px] flex-1">
            <Select
              value={filters.sort}
              onValueChange={(value) =>
                onChange({ sort: value as ChannelsListSort })
              }
            >
              <SelectTrigger className="h-9 rounded-xl bg-background/60 text-xs">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            onClick={() =>
              onChange({ order: filters.order === "asc" ? "desc" : "asc" })
            }
            className={cn(
              "flex h-9 items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 text-xs text-muted-foreground transition hover:text-foreground",
              filters.order === "asc" && "text-foreground"
            )}
          >
            <ArrowDownUp size={14} />
            {filters.order === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelsFilters;
