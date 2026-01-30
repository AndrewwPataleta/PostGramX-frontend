import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAddChannelFlow } from "@/pages/add-channel/useAddChannelFlow";
import type { ChannelListItem } from "@/types/channels";
import { useLanguage } from "@/i18n/LanguageProvider";

const AddChannelStep3 = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
      return t("common.emptyValue");
    }
    return preview.username.startsWith("@") ? preview.username : `@${preview.username}`;
  }, [preview?.username, t]);

  const isSuccess = state.verifyStatus === "success";
  const message =
    state.lastError || t("channels.add.step3.defaultError");
  const linkedChannelId = state.linkedChannelId;

  const channelState: ChannelListItem | null =
    preview && linkedChannelId
      ? {
          id: linkedChannelId,
          username: (preview.username || preview.normalizedUsername || "").replace(/^@/, ""),
          title: preview.title || t("channels.untitled"),
          status: "VERIFIED",
          telegramChatId: preview.telegramChatId ?? null,
          memberCount: preview.memberCount ?? null,
          verifiedAt: new Date().toISOString(),
          lastCheckedAt: new Date().toISOString(),
          membership: {
            role: "OWNER",
            telegramAdminStatus: "administrator",
            lastRecheckAt: new Date().toISOString(),
          },
        }
      : null;

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
              {isSuccess ? t("channels.add.step3.successTitle") : t("channels.add.step3.failedTitle")}
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
              {t("channels.add.step3.goToChannels")}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                linkedChannelId
                  ? navigate(`/channel-manage/${linkedChannelId}/listings`, {
                      state: channelState
                        ? { channel: channelState, rootBackTo: "/channels" }
                        : { rootBackTo: "/channels" },
                    })
                  : undefined
              }
              className="w-full text-sm font-semibold"
              disabled={!linkedChannelId}
            >
              {t("channels.add.step3.manageChannel")}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => navigate("/add-channel/step-2")}
              className="w-full text-sm font-semibold"
            >
              {t("channels.add.step3.retryVerification")}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/channels")}
              className="w-full text-sm font-semibold"
            >
              {t("channels.add.step3.backToChannels")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddChannelStep3;
