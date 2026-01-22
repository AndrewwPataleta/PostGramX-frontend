import DealsFrame from "@/components/deals/DealsFrame";
import DetailFrame from "@/components/deals/DetailFrame";
import {
  dealsActive,
  dealsCompleted,
  dealsPending,
  quickFilters,
  timeline,
  timelineVerifying,
} from "@/pages/dealsData";

export default function Index() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <DealsFrame title="Active" deals={dealsActive} quickFilters={quickFilters} />
          <DealsFrame title="Pending" deals={dealsPending} quickFilters={quickFilters} />
          <DealsFrame title="Completed" deals={dealsCompleted} quickFilters={quickFilters} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <DetailFrame
            status="Payment Required"
            statusKey="paymentRequired"
            icon="💳"
            timelineItems={timeline}
            primary="Pay Now"
            secondary="Open Chat Bot"
            delivery="Awaiting post"
          />
          <DetailFrame
            status="Post Live — Verifying"
            statusKey="verifying"
            icon="👁️"
            timelineItems={timelineVerifying}
            primary="View Post"
            secondary="Message via Bot"
            delivery="Post Live"
          />
        </div>
      </div>
    </div>
  );
}
