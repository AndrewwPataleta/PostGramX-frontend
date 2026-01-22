import { useState } from "react";

export default function Deals() {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Deals</h1>
        <p className="text-sm text-muted-foreground">
          Manage your campaigns
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border px-4 flex gap-6">
        {["active", "pending", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab
                ? "text-primary border-b-primary"
                : "text-muted-foreground border-b-transparent"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="px-4 py-6 space-y-4">
        <div className="glass p-8 rounded-lg text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Deals List Screen
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            This page will include:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 text-left bg-secondary/30 p-4 rounded-lg mb-6">
            <li>• Tabs: Active, Pending, Completed</li>
            <li>• Deal cards with channel name</li>
            <li>• Status badges</li>
            <li>• Price information</li>
            <li>• Open button for each deal</li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Continue interacting with the chat to generate this page content.
          </p>
        </div>
      </div>
    </div>
  );
}
