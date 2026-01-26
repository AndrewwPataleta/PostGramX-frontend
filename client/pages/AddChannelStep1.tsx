import { useState } from "react";
import FlowLayout from "@/components/add-channel/FlowLayout";

export default function AddChannelStep1() {
  const [username, setUsername] = useState("");

  const handleContinue = () => {
    if (username.trim()) {
      // Navigate to step 2
      window.location.href = "/add-channel-step2";
    }
  };

  return (
    <FlowLayout
      title="Connect Channel"
      footerMode="sticky"
      footerPaddingClassName="pb-[calc(24px+var(--tg-content-safe-area-inset-bottom))]"
      footer={
        <button
          onClick={handleContinue}
          disabled={!username.trim()}
          className="button-primary text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      }
    >
      <div className="glass p-4 space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Channel username or link
        </label>
        <input
          type="text"
          placeholder="@mychannel or https://t.me/mychannel"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Public channels only. You must be an admin of the channel.
        </p>
      </div>
    </FlowLayout>
  );
}
