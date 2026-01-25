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
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-500/80 via-blue-500/80 to-indigo-600/80 blur-2xl opacity-90 animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-sky-200/40 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-6 rounded-full border border-cyan-200/30 animate-[spin_6s_linear_infinite_reverse]" />
          <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
            <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
          </div>
          <div className="absolute inset-0 animate-[spin_12s_linear_infinite_reverse]">
            <div className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-indigo-200 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
          </div>
          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 shadow-[0_0_30px_rgba(56,189,248,0.6)]">
            <span className="text-xl font-semibold tracking-[0.2em] text-white">X</span>
          </div>
        </div>

        <div key={step.title} className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
          <p className="text-lg font-semibold tracking-wide">{step.title}</p>
          <p className="text-sm text-white/70">{step.subtitle}</p>
        </div>

        <div className="text-xs uppercase tracking-[0.3em] text-white/50">
          Entering
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
