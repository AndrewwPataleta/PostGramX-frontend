import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  History,
  Lock,
  Send,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useTelegram } from "@/hooks/use-telegram";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildTonConnectTransaction, buildTonTransferLink } from "@/features/deals/payment";
import { useEffect, useState } from "react";
import {
  TonConnectButton,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { toast } from "sonner";
import { useBalance, useProfile } from "@/features/profile/hooks";
import ErrorState from "@/components/feedback/ErrorState";
import LoadingSkeleton from "@/components/feedback/LoadingSkeleton";
import type { WalletTransaction } from "@/features/profile/types";
import { getErrorMessage } from "@/lib/api/errors";
import { useLanguage } from "@/i18n/LanguageProvider";

const statusStyles: Record<string, string> = {
  Confirmed: "bg-emerald-500/15 text-emerald-300",
  Pending: "bg-amber-500/15 text-amber-300",
  Processing: "bg-sky-500/15 text-sky-300",
  Failed: "bg-rose-500/15 text-rose-300",
};

const topUpChips = [10, 25, 50];

export default function Profile() {
  const { user } = useTelegram();
  const { t, language, setLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState<
    "history" | "topup" | "withdraw" | "escrow"
  >("history");
  const { data: profile, isLoading, error, refetch } = useProfile();
  const { data: balance } = useBalance();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState(50);
  const [topUpStatus, setTopUpStatus] = useState<"idle" | "pending" | "confirmed">(
    "idle"
  );
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { open: openWalletModal } = useTonConnectModal();
  const fullName = user
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`
    : t("profile.displayNameFallback");
  const username = user?.username ? `@${user.username}` : t("profile.usernameFallback");
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const profileBalance = profile?.balance;
  const topUpAddress = profile?.topUpAddress ?? "—";
  const topUpMemo = profile?.topUpMemo ?? "—";

  useEffect(() => {
    if (profile) {
      setTransactions(profile.transactions);
      setAvailableBalance(profile.balance.available);
    }
  }, [profile]);

  useEffect(() => {
    if (balance) {
      setAvailableBalance(balance.available);
    }
  }, [balance]);

  const handleTopUp = async () => {
    if (!Number.isFinite(topUpAmount) || topUpAmount <= 0) {
      toast.error(t("profile.toastSelectValidTopUp"));
      return;
    }

    if (!wallet) {
      openWalletModal();
      toast.info(t("profile.toastConnectWallet"));
      return;
    }

    setIsTopUpLoading(true);
    setTopUpStatus("pending");
    try {
      await tonConnectUI.sendTransaction(
        buildTonConnectTransaction({ address: topUpAddress, amountTon: topUpAmount })
      );

      setAvailableBalance((prev) => Number((prev + topUpAmount).toFixed(2)));
      const now = new Date();
      const timeLabel = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTransactions((prev) => [
        {
          type: "Deposit",
          amount: `+${topUpAmount} TON`,
          status: "Confirmed",
          time: `${t("profile.today")} · ${timeLabel}`,
        },
        ...prev,
      ]);
      setTopUpStatus("confirmed");
      toast.success(t("profile.toastTopUpConfirmed"));
    } catch (err) {
      setTopUpStatus("idle");
      toast.error(
        err instanceof Error ? err.message : t("profile.toastTopUpFailed")
      );
    } finally {
      setIsTopUpLoading(false);
    }
  };

  const topUpTransferLink = buildTonTransferLink({
    address: topUpAddress,
    amountTon: topUpAmount,
    memo: topUpMemo,
  });
  const transactionTypeLabel = (type: string) =>
    ({
      Deposit: t("profile.transactionTypeDeposit"),
      Withdrawal: t("profile.transactionTypeWithdrawal"),
    })[type] ?? type;
  const transactionStatusLabel = (status: string) =>
    ({
      Confirmed: t("profile.transactionStatusConfirmed"),
      Pending: t("profile.transactionStatusPending"),
      Processing: t("profile.transactionStatusProcessing"),
      Failed: t("profile.transactionStatusFailed"),
    })[status] ?? status;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-glass border-b border-border/50">
        <div className="px-4 py-3">
          <h1 className="text-base font-semibold text-foreground">
            {t("profile.walletTitle")}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-20">
        {isLoading ? (
          <LoadingSkeleton items={2} />
        ) : error ? (
          <ErrorState
            message={getErrorMessage(error, "Unable to load profile")}
            description="Please reconnect your session and try again."
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <div className="glass p-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={user?.photo_url} alt={fullName} />
                  <AvatarFallback className="bg-primary/15 text-primary text-lg font-semibold">
                    {initials || "TG"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-foreground">{fullName}</h2>
                  <p className="text-sm text-muted-foreground">{username}</p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                    <ShieldCheck size={14} className="text-primary/80" />
                    {t("profile.connectedViaTelegram")}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
              <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
                <div className="relative rounded-[28px] border border-border/40 bg-background/70 shadow-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {t("profile.walletSummary")}
                    </p>
                <TonConnectButton className="shrink-0" />
                  </div>
                  <div className="px-5 py-5 space-y-4 pb-6">
                    <div className="glass p-4 space-y-3">
                      <p className="text-xs text-muted-foreground">
                        {t("profile.balanceLabel")}
                      </p>
                      <div className="space-y-2">
                        <p className="text-2xl font-semibold text-foreground">
                          {t("profile.availableBalance")} {availableBalance.toFixed(2)} TON
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>
                            {t("profile.lockedInEscrow")} {profileBalance?.locked ?? 0}{" "}
                            TON
                          </span>
                          <span>
                            {t("profile.pendingRelease")}{" "}
                            {profileBalance?.pendingRelease ?? 0} TON
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("profile.lockedFundsNote")}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="button-primary rounded-2xl py-2 text-sm"
                        onClick={() => setActiveSection("topup")}
                      >
                        {t("profile.topUp")}
                      </button>
                      <button
                        type="button"
                        className="button-primary rounded-2xl py-2 text-sm bg-primary/80 hover:bg-primary"
                        onClick={() => setActiveSection("withdraw")}
                      >
                        {t("profile.withdraw")}
                      </button>
                    </div>

                    <div className="glass p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {t("profile.instantWithdraw")}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {profileBalance?.instantWithdraw?.toFixed(2) ?? "0.00"} TON
                        </p>
                        <button
                          type="button"
                          className="rounded-full border border-border/40 px-3 py-1 text-xs text-muted-foreground"
                          onClick={() => setActiveSection("withdraw")}
                        >
                          {t("profile.withdrawNow")}
                        </button>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {t("profile.savedWallet")}
                      </p>
                    </div>

              </div>
                </div>

                <div className="glass p-4 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t("profile.language")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("profile.languageDescription")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        value: "en",
                        label: t("profile.languageOptionEnglish"),
                      },
                      {
                        value: "ru",
                        label: t("profile.languageOptionRussian"),
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setLanguage(option.value as "en" | "ru")}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          language === option.value
                            ? "border-primary/60 bg-primary/20 text-primary"
                            : "border-border/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-border/40 bg-background/70 shadow-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border/40">
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: "history", label: t("profile.sectionHistory"), icon: History },
                      { id: "escrow", label: t("profile.sectionEscrow"), icon: Lock },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          setActiveSection(id as "history" | "topup" | "withdraw" | "escrow")
                        }
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition ${
                          activeSection === id
                            ? "border-primary/60 bg-primary/15 text-primary"
                            : "border-border/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-5 py-5 space-y-4 pb-8">
                  {activeSection === "history" && (
                    <div className="glass p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">
                          {t("profile.transactionHistory")}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {t("profile.last7Days")}
                        </span>
                      </div>
                      <div className="mt-4 space-y-3">
                        {transactions.map((tx) => (
                          <div
                            key={`${tx.type}-${tx.time}`}
                            className="flex items-start justify-between gap-3 border-b border-border/30 pb-3 last:border-b-0 last:pb-0"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                                  {transactionTypeLabel(tx.type)}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                                    statusStyles[tx.status] ||
                                    "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {transactionStatusLabel(tx.status)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {tx.time}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                              {tx.amount}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection === "topup" && (
                    <>
                      <div className="glass p-4 space-y-3">
                        <p className="text-xs text-muted-foreground">
                          {t("profile.topUpBalance")}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t("profile.tonAmount")}
                            </p>
                            <p className="text-2xl font-semibold text-foreground">
                              {topUpAmount.toFixed(2)} TON
                            </p>
                          </div>
                          <Wallet size={20} className="text-primary/80" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {topUpChips.map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => setTopUpAmount(amount)}
                              className={`rounded-full border px-3 py-1 text-xs transition ${
                                topUpAmount === amount
                                  ? "border-primary/60 bg-primary/20 text-primary"
                                  : "border-primary/40 bg-primary/10 text-primary/80"
                              }`}
                            >
                              +{amount} TON
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="glass p-4 space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {t("profile.paymentMethod")}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {t("profile.tonWallet")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t("profile.payUsing")}
                            </p>
                          </div>
                          <span className="rounded-full bg-secondary/60 px-3 py-1 text-[11px] text-muted-foreground">
                            {t("profile.selected")}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="button-primary rounded-2xl py-4 disabled:pointer-events-none disabled:opacity-70"
                        onClick={handleTopUp}
                        disabled={isTopUpLoading}
                      >
                        {isTopUpLoading
                          ? t("profile.processing")
                          : t("profile.proceedToPayment")}
                      </button>

                      <div className="glass p-4 space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {t("profile.paymentInstructions")}
                        </p>
                        <div className="space-y-1 text-sm text-foreground">
                          <p>{topUpTransferLink}</p>
                          <p className="text-xs text-muted-foreground">
                            {t("profile.address")} {topUpAddress}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("profile.memo")} {topUpMemo}
                          </p>
                        </div>
                      </div>

                      {topUpStatus === "pending" ? (
                        <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs text-primary">
                          <Clock size={14} />
                          {t("profile.waitingConfirmation")}
                        </div>
                      ) : null}
                      {topUpStatus === "confirmed" ? (
                        <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                          <CheckCircle2 size={14} />
                          {t("profile.topUpConfirmed")}
                        </div>
                      ) : null}
                    </>
                  )}

                  {activeSection === "withdraw" && (
                    <>
                      <div className="glass p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {t("profile.withdrawFunds")}
                            </p>
                            <p className="text-2xl font-semibold text-foreground">
                              18.00 TON
                            </p>
                          </div>
                          <button
                            type="button"
                            className="rounded-full border border-border/40 px-3 py-1 text-xs text-muted-foreground"
                          >
                            {t("profile.max")}
                          </button>
                        </div>
                      </div>

                      <div className="glass p-4 space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {t("profile.destinationWallet")}
                        </p>
                        <p className="text-sm text-foreground">EQB7...m0fLr</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{t("profile.networkFeeEstimate")}</span>
                        <span>~0.05 TON</span>
                      </div>

                      <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
                        {t("profile.withdrawWarning")}
                      </div>

                      <button
                        type="button"
                        className="button-primary rounded-2xl py-4"
                      >
                        {t("profile.withdrawAction")}
                      </button>

                      <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                        <CheckCircle2 size={14} />
                        {t("profile.withdrawSubmitted")}
                      </div>
                    </>
                  )}

                  {activeSection === "escrow" && (
                    <>
                      <div className="glass p-4 space-y-3">
                        <div className="flex items-center gap-2 text-foreground">
                          <Lock size={16} className="text-primary/80" />
                          <p className="text-sm font-semibold">
                            {t("profile.howEscrowWorks")}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t("profile.escrowDescription")}
                        </p>
                      </div>

                      <div className="glass p-4 space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {t("profile.trustIndicators")}
                        </p>
                        <div className="grid gap-2">
                          {[
                            t("profile.trustIndicatorTonNetwork"),
                            t("profile.trustIndicatorOnChainVerification"),
                            t("profile.trustIndicatorAutomatedEscrow"),
                            t("profile.trustIndicatorSmartContractTransparency"),
                          ].map((item) => (
                            <div
                              key={item}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="h-2 w-2 rounded-full bg-primary" />
                              <span className="text-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Send size={14} className="text-primary/70" />
                        {t("profile.automatedReleases")}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
