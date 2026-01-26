import { X } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

const AddChannelLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-sm font-semibold text-foreground">Add channel</h1>
        <button
          type="button"
          onClick={() => navigate("/channels", { replace: true })}
          className="inline-flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          aria-label="Close add channel flow"
        >
          <X size={18} />
        </button>
      </div>
      <div className="pt-2">
        <Outlet />
      </div>
    </div>
  );
};

export default AddChannelLayout;
