import React, { useState, useEffect } from "react";
import { PanicState } from "../types";

interface PanicModeProps {
  panicState: PanicState;
  onUpdatePanicState: (state: Partial<PanicState>) => void;
}

export default function PanicMode({ panicState, onUpdatePanicState }: PanicModeProps) {
  const [situationInput, setSituationInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [activeTone, setActiveTone] = useState("calm but direct");

  // Timer countdown
  useEffect(() => {
    if (!panicState.isActive || panicState.timeRemaining <= 0) return;

    const interval = setInterval(() => {
      onUpdatePanicState({ timeRemaining: panicState.timeRemaining - 1 });
    }, 1000);

    return () => clearInterval(interval);
  }, [panicState.isActive, panicState.timeRemaining]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situationInput.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: situationInput }),
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      onUpdatePanicState({
        situation: situationInput,
        steps: data.steps.map((s: any) => ({ ...s, completed: false })),
        activeDraft: data.activeDraft,
        focusPrompt: data.focusPrompt,
        timeRemaining: (data.timeToResolution || 45) * 60,
        isActive: true,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to reach digital chief-of-staff server. Simulating standard offline fallback plan.");
      // Offline fallback
      onUpdatePanicState({
        situation: situationInput,
        steps: [
          { title: "Isolate Incident", description: "Identify root cause and isolate impact immediately.", completed: false },
          { title: "Draft Stakeholder Alert", description: "Prepare communications to prevent escalation.", completed: false },
          { title: "Deploy Resolution", description: "Coordinate with tech leads to roll out targeted fix.", completed: false },
          { title: "Tidy Operations", description: "Restore full monitor telemetry streams.", completed: false }
        ],
        activeDraft: `Dear Team, \n\nWe are currently resolving a localized delay regarding: "${situationInput}". Our resolution time is estimated to be under 45 minutes. Focus blocks have been secured.\n\nBest, \nLife Saver Chief`,
        focusPrompt: "Secure your focus. Silenced notification lines. Complete Step 1 immediately.",
        timeRemaining: 45 * 60,
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefineDraft = async (tone: string) => {
    if (!panicState.activeDraft) return;
    setActiveTone(tone);
    setRefining(true);
    try {
      const res = await fetch("/api/ai/refine-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: panicState.activeDraft, tone }),
      });
      const data = await res.json();
      onUpdatePanicState({ activeDraft: data.refined });
    } catch (err) {
      console.error(err);
    } finally {
      setRefining(false);
    }
  };

  const handleStepToggle = (index: number) => {
    const updatedSteps = [...panicState.steps];
    updatedSteps[index].completed = !updatedSteps[index].completed;
    onUpdatePanicState({ steps: updatedSteps });
  };

  const handleReset = () => {
    onUpdatePanicState({
      situation: "",
      steps: [],
      activeDraft: "",
      focusPrompt: "",
      timeRemaining: 0,
      isActive: false,
    });
    setSituationInput("");
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <header className="mb-8">
        <h2 className="font-sans text-3xl font-black tracking-tight text-[#ac332a] dark:text-red-500 mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined select-none text-[32px] animate-pulse">error</span>
          Panic Mode
        </h2>
        <p className="font-sans text-sm text-slate-500 dark:text-slate-400">
          Restore operational composure during active crises.
        </p>
      </header>

      {/* Initial state: No active crisis */}
      {!panicState.isActive ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-2xl shadow-sm">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-[#ac332a] dark:text-red-500 text-[64px] mb-4 select-none animate-bounce">
              psychology_alt
            </span>
            <h3 className="font-sans text-xl font-black text-slate-900 dark:text-white">
              No Active Incidents
            </h3>
            <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
              Tell your Chief-of-Staff what is happening, and we will generate a targeted resolution roadmap immediately.
            </p>
          </div>

          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                What is the emergency?
              </label>
              <textarea
                required
                rows={4}
                value={situationInput}
                onChange={(e) => setSituationInput(e.target.value)}
                placeholder="e.g., We have a critical server outage affecting 15% of enterprise clients, and the lead dev is offline."
                className="w-full p-4 border border-slate-200 dark:border-slate-800 bg-transparent rounded-2xl font-sans text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#ac332a] transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#ac332a] hover:bg-[#ac332a]/95 text-white rounded-2xl font-sans font-black tracking-tight shadow-md hover:shadow-lg transition-all active:scale-[0.99] duration-100 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  Formulating Response Strategy...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                  Formulate Composure Plan
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Active crisis: Panic Cockpit */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Action checklist and editor */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Countdown / Status Card */}
            <div className="bg-slate-950 text-white rounded-3xl p-8 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-[-30%] right-[-10%] w-[40%] h-[120%] bg-red-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              <div>
                <span className="bg-red-500/20 text-red-400 border border-red-500/40 font-mono text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                  ACTIVE RESOLUTION ROADMAP
                </span>
                <h3 className="font-sans text-xl font-black mt-4 max-w-md truncate">
                  "{panicState.situation}"
                </h3>
                {panicState.focusPrompt && (
                  <p className="font-sans text-xs text-red-400/80 italic mt-2 leading-relaxed">
                    "{panicState.focusPrompt}"
                  </p>
                )}
              </div>

              <div className="text-center sm:text-right flex flex-col items-center sm:items-end">
                <span className="font-mono text-5xl font-black text-red-500 animate-pulse select-all tracking-tight leading-none">
                  {formatTime(panicState.timeRemaining)}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-red-400 font-bold mt-2">
                  Estimated Resolution
                </span>
              </div>
            </div>

            {/* Action Checklist */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm border-l-4 border-red-500">
              <h4 className="font-sans text-lg font-black text-slate-900 dark:text-white mb-4">
                Ordered Action Plan — AI Generated
              </h4>

              <div className="space-y-4">
                {panicState.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                      step.completed
                        ? "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={() => handleStepToggle(index)}
                      className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-[#ac332a] focus:ring-[#ac332a] cursor-pointer mt-0.5"
                    />
                    <div className="flex-1">
                      <h5
                        className={`font-sans text-sm font-bold ${
                          step.completed ? "line-through text-slate-400" : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {index + 1}. {step.title}
                      </h5>
                      <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Editor */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h4 className="font-sans text-lg font-black text-slate-900 dark:text-white leading-none">
                    Stakeholder Communication
                  </h4>
                  <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    Clear communication is the ultimate decompression tool. Refine tone on-the-fly.
                  </p>
                </div>
                {/* Tone selectors */}
                <div className="flex gap-2">
                  {["calm but direct", "urgent", "apologetic"].map((tone) => (
                    <button
                      key={tone}
                      disabled={refining}
                      onClick={() => handleRefineDraft(tone)}
                      className={`px-3 py-1.5 border rounded-full font-mono text-[10px] uppercase font-bold transition-all cursor-pointer ${
                        activeTone === tone
                          ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white"
                          : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <textarea
                  rows={6}
                  value={panicState.activeDraft}
                  onChange={(e) => onUpdatePanicState({ activeDraft: e.target.value })}
                  className="w-full p-4 border border-slate-200 dark:border-slate-800 bg-transparent rounded-2xl font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-red-500 leading-relaxed resize-none"
                ></textarea>
                {refining && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center font-mono text-xs text-[#ac332a] font-bold">
                    <span className="material-symbols-outlined text-sm animate-spin mr-2">sync</span>
                    Chief-of-Staff Refining Tone...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side support */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Crisis guidance banner */}
            <div className="bg-[#ac332a]/10 dark:bg-red-950/20 text-[#ac332a] dark:text-red-400 rounded-3xl p-6 border border-red-200/30 dark:border-red-900/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined select-none animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
                  headset_mic
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider">CRISIS COMPOSURE TIP</span>
              </div>
              <p className="font-sans text-xs leading-relaxed font-semibold">
                Slow down. When everything feels urgent, nothing is. Focus strictly on executing the first action plan block. Stakeholders have been alerted. You have clear headspace.
              </p>
            </div>

            {/* Reset Cockpit option */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
              <h4 className="font-sans text-sm font-bold text-slate-900 dark:text-white mb-2">
                Resolve Incident
              </h4>
              <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                If the current high-stakes situation is fully mitigated, reset the panic cockpit to clean state.
              </p>
              <button
                onClick={handleReset}
                className="w-full py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-sans font-bold text-xs hover:shadow transition-all active:scale-95 cursor-pointer text-center"
              >
                Clear Cockpit / Mitigated
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
