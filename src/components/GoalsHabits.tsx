import React, { useState } from "react";
import { Goal, Ritual } from "../types";

interface GoalsHabitsProps {
  goals: Goal[];
  rituals: Ritual[];
  onToggleSubtask: (goalId: string, subtaskText: string) => void;
  onCompleteRitual: (id: string) => void;
  onAddGoal: (goal: Omit<Goal, "id" | "uid" | "createdAt">) => void;
}

export default function GoalsHabits({
  goals,
  rituals,
  onToggleSubtask,
  onCompleteRitual,
  onAddGoal,
}: GoalsHabitsProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDesc, setNewGoalDesc] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("Engineering");
  const [newGoalSubtasks, setNewGoalSubtasks] = useState("");

  const handleSubmitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const subtasksArray = newGoalSubtasks
      .split("\n")
      .filter((s) => s.trim())
      .map((text) => ({ text: text.trim(), completed: false }));

    onAddGoal({
      title: newGoalTitle,
      description: newGoalDesc,
      category: newGoalCategory,
      progress: 0,
      subtasks: subtasksArray.length ? subtasksArray : [{ text: "Initial milestone set", completed: false }],
    });

    setNewGoalTitle("");
    setNewGoalDesc("");
    setNewGoalCategory("Engineering");
    setNewGoalSubtasks("");
    setShowAddGoal(false);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="font-sans text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
            Goals & Habits
          </h2>
          <p className="font-sans text-sm text-slate-500 dark:text-slate-400">
            Secure long-term momentum through structured priorities and rituals.
          </p>
        </div>
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3 rounded-xl font-sans font-bold flex items-center gap-2 hover:shadow-md transition-all active:scale-95 duration-100 cursor-pointer text-sm"
        >
          <span className="material-symbols-outlined select-none text-[20px]">add</span>
          Add Long-Term Goal
        </button>
      </header>

      {/* Goal Add Form Panel */}
      {showAddGoal && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl mb-8 shadow-sm border-l-4 border-[#2b9b92] animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-sans text-lg font-black text-slate-900 dark:text-white mb-4">
            Initialize Long-Term Goal
          </h3>
          <form onSubmit={handleSubmitGoal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scale Product Infrastructure"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  className="w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white text-slate-900 dark:text-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
              <input
                type="text"
                placeholder="Establish reliable pipelines and robust performance margins"
                value={newGoalDesc}
                onChange={(e) => setNewGoalDesc(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Milestones / Sub-tasks (One per line)</label>
              <textarea
                rows={3}
                placeholder="Verify load-balancer configs&#10;Configure Firestore schema backup&#10;Implement responsive error fallback"
                value={newGoalSubtasks}
                onChange={(e) => setNewGoalSubtasks(e.target.value)}
                className="w-full p-4 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white text-slate-900 dark:text-white resize-none"
              ></textarea>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-6 py-2.5 rounded-xl font-sans font-bold text-sm hover:shadow-md cursor-pointer transition-all"
              >
                Set Goal
              </button>
              <button
                type="button"
                onClick={() => setShowAddGoal(false)}
                className="border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white px-6 py-2.5 rounded-xl font-sans font-semibold text-sm cursor-pointer transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Goals Area */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-sans text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2b9b92] select-none">stars</span>
            Active Goals
          </h3>

          {goals.map((goal) => {
            const completedCount = goal.subtasks.filter((s) => s.completed).length;
            const totalCount = goal.subtasks.length;
            const progressPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-[#2b9b92] dark:border-teal-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-teal-50 dark:bg-teal-950/20 text-[#2b9b92] dark:text-teal-400 font-mono text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                      {goal.category}
                    </span>
                    <h4 className="font-sans text-lg font-black text-slate-900 dark:text-white mt-2">
                      {goal.title}
                    </h4>
                    <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {goal.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-2xl font-black text-slate-900 dark:text-white">
                      {progressPct}%
                    </span>
                    <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider font-bold">
                      {completedCount}/{totalCount} Steps
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
                  <div
                    className="h-full bg-[#2b9b92] dark:bg-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>

                {/* Subtask Checklist */}
                <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  {goal.subtasks.map((subtask) => (
                    <div key={subtask.text} className="flex gap-3 items-center">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => onToggleSubtask(goal.id, subtask.text)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#2b9b92] focus:ring-[#2b9b92] cursor-pointer"
                      />
                      <span
                        className={`font-sans text-xs font-semibold cursor-pointer select-none transition-all ${
                          subtask.completed
                            ? "line-through text-slate-400 dark:text-slate-600 font-medium"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                        onClick={() => onToggleSubtask(goal.id, subtask.text)}
                      >
                        {subtask.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {goals.length === 0 && (
            <p className="font-sans text-xs text-slate-400 dark:text-slate-600 italic">No active goals. Add one above.</p>
          )}
        </div>

        {/* Rituals Area */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-sans text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ac332a] select-none">favorite</span>
            Daily Rituals
          </h3>

          <div className="space-y-4">
            {rituals.map((ritual) => (
              <div
                key={ritual.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex items-center justify-between border-l-4 border-slate-300 dark:border-slate-700 hover:shadow-md transition-all"
              >
                <div>
                  <h4 className="font-sans text-sm font-bold text-slate-900 dark:text-white leading-none">
                    {ritual.title}
                  </h4>
                  <p className="font-mono text-[10px] uppercase text-slate-400 dark:text-slate-500 mt-2 font-bold tracking-wider">
                    TIME PREFERENCE: {ritual.time}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Streak box */}
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-base font-black text-slate-900 dark:text-white leading-none">
                      {ritual.streak} 🔥
                    </span>
                    <span className="font-mono text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest mt-1">
                      Streak
                    </span>
                  </div>

                  {/* Complete button */}
                  <button
                    onClick={() => onCompleteRitual(ritual.id)}
                    disabled={ritual.completedToday}
                    className={`h-10 px-4 rounded-xl font-sans font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 duration-100 cursor-pointer ${
                      ritual.completedToday
                        ? "bg-slate-50 dark:bg-slate-800/60 text-[#2b9b92] dark:text-teal-400 font-bold border border-slate-100 dark:border-slate-800 pointer-events-none"
                        : "bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm hover:shadow"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm select-none">
                      {ritual.completedToday ? "check_circle" : "check"}
                    </span>
                    {ritual.completedToday ? "Done" : "Complete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Habit compliance momentum card */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[#ac332a] text-[32px] select-none animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                  Momentum Insight
                </h4>
                <p className="font-sans text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  "AI Analysis: Your habit compliance has boosted your Q3 projection timeline by 4.2 days. Keep pushing!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
