interface ListingPreviewDetailsProps {
  priceTon: number;
  format?: "POST";
  pinDurationHours: number | null;
  visibilityDurationHours: number;
  allowEdits: boolean;
  allowLinkTracking: boolean;
  allowPinnedPlacement?: boolean;
  tags: string[];
  requiresApproval?: boolean;
  restrictionRulesText?: string;
  additionalRequirementsText?: string;
  availabilityFrom?: string;
  availabilityTo?: string;
}

const formatDuration = (hours: number) => {
  if (hours >= 168 && hours % 24 === 0) {
    return `${hours / 24} days`;
  }
  return `${hours} hours`;
};

const buildAvailabilityLabel = (from?: string, to?: string) => {
  if (!from || !to) {
    return null;
  }
  const start = new Date(from);
  const end = new Date(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  return `Available: now → +${diffDays} day${diffDays === 1 ? "" : "s"}`;
};

export function ListingPreviewDetails({
  priceTon,
  format = "POST",
  pinDurationHours,
  visibilityDurationHours,
  allowEdits,
  allowLinkTracking,
  allowPinnedPlacement,
  tags,
  requiresApproval,
  restrictionRulesText,
  additionalRequirementsText,
  availabilityFrom,
  availabilityTo,
}: ListingPreviewDetailsProps) {
  const availabilityLabel = buildAvailabilityLabel(availabilityFrom, availabilityTo);
  const pinnedLabel = pinDurationHours ? formatDuration(pinDurationHours) : "None";
  const visibilityLabel = formatDuration(visibilityDurationHours);
  const pinnedAvailable = pinDurationHours !== null || Boolean(allowPinnedPlacement);
  const orderedTags = [
    ...new Set([
      ...tags.filter((tag) => tag === "Must be pre-approved"),
      ...tags.filter((tag) => tag !== "Must be pre-approved"),
    ]),
  ];

  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-4 space-y-6">
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Pricing & Placement</h3>
          <p className="text-xs text-muted-foreground">Overview of pricing and duration.</p>
        </div>
        <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Price</p>
            <p className="text-sm font-semibold text-foreground">{priceTon} TON</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Format</p>
            <p className="text-sm font-semibold text-foreground">
              {format === "POST" ? "Post" : format.toLowerCase()}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Pinned</p>
            <p className="text-sm font-semibold text-foreground">{pinnedLabel}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Visible in feed
            </p>
            <p className="text-sm font-semibold text-foreground">{visibilityLabel}</p>
          </div>
        </div>
        {availabilityLabel ? (
          <div className="rounded-xl border border-border/60 bg-secondary/30 px-3 py-2 text-xs font-medium text-foreground">
            {availabilityLabel}
          </div>
        ) : null}
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Allowed formats / style</h3>
          <p className="text-xs text-muted-foreground">Capabilities for approved posts.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full bg-secondary/60 px-3 py-1 text-foreground">
            {allowEdits ? "Edits allowed" : "No edits"}
          </span>
          <span className="rounded-full bg-secondary/60 px-3 py-1 text-foreground">
            {allowLinkTracking ? "Link tracking allowed" : "No tracking"}
          </span>
          <span className="rounded-full bg-secondary/60 px-3 py-1 text-foreground">
            {pinnedAvailable ? "Pinned placement available" : "No pinned placement"}
          </span>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Prohibited / Restricted content
          </h3>
          <p className="text-xs text-muted-foreground">
            Tags and approval requirements for advertisers.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          {orderedTags.length ? (
            orderedTags.map((tag) => {
              const isLocked = tag === "Must be pre-approved";
              return (
                <span
                  key={tag}
                  className={`rounded-full border px-3 py-1 ${
                    isLocked
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/60 bg-card text-foreground"
                  }`}
                >
                  {tag}
                </span>
              );
            })
          ) : (
            <span className="text-muted-foreground">No tags selected</span>
          )}
        </div>
        <div className="rounded-xl border border-border/60 bg-card px-3 py-2 text-xs">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Restrictions / rules
          </p>
          <p className="mt-1 text-sm text-foreground">{restrictionRulesText || "—"}</p>
        </div>
        {requiresApproval ? (
          <span className="inline-flex w-fit rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold text-primary">
            Pre-approval required
          </span>
        ) : null}
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Additional requirements</h3>
          <p className="text-xs text-muted-foreground">Notes for advertisers.</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground">
          {additionalRequirementsText?.trim() ? additionalRequirementsText : "—"}
        </div>
      </section>
    </div>
  );
}
