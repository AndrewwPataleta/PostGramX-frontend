import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Store, TrendingUp, User } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

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
      <main className="flex-1 overflow-y-auto safe-area-top pb-[calc(6.5rem+var(--tg-safe-bottom))]">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-[var(--tg-safe-bottom)] left-0 right-0 z-50 px-4">
        <div className="flex items-center justify-around max-w-2xl mx-auto rounded-2xl bg-card/80 backdrop-blur-glass border border-border/40 shadow-sm">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center py-3 px-3 flex-1 transition-colors ${
                  active
                    ? "text-primary tg-active-glow"
                    : "text-muted-foreground hover:text-foreground"
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
