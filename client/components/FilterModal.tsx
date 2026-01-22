import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

export interface FilterState {
  priceRange: [number, number];
  subscribersRange: [number, number];
  viewsRange: [number, number];
  engagementRange?: [number, number];
  languages: string[];
  categories: string[];
  verifiedOnly: boolean;
  dateRange: [string, string];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
}

const languages = ["EN", "RU", "ES", "AR", "DE", "Other"];
const categories = [
  "Crypto",
  "Finance",
  "Gaming",
  "Tech",
  "Lifestyle",
  "News",
];

export const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}: FilterModalProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [expandedSections, setExpandedSections] = useState({
    pricing: true,
    audience: true,
    engagement: false,
    language: false,
    category: false,
    availability: false,
    verification: false,
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (
    index: 0 | 1,
    value: number
  ) => {
    const newRange = [...localFilters.priceRange] as [number, number];
    newRange[index] = value;
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: newRange,
    }));
  };

  const handleSubscribersChange = (
    index: 0 | 1,
    value: number
  ) => {
    const newRange = [...localFilters.subscribersRange] as [number, number];
    newRange[index] = value;
    setLocalFilters((prev) => ({
      ...prev,
      subscribersRange: newRange,
    }));
  };

  const handleViewsChange = (
    index: 0 | 1,
    value: number
  ) => {
    const newRange = [...localFilters.viewsRange] as [number, number];
    newRange[index] = value;
    setLocalFilters((prev) => ({
      ...prev,
      viewsRange: newRange,
    }));
  };

  const handleEngagementChange = (
    index: 0 | 1,
    value: number
  ) => {
    const newRange = [...(localFilters.engagementRange || [0, 100])] as [number, number];
    newRange[index] = value;
    setLocalFilters((prev) => ({
      ...prev,
      engagementRange: newRange,
    }));
  };

  const toggleLanguage = (lang: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const toggleCategory = (cat: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    setLocalFilters({
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Bottom Sheet Modal */}
      <div className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-50 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border/50 px-4 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Pricing Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("pricing")}
              className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <span className="font-semibold text-foreground">Pricing (TON)</span>
              <ChevronDown
                size={18}
                className={`text-muted-foreground transition-transform ${
                  expandedSections.pricing ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.pricing && (
              <div className="px-3 space-y-3 pb-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={localFilters.priceRange[0]}
                    onChange={(e) =>
                      handlePriceChange(0, parseFloat(e.target.value) || 0)
                    }
                    className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={localFilters.priceRange[1]}
                    onChange={(e) =>
                      handlePriceChange(1, parseFloat(e.target.value) || 10)
                    }
                    className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={localFilters.priceRange[0]}
                  onChange={(e) =>
                    handlePriceChange(0, parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={localFilters.priceRange[1]}
                  onChange={(e) =>
                    handlePriceChange(1, parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  {localFilters.priceRange[0].toFixed(1)} -{" "}
                  {localFilters.priceRange[1].toFixed(1)} TON
                </p>
              </div>
            )}
          </div>

          {/* Audience Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("audience")}
              className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <span className="font-semibold text-foreground">Audience</span>
              <ChevronDown
                size={18}
                className={`text-muted-foreground transition-transform ${
                  expandedSections.audience ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.audience && (
              <div className="px-3 space-y-4 pb-3">
                {/* Subscribers */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Subscribers
                  </p>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      value={localFilters.subscribersRange[0]}
                      onChange={(e) =>
                        handleSubscribersChange(0, parseInt(e.target.value) || 0)
                      }
                      className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={localFilters.subscribersRange[1]}
                      onChange={(e) =>
                        handleSubscribersChange(1, parseInt(e.target.value) || 1000000)
                      }
                      className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={localFilters.subscribersRange[0]}
                    onChange={(e) =>
                      handleSubscribersChange(0, parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(localFilters.subscribersRange[0] / 1000).toFixed(0)}K -{" "}
                    {(localFilters.subscribersRange[1] / 1000).toFixed(0)}K
                  </p>
                </div>

                {/* Average Views */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Average Views
                  </p>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      value={localFilters.viewsRange[0]}
                      onChange={(e) =>
                        handleViewsChange(0, parseInt(e.target.value) || 0)
                      }
                      className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={localFilters.viewsRange[1]}
                      onChange={(e) =>
                        handleViewsChange(1, parseInt(e.target.value) || 1000000)
                      }
                      className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={localFilters.viewsRange[0]}
                    onChange={(e) =>
                      handleViewsChange(0, parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(localFilters.viewsRange[0] / 1000).toFixed(0)}K -{" "}
                    {(localFilters.viewsRange[1] / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Engagement Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("engagement")}
              className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <span className="font-semibold text-foreground">Engagement Rate</span>
              <ChevronDown
                size={18}
                className={`text-muted-foreground transition-transform ${
                  expandedSections.engagement ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.engagement && (
              <div className="px-3 space-y-3 pb-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={localFilters.engagementRange?.[0] ?? 0}
                    onChange={(e) =>
                      handleEngagementChange(0, parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    max="100"
                    className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Min %"
                  />
                  <input
                    type="number"
                    value={localFilters.engagementRange?.[1] ?? 100}
                    onChange={(e) =>
                      handleEngagementChange(1, parseFloat(e.target.value) || 100)
                    }
                    min="0"
                    max="100"
                    className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Max %"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={localFilters.engagementRange?.[0] ?? 0}
                  onChange={(e) =>
                    handleEngagementChange(0, parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={localFilters.engagementRange?.[1] ?? 100}
                  onChange={(e) =>
                    handleEngagementChange(1, parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  {(localFilters.engagementRange?.[0] ?? 0).toFixed(0)}% -{" "}
                  {(localFilters.engagementRange?.[1] ?? 100).toFixed(0)}%
                </p>
              </div>
            )}
          </div>

          {/* Language Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("language")}
              className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <span className="font-semibold text-foreground">Language</span>
              <ChevronDown
                size={18}
                className={`text-muted-foreground transition-transform ${
                  expandedSections.language ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.language && (
              <div className="px-3 pb-3">
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        localFilters.languages.includes(lang)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("category")}
              className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <span className="font-semibold text-foreground">Category</span>
              <ChevronDown
                size={18}
                className={`text-muted-foreground transition-transform ${
                  expandedSections.category ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.category && (
              <div className="px-3 pb-3">
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        localFilters.categories.includes(cat)
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Availability Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("availability")}
              className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <span className="font-semibold text-foreground">Availability</span>
              <ChevronDown
                size={18}
                className={`text-muted-foreground transition-transform ${
                  expandedSections.availability ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.availability && (
              <div className="px-3 pb-3 space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    From date
                  </p>
                  <input
                    type="date"
                    value={localFilters.dateRange[0]}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        dateRange: [e.target.value, prev.dateRange[1]],
                      }))
                    }
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    To date
                  </p>
                  <input
                    type="date"
                    value={localFilters.dateRange[1]}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        dateRange: [prev.dateRange[0], e.target.value],
                      }))
                    }
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Verification Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("verification")}
              className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <span className="font-semibold text-foreground">Verification</span>
              <ChevronDown
                size={18}
                className={`text-muted-foreground transition-transform ${
                  expandedSections.verification ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.verification && (
              <div className="px-3 pb-3">
                <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary/50 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={localFilters.verifiedOnly}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        verifiedOnly: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 bg-secondary border border-border rounded accent-primary cursor-pointer"
                  />
                  <span className="text-foreground font-medium">
                    Verified channels only
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border/50 px-4 py-4 space-y-3">
          <button
            onClick={handleApply}
            className="button-primary w-full py-3 text-base font-semibold"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="button-secondary w-full py-3 text-base font-semibold"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};
