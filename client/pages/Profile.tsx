import { LogOut, Settings } from "lucide-react";

export default function Profile() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account</p>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 space-y-4 mb-12">
        {/* Wallet Card */}
        <div className="glass p-6 rounded-lg border-2 border-accent/30 mb-4">
          <p className="text-xs text-muted-foreground mb-4">Wallet Balance</p>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Locked Funds</p>
            <p className="text-2xl font-bold text-foreground">0 TON</p>
          </div>
          <div className="pt-4 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-primary">0 TON</p>
          </div>
        </div>

        {/* Main content placeholder */}
        <div className="glass p-8 rounded-lg text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👤</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Profile Screen
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            This page will include:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 text-left bg-secondary/30 p-4 rounded-lg mb-6">
            <li>• Wallet summary card</li>
            <li>• Total locked funds</li>
            <li>• Total earned funds</li>
            <li>• Settings list</li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Continue interacting with the chat to generate this page content.
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
      </div>
    </div>
  );
}
