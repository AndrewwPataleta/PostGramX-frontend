import { useNavigate } from "react-router-dom";
import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { escrowStatusToLabel } from "@/features/deals/dealStageMachine";
import { formatDateTime } from "@/i18n/formatters";
import { useLanguage } from "@/i18n/LanguageProvider";

interface StageDoneProps {
  deal: DealListItem;
  readonly: boolean;
  onAction?: Record<string, never>;
}

export default function StageDone({ deal }: StageDoneProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isCanceled = deal.escrowStatus === "CANCELED";

  const handleCreateNewDeal = () => {
    navigate(`/deals/create/${deal.listing.id}`);
  };
  return (
    <InfoCard title={t("deals.stage.done.title")}>
      {isCanceled ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {t("deals.stage.payment.windowExpired")}
          </p>
          <button
            type="button"
            onClick={handleCreateNewDeal}
            className="rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40"
          >
            {t("deals.stage.payment.createNewDeal")}
          </button>
        </div>
      ) : null}
      <p className="text-xs text-muted-foreground">
        {t("deals.statusLabel")}:{" "}
        <span className="font-semibold text-foreground">
          {escrowStatusToLabel(deal.escrowStatus, t)}
        </span>
      </p>
      <p className="text-xs text-muted-foreground">
        {t("common.lastUpdate")}:{" "}
        <span className="font-semibold text-foreground">
          {formatDateTime(deal.lastActivityAt, language) || t("common.emptyValue")}
        </span>
      </p>
      <p className="text-xs text-muted-foreground">
        {t("common.createdAt")}:{" "}
        <span className="font-semibold text-foreground">
          {formatDateTime(deal.createdAt, language) || t("common.emptyValue")}
        </span>
      </p>
    </InfoCard>
  );
}
