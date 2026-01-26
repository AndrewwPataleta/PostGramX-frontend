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
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const statusStyles: Record<string, string> = {
  Confirmed: "bg-emerald-500/15 text-emerald-300",
  Pending: "bg-amber-500/15 text-amber-300",
  Processing: "bg-sky-500/15 text-sky-300",
  Failed: "bg-rose-500/15 text-rose-300",
};

const topUpChips = [10, 25, 50];

export default function Profile() {
  const { user } = useTelegram();
  const [activeSection, setActiveSection] = useState<
    "history" | "topup" | "withdraw" | "escrow"
  >("history");
  const { data: profile, isLoading, error, refetch } = useProfile();
  const { data: balance } = useBalance();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState(50);
  const [topUpAmountInput, setTopUpAmountInput] = useState("50");
  const [topUpStatus, setTopUpStatus] = useState<"idle" | "pending" | "confirmed">(
    "idle"
  );
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [isTopUpSheetOpen, setIsTopUpSheetOpen] = useState(false);
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { open: openWalletModal } = useTonConnectModal();
  const fullName = user
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`
    : "FlowgramX User";
  const username = user?.username ? `@${user.username}` : "@flowgramx";
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

  const updateTopUpAmount = (value: string) => {
    setTopUpAmountInput(value);
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      setTopUpAmount(parsed);
    }
  };

  const handleTopUp = async () => {
    if (!Number.isFinite(topUpAmount) || topUpAmount <= 0) {
      toast.error("Select a valid top up amount");
      return;
    }

    if (!wallet) {
      openWalletModal();
      toast.info("Connect a TON wallet to continue");
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
          time: `Today · ${timeLabel}`,
        },
        ...prev,
      ]);
      setTopUpStatus("confirmed");
      setIsTopUpSheetOpen(false);
      toast.success("Mock top up confirmed");
    } catch (err) {
      setTopUpStatus("idle");
      toast.error(err instanceof Error ? err.message : "Unable to process top up");
    } finally {
      setIsTopUpLoading(false);
    }
  };

  const topUpTransferLink = buildTonTransferLink({
    address: topUpAddress,
    amountTon: topUpAmount,
    memo: topUpMemo,
  });

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-glass border-b border-border/50">
        <div className="px-4 py-3">
          <h1 className="text-base font-semibold text-foreground">Profile Wallet</h1>
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
                    Connected via Telegram
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
              <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
                <div className="relative rounded-[28px] border border-border/40 bg-background/70 shadow-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">Wallet Summary</p>
                <TonConnectButton className="shrink-0" />
                  </div>
                  <div className="px-5 py-5 space-y-4 pb-6">
                    <div className="glass p-4 space-y-3">
                      <p className="text-xs text-muted-foreground">Balance</p>
                      <div className="space-y-2">
                        <p className="text-2xl font-semibold text-foreground">
                          Available: {availableBalance.toFixed(2)} TON
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>Locked in Escrow: {profileBalance?.locked ?? 0} TON</span>
                          <span>Pending Release: {profileBalance?.pendingRelease ?? 0} TON</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Locked funds release after ad delivery verification.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="button-primary rounded-2xl py-2 text-sm"
                        onClick={() => {
                          setActiveSection("topup");
                          setIsTopUpSheetOpen(true);
                        }}
                      >
                        Top Up
                      </button>
                      <button
                        type="button"
                        className="button-primary rounded-2xl py-2 text-sm bg-primary/80 hover:bg-primary"
                        onClick={() => setActiveSection("withdraw")}
                      >
                        Withdraw
                      </button>
                    </div>

                    <div className="glass p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">Instant withdraw</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {profileBalance?.instantWithdraw?.toFixed(2) ?? "0.00"} TON
                        </p>
                        <button
                          type="button"
                          className="rounded-full border border-border/40 px-3 py-1 text-xs text-muted-foreground"
                          onClick={() => setActiveSection("withdraw")}
                        >
                          Withdraw now
                        </button>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Use saved wallet EQB7...m0fLr
                      </p>
                    </div>

              </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-border/40 bg-background/70 shadow-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border/40">
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: "history", label: "History", icon: History },
                      { id: "topup", label: "Top Up", icon: ArrowDownLeft },
                      { id: "withdraw", label: "Withdraw", icon: ArrowUpRight },
                      { id: "escrow", label: "Escrow", icon: Lock },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          if (id === "topup") {
                            setIsTopUpSheetOpen(true);
                          }
                          setActiveSection(
                            id as "history" | "topup" | "withdraw" | "escrow"
                          );
                        }}
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
                          Transaction History
                        </p>
                        <span className="text-xs text-muted-foreground">
                          Last 7 days
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
                                  {tx.type}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                                    statusStyles[tx.status] ||
                                    "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {tx.status}
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
                        <p className="text-xs text-muted-foreground">Top Up Balance</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">TON amount</p>
                            <p className="text-2xl font-semibold text-foreground">
                              {topUpAmount.toFixed(2)} TON
                            </p>
                          </div>
                          <Wallet size={20} className="text-primary/80" />
                        </div>
                        <button
                          type="button"
                          className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary/80 transition hover:border-primary/60 hover:bg-primary/20"
                          onClick={() => setIsTopUpSheetOpen(true)}
                        >
                          Change amount
                        </button>
                      </div>

                      <div className="glass p-4 space-y-2">
                        <p className="text-xs text-muted-foreground">Payment Method</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              TON Wallet
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Pay using Telegram Wallet or Tonkeeper
                            </p>
                          </div>
                          <span className="rounded-full bg-secondary/60 px-3 py-1 text-[11px] text-muted-foreground">
                            Selected
                          </span>
                        </div>
                      </div>

                      <div className="glass p-4 space-y-2">
                        <p className="text-xs text-muted-foreground">Payment Instructions</p>
                        <div className="space-y-1 text-sm text-foreground">
                          <p>{topUpTransferLink}</p>
                          <p className="text-xs text-muted-foreground">
                            Address: {topUpAddress}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Memo: {topUpMemo}
                          </p>
                        </div>
                      </div>

                      {topUpStatus === "pending" ? (
                        <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs text-primary">
                          <Clock size={14} />
                          Waiting for payment confirmation...
                        </div>
                      ) : null}
                      {topUpStatus === "confirmed" ? (
                        <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                          <CheckCircle2 size={14} />
                          Top up confirmed — balance updated.
                        </div>
                      ) : null}
                    </>
                  )}

                  {activeSection === "withdraw" && (
                    <>
                      <div className="glass p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Withdraw Funds</p>
                            <p className="text-2xl font-semibold text-foreground">
                              18.00 TON
                            </p>
                          </div>
                          <button
                            type="button"
                            className="rounded-full border border-border/40 px-3 py-1 text-xs text-muted-foreground"
                          >
                            Max
                          </button>
                        </div>
                      </div>

                      <div className="glass p-4 space-y-2">
                        <p className="text-xs text-muted-foreground">Destination Wallet</p>
                        <p className="text-sm text-foreground">EQB7...m0fLr</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Network fee estimate</span>
                        <span>~0.05 TON</span>
                      </div>

                      <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
                        Withdrawals are irreversible. Make sure your address is correct.
                      </div>

                      <button
                        type="button"
                        className="button-primary rounded-2xl py-4"
                      >
                        Withdraw
                      </button>

                      <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                        <CheckCircle2 size={14} />
                        Withdrawal submitted — transaction processing
                      </div>
                    </>
                  )}

                  {activeSection === "escrow" && (
                    <>
                      <div className="glass p-4 space-y-3">
                        <div className="flex items-center gap-2 text-foreground">
                          <Lock size={16} className="text-primary/80" />
                          <p className="text-sm font-semibold">How escrow works</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Advertiser payments are locked until ads are successfully
                          published and verified. This protects both advertisers and
                          channel owners.
                        </p>
                      </div>

                      <div className="glass p-4 space-y-2">
                        <p className="text-xs text-muted-foreground">Trust indicators</p>
                        <div className="grid gap-2">
                          {[
                            "TON Network",
                            "On-chain verification",
                            "Automated escrow",
                            "Smart-contract transparency",
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
                        Automated releases keep balances synchronized with delivery
                        status.
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Sheet open={isTopUpSheetOpen} onOpenChange={setIsTopUpSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl border-t border-border/60 bg-background/95 px-5 pb-8 pt-6"
        >
          <SheetHeader className="text-left">
            <SheetTitle>Top up balance</SheetTitle>
            <SheetDescription>
              Enter the TON amount you want to add to your wallet.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Amount (TON)</label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={topUpAmountInput}
                  onChange={(event) => updateTopUpAmount(event.target.value)}
                  className="h-12 rounded-2xl text-lg"
                  placeholder="0.00"
                />
                <span className="text-sm font-medium text-muted-foreground">TON</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {topUpChips.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => updateTopUpAmount(amount.toString())}
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
            <button
              type="button"
              className="button-primary rounded-2xl py-4 disabled:pointer-events-none disabled:opacity-70"
              onClick={handleTopUp}
              disabled={isTopUpLoading}
            >
              {isTopUpLoading ? "Processing..." : "Top up"}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
