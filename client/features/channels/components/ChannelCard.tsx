import { memo, type ReactNode } from "react";
import { BadgeCheck, ChevronDown, Users2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChannelListItem, ChannelStatus } from "@/types/channels";

const statusStyles: Record<
  ChannelStatus,
  { label: string; className: string; icon?: ReactNode }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-muted/40 text-muted-foreground border-border/60",
  },
  PENDING_VERIFY: {
    label: "Pending verification",
    className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  },
  VERIFIED: {
    label: "Verified",
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    icon: <BadgeCheck size={12} className="text-emerald-300" />,
  },
  FAILED: {
    label: "Verification failed",
    className: "bg-red-500/20 text-red-300 border-red-500/40",
  },
  REVOKED: {
    label: "Revoked",
    className: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  },
};

const formatMetric = (value?: number | null) => {
  if (value == null) {
    return "–";
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toString();
};

const formatTitle = (text: string) => text || "Untitled channel";

interface ChannelCardProps {
  channel: ChannelListItem;
  onClick?: () => void;
  onVerify?: () => void;
  onUnlink?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  expandDisabled?: boolean;
  expandTooltip?: string;
  expandedContent?: ReactNode;
}

const ChannelCard = ({
  channel,
  onClick,
  onVerify,
  onUnlink,
  isExpanded = false,
  onToggleExpand,
  expandDisabled = false,
  expandTooltip,
  expandedContent,
}: ChannelCardProps) => {
  const status = statusStyles[channel.status];
  const showVerifyAction = channel.status === "PENDING_VERIFY" && onVerify;
  const showUnlinkAction = Boolean(onUnlink);
  const showExpandAction = Boolean(onToggleExpand);

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border/50 bg-card/80 p-4 text-left shadow-sm transition",
        onClick && "cursor-pointer hover:border-border/80 hover:bg-card"
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {formatTitle(channel.title)}
          </h3>
          <p className="text-xs text-muted-foreground">@{channel.username}</p>
        </div>
        <div className="flex items-center gap-2">
          {showUnlinkAction ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onUnlink?.();
              }}
              className="rounded-full border border-border/60 bg-background/70 p-1.5 text-muted-foreground transition hover:text-foreground"
              aria-label="Unlink channel"
            >
              <X size={14} />
            </button>
          ) : null}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
              status.className
            )}
          >
            {status.icon}
            {status.label}
          </span>
          {showExpandAction ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleExpand?.();
              }}
              disabled={expandDisabled}
              title={expandTooltip}
              aria-label={isExpanded ? "Collapse placements" : "Expand placements"}
              aria-expanded={isExpanded}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted-foreground transition",
                !expandDisabled && "hover:text-foreground",
                expandDisabled && "cursor-not-allowed opacity-60"
              )}
            >
              <ChevronDown
                size={16}
                className={cn(
                  "transition-transform duration-300",
                  isExpanded && "rotate-180"
                )}
              />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <div className="rounded-xl bg-muted/30 p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users2 size={12} />
            Subscribers
          </div>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {formatMetric(channel.memberCount)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {showVerifyAction ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onVerify();
              }}
              className="rounded-full border border-yellow-500/40 bg-yellow-500/15 px-2 py-0.5 text-[11px] font-semibold text-yellow-200 transition hover:bg-yellow-500/25"
            >
              Verify
            </button>
          ) : null}
        </div>
      </div>

      {expandedContent ? (
        <div
          className={cn(
            "mt-4 grid transition-[grid-template-rows] duration-300 ease-out",
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-out",
              isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
            )}
          >
            <div className="rounded-xl border border-border/50 bg-background/60 p-3">
              {expandedContent}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default memo(ChannelCard);
