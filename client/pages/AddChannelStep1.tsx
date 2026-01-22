import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AddChannelStep1() {
  const [username, setUsername] = useState("");

  const handleContinue = () => {
    if (username.trim()) {
      // Navigate to step 2
      window.location.href = "/add-channel-step2";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-glass border-b border-border/50 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to="/channels">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">Add Channel</h1>
            <p className="text-xs text-muted-foreground">Step 1 of 3</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Add Telegram Channel
          </h2>
          <p className="text-muted-foreground">
            Enter your channel username or link to get started
          </p>
        </div>

        {/* Input Card */}
        <div className="glass p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Channel username or link
            </label>
            <input
              type="text"
              placeholder="@mychannel or https://t.me/mychannel"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We'll detect your channel details automatically
          </p>
        </div>

        {/* Info Box */}
        <div className="glass p-4 border border-border/50 space-y-3">
          <h3 className="font-semibold text-foreground text-sm">Requirements</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Public Telegram channel</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>At least 10K subscribers</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Active posting history</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContinue}
            disabled={!username.trim()}
            className="button-primary w-full py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
          <Link
            to="/channels"
            className="button-secondary w-full py-4 text-base font-semibold text-center"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
