import { Check, LogOut, Send, Settings } from "lucide-react";

export default function Profile() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-glass border-b border-border/50">
        <div className="px-4 py-3">
          <h1 className="text-base font-semibold text-foreground">Profile</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-4 space-y-4 pb-28">
        {/* Profile Header Card */}
        <div className="glass p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xl font-semibold">
            AJ
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                Alex Johnson
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary px-2 py-0.5 text-[11px] font-medium">
                <Check size={12} />
                Verified
              </span>
            </div>
            <p className="text-sm text-muted-foreground">@alexjohnson</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Connected via Telegram
            </p>
          </div>
        </div>

        {/* Wallet Summary Card */}
        <div className="glass p-4">
          <p className="text-xs text-muted-foreground mb-3">
            Wallet Summary
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                Escrow balance locked
              </p>
              <p className="text-lg font-semibold text-foreground mt-1">
                1.2 TON
              </p>
            </div>
            <div className="bg-secondary/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                Total earnings (TON)
              </p>
              <p className="text-lg font-semibold text-primary mt-1">
                8.4 TON
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="glass p-4">
          <p className="text-xs text-muted-foreground mb-2">About</p>
          <p className="text-sm text-foreground">
            Powered by Telegram Mini Apps.
          </p>
        </div>

        {/* Settings Section */}
        <div className="mt-6 space-y-2">
          <button className="w-full glass p-4 rounded-lg flex items-center gap-3 hover:bg-card/60 transition-colors text-left">
            <Settings size={18} className="text-muted-foreground" />
            <span className="text-foreground font-medium">Settings</span>
          </button>
          <button className="w-full glass p-4 rounded-lg flex items-center gap-3 hover:bg-card/60 transition-colors text-left">
            <LogOut size={18} className="text-muted-foreground" />
            <span className="text-foreground font-medium">Logout</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 pt-6 text-xs text-muted-foreground/70">
          <Send size={14} className="text-primary/70" />
          <span className="tracking-wide">Telegram Mini App</span>
        </div>
      </div>
    </div>
  );
}
