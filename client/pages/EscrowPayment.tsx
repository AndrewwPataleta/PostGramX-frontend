import { ArrowLeft, Lock, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function EscrowPayment() {
  const [showManualTransfer, setShowManualTransfer] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="sticky top-0 bg-background/90 backdrop-blur-glass border-b border-border/50 z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/deals">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">Secure Payment</h1>
            <p className="text-xs text-muted-foreground">Escrow protection</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 pt-6 pb-24 space-y-4">
        {/* Secure Payment Card */}
        <div className="glass p-8 rounded-lg border-2 border-primary/30 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <Lock size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Secure Payment
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your payment is protected in escrow until the deal is completed
          </p>
          <div className="bg-secondary/50 p-4 rounded-lg mb-6">
            <p className="text-xs text-muted-foreground mb-2">Amount to lock</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-primary">2.5</span>
              <span className="text-lg text-muted-foreground">TON</span>
            </div>
          </div>
        </div>

        {/* Main placeholder */}
        <div className="glass p-8 rounded-lg text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💰</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Escrow Payment Screen
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            This page will include:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 text-left bg-secondary/30 p-4 rounded-lg mb-6">
            <li>• Secure payment card</li>
            <li>• TON amount display</li>
            <li>• Lock icon</li>
            <li>• Pay via Telegram Wallet button</li>
            <li>• Manual transfer details (collapsible)</li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Continue interacting with the chat to generate this page content.
          </p>
        </div>

        {/* Manual Transfer Section */}
        <button
          onClick={() => setShowManualTransfer(!showManualTransfer)}
          className="w-full glass p-4 rounded-lg flex items-center justify-between hover:bg-card/60 transition-colors"
        >
          <span className="font-medium text-foreground">
            Manual Transfer Details
          </span>
          <ChevronDown
            size={18}
            className={`text-muted-foreground transition-transform ${
              showManualTransfer ? "rotate-180" : ""
            }`}
          />
        </button>

        {showManualTransfer && (
          <div className="glass p-4 rounded-lg space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
              <p className="font-mono text-sm text-primary break-all">
                0xUQBt3_v0WY...
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Reference</p>
              <p className="font-mono text-sm text-foreground">DEAL_12345</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="sticky bottom-[calc(5.5rem+var(--tg-safe-bottom))] -mx-4 mt-6 border-t border-border/50 bg-background/90 backdrop-blur-glass safe-area-bottom">
          <div className="px-4 py-4 space-y-3">
            <button className="button-primary text-center py-4 text-base font-semibold">
              Pay with Telegram Wallet
            </button>
            <button className="button-secondary text-center py-4 text-base font-semibold">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
