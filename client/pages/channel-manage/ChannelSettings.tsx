import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { updateChannelDisabledStatus } from "@/api/features/channelsApi";
import type { ChannelManageContext } from "@/pages/channel-manage/ChannelManageLayout";

const ChannelSettings = () => {
  const { channel } = useOutletContext<ChannelManageContext>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleDisabled = async () => {
    const nextValue = !isDisabled;
    setIsUpdating(true);
    try {
      await updateChannelDisabledStatus({ id: channel.id, disabled: nextValue });
      setIsDisabled(nextValue);
      toast.success(nextValue ? "Канал приостановлен." : "Канал снова активен.");
    } catch (error) {
      toast.error("Не удалось обновить статус канала.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-2">
      <button className="w-full glass p-4 rounded-lg flex items-center justify-between hover:bg-card/60 transition-colors text-left">
        <span className="text-foreground font-medium">Manage channel managers</span>
        <span className="text-muted-foreground">→</span>
      </button>
      <div className="glass rounded-lg p-4 space-y-2">
        <button
          type="button"
          onClick={handleToggleDisabled}
          disabled={isUpdating}
          className="w-full flex items-center justify-between text-left hover:text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="text-foreground font-medium">
            {isDisabled ? "Возобновить канал" : "Приостановить канал"}
          </span>
          <span className="text-muted-foreground">→</span>
        </button>
        <p className="text-xs text-muted-foreground">
          С помощью неё рекламодатели вас не найдут.
        </p>
      </div>

      <button className="w-full glass p-4 rounded-lg flex items-center justify-between hover:bg-destructive/20 transition-colors text-left mt-4">
        <span className="text-destructive font-medium">Remove channel</span>
        <span className="text-destructive">→</span>
      </button>
    </div>
  );
};

export default ChannelSettings;
