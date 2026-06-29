import React from "react";
import { UserProfile } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  onSignOut: () => void;
  onAddTaskClick: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  profile,
  onSignOut,
  onAddTaskClick,
  darkMode,
  setDarkMode,
}: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "calendar", label: "Calendar", icon: "calendar_today" },
    { id: "goals", label: "Goals & Habits", icon: "bolt" },
    { id: "panic", label: "Panic Mode", icon: "error" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 gap-6 z-30 transition-colors duration-300">
      {/* Brand Header */}
      <div className="px-2 pt-2">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-lg">
            ⚡
          </div>
          <div>
            <h1 className="font-sans text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Life Saver
            </h1>
            <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              In Control
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 grow">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-sans font-semibold text-sm transition-all duration-200 text-left ${
                isActive
                  ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md scale-[0.98]"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <span className="material-symbols-outlined select-none">
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.id === "panic" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-[#ac332a] animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Controls */}
      <div className="flex flex-col gap-4 mt-auto">
        {/* Quick Add Task Button */}
        <button
          onClick={onAddTaskClick}
          className="w-full h-12 bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-xl font-sans font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95 duration-100 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Task
        </button>

        {/* Dark Mode & Account Control */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Dark Theme
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 dark:bg-slate-700 transition-colors focus:outline-none"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-950 dark:bg-slate-800 text-white flex items-center justify-center text-xs font-bold font-mono">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : "JD"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">
                {profile.name || "Chief Admin"}
              </p>
              <button
                onClick={onSignOut}
                className="font-sans text-[11px] text-slate-400 hover:text-[#ac332a] dark:text-slate-500 dark:hover:text-[#ff6f61] transition-colors mt-1"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
