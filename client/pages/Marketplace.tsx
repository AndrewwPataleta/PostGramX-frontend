import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { FilterModal, FilterState } from "@/components/FilterModal";
import { ActiveFiltersChips } from "@/components/ActiveFiltersChips";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { MarketplaceCardSkeleton } from "@/components/marketplace/MarketplaceCardSkeleton";
import type { ChannelCard } from "@/types/marketplace";

// Mock data with Telegram-style fields
const channels: ChannelCard[] = [
  {
    id: "1",
    name: "CryptoNews Daily",
    username: "@cryptonewsdaily",
    avatar: "📰",
    verified: true,
    subscribers: 125000,
    averageViews: 45000,
    engagement: 36,
    pricePerPost: 2.5,
    language: "EN",
    category: "Crypto",
    viewsTrend: [42000, 44500, 43200, 46100, 45500, 47200, 46800, 45300, 48100, 45000],
    lastUpdated: "2h",
  },
  {
    id: "2",
    name: "Tech Updates",
    username: "@techupdates",
    avatar: "💻",
    verified: true,
    subscribers: 89000,
    averageViews: 32000,
    engagement: 36,
    pricePerPost: 1.8,
    language: "EN",
    category: "Tech",
    viewsTrend: [30000, 31500, 32500, 31800, 33200, 32100, 33800, 32500, 32900, 32000],
    lastUpdated: "4h",
  },
  {
    id: "3",
    name: "Web3 Insights",
    username: "@web3insights",
    avatar: "🔗",
    verified: false,
    subscribers: 54000,
    averageViews: 18000,
    engagement: 33,
    pricePerPost: 1.2,
    language: "EN",
    category: "Crypto",
    viewsTrend: [17500, 18200, 17800, 18500, 18100, 18900, 18300, 18600, 17900, 18000],
    lastUpdated: "1h",
  },
  {
    id: "4",
    name: "Blockchain Weekly",
    username: "@blockchainweekly",
    avatar: "⛓️",
    verified: true,
    subscribers: 203000,
    averageViews: 78000,
    engagement: 38,
    pricePerPost: 4.5,
    language: "EN",
    category: "Finance",
    viewsTrend: [76000, 77500, 78200, 79100, 78800, 80200, 79500, 78300, 79800, 78000],
    lastUpdated: "3h",
  },
  {
    id: "5",
    name: "Dev Talk",
    username: "@devtalk",
    avatar: "👨‍💻",
    verified: false,
    subscribers: 42000,
    averageViews: 12000,
    engagement: 29,
    pricePerPost: 0.9,
    language: "EN",
    category: "Tech",
    viewsTrend: [11500, 12100, 11800, 12300, 12000, 12500, 12200, 11900, 12400, 12000],
    lastUpdated: "6h",
  },
  {
    id: "6",
    name: "Финансовые Новости",
    username: "@finansy_novosti",
    avatar: "💰",
    verified: true,
    subscribers: 178000,
    averageViews: 62000,
    engagement: 35,
    pricePerPost: 3.2,
    language: "RU",
    category: "Finance",
    viewsTrend: [60000, 61500, 62200, 61800, 63100, 62500, 63800, 62200, 63500, 62000],
    lastUpdated: "5h",
  },
  {
    id: "7",
    name: "Gaming Central",
    username: "@gamingcentral",
    avatar: "🎮",
    verified: true,
    subscribers: 95000,
    averageViews: 38000,
    engagement: 40,
    pricePerPost: 2.1,
    language: "EN",
    category: "Gaming",
    viewsTrend: [36000, 37500, 38200, 39100, 38800, 39800, 38500, 37800, 39500, 38000],
    lastUpdated: "2h",
  },
  {
    id: "8",
    name: "Lifestyle Plus",
    username: "@lifestyleplus",
    avatar: "✨",
    verified: false,
    subscribers: 67000,
    averageViews: 22000,
    engagement: 33,
    pricePerPost: 1.5,
    language: "EN",
    category: "Lifestyle",
    viewsTrend: [21000, 21800, 22200, 22500, 22100, 23000, 22300, 21900, 22800, 22000],
    lastUpdated: "8h",
  },
  {
    id: "9",
    name: "Noticias Tech",
    username: "@noticiastech",
    avatar: "📱",
    verified: true,
    subscribers: 112000,
    averageViews: 51000,
    engagement: 46,
    pricePerPost: 2.8,
    language: "ES",
    category: "Tech",
    viewsTrend: [49000, 50500, 51200, 52100, 51800, 52800, 51500, 50800, 52500, 51000],
    lastUpdated: "1h",
  },
  {
    id: "10",
    name: "News Aggregator",
    username: "@newsagg",
    avatar: "📡",
    verified: true,
    subscribers: 245000,
    averageViews: 98000,
    engagement: 40,
    pricePerPost: 5.2,
    language: "EN",
    category: "News",
    viewsTrend: [95000, 96500, 97800, 99100, 98500, 100200, 99500, 98200, 100500, 98000],
    lastUpdated: "30m",
  },
];

