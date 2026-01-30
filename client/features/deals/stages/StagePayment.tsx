import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useTonConnectModal } from "@tonconnect/ui-react";
import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { cn } from "@/lib/utils";
import { formatTon } from "@/i18n/formatters";
import { useLanguage } from "@/i18n/LanguageProvider";
import { buildTelegramWalletTransferLinkFromNano } from "@/features/deals/payment";
import { useWalletContext } from "@/contexts/WalletContext";
import { openTelegramLink } from "@/lib/telegramLinks";

interface StagePaymentProps {
  deal: DealListItem;
  readonly: boolean;
  onAction?: {
    onRefresh?: () => void;
  };
  isRefreshing?: boolean;
}

const formatCountdown = (valueMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(valueMs / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const formatShortAddress = (address: string) => {
  if (address.length <= 10) {
    return address;
  }
  return `${address.slice(0, 3)}...${address.slice(-3)}`;
};

export default function StagePayment({
  deal,
  readonly,
  onAction,
  isRefreshing,
}: StagePaymentProps) {
  const { t, language } = useLanguage();
  const { open: openWalletModal } = useTonConnectModal();
  const { isConnected, walletAppName, network } = useWalletContext();
  const [isWaiting, setIsWaiting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const paymentDeadlineAt = deal.paymentDeadlineAt ?? deal.paymentExpiresAt;

  const escrowAmountNano = deal.escrowAmountNano ?? deal.listing.priceNano;
  const paymentAddress = deal.escrowPaymentAddress ?? "";
  const displayAmount = escrowAmountNano
    ? `${formatTon(escrowAmountNano, language)} ${t("common.ton")}`
    : t("common.emptyValue");

  const walletStatusLabel = useMemo(() => {
    if (!isConnected) {
      return t("deals.stage.payment.walletDisconnected");
    }
    const networkLabel = network ? ` • ${network}` : "";
    return `${t("deals.stage.payment.walletConnected")}${walletAppName ? ` • ${walletAppName}` : ""}${networkLabel}`;
  }, [isConnected, network, t, walletAppName]);

  useEffect(() => {
    if (!paymentDeadlineAt) {
      setTimeRemaining(null);
      return;
    }

    const expiresAt = new Date(paymentDeadlineAt).getTime();
    if (Number.isNaN(expiresAt)) {
      setTimeRemaining(null);
      return;
    }

    const updateRemaining = () => {
      const diff = Math.max(0, expiresAt - Date.now());
      setTimeRemaining(formatCountdown(diff));
    };

    updateRemaining();
    const interval = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(interval);
  }, [paymentDeadlineAt]);

  useEffect(() => {
    setIsWaiting(false);
  }, [deal.id, deal.escrowStatus]);

  if (deal.escrowStatus !== "PAYMENT_AWAITING") {
    return null;
  }

  const handleConnectWallet = () => {
    if (readonly) {
      return;
    }
    openWalletModal();
  };

  const handlePayWithWallet = () => {
    if (readonly || !paymentAddress || !escrowAmountNano) {
      return;
    }
    try {
      const link = buildTelegramWalletTransferLinkFromNano({
        address: paymentAddress,
        amountNano: escrowAmountNano,
        memo: `Deal:${deal.id}`,
      });
      openTelegramLink(link);
      setIsWaiting(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("deals.stage.payment.paymentCanceled")
      );
    }
  };

  const handleCopyAddress = async () => {
    if (!paymentAddress) {
      return;
    }
    try {
      await navigator.clipboard.writeText(paymentAddress);
      toast.success(t("deals.stage.payment.addressCopied"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("deals.stage.payment.copyFailed")
      );
    }
  };

  return (
    <InfoCard title={t("deals.stage.payment.title")}>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            isConnected ? "bg-emerald-400" : "bg-muted-foreground/50"
          )}
        />
        <span className="text-xs text-muted-foreground">{walletStatusLabel}</span>
      </div>
      <div className="space-y-3">
        <div className="rounded-xl border border-border/60 bg-background/40 p-3">
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">
                {t("deals.stage.payment.amountToPay")}
              </span>
              : {displayAmount}
            </p>
            <p>
              <span className="font-semibold text-foreground">
                {t("deals.stage.payment.receiver")}
              </span>
              : {paymentAddress ? formatShortAddress(paymentAddress) : t("common.emptyValue")}
            </p>
            {timeRemaining ? (
              <p>
                <span className="font-semibold text-foreground">
                  {t("deals.stage.payment.expiresIn", { time: timeRemaining })}
                </span>
              </p>
            ) : null}
          </div>
        </div>
        {isWaiting ? (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-secondary/30 px-3 py-2">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border/60">
              <span className="h-2 w-2 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            </span>
            <span className="text-xs text-muted-foreground">
              {t("deals.stage.payment.waiting")}
            </span>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {!isConnected ? (
            <button
              type="button"
              onClick={handleConnectWallet}
              disabled={readonly}
              className={cn(
                "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground transition",
                readonly ? "cursor-not-allowed opacity-60" : "hover:border-primary/40"
              )}
            >
              {t("deals.stage.payment.connectWallet")}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handlePayWithWallet}
                disabled={readonly || isWaiting}
                className={cn(
                  "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition",
                  readonly || isWaiting ? "cursor-not-allowed opacity-60" : "hover:bg-primary/90"
                )}
              >
                {t("deals.stage.payment.payWithWallet")}
              </button>
              <button
                type="button"
                onClick={handleCopyAddress}
                disabled={readonly}
                className={cn(
                  "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground transition",
                  readonly ? "cursor-not-allowed opacity-60" : "hover:border-primary/40"
                )}
              >
                {t("deals.stage.payment.copyAddress")}
              </button>
            </>
          )}
        </div>
        {isWaiting ? (
          <button
            type="button"
            onClick={onAction?.onRefresh}
            disabled={isRefreshing || !onAction?.onRefresh}
            className={cn(
              "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground",
              isRefreshing || !onAction?.onRefresh
                ? "cursor-not-allowed opacity-60"
                : "hover:border-primary/40"
            )}
          >
            {isRefreshing ? t("common.refreshing") : t("deals.stage.payment.checkStatus")}
          </button>
        ) : null}
      </div>
    </InfoCard>
  );
}
