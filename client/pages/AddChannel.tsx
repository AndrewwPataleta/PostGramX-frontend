import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  UserCog,
  Users,
  XCircle,
} from "lucide-react";

const channelAdmins = [
  { name: "Sofia Marin", username: "@sofia_marin", active: true },
  { name: "Anton Lee", username: "@anton_lee", active: true },
  { name: "Marina K", username: "@marina_k", active: false },
];

export default function AddChannel() {
  const steps = useMemo(
    () => [
      "Connect Channel Input Screen",
      "Channel Preview Screen",
      "Grant Bot Access Instructions Screen",
      "Verifying State Screen",
      "Verification Success Screen",
      "Verification Failed Screen",
      "Optional Manager Access Screen",
    ],
    [],
  );
  const [activeStep, setActiveStep] = useState(0);

  const goNext = () => {
    setActiveStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goPrev = () => {
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const stepLabel = steps[activeStep];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="w-full max-w-sm rounded-[32px] border border-white/10 bg-slate-900/80 shadow-2xl">
            <div className="flex min-h-[720px] flex-col px-5 pb-6 pt-6 safe-area-top safe-area-bottom">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {activeStep + 1} · {stepLabel}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Step {activeStep + 1} of {steps.length}
                </p>
              </div>

              {activeStep === 0 && (
                <>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Connect your channel</h2>
                    <p className="text-sm text-slate-400">
                      Verify your Telegram channel to start selling ad placements
                    </p>
                  </div>

                  <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-sm">
                    <label className="text-sm font-medium text-slate-200">
                      Channel username or link
                    </label>
                    <input
                      type="text"
                      placeholder="@mychannel or https://t.me/mychannel"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                    />
                    <p className="text-xs text-slate-400">
                      Public channels only. You must be an admin of the channel.
                    </p>
                  </div>

                  <button className="button-primary mt-6 py-4 text-base font-semibold">
                    Continue
                  </button>
                  <button className="mt-3 text-sm font-medium text-sky-400">
                    What permissions are required?
                  </button>
                </>
              )}

              {activeStep === 1 && (
                <>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Confirm channel</h2>
                    <p className="text-sm text-slate-400">
                      Make sure the detected channel is correct
                    </p>
                  </div>

                  <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-lg">
                        📣
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">FlowgramX Updates</p>
                        <p className="text-xs text-slate-400">@flowgramx_updates</p>
                      </div>
                      <Loader2 className="h-5 w-5 animate-spin text-sky-400" />
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        Public Channel
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        84.2K subscribers
                      </span>
                    </div>
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                      You must be an admin to continue
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Stats preview</p>
                    <div className="mt-3 grid gap-3">
                      <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
                        <span className="text-slate-400">Subscribers</span>
                        <span className="font-semibold text-slate-100">84,200</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
                        <span className="text-slate-400">Visibility</span>
                        <span className="font-semibold text-slate-100">Public Channel</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto space-y-3 pt-6">
                    <button className="button-primary py-4 text-base font-semibold">
                      Continue verification
                    </button>
                    <button className="button-secondary py-4 text-base font-semibold">
                      Change channel
                    </button>
                  </div>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Grant bot access</h2>
                    <p className="text-sm text-slate-400">
                      Required for stats verification and auto-posting
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-sm">
                    <div className="flex items-center justify-center gap-3 text-sky-400">
                      <UserCog className="h-7 w-7" />
                      <ArrowRight className="h-4 w-4" />
                      <Bot className="h-7 w-7" />
                    </div>
                    <div className="mt-5 space-y-4 text-sm">
                      <div className="flex gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-xs font-semibold text-sky-200">
                          1
                        </span>
                        <div>
                          <p className="font-medium text-slate-100">Open your channel settings</p>
                          <p className="text-xs text-slate-400">Go to Administrators</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-xs font-semibold text-sky-200">
                          2
                        </span>
                        <div>
                          <p className="font-medium text-slate-100">Add @FlowgramXBot</p>
                          <p className="text-xs text-slate-400">Invite the bot as admin</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-xs font-semibold text-sky-200">
                          3
                        </span>
                        <div>
                          <p className="font-medium text-slate-100">Enable permissions</p>
                          <p className="text-xs text-slate-400">
                            Post messages, Edit messages (optional but recommended)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 text-sm">
                    <p className="font-semibold text-slate-100">Why is this needed?</p>
                    <p className="mt-2 text-xs text-slate-300">
                      We use this access to verify channel stats and automatically publish approved
                      ads. We never edit or delete your content.
                    </p>
                  </div>

                  <div className="mt-auto space-y-3 pt-6">
                    <button className="button-primary py-4 text-base font-semibold">
                      I added the bot
                    </button>
                    <button className="button-secondary py-4 text-base font-semibold">
                      Open Telegram Settings
                    </button>
                  </div>
                </>
              )}

              {activeStep === 3 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
                  <div>
                    <h2 className="text-xl font-semibold">Verifying channel...</h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Checking admin permissions and channel data
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      This usually takes a few seconds
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                      <Check className="h-8 w-8 text-emerald-300" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Channel connected</h2>
                      <p className="text-sm text-slate-400">Ready for monetization</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-lg">
                        🚀
                      </div>
                      <div>
                        <p className="text-sm font-semibold">FlowgramX Updates</p>
                        <p className="text-xs text-slate-400">@flowgramx_updates</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm">
                    <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                      <span className="text-slate-400">Subscribers</span>
                      <span className="font-semibold text-slate-100">84,200</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                      <span className="text-slate-400">Avg views</span>
                      <span className="font-semibold text-slate-100">31,500</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                      <span className="text-slate-400">Verification</span>
                      <span className="flex items-center gap-1 text-emerald-300">
                        <ShieldCheck className="h-4 w-4" /> Verified via Telegram
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-200">
                      Bot access verified
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-slate-400">
                    Admin rights are re-checked automatically before payouts and posting.
                  </p>

                  <div className="mt-auto space-y-3 pt-6">
                    <button className="button-primary py-4 text-base font-semibold">
                      Create listing
                    </button>
                    <button className="button-secondary py-4 text-base font-semibold">
                      View channel
                    </button>
                  </div>
                </>
              )}

              {activeStep === 5 && (
                <>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20">
                      <XCircle className="h-8 w-8 text-rose-300" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Verification failed</h2>
                      <p className="text-sm text-slate-400">
                        We couldn't confirm channel ownership
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm">
                    <p className="font-semibold text-rose-200">Possible issues</p>
                    <ul className="space-y-1 text-xs text-rose-100">
                      <li>• Bot is not an admin</li>
                      <li>• You are not an admin of this channel</li>
                      <li>• Missing post permission</li>
                    </ul>
                  </div>

                  <div className="mt-auto space-y-3 pt-6">
                    <button className="button-primary py-4 text-base font-semibold">
                      Retry verification
                    </button>
                    <button className="button-secondary py-4 text-base font-semibold">
                      View instructions
                    </button>
                  </div>
                </>
              )}

              {activeStep === 6 && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sky-300">
                      <Users className="h-5 w-5" />
                      <p className="text-sm font-semibold">Add managers (optional)</p>
                    </div>
                    <p className="text-sm text-slate-400">
                      Allow PR managers to manage listings and deals
                    </p>
                  </div>

                  <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-sm">
                    {channelAdmins.map((admin) => (
                      <div
                        key={admin.username}
                        className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-100">{admin.name}</p>
                          <p className="text-xs text-slate-400">{admin.username}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            {admin.active ? "Added" : "Invite"}
                          </span>
                          <button
                            className={`flex h-6 w-10 items-center rounded-full border border-white/10 p-0.5 transition ${
                              admin.active ? "bg-sky-500/60" : "bg-white/10"
                            }`}
                          >
                            <span
                              className={`h-5 w-5 rounded-full bg-white transition ${
                                admin.active ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-xs text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Admin rights are re-checked automatically before payouts and posting.
                  </div>

                  <div className="mt-auto space-y-3 pt-6">
                    <button className="button-primary py-4 text-base font-semibold">
                      Continue
                    </button>
                    <button className="button-secondary py-4 text-base font-semibold">Skip</button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex w-full max-w-sm items-center justify-between text-sm">
            <button
              className="button-secondary whitespace-nowrap px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              disabled={activeStep === 0}
              onClick={goPrev}
            >
              Назад
            </button>
            <button
              className="button-primary whitespace-nowrap px-6 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              disabled={activeStep === steps.length - 1}
              onClick={goNext}
            >
              Далее
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
