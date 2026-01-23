import StatusPill from "./StatusPill";
import type { StatusKey } from "./statusStyles";

interface DetailHeaderProps {
  status: string;
  statusKey: StatusKey;
  icon: string;
  title: string;
  username: string;
  verified: boolean;
  price: string;
  dealId: string;
  avatarUrl?: string;
  statusDescription: string;
}

export default function DetailHeader({
  status,
  statusKey,
  icon,
  title,
  username,
  verified,
  price,
  dealId,
  avatarUrl,
  statusDescription,
}: DetailHeaderProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.45)]">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400/40 via-sky-500/40 to-blue-600/40 p-[1px]">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950 text-lg font-semibold text-white">
            {avatarUrl ? (
              <img src={avatarUrl} alt={title} className="h-full w-full object-cover" />
            ) : (
              title.slice(0, 1)
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span>{title}</span>
            {verified && (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[10px] text-white">
                ✓
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">@{username}</p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p className="font-semibold text-white">{price}</p>
          <p>{dealId}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <StatusPill icon={icon} label={status} tone={statusKey} />
        <p className="text-xs text-slate-400">{statusDescription}</p>
      </div>
    </div>
  );
}
