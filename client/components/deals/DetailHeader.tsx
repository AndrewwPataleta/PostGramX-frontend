import DealStatusPill, { DealStatusTone } from "./DealStatusPill";

interface DetailHeaderProps {
  status: string;
  tone: DealStatusTone;
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
  tone,
  title,
  username,
  verified,
  price,
  dealId,
  avatarUrl,
  statusDescription,
}: DetailHeaderProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/60 text-xl">
          {avatarUrl ? (
            avatarUrl.startsWith("http") ? (
              <img src={avatarUrl} alt={title} className="h-full w-full rounded-full object-cover" />
            ) : (
              avatarUrl
            )
          ) : (
            title.slice(0, 1)
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span>{title}</span>
            {verified ? (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[10px] text-primary">
                ✓
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">@{username}</p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">{price}</p>
          <p>{dealId}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <DealStatusPill label={status} tone={tone} />
        <p className="text-xs text-muted-foreground">{statusDescription}</p>
      </div>
    </div>
  );
}
