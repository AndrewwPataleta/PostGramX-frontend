import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAddChannelFlow } from "@/pages/add-channel/useAddChannelFlow";

const AddChannelStep3 = () => {
  const navigate = useNavigate();
  const { state } = useAddChannelFlow();
  const preview = state.preview;

  useEffect(() => {
    if (!preview) {
      navigate("/add-channel/step-1", { replace: true });
      return;
    }
    if (state.verifyStatus === "idle") {
      navigate("/add-channel/step-2", { replace: true });
    }
  }, [navigate, preview, state.verifyStatus]);

  const displayUsername = useMemo(() => {
    if (!preview?.username) {
      return "—";
    }
    return preview.username.startsWith("@") ? preview.username : `@${preview.username}`;
  }, [preview?.username]);

  const isSuccess = state.verifyStatus === "success";
  const message =
    state.lastError || "We could not verify your admin rights. Please try again.";

  if (!preview) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <Card className="border-border/60 bg-card/80 shadow-sm">
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              isSuccess
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-destructive/15 text-destructive"
            }`}
          >
            {isSuccess ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {isSuccess ? "Channel verified" : "Verification failed"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {preview.title} · {displayUsername}
            </p>
          </div>
          {!isSuccess ? (
            <p className="text-xs text-muted-foreground">{message}</p>
          ) : null}
        </CardContent>
      </Card>

      <div className="mt-auto flex flex-col gap-3">
        {isSuccess ? (
          <>
            <Button
              onClick={() => navigate("/channels")}
              className="w-full text-sm font-semibold"
            >
              Go to My Channels
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/channel-manage/${state.linkedChannelId}/overview`)
              }
              className="w-full text-sm font-semibold"
              disabled={!state.linkedChannelId}
            >
              Manage channel
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => navigate("/add-channel/step-2")}
              className="w-full text-sm font-semibold"
            >
              Retry verification
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/channels")}
              className="w-full text-sm font-semibold"
            >
              Back to channels
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddChannelStep3;
