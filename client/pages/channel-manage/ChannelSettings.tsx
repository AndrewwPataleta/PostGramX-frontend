const ChannelSettings = () => {
  return (
    <div className="space-y-2">
      <button className="w-full glass p-4 rounded-lg flex items-center justify-between hover:bg-card/60 transition-colors text-left">
        <span className="text-foreground font-medium">Re-check admin rights</span>
        <span className="text-muted-foreground">→</span>
      </button>

      <button className="w-full glass p-4 rounded-lg flex items-center justify-between hover:bg-card/60 transition-colors text-left">
        <span className="text-foreground font-medium">Manage channel managers</span>
        <span className="text-muted-foreground">→</span>
      </button>

      <button className="w-full glass p-4 rounded-lg flex items-center justify-between hover:bg-card/60 transition-colors text-left">
        <span className="text-foreground font-medium">Notification preferences</span>
        <span className="text-muted-foreground">→</span>
      </button>

      <button className="w-full glass p-4 rounded-lg flex items-center justify-between hover:bg-destructive/20 transition-colors text-left mt-4">
        <span className="text-destructive font-medium">Remove channel</span>
        <span className="text-destructive">→</span>
      </button>
    </div>
  );
};

export default ChannelSettings;
