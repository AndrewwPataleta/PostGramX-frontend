import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Store, TrendingUp, User } from "lucide-react";
import SafeAreaLayout from "@/components/telegram/SafeAreaLayout";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const bottomNavHeight = 104;

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Marketplace", icon: Store },
    { path: "/deals", label: "Deals", icon: TrendingUp },
    { path: "/channels", label: "Channels", icon: Zap },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main content */}
      <SafeAreaLayout bottomNavHeight={bottomNavHeight}>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </SafeAreaLayout>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-[var(--tg-safe-bottom)] left-0 right-0 z-50 px-4">
        <div className="flex items-center justify-around max-w-2xl mx-auto rounded-2xl bg-card/80 backdrop-blur-glass border border-border/40 shadow-sm">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center py-3 px-3 flex-1 rounded-xl transition-colors focus-visible:outline-none focus-visible:bg-primary/10 ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <Icon size={22} className="mb-1" />
                <span className="text-[11px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
