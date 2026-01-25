import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Store, TrendingUp, User } from "lucide-react";
import SafeAreaLayout from "@/components/telegram/SafeAreaLayout";
import WalletConnectBanner from "@/components/wallet/WalletConnectBanner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionsRef = useRef<Map<string, number>>(new Map());
  const lastPathRef = useRef(location.pathname);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const mainNavPaths = ["/marketplace", "/deals", "/channels", "/profile"];
  const isMainNavRoute = mainNavPaths.includes(location.pathname);
  const shouldHideBottomNav =
    !isMainNavRoute || (location.pathname === "/marketplace" && isKeyboardOpen);
  const bottomNavOffset = 8;
  const bottomNavHeight = shouldHideBottomNav ? 0 : 104 + bottomNavOffset;

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navItems = useMemo(
    () => [
      { path: "/marketplace", label: "Marketplace", icon: Store },
      { path: "/deals", label: "Deals", icon: TrendingUp },
      { path: "/channels", label: "Channels", icon: Zap },
      { path: "/profile", label: "Profile", icon: User },
    ],
    [],
  );

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) {
      return;
    }

    const previousPath = lastPathRef.current;
    if (previousPath !== location.pathname) {
      scrollPositionsRef.current.set(previousPath, mainElement.scrollTop);
    }

    const savedScrollTop = scrollPositionsRef.current.get(location.pathname) ?? 0;

    requestAnimationFrame(() => {
      mainElement.scrollTo({ top: savedScrollTop, behavior: "auto" });
    });

    lastPathRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/marketplace") {
      setIsKeyboardOpen(false);
      return;
    }

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        setIsKeyboardOpen(false);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SafeAreaLayout bottomNavHeight={bottomNavHeight}>
        <main className="flex-1 overflow-y-auto touch-pan-y" ref={mainRef}>
          <WalletConnectBanner />
          {children}
        </main>
      </SafeAreaLayout>

      <nav
        className={`fixed bottom-[calc(var(--tg-content-safe-area-inset-bottom)+8px)] left-0 right-0 z-50 px-4 ${
          shouldHideBottomNav ? "hidden" : ""
        }`}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-around rounded-2xl border border-border/40 bg-card/80 shadow-sm backdrop-blur-glass">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-3 py-3 transition-colors focus-visible:outline-none focus-visible:bg-primary/10 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                }`}
              >
                <Icon size={22} />
                <span className="max-w-full truncate whitespace-nowrap text-[10px] font-medium leading-none">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
