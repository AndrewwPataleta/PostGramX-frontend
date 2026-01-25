import { useEffect, useState } from "react";
import { Crown, Send } from "lucide-react";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useTelegram } from "@/hooks/use-telegram";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function Profile() {
  const { user } = useTelegram();
  const { language, setLanguage, t } = useLanguage();
  const wallet = useTonWallet();
  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [isLoading, setIsLoading] = useState(true);
  const fullName = user
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`
    : t("profile.displayNameFallback");
  const username = user?.username ? `@${user.username}` : t("profile.usernameFallback");
  const isPremium = Boolean(user?.is_premium);
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-glass border-b border-border/50">
        <div className="px-4 py-3">
          <h1 className="text-base font-semibold text-foreground">
            {t("profile.title")}
          </h1>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-4 space-y-4 pb-28">
        {isLoading ? (
          <>
            <div className="glass p-4 flex items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-full" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            <div className="glass p-4 space-y-3">
              <Skeleton className="h-3 w-28" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            </div>

            <div className="glass p-4 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-48" />
            </div>

            <div className="mt-6 space-y-2">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>

            <div className="flex items-center justify-center gap-2 pt-6">
              <Skeleton className="h-3 w-32 rounded-full" />
            </div>
          </>
        ) : (
          <>
            {wallet ? (
              <div className="glass p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {t("profile.connectedWallet")}
                  </p>
                  <p className="text-sm font-medium text-foreground break-all">
                    {walletAddress}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => tonConnectUI.disconnect()}
                  className="px-3 py-1.5 rounded-full border border-border/60 text-xs font-semibold text-foreground hover:bg-card/60 transition-colors"
                >
                  {t("profile.disconnect")}
                </button>
              </div>
            ) : null}

            {/* Profile Header Card */}
            <div className="glass p-4 flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={user?.photo_url} alt={fullName} />
                <AvatarFallback className="bg-primary/15 text-primary text-xl font-semibold">
                  {initials || "TG"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    {fullName}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      isPremium
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Crown size={12} />
                    {isPremium ? t("profile.premium") : t("profile.standard")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{username}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {t("profile.connectedViaTelegram")}
                </p>
              </div>
            </div>

            <div className="glass p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t("profile.language")}</p>
                  <p className="text-sm text-foreground">
                    {t("profile.languageDescription")}
                  </p>
                </div>
                <div className="flex rounded-full border border-border/60 bg-background/40 p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`px-3 py-1 rounded-full transition-colors ${
                      language === "en"
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("profile.languageOptionEnglish")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("ru")}
                    className={`px-3 py-1 rounded-full transition-colors ${
                      language === "ru"
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("profile.languageOptionRussian")}
                  </button>
                </div>
              </div>
            </div>

            {/* Wallet Summary Card */}
            <div className="glass p-4">
              <p className="text-xs text-muted-foreground mb-3">
                {t("profile.walletSummary")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    {t("profile.escrowBalanceLocked")}
                  </p>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    1.2 TON
                  </p>
                </div>
                <div className="bg-secondary/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    {t("profile.totalEarnings")}
                  </p>
                  <p className="text-lg font-semibold text-primary mt-1">
                    8.4 TON
                  </p>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="glass p-4">
              <p className="text-xs text-muted-foreground mb-2">
                {t("profile.about")}
              </p>
              <p className="text-sm text-foreground">
                {t("profile.poweredByTelegram")}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-6 text-xs text-muted-foreground/70">
              <Send size={14} className="text-primary/70" />
              <span className="tracking-wide">
                {t("profile.createdBy")}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
