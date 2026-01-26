import { Link } from "react-router-dom";
import { ArrowRight, Bot, UserCog } from "lucide-react";
import FlowLayout from "@/components/add-channel/FlowLayout";

export default function AddChannelStep3() {
  return (
    <FlowLayout
      title="Grant Access"
      footerPaddingClassName="pb-[calc(140px+var(--tg-content-safe-area-inset-bottom))]"
      footer={
        <div className="space-y-2">
          <Link
            to="/channels"
            className="button-primary block text-center text-base font-semibold"
          >
            I added the bot
          </Link>
          <Link
            to="/channels"
            className="button-secondary block text-center text-base font-semibold"
          >
            Open Telegram Settings
          </Link>
        </div>
      }
    >
      <div className="glass p-4 space-y-3">
        <div className="flex items-center justify-center gap-2 text-primary">
          <UserCog className="h-5 w-5" />
          <ArrowRight className="h-4 w-4" />
          <Bot className="h-5 w-5" />
        </div>
        <div className="space-y-3 text-sm text-foreground">
          <div className="flex gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              1
            </span>
            <p>Open channel settings → Administrators.</p>
          </div>
          <div className="flex gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              2
            </span>
            <p>Add @FlowgramXBot as admin.</p>
          </div>
          <div className="flex gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              3
            </span>
            <p>Enable “Post Messages” permission.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          We only post verified ads that you approve. No spam or edits.
        </p>
      </div>
    </FlowLayout>
  );
}
