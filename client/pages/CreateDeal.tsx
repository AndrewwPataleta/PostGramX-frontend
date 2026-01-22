import { ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function CreateDeal() {
  const [searchParams] = useSearchParams();
  const channelId = searchParams.get("channel");

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-glass border-b border-border/50 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to="/deals">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">Create Deal</h1>
            <p className="text-xs text-muted-foreground">Campaign details</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 space-y-4">
        <div className="glass p-8 rounded-lg text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎨</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Create Deal Screen
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            This page will include:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 text-left bg-secondary/30 p-4 rounded-lg mb-6">
            <li>• Campaign brief text input</li>
            <li>• Date and time selector</li>
            <li>• Price summary</li>
            <li>• Continue button</li>
          </ul>
          {channelId && (
            <p className="text-xs text-muted-foreground mb-4">
              Channel ID: {channelId}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Continue interacting with the chat to generate this page content.
          </p>
        </div>

        <Link
          to="/deals"
          className="button-primary mt-2 text-center py-4 text-base font-semibold"
        >
          Back to Deals
        </Link>
      </div>
    </div>
  );
}
