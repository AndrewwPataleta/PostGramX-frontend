import { memo, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, Users2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatNumber, formatTon } from "@/i18n/formatters";
import { getChannelStatusLabel } from "@/i18n/labels";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Language } from "@/i18n/translations";
import type { ChannelListItem, ChannelStatus } from "@/types/channels";

const statusStyles: Record<
  ChannelStatus,
  { className: string; icon?: ReactNode }
> = {
  DRAFT: {
    className: "bg-muted/40 text-muted-foreground border-border/60",
  },
  PENDING_VERIFY: {
    className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  },
  VERIFIED: {
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  FAILED: {
    className: "bg-red-500/20 text-red-300 border-red-500/40",
  },
  REVOKED: {
    className: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  },
};

const formatMetric = (
  value: number | null | undefined,
  language: Language,
  fallback: string
) => {
  if (value == null) {
    return fallback;
  }
  return formatNumber(value, language as never, {
    notation: "compact",
    maximumFractionDigits: 1,
  });
};

interface ChannelCardProps {
  channel: ChannelListItem;
  placementsCount?: number | null;
  minPriceNano?: string | null;
  onClick?: () => void;
  onVerify?: () => void;
  onUnlink?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  expandDisabled?: boolean;
  expandTooltip?: string;
  expandedContent?: ReactNode;
  createListingTo?: string;
  createListingState?: Record<string, unknown>;
}

const ChannelCard = ({
  channel,
  placementsCount,
  minPriceNano,
  onClick,
  onVerify,
  onUnlink,
  isExpanded = false,
  onToggleExpand,
  expandDisabled = false,
  expandTooltip,
  expandedContent,
  createListingTo,
  createListingState,
}: ChannelCardProps) => {
  const { t, language } = useLanguage();
  const status = statusStyles[channel.status];
  const showVerifyAction = channel.status === "PENDING_VERIFY" && onVerify;
  const showUnlinkAction = Boolean(onUnlink);
  const showExpandAction = Boolean(onToggleExpand);
  const showStatusBadge = channel.status !== "VERIFIED";
  const [avatarError, setAvatarError] = useState(false);
  const avatarFallback = channel.title?.[0]?.toUpperCase() ?? channel.username?.[0]?.toUpperCase();
  const avatarSrc = !avatarError && channel.avatarUrl ? channel.avatarUrl : null;
  const formattedSubscribers = formatMetric(channel.memberCount, language, t("common.emptyValue"));
  const formattedMinPrice = useMemo(() => {
    if (!minPriceNano) {
      return t("common.emptyValue");
    }
    return formatTon(minPriceNano, language);
  }, [language, minPriceNano, t]);

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
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-muted/40 text-base text-foreground">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={channel.title}
              className="h-12 w-12 rounded-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span>{avatarFallback ?? t("common.avatarFallback")}</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {channel.title || t("channels.untitled")}
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
                  aria-label={t("channels.unlinkAction")}
                >
                  <X size={14} />
                </button>
              ) : null}
              {showStatusBadge ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                    status.className
                  )}
                >
                  {status.icon}
                  {getChannelStatusLabel(t, channel.status)}
                </span>
              ) : null}
              {showExpandAction ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleExpand?.();
                  }}
                  disabled={expandDisabled}
                  title={expandTooltip}
                  aria-label={
                    isExpanded ? t("channels.collapsePlacements") : t("channels.expandPlacements")
                  }
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

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users2 size={12} />
              {formattedSubscribers}
            </span>
            <span>·</span>
            <span>
              {typeof placementsCount === "number"
                ? `${placementsCount} ${t("marketplace.placements")}`
                : `${t("common.emptyValue")} ${t("marketplace.placements")}`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>
              {t("common.from")}{" "}
              <span className="font-semibold text-primary">
                {formattedMinPrice} {t("common.ton")}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
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
              {t("channels.verifyAction")}
            </button>
          ) : null}
        </div>
        {createListingTo ? (
          <Link
            to={createListingTo}
            state={createListingState}
            onClick={(event) => event.stopPropagation()}
            className="rounded-full bg-primary px-4 py-1.5 text-[11px] font-semibold text-primary-foreground"
          >
            {t("listings.createAction")}
          </Link>
        ) : null}
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
