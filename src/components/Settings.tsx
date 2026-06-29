import React from "react";
import { UserProfile } from "../types";

interface SettingsProps {
  profile: UserProfile;
  onUpdatePreference: (preference: 'morning' | 'night') => void;
  onUpdateCalendar: (connected: boolean) => void;
  onExportData: () => void;
  onPurgeData: () => void;
}

export default function Settings({
  profile,
  onUpdatePreference,
  onUpdateCalendar,
  onExportData,
  onPurgeData,
}: SettingsProps) {
  return (
    <div className="animate-in fade-in duration-300 max-w-3xl">
      <header className="mb-8">
        <h2 className="font-sans text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
          Settings / Preferences
        </h2>
        <p className="font-sans text-sm text-slate-500 dark:text-slate-400">
          Tailor your digital chief-of-staff experience and data sovereignty.
        </p>
      </header>

      <div className="space-y-6">
        {/* Calendar Sync Control */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <h3 className="font-sans text-lg font-black text-slate-900 dark:text-white mb-2">
            Ecosystem Sync
          </h3>
          <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mb-6">
            Link external accounts to align your operational matrix.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-4">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm6Hh9SmRXLmP9n5zmXkdwBOEE3PgcAHx7afNYzLoxw25Ze6H1bBTrEeVC1134OqHqPCB017FLqjStWaOUHFP0V-QjL_PZEh9x4NxyewnzsJFXr86llUs77ZAlSroSslFa9xIgTdSIuRxwBoaR5-Jq757WFV_ZRfc2TWLJ-v1OB5znZ_1bhj3lBar-Io-YF86uR2amwcFTPA1zVobwRxtbSTFI22-2XfnUC4hRAHejn8HCgrsNm1x-kJ5cEkjzC5tbEjsgVvdVRz7y"
                alt="Google Calendar"
                className="w-10 h-10 rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900 dark:text-white leading-none">
                  Google Calendar
                </h4>
                <p className="font-sans text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                  {profile.calendarConnected ? "Synchronized on default calendar" : "Offline / Unsynchronized"}
                </p>
              </div>
            </div>

            <button
              onClick={() => onUpdateCalendar(!profile.calendarConnected)}
              className={`px-5 py-2.5 rounded-xl font-sans font-bold text-xs transition-all active:scale-95 duration-100 cursor-pointer ${
                profile.calendarConnected
                  ? "border border-red-200 text-[#ac332a] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                  : "bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow"
              }`}
            >
              {profile.calendarConnected ? "Disconnect Sync" : "Sync Calendar"}
            </button>
          </div>
        </div>

        {/* Productivity Slot preference */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <h3 className="font-sans text-lg font-black text-slate-900 dark:text-white mb-2">
            Peak Energy Alignment
          </h3>
          <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mb-6">
            Configure the default scheduling envelope for AI Focus blocks.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onUpdatePreference("morning")}
              className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all cursor-pointer ${
                profile.preference === "morning"
                  ? "border-slate-950 dark:border-white bg-slate-50 dark:bg-slate-800/40"
                  : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-[32px] text-amber-500 select-none">
                light_mode
              </span>
              <span className="font-sans text-xs font-bold text-slate-800 dark:text-slate-200">
                Morning Lark
              </span>
            </button>

            <button
              onClick={() => onUpdatePreference("night")}
              className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all cursor-pointer ${
                profile.preference === "night"
                  ? "border-slate-950 dark:border-white bg-slate-50 dark:bg-slate-800/40"
                  : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-[32px] text-violet-500 select-none">
                dark_mode
              </span>
              <span className="font-sans text-xs font-bold text-slate-800 dark:text-slate-200">
                Night Owl
              </span>
            </button>
          </div>
        </div>

        {/* Notification preferences */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <h3 className="font-sans text-lg font-black text-slate-900 dark:text-white mb-2">
            Notification Rules
          </h3>
          <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mb-6">
            Control telemetry noise and focus safety valves.
          </p>

          <div className="space-y-4">
            {[
              { id: "push", title: "Push Notifications", desc: "Urgent checkins on task updates" },
              { id: "email", title: "Email Summary Reports", desc: "Daily retrospective analytics sent to inbox" },
              { id: "urgency", title: "Urgency Filters", desc: "Mute non-critical noise during active deep work" },
            ].map((pref) => (
              <div key={pref.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 dark:border-slate-800/50">
                <div>
                  <h4 className="font-sans text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">
                    {pref.title}
                  </h4>
                  <p className="font-sans text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                    {pref.desc}
                  </p>
                </div>
                <button className="relative inline-flex h-5 w-10 items-center rounded-full bg-slate-950 dark:bg-white transition-colors">
                  <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-slate-950 translate-x-5.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Sovereignty */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm border-l-4 border-red-500">
          <h3 className="font-sans text-lg font-black text-slate-900 dark:text-white mb-2">
            Data Sovereignty
          </h3>
          <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mb-6">
            We prioritize absolute privacy. All data belongs strictly to you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onExportData}
              className="flex-1 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 py-3 rounded-xl font-sans font-bold text-xs text-slate-700 dark:text-slate-300 transition-all cursor-pointer text-center"
            >
              Export Secure JSON Data
            </button>
            <button
              onClick={onPurgeData}
              className="px-6 border border-red-200/40 hover:border-red-500 py-3 rounded-xl font-mono text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
            >
              Purge All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
