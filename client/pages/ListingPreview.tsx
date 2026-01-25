import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ListingSummaryCard } from "@/components/listings/ListingSummaryCard";
import { managedChannelData } from "@/features/channels/managedChannels";
import { getActiveListingForChannel, isMockListingsEnabled } from "@/features/listings/mockStore";

export default function ListingPreview() {
  const { id } = useParams<{ id: string }>();
  const channel = id ? managedChannelData[id] : null;
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

  if (!channel) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <p className="text-muted-foreground">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="sticky top-0 bg-card/80 backdrop-blur-glass border-b border-border/50 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to={`/channel-manage/${channel.id}`}>
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">Listing preview</h1>
            <p className="text-xs text-muted-foreground">How your offer appears in Marketplace</p>
          </div>
        </div>
      </div>

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
