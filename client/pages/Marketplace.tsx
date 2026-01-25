import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import ChannelCard from "@/components/marketplace/ChannelCard";
import BottomSheet from "@/components/BottomSheet";
import { getChannels } from "@/features/marketplace/api";
import type { MarketplaceChannel } from "@/features/marketplace/types";
import { Skeleton } from "@/components/ui/skeleton";

const languageFilters = ["EN", "RU", "ES"];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [channels, setChannels] = useState<MarketplaceChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    getChannels()
      .then((data) => {
        if (!mounted) {
          return;
        }
        setChannels(data);
      })
      .finally(() => {
        if (!mounted) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }

    const updateHeaderHeight = () => {
      setHeaderHeight(header.offsetHeight);
    };

    updateHeaderHeight();

    const observer = new ResizeObserver(() => updateHeaderHeight());
    observer.observe(header);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      const matchesQuery =
        channel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLanguage =
        selectedLanguages.length === 0 || selectedLanguages.includes(channel.language);

      return matchesQuery && matchesLanguage;
    });
  }, [channels, searchQuery, selectedLanguages]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        ref={headerRef}
        className="fixed left-0 right-0 z-30 border-b border-border/50 bg-background/90 backdrop-blur-glass"
        style={{
          top: "calc(var(--tg-content-safe-area-inset-top) + var(--wallet-banner-height, 0px))",
        }}
      >
        <div className="mx-auto w-full max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-foreground">Marketplace</h1>
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="rounded-full bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
            >
              Filters
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-2">
            <Search size={16} className="text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search channels or @username"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div style={{ paddingTop: headerHeight }} className="px-4 py-6 space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={`marketplace-skeleton-${index}`} className="rounded-2xl border border-border/50 bg-card/80 p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))
          : filteredChannels.map((channel) => <ChannelCard key={channel.id} channel={channel} />)}

        {!isLoading && filteredChannels.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 text-center text-sm text-muted-foreground">
            No channels found. Try a new search.
          </div>
        ) : null}
      </div>

      <BottomSheet open={isFilterOpen} onOpenChange={setIsFilterOpen} title="Filters">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-foreground">Language</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {languageFilters.map((language) => {
                const active = selectedLanguages.includes(language);
                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => {
                      setSelectedLanguages((prev) =>
                        prev.includes(language)
                          ? prev.filter((value) => value !== language)
                          : [...prev, language],
                      );
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      active
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary/60 text-muted-foreground"
                    }`}
                  >
                    {language}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => setIsFilterOpen(false)}
          >
            Apply Filters
          </button>
        </div>
        <div className="pointer-events-none absolute inset-x-0 -bottom-4 h-4 bg-gradient-to-b from-background/90 to-transparent backdrop-blur-sm" />
      </BottomSheet>
    </div>
  );
}
