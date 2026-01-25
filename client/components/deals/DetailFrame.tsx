import DetailHeader from "./DetailHeader";
import InfoCard from "./InfoCard";
import Timeline, { type TimelineItem } from "./Timeline";
import type { StatusKey } from "./statusStyles";

interface DetailFrameProps {
  title: string;
  username: string;
  verified: boolean;
  price: string;
  dealId: string;
  avatarUrl?: string;
  status: string;
  statusKey: StatusKey;
  icon: string;
  timelineItems: TimelineItem[];
  primary: string;
  secondary: string;
  delivery: string;
  statusDescription: string;
}

export default function DetailFrame({
  title,
  username,
  verified,
  price,
  dealId,
  avatarUrl,
  status,
  statusKey,
  icon,
  timelineItems,
  primary,
  secondary,
  delivery,
  statusDescription,
}: DetailFrameProps) {
  return (
    <div className="rounded-[32px] border border-border/30 bg-card/80 p-6 shadow-sm">
      <DetailHeader
        status={status}
        statusKey={statusKey}
        icon={icon}
        title={title}
        username={username}
        verified={verified}
        price={price}
        dealId={dealId}
        avatarUrl={avatarUrl}
        statusDescription={statusDescription}
      />

      <div className="mt-5 space-y-4">
        <Timeline items={timelineItems} />

        <InfoCard title="Escrow">
          <p className="flex items-center justify-between text-sm text-foreground">
            <span>{status}</span>
            <span className="font-semibold">35 TON</span>
          </p>
          <p>Funds are locked until the post is verified.</p>
          <div className="rounded-xl border border-border/30 bg-card/70 p-3 text-[11px] text-muted-foreground">
            <p>Network: TON</p>
            <p>Confirmations: 2</p>
            <p>Updated: 1m ago</p>
          </div>
        </InfoCard>

        <InfoCard title="Creative">
          <p className="text-sm text-foreground">Submitted</p>
          <p>"Launching the new FlowgramX workflow today. Get your slot."</p>
          <div className="flex gap-2">
            <button className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
              {statusKey === "paymentRequired" ? "Approve" : "Request edits"}
            </button>
            <button className="rounded-full border border-border/40 px-3 py-2 text-xs text-foreground">
              {statusKey === "paymentRequired" ? "Request edits" : "Approve"}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Final approvals are confirmed via the bot.
          </p>
        </InfoCard>

        <InfoCard title="Schedule">
          <p className="text-sm text-foreground">Jan 30, 18:00 (UTC)</p>
          <button className="rounded-full border border-border/40 px-3 py-2 text-xs text-foreground">
            Select time
          </button>
        </InfoCard>

        <InfoCard title="Delivery">
          <p className="text-sm text-foreground">{delivery}</p>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-teal-400"></div>
            <span>Verifying integrity</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Release in: 45m</p>
          <button className="rounded-full bg-secondary px-3 py-2 text-xs text-secondary-foreground">
            View in Telegram
          </button>
        </InfoCard>
      </div>

      <div className="sticky bottom-4 mt-6 flex items-center gap-3 rounded-2xl border border-border/30 bg-card/80 px-4 py-3">
        <button className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          {primary}
        </button>
        <button className="rounded-full border border-border/40 px-4 py-2 text-sm text-foreground">
          {secondary}
        </button>
      </div>
    </div>
  );
}
