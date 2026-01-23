import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Deals() {
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-glass border-b border-border/50">
        <div className="px-4 py-3">
          <h1 className="text-base font-semibold text-foreground">Deals</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 flex gap-6 bg-background/80 backdrop-blur-glass">
        {["active", "pending", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab
                ? "text-primary border-b-primary"
                : "text-muted-foreground border-b-transparent"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="px-4 py-6 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`deal-skeleton-${index}`} className="glass p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Skeleton className="h-12 rounded-lg" />
                  <Skeleton className="h-12 rounded-lg" />
                </div>
                <Skeleton className="h-10 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass p-8 rounded-lg text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Deals List Screen
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              This page will include:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 text-left bg-secondary/30 p-4 rounded-lg mb-6">
              <li>• Tabs: Active, Pending, Completed</li>
              <li>• Deal cards with channel name</li>
              <li>• Status badges</li>
              <li>• Price information</li>
              <li>• Open button for each deal</li>
            </ul>
            <p className="text-xs text-muted-foreground">
              Continue interacting with the chat to generate this page content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