interface ExtendedFilterState extends FilterState {
  engagementRange: [number, number];
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ExtendedFilterState>({
    priceRange: [0, 10],
    subscribersRange: [0, 1000000],
    viewsRange: [0, 1000000],
    engagementRange: [0, 100],
    languages: [],
    categories: [],
    verifiedOnly: false,
    dateRange: ["", ""],
  });

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, []);

  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 10],
      subscribersRange: [0, 1000000],
      viewsRange: [0, 1000000],
      engagementRange: [0, 100],
      languages: [],
      categories: [],
      verifiedOnly: false,
      dateRange: ["", ""],
    });
  };

  const handleRemoveFilter = (filterType: string, value?: string) => {
    if (filterType === "priceRange") {
      setFilters((prev) => ({
        ...prev,
        priceRange: [0, 10],
      }));
    } else if (filterType === "subscribersRange") {
      setFilters((prev) => ({
        ...prev,
        subscribersRange: [0, 1000000],
      }));
    } else if (filterType === "viewsRange") {
      setFilters((prev) => ({
        ...prev,
        viewsRange: [0, 1000000],
      }));
    } else if (filterType === "engagementRange") {
      setFilters((prev) => ({
        ...prev,
        engagementRange: [0, 100],
      }));
    } else if (filterType === "verifiedOnly") {
      setFilters((prev) => ({
        ...prev,
        verifiedOnly: false,
      }));
    } else if (filterType === "languages" && value) {
      setFilters((prev) => ({
        ...prev,
        languages: prev.languages.filter((l) => l !== value),
      }));
    } else if (filterType === "categories" && value) {
      setFilters((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c !== value),
      }));
    }
  };

  // Apply all filters
  let filteredChannels = channels.filter((channel) => {
    if (!channel.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !channel.username.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (
      channel.pricePerPost < filters.priceRange[0] ||
      channel.pricePerPost > filters.priceRange[1]
    ) {
      return false;
    }

    if (
      channel.subscribers < filters.subscribersRange[0] ||
      channel.subscribers > filters.subscribersRange[1]
    ) {
      return false;
    }

    if (
      channel.averageViews < filters.viewsRange[0] ||
      channel.averageViews > filters.viewsRange[1]
    ) {
      return false;
    }

    if (
      channel.engagement < filters.engagementRange[0] ||
      channel.engagement > filters.engagementRange[1]
    ) {
      return false;
    }

    if (filters.languages.length > 0 &&
        !filters.languages.includes(channel.language)) {
      return false;
    }

    if (filters.categories.length > 0 &&
        !filters.categories.includes(channel.category)) {
      return false;
    }

    if (filters.verifiedOnly && !channel.verified) {
      return false;
    }

    return true;
  });

  const sortedChannels = [...filteredChannels].sort((a, b) => {
    return b.subscribers - a.subscribers;
  });

  return (
    <div className="w-full max-w-2xl mx-auto safe-area-guide">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-glass border-b border-border/50">
        <div className="px-4 py-3">
          <h1 className="text-base font-semibold text-foreground">Marketplace</h1>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="sticky top-[52px] z-10 border-b border-border/50 bg-background/90 backdrop-blur-glass">
        <div className="px-4 pb-4 pt-4 flex gap-2">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search channels or @username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3"
            />
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="tg-icon-button flex-shrink-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFiltersChips filters={filters as any} onRemoveFilter={handleRemoveFilter} />

      {/* Channel Cards */}
      <div className="px-4 py-6 space-y-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <MarketplaceCardSkeleton
                key={`marketplace-skeleton-${index}`}
                className="glass p-4"
              />
            ))
          : sortedChannels.map((channel) => (
              <MarketplaceCard key={channel.id} channel={channel} />
            ))}
      </div>

      {!isLoading && sortedChannels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No channels found matching your filters
          </p>
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters as any}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
}
