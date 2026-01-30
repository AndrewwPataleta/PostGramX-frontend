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
  return (
    <InfoCard title={t("deals.stage.done.title")}>
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
