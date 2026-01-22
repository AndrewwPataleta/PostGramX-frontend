import StatusPill from "./StatusPill";
import type { StatusKey } from "./statusStyles";

export interface DealCardData {
  id: string;
  name: string;
  username: string;
  verified: boolean;
  status: string;
  statusKey: StatusKey;
  icon: string;
  price: string;
  meta: string;
  secondary: string;
  action: string;
}

export default function DealCard({
  name,
  username,
  verified,
  status,
  statusKey,
  icon,
  price,
  id,
  meta,
  secondary,
  action,
}: DealCardData) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-cyan-400/40 via-sky-500/40 to-blue-600/40 p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-lg font-semibold text-white">
              {name.slice(0, 1)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span>{name}</span>
              {verified && (
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[10px] text-white">
                  ✓
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{username}</p>
          </div>
        </div>
        <button className="text-slate-500">›</button>
      </div>

      <div className="mt-3">
        <StatusPill icon={icon} label={status} tone={statusKey} />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-white">
          <span className="text-base font-semibold">{price}</span>
          {statusKey === "fundsLocked" && <span className="text-sm">🔒</span>}
        </div>
        <div className="text-xs text-slate-500">{id}</div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span>{secondary}</span>
        <span>{meta}</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_8px_18px_rgba(14,165,233,0.4)]">
          {action}
        </button>
        <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">
          Details
        </button>
      </div>
    </div>
  );
}
