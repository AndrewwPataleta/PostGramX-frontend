import { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { linkChannel, verifyChannel } from "@/lib/api/endpoints/channels";
import { getChannelErrorMessage } from "@/pages/add-channel/errorMapping";
import { useAddChannelFlow } from "@/pages/add-channel/useAddChannelFlow";
import type { VerifyChannelResponse } from "@/types/channels";

const formatMetric = (value?: number | null) => {
  if (value == null) {
    return null;
  }
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
};

const isVerifiedResponse = (response: VerifyChannelResponse) => {
  const status = String(response.status ?? "").toUpperCase();
  return ["VERIFIED", "SUCCESS", "OK"].includes(status);
};

const AddChannelStep2 = () => {
  const navigate = useNavigate();
  const {
    state,
    setLinkedChannelId,
    setLinkStatus,
    setVerifyStatus,
    setLastError,
  } = useAddChannelFlow();

  const preview = state.preview;

  useEffect(() => {
    if (!preview) {
      navigate("/add-channel/step-1", { replace: true });
    }
  }, [navigate, preview]);

  const displayUsername = useMemo(() => {
    if (!preview?.username) {
      return "—";
    }
    return preview.username.startsWith("@") ? preview.username : `@${preview.username}`;
  }, [preview?.username]);

  const linkMutation = useMutation({
    mutationFn: (username: string) => linkChannel({ username }),
    onMutate: () => {
      setLinkStatus("loading");
      setLastError(null);
    },
    onSuccess: (response) => {
      const linkedChannelId = response.channelId ?? response.id;
      if (!linkedChannelId) {
        const message = "Channel link response is missing an id.";
        setLinkStatus("error");
        setLastError(message);
        toast.error(message);
        return;
      }
      setLinkStatus("success");
      setLinkedChannelId(linkedChannelId);
      setVerifyStatus("idle");
      toast.success("Channel linked");
      verifyMutation.mutate(linkedChannelId);
    },
    onError: (error) => {
      const message = getChannelErrorMessage(error);
      setLinkStatus("error");
      setLastError(message);
      toast.error(message);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => verifyChannel({ id }),
    onMutate: () => {
      setVerifyStatus("loading");
      setLastError(null);
    },
    onSuccess: (response) => {
      if (isVerifiedResponse(response)) {
        setVerifyStatus("success");
        setLastError(null);
        navigate("/add-channel/step-3");
        return;
      }
      const message =
        typeof response.error === "string"
          ? response.error
          : response.error?.message || "Verification failed. Please try again.";
      setVerifyStatus("error");
      setLastError(message);
      toast.error(message);
    },
    onError: (error) => {
      const message = getChannelErrorMessage(error);
      setVerifyStatus("error");
      setLastError(message);
      toast.error(message);
    },
  });

  const handlePrimaryAction = () => {
    if (!preview) {
      return;
    }
    const username = (preview.normalizedUsername || preview.username || "").replace(/^@/, "");
    if (!state.linkedChannelId) {
      if (!username) {
        toast.error("Missing channel username.");
        return;
      }
      linkMutation.mutate(username);
      return;
    }
    verifyMutation.mutate(state.linkedChannelId);
  };

  const isLoading = linkMutation.isPending || verifyMutation.isPending;
  const isLinked = Boolean(state.linkedChannelId);
  const primaryLabel = isLinked ? "Verify channel" : "Connect channel";

  const memberCount = formatMetric(preview?.memberCount);
  const avgViews = formatMetric(preview?.avgViews);

  if (!preview) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Card className="border-border/60 bg-card/80 shadow-sm">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {preview.photoUrl || preview.avatarUrl ? (
                <AvatarImage src={preview.photoUrl ?? preview.avatarUrl ?? ""} />
              ) : null}
              <AvatarFallback className="bg-secondary text-sm font-semibold text-foreground">
                {(preview.title || "C").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {preview.title}
              </p>
              <p className="text-xs text-muted-foreground">{displayUsername}</p>
            </div>
            <Badge variant="secondary" className="text-[10px] uppercase">
              {isLinked ? "Linked" : "Not connected yet"}
            </Badge>
          </div>
          {(memberCount || avgViews) && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {memberCount ? <span>{memberCount} subscribers</span> : null}
              {avgViews ? <span>{avgViews} avg views</span> : null}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80 shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Grant bot access</p>
            <p className="text-xs text-muted-foreground">
              We will verify admin rights before money operations.
            </p>
          </div>
          <ol className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-foreground">1.</span>
              Open channel settings
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">2.</span>
              Add @PostGramXBot as admin
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">3.</span>
              Enable "Post messages" permission
            </li>
          </ol>
        </CardContent>
      </Card>

      <div className="mt-auto flex flex-col gap-3">
        <Button
          onClick={handlePrimaryAction}
          disabled={isLoading}
          className="w-full text-sm font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isLinked ? "Verifying" : "Connecting"}
            </>
          ) : (
            primaryLabel
          )}
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate("/add-channel/step-1")}
          disabled={isLoading}
          className="w-full text-sm font-semibold"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default AddChannelStep2;
