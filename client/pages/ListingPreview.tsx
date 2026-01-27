import { useOutletContext, useParams } from "react-router-dom";
import { ListingSummaryCard } from "@/components/listings/ListingSummaryCard";
import { managedChannelData } from "@/features/channels/managedChannels";
import { getActiveListingForChannel, isMockListingsEnabled } from "@/features/listings/mockStore";
import type { ChannelManageContext } from "@/pages/channel-manage/ChannelManageLayout";

export default function ListingPreview() {
  const { id } = useParams<{ id: string }>();
  const outletContext = useOutletContext<ChannelManageContext | null>();
  const channel = outletContext?.channel ?? (id ? managedChannelData[id] : null);
  const listing = id ? getActiveListingForChannel(id) : undefined;
  const mockModeEnabled = import.meta.env.DEV && isMockListingsEnabled;
  const availabilityLabel = listing
    ? (() => {
        const from = new Date(listing.availabilityFrom);
        const to = new Date(listing.availabilityTo);
        const diffMs = to.getTime() - from.getTime();
        const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        return `Available next ${diffDays} day${diffDays === 1 ? "" : "s"}`;
      })()
    : "Available next 7 days";
  const pinDurationHours = listing?.pinDurationHours ?? null;
  const visibilityDurationHours = listing?.visibilityDurationHours ?? 24;

  if (!channel) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <p className="text-muted-foreground">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="px-4 py-6 space-y-4">
        {mockModeEnabled ? (
          <div className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit">
            Mock mode enabled
          </div>
        ) : null}

        <ListingSummaryCard
          channel={channel}
          priceTon={listing?.priceTon ?? 25}
          availabilityLabel={availabilityLabel}
          pinDurationHours={pinDurationHours}
          visibilityDurationHours={visibilityDurationHours}
          tags={listing?.tags ?? []}
        />

        <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Preview state</p>
          <p className="mt-1">
            This summary card is used across Marketplace and advertiser requests.
          </p>
        </div>
      </div>
      <div className="h-20" />
    </div>
  );
}
