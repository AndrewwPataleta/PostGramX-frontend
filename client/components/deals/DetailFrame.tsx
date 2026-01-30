import DetailHeader from "./DetailHeader";
import InfoCard from "./InfoCard";
import Timeline, { type TimelineItem } from "./Timeline";
import type { StatusKey } from "./statusStyles";
import { useLanguage } from "@/i18n/LanguageProvider";

interface DetailFrameProps {
  title: string;
  username: string;
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
  const { t } = useLanguage();
  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_20px_60px_rgba(8,15,30,0.6)]">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
        <DetailHeader
          status={status}
          statusKey={statusKey}
          icon={icon}
          title={title}
          username={username}
          price={price}
          dealId={dealId}
          avatarUrl={avatarUrl}
          statusDescription={statusDescription}
        />
        <Timeline items={timelineItems} />
      </div>

      <div className="mt-5 space-y-4">

        <InfoCard title={t("deals.detail.escrowTitle")}>
          <p className="flex items-center justify-between text-sm text-white">
            <span>{status}</span>
            <span className="font-semibold">
              {t("deals.detail.escrowAmount")}
            </span>
          </p>
          <p>{t("deals.detail.escrowNote")}</p>
          <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3 text-[11px] text-slate-400">
            <p>
              {t("deals.detail.network")}: {t("common.ton")}
            </p>
            <p>{t("deals.detail.confirmations")}: 2</p>
            <p>{t("deals.detail.updatedAt")}: 1m</p>
          </div>
        </InfoCard>

        <InfoCard title={t("deals.detail.creativeTitle")}>
          <p className="text-sm text-white">{t("deals.detail.creativeSubmitted")}</p>
          <p>{t("deals.detail.creativeSample")}</p>
          <div className="flex gap-2">
            <button className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950">
              {statusKey === "paymentRequired" ? t("common.approve") : t("common.requestEdits")}
            </button>
            <button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200">
              {statusKey === "paymentRequired" ? t("common.requestEdits") : t("common.approve")}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">{t("deals.detail.creativeNote")}</p>
        </InfoCard>

        <InfoCard title={t("deals.detail.scheduleTitle")}>
          <p className="text-sm text-white">{t("deals.detail.scheduleSample")}</p>
          <button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200">
            {t("deals.detail.selectTime")}
          </button>
        </InfoCard>

        <InfoCard title={t("deals.detail.deliveryTitle")}>
          <p className="text-sm text-white">{delivery}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <div className="h-2 w-2 rounded-full bg-teal-400"></div>
            <span>{t("deals.detail.verifying")}</span>
          </div>
          <p className="text-[11px] text-slate-400">{t("deals.detail.releaseIn")}: 45m</p>
          <button className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-200">
            {t("deals.detail.viewInTelegram")}
          </button>
        </InfoCard>
      </div>

      <div className="sticky bottom-4 mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3">
        <button className="flex-1 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950">
          {primary}
        </button>
        <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200">
          {secondary}
        </button>
      </div>
    </div>
  );
}
