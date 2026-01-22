import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";

const WalletConnectBanner = () => {
  const wallet = useTonWallet();

  if (wallet) {
    return null;
  }

  return (
    <div className="px-4 pt-4">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-glass">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Подключите кошелек</p>
          <p className="text-xs text-muted-foreground">
            Чтобы продолжить, подключите TON кошелек.
          </p>
        </div>
        <TonConnectButton className="shrink-0" />
      </div>
    </div>
  );
};

export default WalletConnectBanner;
