import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function DealDetails() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-glass border-b border-border/50 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to="/deals">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">Deal Details</h1>
            <p className="text-xs text-muted-foreground">Campaign progress</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 space-y-4">
        <div className="glass p-8 rounded-lg text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Deal Details Screen
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            This page will include:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 text-left bg-secondary/30 p-4 rounded-lg mb-6">
            <li>• Deal header</li>
            <li>• Timeline with steps (Accepted, Payment, Creative, Scheduled, Posted, Released)</li>
            <li>• Dynamic action buttons at bottom</li>
            <li>• Status updates</li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Continue interacting with the chat to generate this page content.
          </p>
        </div>

        <button className="button-primary mt-2 text-center py-4 text-base font-semibold">
          Next Step
        </button>
      </div>
    </div>
  );
}
