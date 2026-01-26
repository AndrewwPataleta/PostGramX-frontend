import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FlowLayout from "@/components/add-channel/FlowLayout";

export default function AddChannelStep2() {
  return (
    <FlowLayout
      title="Confirm Channel"
      footerPaddingClassName="pb-[calc(140px+var(--tg-content-safe-area-inset-bottom))]"
      footer={
        <div className="space-y-2">
          <Link
            to="/add-channel-step3"
            className="button-primary block text-center text-base font-semibold"
          >
            Continue
          </Link>
          <Link
            to="/add-channel-step1"
            className="button-secondary block text-center text-base font-semibold"
          >
            Change channel
          </Link>
        </div>
      }
    >
      <div className="glass p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/60 text-lg">
            📣
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">FlowgramX Updates</p>
            <p className="text-xs text-muted-foreground">@flowgramx_updates</p>
          </div>
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border/60 bg-secondary/30 px-3 py-1">
            Public Channel
          </span>
          <span className="rounded-full border border-border/60 bg-secondary/30 px-3 py-1">
            84.2K subscribers
          </span>
        </div>
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          You must be an admin to continue.
        </p>
      </div>
    </FlowLayout>
  );
}
