import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

export default function AddChannelStep2() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-glass border-b border-border/50 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to="/add-channel-step1">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">Grant Bot Access</h1>
            <p className="text-xs text-muted-foreground">Step 2 of 3</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 space-y-6">
        {/* Icon */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-primary" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Grant Bot Access
          </h2>
          <p className="text-muted-foreground">
            Add our bot as admin to verify your channel
          </p>
        </div>

        {/* Instructions Card */}
        <div className="glass p-6 space-y-4">
          <h3 className="font-semibold text-foreground text-sm mb-4">
            Follow these steps:
          </h3>

          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Open channel settings</p>
              <p className="text-sm text-muted-foreground">
                Go to your channel → Manage → Administrators
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Add @FlowgramXBot</p>
              <p className="text-sm text-muted-foreground">
                Search for and add our verification bot
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">
                Enable "Post Messages"
              </p>
              <p className="text-sm text-muted-foreground">
                Grant permission to post on your behalf
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="glass p-4 bg-primary/5 border border-primary/20 space-y-2">
          <p className="text-xs font-medium text-primary flex items-start gap-2">
            <span className="text-sm mt-0.5">ℹ️</span>
            <span>
              The bot will only post verified ads that you approve. No spam or
              promotional content.
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/add-channel-step3"
            className="button-primary block text-center w-full py-4 text-base font-semibold"
          >
            Verify Channel
          </Link>
          <Link
            to="/add-channel-step1"
            className="button-secondary block text-center w-full py-4 text-base font-semibold"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
