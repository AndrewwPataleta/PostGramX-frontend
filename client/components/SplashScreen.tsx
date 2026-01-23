import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Loading your data",
    subtitle: "Syncing your profile and preferences",
  },
  {
    title: "Initializing visuals",
    subtitle: "Preparing the interface for launch",
  },
  {
    title: "Starting core modules",
    subtitle: "Final checks before takeoff",
  },
];

const STEP_DURATION_MS = 1500;

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, STEP_DURATION_MS);

    const timeoutId = window.setTimeout(() => {
      onComplete();
    }, steps.length * STEP_DURATION_MS);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [onComplete]);

  const step = steps[activeStep];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background text-white">
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-700 via-black to-slate-900 blur-2xl opacity-80 animate-pulse" />
          <div className="absolute inset-4 rounded-full border border-slate-500/40 animate-spin" />
          <div className="absolute inset-10 rounded-full bg-black shadow-[0_0_30px_rgba(0,0,0,0.9)]" />
          <div className="absolute inset-0 rounded-full border border-slate-400/20 animate-[spin_6s_linear_infinite]" />
          <div className="absolute -inset-6 rounded-full border border-slate-600/10 animate-[spin_10s_linear_infinite_reverse]" />
        </div>

        <div key={step.title} className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
          <p className="text-lg font-semibold tracking-wide">{step.title}</p>
          <p className="text-sm text-white/70">{step.subtitle}</p>
        </div>

        <div className="h-1 w-52 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-[shimmer_2s_linear_infinite]" />
        </div>

        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
          <span className="h-2 w-2 rounded-full bg-white/70 animate-pulse" />
          <span>Entering</span>
          <span className="h-2 w-2 rounded-full bg-white/70 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
