import React, { useState } from "react";

interface AddTaskProps {
  onAddTask: (task: {
    title: string;
    deadline: string;
    effort: string;
    criticality: number;
    notes: string;
  }) => void;
  onCancel: () => void;
}

export default function AddTask({ onAddTask, onCancel }: AddTaskProps) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [effort, setEffort] = useState("15m");
  const [criticality, setCriticality] = useState(5);
  const [notes, setNotes] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      deadline: deadline || new Date().toISOString(),
      effort,
      criticality,
      notes,
    });
  };

  const handleVoiceToggle = () => {
    setIsListening(true);
    setTimeout(() => {
      setTitle("Finalize quarterly strategy presentation");
      setIsListening(false);
    }, 1800);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header Navigation */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">arrow_back</span>
          </button>
          <h2 className="font-sans text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Add New Task
          </h2>
        </div>
        <div className="hidden md:flex gap-2">
          <span className="font-mono text-[10px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-3 py-1 rounded-full uppercase tracking-wider font-bold border border-red-200/40 dark:border-red-900/40">
            DUE SOON
          </span>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Form Card */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800/80 border-l-4 border-[#ac332a] dark:border-red-500 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Voice input */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Task Identification
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-14 pl-5 pr-16 border border-slate-200 dark:border-slate-800 bg-transparent rounded-2xl font-sans text-lg font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  disabled={isListening}
                  className={`absolute right-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                    isListening
                      ? "bg-[#ac332a] text-white animate-pulse"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span className="material-symbols-outlined select-none text-[20px]">
                    mic
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deadline Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Target Deadline
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full h-12 px-4 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl font-sans text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                />
              </div>

              {/* Effort Estimate Chips */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Effort Estimate
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["15m", "1h", "4h", "8h+"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setEffort(item)}
                      className={`px-4 py-2 border rounded-full font-mono text-xs transition-all duration-150 cursor-pointer ${
                        effort === item
                          ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white font-bold"
                          : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Importance Slider */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Mission Criticality
                </label>
                <span
                  className={`font-mono text-xl font-black ${
                    criticality >= 8
                      ? "text-[#ac332a] dark:text-red-400 scale-110 transition-transform"
                      : "text-slate-950 dark:text-white"
                  }`}
                >
                  {criticality}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={criticality}
                onChange={(e) => setCriticality(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-slate-950 dark:accent-white focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold">
                <span>OPTIONAL</span>
                <span>URGENT</span>
              </div>
            </div>

            {/* Operational Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Operational Notes
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specific instructions or sub-tasks..."
                className="w-full p-4 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl font-sans text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors resize-none"
              ></textarea>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 h-14 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-850 dark:hover:bg-slate-100 rounded-xl font-sans font-black tracking-tight shadow-md hover:shadow-lg transition-all active:scale-95 duration-100 cursor-pointer"
              >
                Assign Mission
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-8 h-14 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-sans font-semibold transition-all active:scale-95 duration-100 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Contextual Side Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Chief's Tip */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80">
            <h3 className="font-sans text-lg font-black text-slate-900 dark:text-white mb-2">
              Chief's Tip
            </h3>
            <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Break large missions into tasks under 4 hours to maintain momentum and ensure clear progress tracking.
            </p>
            <div className="flex items-center gap-2 text-[#ac332a] dark:text-red-400 font-bold">
              <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                lightbulb
              </span>
              <span className="font-mono text-xs uppercase tracking-wider">
                PRIORITIZE DEPTH
              </span>
            </div>
          </div>

          {/* Voice status modal */}
          {isListening && (
            <div className="bg-[#ac332a] text-white rounded-3xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-ping">
                  <span className="material-symbols-outlined text-white">mic</span>
                </div>
                <div>
                  <p className="font-sans font-bold text-sm">Listening...</p>
                  <p className="font-sans text-xs opacity-80 mt-0.5">Transcribing voice-to-text</p>
                </div>
              </div>
            </div>
          )}

          {/* Asset Image */}
          <div className="rounded-3xl overflow-hidden shadow-sm aspect-square relative group">
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors z-10"></div>
            <div className="absolute bottom-6 left-6 z-20 text-white">
              <p className="font-sans text-xl font-black mb-1">Stay Focused.</p>
              <p className="font-mono text-xs uppercase tracking-wider opacity-80">
                Mission clarity is the path to peace.
              </p>
            </div>
            <div
              className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDYkktwsLN3tSJ7lrB0FF0WeCoJjaPbOptLCWAEom7WxLyYOI4eetI2W7bH8MkhuiNFEjaDZfuHBwm8pjYthgtF1eDPB4XX2aMUOmXIW1OGSe5oyYagEJk7AzKmPPYfe0Z21RQsyTTaeriCW6ZOorATNXJvEy5ttJ3ZyPreIeIf0qP7Y2U0RPKFXGFm70wl6Bl16RgiDRmCD4GodBf3Qew1QxEdn4NQvuW29IbeLNNMGNBRzUTaaGqtcvXm91hfJocrU6owgorqrCo9')`,
              }}
              referrerPolicy="no-referrer"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
