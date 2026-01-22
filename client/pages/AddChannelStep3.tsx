import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export default function AddChannelStep3() {
  const detectedStats = {
    name: "My Crypto Channel",
    subscribers: 45000,
    averageViews: 18000,
    engagement: 40,
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col min-h-screen">
      {/* Main content - centered */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="text-center space-y-6 w-full">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full">
            <Check size={48} className="text-primary" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Channel Verified!
            </h1>
            <p className="text-muted-foreground">
              {detectedStats.name} is now verified and ready
            </p>
          </div>

          {/* Detected Stats */}
          <div className="glass p-6 space-y-3 text-left">
            <h2 className="font-semibold text-foreground text-center mb-4">
              Detected Statistics
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg">
                <span className="text-muted-foreground">Subscribers</span>
                <span className="font-semibold text-foreground">
                  {(detectedStats.subscribers / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg">
                <span className="text-muted-foreground">Avg Views (Last 10)</span>
                <span className="font-semibold text-foreground">
                  {(detectedStats.averageViews / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg">
                <span className="text-muted-foreground">Engagement Rate</span>
                <span className="font-semibold text-accent">
                  {detectedStats.engagement}%
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <p className="text-sm text-muted-foreground">
            Your channel is now visible to advertisers. Set your pricing and start
            receiving offers!
          </p>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="px-4 py-6 space-y-3">
        <Link
          to="/channels"
          className="button-primary block text-center w-full py-4 text-base font-semibold"
        >
          Create Listing
        </Link>
        <Link
          to="/channels"
          className="button-secondary block text-center w-full py-4 text-base font-semibold"
        >
          Back to My Channels
        </Link>
      </div>
    </div>
  );
}
