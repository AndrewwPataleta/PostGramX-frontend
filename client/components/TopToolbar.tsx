import { useCallback, useEffect, useMemo } from "react";
import { ArrowLeft, X } from "lucide-react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { getTelegramWebApp } from "@/lib/telegram";

const mainNavPaths = ["/marketplace", "/deals", "/channels", "/profile"];

const titleMatchers = [
  { path: "/marketplace/channels/:channelId/request", title: "Request placement" },
  { path: "/marketplace/channels/:channelId", title: "Channel" },
  { path: "/channels/:channelId", title: "Channel" },
  { path: "/marketplace", title: "Marketplace" },
  { path: "/deals/:dealId", title: "Deal" },
  { path: "/deals", title: "Deals" },
  { path: "/channel-manage/:id/listings/create", title: "Create listing" },
  { path: "/channel-manage/:id/listings/preview", title: "Listing preview" },
  { path: "/channel-manage/:id/listings/:listingId/edit", title: "Edit listing" },
  { path: "/channel-manage/:id/listings/success", title: "Listing published" },
  { path: "/channel-manage/:id/listings", title: "Listings" },
  { path: "/channel-manage/:id/settings", title: "Settings" },
  { path: "/add-channel", title: "Add channel" },
  { path: "/add-channel/step-1", title: "Add channel" },
  { path: "/add-channel/step-2", title: "Add channel" },
  { path: "/add-channel/step-3", title: "Add channel" },
  { path: "/channels", title: "My Channels" },
  { path: "/escrow/:dealId", title: "Secure payment" },
  { path: "/funds-locked", title: "Funds locked" },
  { path: "/profile", title: "Profile" },
];

const actionCloseMatchers = [
  "/add-channel",
  "/add-channel/step-1",
  "/add-channel/step-2",
  "/add-channel/step-3",
];

const getFallbackPath = (pathname: string) => {
  if (pathname.startsWith("/marketplace")) {
    return "/marketplace";
  }
  if (pathname.startsWith("/deals") || pathname.startsWith("/escrow") || pathname.startsWith("/funds-locked")) {
    return "/deals";
  }
  if (
    pathname.startsWith("/channels") ||
    pathname.startsWith("/channel-manage") ||
    pathname.startsWith("/add-channel")
  ) {
    return "/channels";
  }
  if (pathname.startsWith("/profile")) {
    return "/profile";
  }
  return "/marketplace";
};

const TopToolbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const rootBackTo = (location.state as { rootBackTo?: string } | null)?.rootBackTo;

  const title = useMemo(() => {
    for (const matcher of titleMatchers) {
      if (matchPath({ path: matcher.path, end: true }, pathname)) {
        return matcher.title;
      }
    }
    return "PostgramX";
  }, [pathname]);

  const isMainNavRoute = mainNavPaths.includes(pathname);
  const showBack = !isMainNavRoute;
  const fallbackPath = getFallbackPath(pathname);

  const showActionClose = actionCloseMatchers.some((pattern) =>
    matchPath({ path: pattern, end: true }, pathname),
  );

  const handleBack = useCallback(() => {
    if (rootBackTo) {
      navigate(rootBackTo, { replace: true });
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallbackPath);
  }, [fallbackPath, navigate, rootBackTo]);

  const handleClose = () => {
    navigate(fallbackPath, { replace: true });
  };

  useEffect(() => {
    const webApp = getTelegramWebApp();
    const backButton = webApp?.BackButton;
    if (!backButton) {
      return;
    }
    if (showBack) {
      backButton.show?.();
      backButton.onClick?.(handleBack);
    } else {
      backButton.hide?.();
    }
    return () => {
      backButton.offClick?.(handleBack);
    };
  }, [handleBack, showBack]);

  return (
    <header
      className="fixed left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-glass"
      style={{
        top: "max(var(--tg-safe-top), var(--tg-content-safe-area-inset-top))",
        paddingLeft: "max(var(--tg-safe-left), var(--tg-content-safe-area-inset-left))",
        paddingRight: "max(var(--tg-safe-right), var(--tg-content-safe-area-inset-right))",
      }}
    >
      <div className="mx-auto flex h-[var(--app-toolbar-height)] max-w-2xl items-center gap-3 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center rounded-full p-1 text-foreground transition-colors hover:bg-secondary/50"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          ) : null}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          </div>
        </div>
        {showActionClose ? (
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-full p-1 text-foreground transition-colors hover:bg-secondary/50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>
    </header>
  );
};

export default TopToolbar;
