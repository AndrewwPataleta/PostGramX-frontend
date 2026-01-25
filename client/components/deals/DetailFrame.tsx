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
    <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_20px_60px_rgba(8,15,30,0.6)]">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
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
        <Timeline items={timelineItems} />
      </div>

      <div className="mt-5 space-y-4">

        <InfoCard title="Escrow">
          <p className="flex items-center justify-between text-sm text-white">
            <span>{status}</span>
            <span className="font-semibold">35 TON</span>
          </p>
          <p>Funds are locked until the post is verified.</p>
          <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3 text-[11px] text-slate-400">
            <p>Network: TON</p>
            <p>Confirmations: 2</p>
            <p>Updated: 1m ago</p>
          </div>
        </InfoCard>

        <InfoCard title="Creative">
          <p className="text-sm text-white">Submitted</p>
          <p>"Launching the new FlowgramX workflow today. Get your slot."</p>
          <div className="flex gap-2">
            <button className="rounded-full bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950">
              {statusKey === "paymentRequired" ? "Approve" : "Request edits"}
            </button>
            <button className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200">
              {statusKey === "paymentRequired" ? "Request edits" : "Approve"}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">Final approvals are confirmed via the bot.</p>
        </InfoCard>

        <InfoCard title="Schedule">
          <p className="text-sm text-white">Jan 30, 18:00 (UTC)</p>
          <button className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200">
            Select time
          </button>
        </InfoCard>

        <InfoCard title="Delivery">
          <p className="text-sm text-white">{delivery}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <div className="h-2 w-2 rounded-full bg-teal-400"></div>
            <span>Verifying integrity</span>
          </div>
          <p className="text-[11px] text-slate-400">Release in: 45m</p>
          <button className="rounded-full bg-slate-800 px-3 py-2 text-xs text-slate-200">
            View in Telegram
          </button>
        </InfoCard>
      </div>

      <div className="sticky bottom-4 mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3">
        <button className="flex-1 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950">
          {primary}
        </button>
        <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">
          {secondary}
        </button>
      </div>
    </div>
  );
}
