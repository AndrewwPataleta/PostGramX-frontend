import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ListingSummaryCard } from "@/components/listings/ListingSummaryCard";
import { managedChannelData } from "@/features/channels/managedChannels";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  disableListing,
  enableListing,
  getListingById,
  isMockListingsEnabled,
  updateListing,
} from "@/features/listings/mockStore";
import { listingTagCategories } from "@/features/listings/tagOptions";

const availabilityOptions = [
  { label: "1 day", days: 1 },
  { label: "3 days", days: 3 },
  { label: "7 days", days: 7 },
  { label: "14 days", days: 14 },
  { label: "Custom range", days: null },
];

const pinDurationOptions = [
  { label: "Not pinned", value: "none" },
  { label: "6 hours", value: "6" },
  { label: "12 hours", value: "12" },
  { label: "24 hours", value: "24" },
  { label: "48 hours", value: "48" },
  { label: "Custom", value: "custom" },
];

const visibilityDurationOptions = [
  { label: "24 hours", value: "24" },
  { label: "48 hours", value: "48" },
  { label: "72 hours", value: "72" },
  { label: "7 days", value: "168" },
  { label: "Custom", value: "custom" },
];

const getRangeDays = (from: string, to: string) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffMs = toDate.getTime() - fromDate.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

const resolveHours = (choice: string, customValue: string, fallback: number) => {
  if (choice === "custom") {
    const parsed = Number(customValue);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }
  const parsed = Number(choice);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function EditListing() {
  const { id, listingId } = useParams<{ id: string; listingId: string }>();
  const channel = id ? managedChannelData[id] : null;
  const listing = listingId ? getListingById(listingId) : undefined;
  const navigate = useNavigate();

  const initialRangeDays = listing
    ? getRangeDays(listing.availabilityFrom, listing.availabilityTo)
    : 7;
  const initialChoice = [1, 3, 7, 14].includes(initialRangeDays)
    ? initialRangeDays
    : 0;
  const initialPinDuration = listing?.pinDurationHours ?? null;
  const initialPinChoice = initialPinDuration
    ? [6, 12, 24, 48].includes(initialPinDuration)
      ? String(initialPinDuration)
      : "custom"
    : "none";
  const initialPinCustom =
    initialPinDuration && ![6, 12, 24, 48].includes(initialPinDuration)
      ? String(initialPinDuration)
      : "";
  const initialVisibilityDuration = listing?.visibilityDurationHours ?? 24;
  const initialVisibilityChoice = [24, 48, 72, 168].includes(initialVisibilityDuration)
    ? String(initialVisibilityDuration)
    : "custom";
  const initialVisibilityCustom = [24, 48, 72, 168].includes(initialVisibilityDuration)
    ? ""
    : String(initialVisibilityDuration);

  const [priceTon, setPriceTon] = useState(listing ? String(listing.priceTon) : "25");
  const [availabilityChoice, setAvailabilityChoice] = useState(initialChoice);
  const [customFrom, setCustomFrom] = useState(
    listing ? listing.availabilityFrom.split("T")[0] : "",
  );
  const [customTo, setCustomTo] = useState(
    listing ? listing.availabilityTo.split("T")[0] : "",
  );
  const [pinDurationChoice, setPinDurationChoice] = useState(initialPinChoice);
  const [pinCustomHours, setPinCustomHours] = useState(initialPinCustom);
  const [visibilityDurationChoice, setVisibilityDurationChoice] = useState(
    initialVisibilityChoice,
  );
  const [visibilityCustomHours, setVisibilityCustomHours] = useState(
    initialVisibilityCustom,
  );
  const [allowEdits, setAllowEdits] = useState(listing?.allowEdits ?? true);
  const [allowLinkTracking, setAllowLinkTracking] = useState(
    listing?.allowLinkTracking ?? true,
  );
  const [contentRulesText, setContentRulesText] = useState(
    listing?.contentRulesText ?? "",
  );
  const [tagQuery, setTagQuery] = useState("");
  const [customTag, setCustomTag] = useState("");
  const initialTags = listing?.tags?.length ? listing.tags : ["Must be pre-approved"];
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTags.includes("Must be pre-approved")
      ? initialTags
      : [...initialTags, "Must be pre-approved"],
  );
  const [showVisibilityWarning, setShowVisibilityWarning] = useState(false);

  const mockModeEnabled = import.meta.env.DEV && isMockListingsEnabled;

  const availabilityLabel = useMemo(() => {
    if (availabilityChoice) {
      return `Available next ${availabilityChoice} day${availabilityChoice === 1 ? "" : "s"}`;
    }
    if (customFrom && customTo) {
      const diffDays = getRangeDays(customFrom, customTo);
      return `Available ${diffDays} days`;
    }
    return "Availability pending";
  }, [availabilityChoice, customFrom, customTo]);
  const pinDurationHours =
    pinDurationChoice === "none" ? null : resolveHours(pinDurationChoice, pinCustomHours, 24);
  const visibilityDurationHours = resolveHours(
    visibilityDurationChoice,
    visibilityCustomHours,
    24,
  );

  if (!channel || !listing) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <p className="text-muted-foreground">Listing not found</p>
      </div>
    );
  }

  const applySave = () => {
    const today = new Date();
    const availabilityFrom = availabilityChoice
      ? today
      : customFrom
        ? new Date(customFrom)
        : today;
    const availabilityTo = availabilityChoice
      ? new Date(today.getTime() + availabilityChoice * 24 * 60 * 60 * 1000)
      : customTo
        ? new Date(customTo)
        : today;
    const ensuredTags = selectedTags.includes("Must be pre-approved")
      ? selectedTags
      : [...selectedTags, "Must be pre-approved"];

    updateListing(listing.id, {
      priceTon: Number(priceTon || 0),
      availabilityFrom: availabilityFrom.toISOString(),
      availabilityTo: availabilityTo.toISOString(),
      pinDurationHours,
      visibilityDurationHours,
      allowEdits,
      allowLinkTracking,
      contentRulesText,
      tags: ensuredTags,
      allowPinnedPlacement: pinDurationHours !== null,
    });

    navigate(`/channel-manage/${channel.id}`);
  };

  const handleSave = () => {
    const hasActiveDeals = channel.activeDeals > 0;
    const pinChanged = (listing.pinDurationHours ?? null) !== pinDurationHours;
    const visibilityChanged =
      (listing.visibilityDurationHours ?? 24) !== visibilityDurationHours;

    if (hasActiveDeals && (pinChanged || visibilityChanged)) {
      setShowVisibilityWarning(true);
      return;
    }

    applySave();
  };

  const handleDisable = () => {
    disableListing(listing.id);
    navigate(`/channel-manage/${channel.id}`);
  };

  const handleEnable = () => {
    enableListing(listing.id);
    navigate(`/channel-manage/${channel.id}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="px-4 py-6 space-y-6">
        {mockModeEnabled ? (
          <div className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit">
            Mock mode enabled
          </div>
        ) : null}

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Ad format</h2>
            <p className="text-xs text-muted-foreground">Post format only in MVP.</p>
          </div>
          <select
            disabled
            className="w-full rounded-xl border border-border/40 bg-card/60 px-3 py-3 text-sm text-muted-foreground"
          >
            <option value="POST">Post</option>
          </select>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Price per post</h2>
            <p className="text-xs text-muted-foreground">Price shown publicly in Marketplace.</p>
          </div>
          <input
            type="number"
            value={priceTon}
            onChange={(event) => setPriceTon(event.target.value)}
            placeholder="Example: 25 TON"
            className="w-full rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
          />
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Availability</h2>
            <p className="text-xs text-muted-foreground">
              Advertisers will only be able to schedule posts inside this range.
            </p>
          </div>
          <select
            value={availabilityChoice}
            onChange={(event) => setAvailabilityChoice(Number(event.target.value))}
            className="w-full rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
          >
            {availabilityOptions.map((option) => (
              <option
                key={option.label}
                value={option.days ?? 0}
              >
                Available for next: {option.label}
              </option>
            ))}
          </select>
          {availabilityChoice === 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">From date</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(event) => setCustomFrom(event.target.value)}
                  className="w-full rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">To date</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(event) => setCustomTo(event.target.value)}
                  className="w-full rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
                />
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Post visibility requirements</h2>
            <p className="text-xs text-muted-foreground">
              Define how long the ad post must remain published to receive payment.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Pinned post duration</label>
            <select
              value={pinDurationChoice}
              onChange={(event) => setPinDurationChoice(event.target.value)}
              className="w-full rounded-xl border border-border/60 bg-card px-3 py-2 text-sm text-foreground"
            >
              {pinDurationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              {[6, 12, 24, 48].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setPinDurationChoice(String(hours))}
                  className={`rounded-full border px-3 py-1 text-[11px] ${
                    pinDurationChoice === String(hours)
                      ? "border-primary/60 bg-primary/20 text-primary"
                      : "border-border/60 bg-secondary/60 text-foreground"
                  }`}
                >
                  {hours}h
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPinDurationChoice("none")}
                className={`rounded-full border px-3 py-1 text-[11px] ${
                  pinDurationChoice === "none"
                    ? "border-primary/60 bg-primary/20 text-primary"
                    : "border-border/60 bg-secondary/60 text-foreground"
                }`}
              >
                Off
              </button>
            </div>
            {pinDurationChoice === "custom" ? (
              <input
                type="number"
                value={pinCustomHours}
                onChange={(event) => setPinCustomHours(event.target.value)}
                placeholder="Custom hours"
                className="w-full rounded-xl border border-border/60 bg-card px-3 py-2 text-sm text-foreground"
              />
            ) : null}
            <p className="text-xs text-muted-foreground">
              If enabled, the ad will stay pinned at the top of your channel.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Post visibility duration
            </label>
            <select
              value={visibilityDurationChoice}
              onChange={(event) => setVisibilityDurationChoice(event.target.value)}
              className="w-full rounded-xl border border-border/60 bg-card px-3 py-2 text-sm text-foreground"
            >
              {visibilityDurationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              {[24, 48, 72, 168].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setVisibilityDurationChoice(String(hours))}
                  className={`rounded-full border px-3 py-1 text-[11px] ${
                    visibilityDurationChoice === String(hours)
                      ? "border-primary/60 bg-primary/20 text-primary"
                      : "border-border/60 bg-secondary/60 text-foreground"
                  }`}
                >
                  {hours === 168 ? "7d" : `${hours}h`}
                </button>
              ))}
            </div>
            {visibilityDurationChoice === "custom" ? (
              <input
                type="number"
                value={visibilityCustomHours}
                onChange={(event) => setVisibilityCustomHours(event.target.value)}
                placeholder="Custom hours"
                className="w-full rounded-xl border border-border/60 bg-card px-3 py-2 text-sm text-foreground"
              />
            ) : null}
            <p className="text-xs text-muted-foreground">
              The post must stay visible in the channel feed without deletion or major edits.
            </p>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-3 text-xs text-primary">
            <p className="font-semibold text-foreground">Escrow verification rule</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Funds will be released only after the post remains published and pinned (if
              enabled) for the selected duration.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Posting conditions</h2>
            <p className="text-xs text-muted-foreground">Control what advertisers can change.</p>
          </div>
          <div className="space-y-2">
            <label className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-3 py-3 text-sm">
              <span className="text-foreground">Allow minor post edits by advertiser</span>
              <input
                type="checkbox"
                checked={allowEdits}
                onChange={(event) => setAllowEdits(event.target.checked)}
                className="h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-3 py-3 text-sm">
              <span className="text-foreground">Allow link tracking (UTM / referral links)</span>
              <input
                type="checkbox"
                checked={allowLinkTracking}
                onChange={(event) => setAllowLinkTracking(event.target.checked)}
                className="h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-border/40 bg-card/60 px-3 py-3 text-sm opacity-80">
              <span className="text-foreground">
                Require pre-approval before publishing
                <span className="ml-2 text-[10px] uppercase tracking-wide text-primary">Locked</span>
              </span>
              <input type="checkbox" checked disabled className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-border/40 bg-card/60 px-3 py-3 text-sm opacity-60">
              <span className="text-foreground">
                Allow pinned post placement
                <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                  Coming soon
                </span>
              </span>
              <input type="checkbox" disabled className="h-4 w-4" />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Content Tags</h2>
            <p className="text-xs text-muted-foreground">
              Help advertisers understand what content is allowed in your channel.
            </p>
            <p className="text-[11px] text-muted-foreground">
              Tags are used for discovery and matching.
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={tagQuery}
              onChange={(event) => setTagQuery(event.target.value)}
              placeholder="Search tags"
              className="w-full rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(event) => setCustomTag(event.target.value)}
                placeholder="Add custom tag"
                className="flex-1 rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
              />
              <button
                type="button"
                onClick={() => {
                  const nextTag = customTag.trim();
                  if (!nextTag) {
                    return;
                  }
                  if (!selectedTags.includes(nextTag)) {
                    setSelectedTags((prev) => [...prev, nextTag]);
                  }
                  setCustomTag("");
                }}
                className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-xs font-semibold text-primary"
              >
                Add
              </button>
            </div>
          </div>

          {selectedTags.length > 0 ? (
            <div className="flex flex-wrap gap-2 text-[11px] text-foreground">
              {selectedTags.map((tag) => {
                const isLocked = tag === "Must be pre-approved";
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (isLocked) {
                        return;
                      }
                      setSelectedTags((prev) => prev.filter((item) => item !== tag));
                    }}
                    className={`rounded-full px-2.5 py-1 ${
                      isLocked
                        ? "bg-secondary/60 text-foreground"
                        : "bg-secondary/60 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {tag}
                    {isLocked ? " • Locked" : " ×"}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="space-y-4">
            {listingTagCategories.map((category) => {
              const filteredTags = category.tags.filter((tag) =>
                tag.toLowerCase().includes(tagQuery.trim().toLowerCase()),
              );
              const displayTags = tagQuery ? filteredTags : category.tags;
              if (displayTags.length === 0) {
                return null;
              }
              return (
                <div key={category.title} className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">{category.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {displayTags.map((tag) => {
                      const isLocked = tag === "Must be pre-approved";
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (isLocked) {
                              return;
                            }
                            setSelectedTags((prev) =>
                              prev.includes(tag)
                                ? prev.filter((item) => item !== tag)
                                : [...prev, tag],
                            );
                          }}
                          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                            isSelected
                              ? "border-primary/60 bg-primary/20 text-primary"
                              : "border-border/60 bg-card text-muted-foreground hover:text-foreground"
                          } ${isLocked ? "cursor-not-allowed opacity-70" : ""}`}
                        >
                          {tag}
                          {isLocked ? " • Locked" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Additional requirements (optional)
            </h2>
            <p className="text-xs text-muted-foreground">Add any restrictions or notes.</p>
          </div>
          <textarea
            value={contentRulesText}
            onChange={(event) => setContentRulesText(event.target.value)}
            placeholder="Example: No gambling links, English language only, max 2 emojis."
            className="min-h-[120px] w-full rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
          />
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Listing preview</h2>
            <p className="text-xs text-muted-foreground">Review how your offer appears.</p>
          </div>
          <ListingSummaryCard
            channel={channel}
            priceTon={Number(priceTon || 0)}
            availabilityLabel={availabilityLabel}
            pinDurationHours={pinDurationHours}
            visibilityDurationHours={visibilityDurationHours}
            tags={selectedTags}
          />
        </section>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSave}
            className="w-full button-primary py-3 text-base font-semibold"
          >
            Save changes
          </button>
          <AlertDialog open={showVisibilityWarning} onOpenChange={setShowVisibilityWarning}>
            <AlertDialogContent className="max-w-sm rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Update visibility rules?</AlertDialogTitle>
                <AlertDialogDescription>
                  Changing visibility rules will only apply to new deals.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={applySave}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <button
            type="button"
            onClick={handleDisable}
            className="w-full rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-3 text-sm font-semibold text-destructive"
          >
            Disable listing
          </button>
          {!listing.isActive ? (
            <button
              type="button"
              onClick={handleEnable}
              className="w-full rounded-xl border border-primary/40 bg-primary/10 px-3 py-3 text-sm font-semibold text-primary"
            >
              Enable listing
            </button>
          ) : null}
          <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-card px-3 py-3 text-xs text-muted-foreground">
            <Info size={16} className="text-primary" />
            <span>
              Funds are locked in escrow before posting. Payment is released only after
              delivery verification.
            </span>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}
