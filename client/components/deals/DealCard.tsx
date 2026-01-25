import StatusPill from "./StatusPill";
import type { StatusKey } from "./statusStyles";

export interface DealCardData {
  id: string;
  name: string;
  username: string;
  verified: boolean;
  avatarUrl?: string;
  status: string;
  statusKey: StatusKey;
  icon: string;
  price: string;
  meta: string;
  secondary: string;
  action: string;
  onSelect?: () => void;
}

export default function DealCard({
  name,
  username,
  verified,
  avatarUrl,
  status,
  statusKey,
  icon,
  price,
  id,
  meta,
  secondary,
  action,
  onSelect,
}: DealCardData) {
  return (
    <div
      className={`glass p-4 transition-colors hover:bg-card/60 ${
        onSelect ? "cursor-pointer" : ""
      }`}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (!onSelect) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-secondary/60 p-[1px]">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-card text-lg font-semibold text-foreground">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
              ) : (
                name.slice(0, 1)
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span>{name}</span>
              {verified && (
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  ✓
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{username}</p>
          </div>
        </div>
        <button className="text-muted-foreground">›</button>
      </div>

      <div className="mt-3">
        <StatusPill icon={icon} label={status} tone={statusKey} />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-foreground">
          <span className="text-base font-semibold">{price}</span>
          {statusKey === "fundsLocked" && <span className="text-sm">🔒</span>}
        </div>
        <div className="text-xs text-muted-foreground">{id}</div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{secondary}</span>
        <span>{meta}</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_8px_18px_hsl(var(--primary)/0.35)]"
          onClick={(event) => event.stopPropagation()}
        >
          {action}
        </button>
        <button
          type="button"
          className="rounded-full border border-border/40 px-4 py-2 text-sm text-foreground"
          onClick={(event) => event.stopPropagation()}
        >
          Details
        </button>
      </div>
    </div>
  );
}
