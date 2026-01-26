import { Link, useOutletContext } from "react-router-dom";
import { Edit, Plus, Power } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { disableListing, enableListing } from "@/features/listings/mockStore";
import type { ChannelManageContext } from "@/pages/channel-manage/ChannelManageLayout";

const ListingsList = () => {
  const {
    channel,
    activeListings,
    inactiveListings,
    listingFilter,
    setListingFilter,
    mockModeEnabled,
  } = useOutletContext<ChannelManageContext>();

  const hasListings = activeListings.length > 0 || inactiveListings.length > 0;

  return (
    <>
      {mockModeEnabled ? (
        <div className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit">
          Mock mode enabled
        </div>
      ) : null}

      {hasListings ? (
        <div className="space-y-4">
          <div className="flex gap-2 rounded-full bg-secondary/40 p-1">
            {([
              { id: "active", label: "Active" },
              { id: "disabled", label: "Disabled" },
            ] as const).map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setListingFilter(filter.id)}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                  listingFilter === filter.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {(listingFilter === "active" ? activeListings : inactiveListings).map(
              (listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  variant="full"
                  actionSlot={
                    <>
                      <Link
                        to={`/channel-manage/${channel.id}/listings/${listing.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2 rounded-lg border border-border transition-colors text-sm"
                      >
                        <Edit size={16} />
                        Edit
                      </Link>
                      {listing.isActive ? (
                        <button
                          type="button"
                          onClick={() => disableListing(listing.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-destructive/20 hover:bg-destructive/30 text-destructive font-medium py-2 rounded-lg transition-colors text-sm"
                        >
                          <Power size={16} />
                          Disable
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => enableListing(listing.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-primary/15 hover:bg-primary/20 text-primary font-medium py-2 rounded-lg transition-colors text-sm"
                        >
                          <Plus size={16} />
                          Enable
                        </button>
                      )}
                    </>
                  }
                />
              ),
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">📋</span>
          </div>
          <p className="text-foreground font-semibold mb-2">No listings yet</p>
          <p className="text-muted-foreground text-sm mb-6">
            Create your first listing to start receiving offers
          </p>
        </div>
      )}

      <Link
        to={`/channel-manage/${channel.id}/listings/create`}
        className="w-full button-primary py-3 text-base font-semibold text-center"
      >
        Create Listing
      </Link>
    </>
  );
};

export default ListingsList;
