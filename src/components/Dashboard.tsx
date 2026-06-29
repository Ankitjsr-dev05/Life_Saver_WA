import React, { useState, useEffect } from "react";
import { Task, UserProfile } from "../types";

interface DashboardProps {
  tasks: Task[];
  profile: UserProfile;
  onToggleTask: (id: string, completed: boolean) => void;
  onHelpMeNow: () => void;
  onEnterDeepWork: () => void;
}

export default function Dashboard({
  tasks,
  profile,
  onToggleTask,
  onHelpMeNow,
  onEnterDeepWork,
}: DashboardProps) {
  const [timeLeft, setTimeLeft] = useState(2535); // 42 minutes 15 seconds

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 2535));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Organize tasks by criticality
  const criticalTasks = tasks.filter(t => !t.completed && t.criticality >= 8);
  const highTasks = tasks.filter(t => !t.completed && t.criticality >= 6 && t.criticality < 8);
  const mediumTasks = tasks.filter(t => !t.completed && t.criticality >= 4 && t.criticality < 6);
  const lowTasks = tasks.filter(t => !t.completed && t.criticality < 4);

  // Fallback critical task if none exists
  const heroTask = criticalTasks[0] || tasks.find(t => !t.completed) || {
    id: "default-hero",
    title: "Finalize Quarter Budget Sheets",
    deadline: "11:30 AM",
    effort: "2h 15m",
    notes: "Complete all department reconciliations for Q3 before the board review session.",
    criticality: 9,
    completed: false,
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-sans text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
            Good morning, {profile.name || "Alex"}
          </h2>
          <p className="font-sans text-sm text-slate-500 dark:text-slate-400">
            Your AI assistant has prioritized {tasks.filter(t => !t.completed).length} tasks for today.
          </p>
        </div>
        <button
          onClick={onHelpMeNow}
          className="bg-[#ac332a] text-white px-6 py-3 rounded-xl font-mono text-xs uppercase font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined select-none">bolt</span>
          I'm behind — help me now
        </button>
      </header>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Focus remaining */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border-l-4 border-[#ac332a] dark:border-red-500 flex flex-col justify-center border border-slate-100 dark:border-slate-800/80 transition-all">
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 font-bold">
            Focus Time Remaining
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-[#ac332a] dark:text-red-400 animate-pulse select-all">
              {formatTime(timeLeft)}
            </span>
            <span className="font-sans text-xs text-slate-400 dark:text-slate-500">
              to next meeting
            </span>
          </div>
        </div>

        {/* Efficiency Level */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border-l-4 border-[#2b9b92] dark:border-teal-500 flex flex-col justify-center border border-slate-100 dark:border-slate-800/80 transition-all">
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 font-bold">
            Efficiency Level
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-3xl font-black text-slate-900 dark:text-white">
              {profile.efficiency || 84}%
            </span>
            <span className="material-symbols-outlined text-[#2b9b92] dark:text-teal-400 select-none">
              trending_up
            </span>
          </div>
        </div>

        {/* Upcoming Meeting */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border-l-4 border-slate-900 dark:border-slate-400 flex flex-col justify-center border border-slate-100 dark:border-slate-800/80 transition-all">
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 font-bold">
            Upcoming Block
          </span>
          <div className="flex flex-col">
            <span className="font-sans text-sm font-bold text-slate-900 dark:text-white truncate">
              Board Review Preparation
            </span>
            <span className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Starts at 11:30 AM
            </span>
          </div>
        </div>
      </div>

      {/* Task Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Critical Task Hero Card */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/80 border-l-4 border-[#ac332a] dark:border-red-500 overflow-hidden hover:shadow-md transition-all">
          <div className="p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="bg-red-50 dark:bg-red-950/20 text-[#ac332a] dark:text-red-400 border border-red-200/40 dark:border-red-900/40 font-mono text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                  CRITICAL
                </span>
                <span className="font-mono text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 select-none">
                  <span className="material-symbols-outlined text-sm">timer</span>{" "}
                  {heroTask.effort || "2h 15m"}
                </span>
              </div>

              <div className="flex gap-4 items-start">
                <input
                  type="checkbox"
                  id={heroTask.id}
                  checked={heroTask.completed || false}
                  onChange={(e) => onToggleTask(heroTask.id, e.target.checked)}
                  className="w-6 h-6 rounded border-slate-300 dark:border-slate-700 text-[#ac332a] focus:ring-[#ac332a] cursor-pointer mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={heroTask.id}
                    className={`font-sans text-xl md:text-2xl font-black block mb-2 cursor-pointer transition-all ${
                      heroTask.completed
                        ? "line-through text-slate-400 dark:text-slate-600"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {heroTask.title}
                  </label>
                  <p className="font-sans text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    {heroTask.notes || "No operational notes provided."}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ac332a] dark:text-red-400 select-none animate-bounce">
                psychology
              </span>
              <p className="font-sans text-xs italic text-slate-700 dark:text-slate-300">
                "Due in 3h, not started. High probability of delay if not prioritized now."
              </p>
            </div>
          </div>
        </div>

        {/* High Urgency Side Tasks */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {highTasks.slice(0, 2).map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 border-l-4 border-amber-500 p-5 hover:shadow-md transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 font-mono text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    HIGH
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                    {task.effort}
                  </span>
                </div>
                <div className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    id={task.id}
                    checked={task.completed}
                    onChange={(e) => onToggleTask(task.id, e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer mt-0.5"
                  />
                  <label
                    htmlFor={task.id}
                    className={`font-sans text-sm font-bold block cursor-pointer truncate ${
                      task.completed
                        ? "line-through text-slate-400 dark:text-slate-600"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {task.title}
                  </label>
                </div>
                {task.notes && (
                  <p className="font-sans text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed truncate">
                    "{task.notes}"
                  </p>
                )}
              </div>
            </div>
          ))}

          {highTasks.length === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 border-l-4 border-amber-500 p-5 flex flex-col justify-center items-center text-center py-8">
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-[32px] mb-2 select-none">
                verified_user
              </span>
              <p className="font-sans text-xs font-bold text-slate-500 dark:text-slate-400">
                All High Priority Tasks Cleared
              </p>
            </div>
          )}
        </div>

        {/* Medium Priority Grid */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 border-l-4 border-teal-500 p-5 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-teal-50 dark:bg-teal-950/20 text-[#2b9b92] dark:text-teal-400 font-mono text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
              MEDIUM
            </span>
            <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
              {mediumTasks.length} left
            </span>
          </div>
          {mediumTasks.length > 0 ? (
            <div className="space-y-4">
              {mediumTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    id={task.id}
                    checked={task.completed}
                    onChange={(e) => onToggleTask(task.id, e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#2b9b92] focus:ring-[#2b9b92] cursor-pointer mt-0.5"
                  />
                  <label
                    htmlFor={task.id}
                    className="font-sans text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer truncate"
                  >
                    {task.title}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-sans text-xs text-slate-400 dark:text-slate-600 italic">
              No active medium-priority tasks.
            </p>
          )}
        </div>

        {/* Low Priority Grid */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 border-l-4 border-slate-400 p-5 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
              LOW
            </span>
            <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
              {lowTasks.length} left
            </span>
          </div>
          {lowTasks.length > 0 ? (
            <div className="space-y-4">
              {lowTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    id={task.id}
                    checked={task.completed}
                    onChange={(e) => onToggleTask(task.id, e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-slate-500 focus:ring-slate-500 cursor-pointer mt-0.5"
                  />
                  <label
                    htmlFor={task.id}
                    className="font-sans text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer truncate"
                  >
                    {task.title}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-sans text-xs text-slate-400 dark:text-slate-600 italic">
              No active low-priority tasks.
            </p>
          )}
        </div>

        {/* Upcoming agenda placeholder */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 p-5 flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <h4 className="font-sans text-sm font-bold text-slate-900 dark:text-white mb-2">
              Next Scheduled block
            </h4>
            <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mb-4">
              Keep momentum high! Clean your plate before lunch.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <span className="font-mono text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
              AI suggested break in 45m
            </span>
          </div>
        </div>

        {/* Dynamic Focus / Activation Flow Block */}
        <div className="lg:col-span-12 relative rounded-3xl h-64 overflow-hidden shadow-lg mt-6">
          <div
            className="absolute inset-0 bg-cover bg-center brightness-[0.4] dark:brightness-[0.25] transition-transform duration-700 hover:scale-[1.02]"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAa2PdD2dCEA3bDQQvmKSyE8tLrDYCNtiPPJxypxKyTOw5ZcUZ6NMf66LqeurgVnk9SvE-weI_w8wZ9EjItVsFLhuRjznjkoWXolFqlvqenzjqCN3vKhmsrGYxcKly8ch8VdkJXf3jMEvB_0A1xhQxTnzOyp0UscqFzhljKLVTWMU_55XEEzLQAZMfH-gXdZN9vxmgqXbV4i9mkU13BGccJ9m71mq_orSQZiRENnaqhmlFBKuD0R1zs6rAyIzqz7zFSYhyU9wNRk5dg')`,
            }}
            referrerPolicy="no-referrer"
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent flex items-center px-10">
            <div className="max-w-md text-white">
              <h3 className="font-sans text-2xl md:text-3xl font-black mb-2 tracking-tight">
                Flow State Activated
              </h3>
              <p className="font-sans text-sm text-slate-300 mb-6 leading-relaxed">
                AI analysis shows your peak performance window is starting. We've muted all notifications and secured your focus zone.
              </p>
              <button
                onClick={onEnterDeepWork}
                className="bg-white hover:bg-slate-100 text-slate-950 px-6 py-3 rounded-xl font-sans font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">headset</span>
                Enter Deep Work Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
