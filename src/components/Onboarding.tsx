import React, { useState } from "react";
import { UserProfile } from "../types";

interface OnboardingProps {
  onComplete: (name: string, preference: 'morning' | 'night', calendarConnected: boolean) => void;
  initialEmail: string;
}

export default function Onboarding({ onComplete, initialEmail }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [preference, setPreference] = useState<'morning' | 'night' | "">("");

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 3) {
      onComplete(name, preference === "night" ? "night" : "morning", calendarConnected);
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 select-none transition-colors duration-300">
      {/* Top Left Branding */}
      <div className="fixed top-12 left-12 hidden md:block">
        <span className="font-sans text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Life Saver
        </span>
        <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mt-1">
          Digital Chief-of-Staff
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className={`w-12 h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? "bg-slate-900 dark:bg-white" : "bg-slate-200 dark:bg-slate-800"}`}></div>
        <div className={`w-12 h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? "bg-slate-900 dark:bg-white" : "bg-slate-200 dark:bg-slate-800"}`}></div>
        <div className={`w-12 h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? "bg-slate-900 dark:bg-white" : "bg-slate-200 dark:bg-slate-800"}`}></div>
      </div>

      <main className="w-full max-w-[600px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-10 shadow-xl z-10 transition-all duration-300">
        
        {/* Step 1: Identity */}
        {step === 1 && (
          <section className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <span className="font-mono text-xs text-[#ac332a] font-bold mb-4 bg-red-50 dark:bg-red-950/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Phase 01 — Identity
            </span>
            <h1 className="font-sans text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-none tracking-tight">
              What should I call you?
            </h1>
            <div className="w-full relative group my-8">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-white text-center py-4 font-sans text-2xl md:text-3xl placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none transition-all duration-300 text-slate-900 dark:text-white"
              />
            </div>
            <p className="font-sans text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              I'll use this to personalize your dashboard and prioritize your high-stakes tasks.
            </p>
          </section>
        )}

        {/* Step 2: Ecosystem */}
        {step === 2 && (
          <section className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <span className="font-mono text-xs text-[#ac332a] font-bold mb-4 bg-red-50 dark:bg-red-950/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Phase 02 — Ecosystem
            </span>
            <h1 className="font-sans text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-none tracking-tight">
              Sync your world.
            </h1>
            <p className="font-sans text-base text-slate-500 dark:text-slate-400 mb-8 max-w-md">
              To manage your deadlines effectively, I need to see the big picture. Let's link your schedule.
            </p>
            
            <button
              type="button"
              onClick={() => setCalendarConnected(!calendarConnected)}
              className={`flex items-center gap-4 border px-8 py-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer ${
                calendarConnected 
                  ? "bg-emerald-50 dark:bg-emerald-950/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              }`}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm6Hh9SmRXLmP9n5zmXkdwBOEE3PgcAHx7afNYzLoxw25Ze6H1bBTrEeVC1134OqHqPCB017FLqjStWaOUHFP0V-QjL_PZEh9x4NxyewnzsJFXr86llUs77ZAlSroSslFa9xIgTdSIuRxwBoaR5-Jq757WFV_ZRfc2TWLJ-v1OB5znZ_1bhj3lBar-Io-YF86uR2amwcFTPA1zVobwRxtbSTFI22-2XfnUC4hRAHejn8HCgrsNm1x-kJ5cEkjzC5tbEjsgVvdVRz7y"
                alt="Google Calendar"
                className="w-8 h-8 rounded-lg"
                referrerPolicy="no-referrer"
              />
              <span className="font-sans text-lg font-bold">
                {calendarConnected ? "Google Calendar Connected" : "Connect Google Calendar"}
              </span>
            </button>
            
            <div className="mt-8 flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span className="font-mono text-xs uppercase tracking-wider">End-to-end encrypted integration</span>
            </div>
          </section>
        )}

        {/* Step 3: Flow */}
        {step === 3 && (
          <section className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <span className="font-mono text-xs text-[#ac332a] font-bold mb-4 bg-red-50 dark:bg-red-950/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Phase 03 — Flow
            </span>
            <h1 className="font-sans text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-none tracking-tight">
              When are you most productive?
            </h1>
            <p className="font-sans text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
              We'll block your deepest work sessions when your energy spikes naturally.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <label className="cursor-pointer group">
                <input
                  type="radio"
                  name="preference"
                  value="morning"
                  checked={preference === "morning"}
                  onChange={() => setPreference("morning")}
                  className="sr-only"
                />
                <div className={`p-6 border-2 rounded-2xl flex flex-col items-center gap-4 transition-all duration-300 group-hover:scale-[1.01] ${
                  preference === "morning"
                    ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 shadow-md"
                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                }`}>
                  <span className="material-symbols-outlined text-[48px] text-amber-500 group-hover:scale-110 transition-transform select-none">
                    light_mode
                  </span>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-slate-900 dark:text-white">Morning Lark</h3>
                    <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-1">Focus deep work before noon</p>
                  </div>
                </div>
              </label>

              <label className="cursor-pointer group">
                <input
                  type="radio"
                  name="preference"
                  value="night"
                  checked={preference === "night"}
                  onChange={() => setPreference("night")}
                  className="sr-only"
                />
                <div className={`p-6 border-2 rounded-2xl flex flex-col items-center gap-4 transition-all duration-300 group-hover:scale-[1.01] ${
                  preference === "night"
                    ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 shadow-md"
                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                }`}>
                  <span className="material-symbols-outlined text-[48px] text-violet-500 group-hover:scale-110 transition-transform select-none">
                    dark_mode
                  </span>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-slate-900 dark:text-white">Night Owl</h3>
                    <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-1">Prime output after sundown</p>
                  </div>
                </div>
              </label>
            </div>
          </section>
        )}

        {/* Navigation Controls */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl font-sans font-semibold text-sm transition-all"
            >
              Go Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step === 1 && !name.trim()}
            className={`px-12 py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-sans font-bold shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all min-w-[140px] text-center ${
              step === 1 && !name.trim() ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {step === 3 ? "Complete Setup" : "Continue"}
          </button>
        </div>
      </main>

      {/* Atmospheric backgrounds */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ac332a]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#2b9b92]/5 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}
