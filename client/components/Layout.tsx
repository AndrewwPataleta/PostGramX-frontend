import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Zap, Store, TrendingUp, User } from "lucide-react";
import SafeAreaLayout from "@/components/telegram/SafeAreaLayout";
import WalletConnectBanner from "@/components/wallet/WalletConnectBanner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement | null>(null);
  const swipeStartXRef = useRef<number | null>(null);
  const swipeStartYRef = useRef<number | null>(null);
  const swipeActiveRef = useRef(false);
  const swipeNavigationLockedRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const shouldHideBottomNav = location.pathname === "/" && isKeyboardOpen;
  const bottomNavOffset = 8;
  const bottomNavHeight = shouldHideBottomNav ? 0 : 104 + bottomNavOffset;

  const isActive = (path: string) => location.pathname === path;

  const navItems = useMemo(
    () => [
      { path: "/", label: "Marketplace", icon: Store },
      { path: "/deals", label: "Deals", icon: TrendingUp },
      { path: "/channels", label: "Channels", icon: Zap },
      { path: "/profile", label: "Profile", icon: User },
    ],
    []
  );

  useEffect(() => {
    swipeNavigationLockedRef.current = false;
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") {
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

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) {
      return;
    }

    const resetSwipeState = () => {
      swipeStartXRef.current = null;
      swipeStartYRef.current = null;
      swipeActiveRef.current = false;
      activePointerIdRef.current = null;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        return;
      }

      swipeStartXRef.current = event.clientX;
      swipeStartYRef.current = event.clientY;
      swipeActiveRef.current = true;
      activePointerIdRef.current = event.pointerId;
      mainElement.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!swipeActiveRef.current || swipeNavigationLockedRef.current) {
        return;
      }

      if (
        activePointerIdRef.current !== null &&
        event.pointerId !== activePointerIdRef.current
      ) {
        return;
      }

      const startX = swipeStartXRef.current;
      const startY = swipeStartYRef.current;

      if (startX === null || startY === null) {
        return;
      }

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX < 40 || absDeltaY > 30 || absDeltaX < absDeltaY) {
        return;
      }

      const currentIndex = navItems.findIndex(
        (item) => item.path === location.pathname
      );

      if (currentIndex === -1) {
        return;
      }

      const nextIndex = deltaX < 0 ? currentIndex + 1 : currentIndex - 1;

      if (nextIndex < 0 || nextIndex >= navItems.length) {
        return;
      }

      swipeNavigationLockedRef.current = true;
      navigate(navItems[nextIndex].path);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (
        activePointerIdRef.current !== null &&
        event.pointerId !== activePointerIdRef.current
      ) {
        return;
      }

      if (activePointerIdRef.current !== null) {
        mainElement.releasePointerCapture(activePointerIdRef.current);
      }

      resetSwipeState();
    };

    mainElement.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    mainElement.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    mainElement.addEventListener("pointerup", handlePointerUp);
    mainElement.addEventListener("pointercancel", handlePointerUp);

    return () => {
      mainElement.removeEventListener("pointerdown", handlePointerDown);
      mainElement.removeEventListener("pointermove", handlePointerMove);
      mainElement.removeEventListener("pointerup", handlePointerUp);
      mainElement.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [location.pathname, navItems, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main content */}
      <SafeAreaLayout bottomNavHeight={bottomNavHeight}>
        <main className="flex-1 overflow-y-auto touch-pan-y" ref={mainRef}>
          <WalletConnectBanner />
          {children}
        </main>
      </SafeAreaLayout>

      {/* Bottom Navigation */}
      <nav
        className={`fixed bottom-[calc(var(--tg-content-safe-area-inset-bottom)+8px)] left-0 right-0 z-50 px-4 ${
          shouldHideBottomNav ? "hidden" : ""
        }`}
      >
        <div className="flex items-center justify-around max-w-2xl mx-auto rounded-2xl bg-card/80 backdrop-blur-glass border border-border/40 shadow-sm">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-1 py-3 px-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:bg-primary/10 ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <Icon size={22} />
                <span className="text-[10px] font-medium leading-none whitespace-nowrap truncate max-w-full">
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
