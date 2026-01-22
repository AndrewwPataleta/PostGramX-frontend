import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function AddChannel() {
  const [username, setUsername] = useState("");

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
            <p className="text-xs text-muted-foreground">Connect your channel</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 space-y-4">
        <div className="glass p-8 rounded-lg text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">➕</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Add Channel Screen
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            This page will include:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 text-left bg-secondary/30 p-4 rounded-lg mb-6">
            <li>• Input field for channel username</li>
            <li>• Instructions for adding bot as admin</li>
            <li>• Verify button</li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Continue interacting with the chat to generate this page content.
          </p>
        </div>

        {/* Input field */}
        <input
          type="text"
          placeholder="@your_channel_username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />

        <button className="button-primary mt-2 text-center py-4 text-base font-semibold">
          Continue
        </button>
      </div>
    </div>
  );
}
