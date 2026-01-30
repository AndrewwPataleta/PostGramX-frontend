import { useState } from "react";
import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { cn } from "@/lib/utils";
import { formatTon } from "@/i18n/formatters";
import { useLanguage } from "@/i18n/LanguageProvider";

interface StagePaymentProps {
  deal: DealListItem;
  readonly: boolean;
  onAction?: {
    onPay?: () => Promise<void> | void;
  };
}

export default function StagePayment({ deal, readonly, onAction }: StagePaymentProps) {
  const { t, language } = useLanguage();
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = () => {
    if (readonly) {
      return;
    }
    if (onAction?.onPay) {
      onAction.onPay();
      return;
    }
    setIsPaying(true);
    setTimeout(() => setIsPaying(false), 1200);
  };

  return (
    <InfoCard title={t("deals.stage.payment.title")}>
      <p className="text-xs text-muted-foreground">
        {t("deals.stage.payment.description")}
      </p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-semibold text-foreground">
          {t("deals.stage.payment.amount")}: {formatTon(deal.listing.priceNano, language)}{" "}
          {t("common.ton")}
        </span>
        <span className="rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs font-semibold text-muted-foreground">
          {t("deals.stage.payment.walletHint")}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={readonly || isPaying}
          onClick={handlePay}
          className={cn(
            "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition",
            readonly || isPaying ? "cursor-not-allowed opacity-60" : "hover:bg-primary/90"
          )}
        >
          {isPaying ? t("common.sending") : t("common.pay")}
        </button>
      </div>
    </InfoCard>
  );
}
