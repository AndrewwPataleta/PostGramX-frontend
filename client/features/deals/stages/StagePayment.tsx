import { useState } from "react";
import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { cn } from "@/lib/utils";

interface StagePaymentProps {
  deal: DealListItem;
  isCurrent: boolean;
}

const formatTon = (priceNano: string) => {
  try {
    const value = BigInt(priceNano);
    const ton = value / 1_000_000_000n;
    const remainder = value % 1_000_000_000n;
    if (remainder === 0n) {
      return ton.toString();
    }
    const decimals = remainder.toString().padStart(9, "0").slice(0, 2);
    return `${ton.toString()}.${decimals}`;
  } catch {
    return priceNano;
  }
};

export default function StagePayment({ deal, isCurrent }: StagePaymentProps) {
  const [isPaying, setIsPaying] = useState(false);

  return (
    <InfoCard title="Payment">
      <p className="text-xs text-muted-foreground">
        Connect your wallet and confirm payment to lock funds in escrow.
      </p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-semibold text-foreground">
          Amount: {formatTon(deal.listing.priceNano)} TON
        </span>
        <span className="rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs font-semibold text-muted-foreground">
          Wallet via TonConnect
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!isCurrent || isPaying}
          onClick={() => {
            setIsPaying(true);
            setTimeout(() => setIsPaying(false), 1200);
          }}
          className={cn(
            "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition",
            !isCurrent || isPaying ? "cursor-not-allowed opacity-60" : "hover:bg-primary/90"
          )}
        >
          {isPaying ? "Sending..." : "Pay"}
        </button>
        <button
          type="button"
          disabled
          className="rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-muted-foreground opacity-60"
        >
          Connect wallet
        </button>
      </div>
      {!isCurrent ? (
        <p className="text-xs text-muted-foreground">Payment step already processed.</p>
      ) : null}
    </InfoCard>
  );
}
