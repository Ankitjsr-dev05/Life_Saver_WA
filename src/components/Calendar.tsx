import React, { useState } from "react";
import { CalendarEvent } from "../types";

interface CalendarProps {
  events: CalendarEvent[];
  onAcceptEvent: (id: string) => void;
}

export default function Calendar({ events, onAcceptEvent }: CalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const days = [
    { label: "SUN", date: "23" },
    { label: "MON", date: "24" },
    { label: "TUE", date: "25" },
    { label: "WED", date: "26" },
    { label: "THU", date: "27" },
    { label: "FRI", date: "28" },
    { label: "SAT", date: "29" },
  ];

  const hours = [
    "08 AM",
    "09 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "01 PM",
    "02 PM",
    "03 PM",
    "04 PM",
    "05 PM",
  ];

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleAcceptBlock = (id: string) => {
    onAcceptEvent(id);
    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent({ ...selectedEvent, accepted: true });
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Top Header Controls */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h2 className="font-sans text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Calendar
          </h2>
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
            <button className="material-symbols-outlined text-slate-500 hover:text-slate-950 dark:hover:text-white text-lg select-none cursor-pointer">
              chevron_left
            </button>
            <span className="mx-4 font-mono text-xs uppercase font-bold text-slate-600 dark:text-slate-400">
              Oct 23 - Oct 29, 2023
            </span>
            <button className="material-symbols-outlined text-slate-500 hover:text-slate-950 dark:hover:text-white text-lg select-none cursor-pointer">
              chevron_right
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="w-3 h-3 rounded-full bg-slate-950 dark:bg-white border border-slate-200 dark:border-slate-800"></span>{" "}
              Manual
            </span>
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#ac332a] dark:text-red-400">
              <span className="w-3 h-3 rounded-full bg-[#ac332a] dark:bg-red-500"></span>{" "}
              AI Suggested
            </span>
          </div>
        </div>
      </header>

      {/* Grid Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/80 overflow-hidden relative">
        
        {/* Day Headers */}
        <div className="grid grid-cols-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-center py-4">
          <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold self-center border-r border-slate-200 dark:border-slate-800">
            GMT-4
          </div>
          {days.map((day) => (
            <div
              key={day.label}
              className={`flex flex-col items-center justify-center border-r last:border-0 border-slate-200 dark:border-slate-800 ${
                day.label === "TUE" ? "bg-slate-100/50 dark:bg-slate-800/20" : ""
              }`}
            >
              <span className="font-sans text-xs font-semibold text-slate-400 dark:text-slate-500">
                {day.label}
              </span>
              <span className="font-sans text-lg font-black text-slate-900 dark:text-white">
                {day.date}
              </span>
            </div>
          ))}
        </div>

        {/* Hour Rows and Blocks Area */}
        <div className="relative h-[650px] overflow-y-auto">
          {/* Hour Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-8 pointer-events-none">
            {/* Timeline hour cells */}
            <div className="border-r border-slate-200 dark:border-slate-800">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-16 border-b border-slate-200 dark:border-slate-800 flex justify-center pt-2"
                >
                  <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {hour}
                  </span>
                </div>
              ))}
            </div>

            {/* Empty columns for grid lines */}
            {days.map((day, i) => (
              <div
                key={day.label}
                className={`border-r last:border-0 border-slate-200 dark:border-slate-800 ${
                  day.label === "TUE" ? "bg-slate-100/20 dark:bg-slate-800/10" : ""
                }`}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-slate-200 dark:border-slate-800"
                  ></div>
                ))}
              </div>
            ))}
          </div>

          {/* Actual Event Overlays (Positioned using Day Column and top parameters) */}
          <div className="absolute inset-0 grid grid-cols-8 pl-[12.5%] select-none">
            {/* SUN Column */}
            <div className="relative border-r border-slate-100 dark:border-slate-800/40"></div>

            {/* MON Column */}
            <div className="relative border-r border-slate-100 dark:border-slate-800/40">
              {/* Client Strategy Session */}
              <div
                onClick={() =>
                  handleEventClick({
                    id: "evt-1",
                    uid: "any",
                    title: "Client Strategy Session",
                    description: "Kickoff with the design team for Q4 goals.",
                    start: "09:00 AM",
                    end: "10:30 AM",
                    type: "manual",
                    accepted: true,
                    reason: "",
                    day: "MON",
                  })
                }
                className="absolute top-[64px] left-1 right-1 h-[96px] bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-3 rounded-xl shadow-md cursor-pointer border-l-4 border-slate-400 hover:scale-[1.01] transition-transform"
              >
                <span className="block font-mono text-[10px] uppercase opacity-70">09:00 AM</span>
                <span className="block font-sans text-xs font-bold leading-tight mt-1">Client Strategy</span>
              </div>

              {/* Research Analysis - AI Block */}
              <div
                onClick={() =>
                  handleEventClick({
                    id: "evt-2",
                    uid: "any",
                    title: "Research Analysis",
                    description:
                      "Identified as high-priority focus time before your 1 PM meeting based on past velocity.",
                    start: "11:00 AM",
                    end: "12:00 PM",
                    type: "ai-suggested",
                    accepted: events.find((e) => e.id === "evt-2")?.accepted || false,
                    reason:
                      "Your focus energy peaks around 11 AM after your morning catchups. Completing research now protects your afternoon from backlogs.",
                    day: "MON",
                  })
                }
                className={`absolute top-[192px] left-1 right-1 h-[64px] border-l-4 border-[#ac332a] dark:border-red-500 p-3 rounded-xl cursor-pointer hover:scale-[1.01] transition-all ${
                  events.find((e) => e.id === "evt-2")?.accepted
                    ? "bg-slate-100 dark:bg-slate-800 border-slate-500 text-slate-800 dark:text-slate-200"
                    : "bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs select-none">auto_awesome</span>
                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold">AI BLOCK</span>
                </div>
                <span className="block font-sans text-xs font-bold leading-tight mt-0.5">Research Analysis</span>
              </div>
            </div>

            {/* TUE Column */}
            <div className="relative border-r border-slate-100 dark:border-slate-800/40 bg-slate-100/5 dark:bg-slate-800/5">
              {/* Internal Sync */}
              <div
                onClick={() =>
                  handleEventClick({
                    id: "evt-3",
                    uid: "any",
                    title: "Internal Sync",
                    description: "Status check on developer branch deployments.",
                    start: "12:00 PM",
                    end: "01:00 PM",
                    type: "manual",
                    accepted: true,
                    reason: "",
                    day: "TUE",
                  })
                }
                className="absolute top-[256px] left-1 right-1 h-[64px] bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-3 rounded-xl shadow-md cursor-pointer border-l-4 border-slate-400 hover:scale-[1.01] transition-transform"
              >
                <span className="block font-mono text-[10px] uppercase opacity-70">12:00 PM</span>
                <span className="block font-sans text-xs font-bold leading-tight mt-0.5">Internal Sync</span>
              </div>
            </div>

            {/* WED Column */}
            <div className="relative border-r border-slate-100 dark:border-slate-800/40">
              {/* Project Alpha Core - AI Focus */}
              <div
                onClick={() =>
                  handleEventClick({
                    id: "evt-4",
                    uid: "any",
                    title: "Project Alpha Core",
                    description:
                      "Your calendar is clear and energy peaks are high during this slot. Recommended deep work.",
                    start: "09:00 AM",
                    end: "11:00 AM",
                    type: "ai-focus",
                    accepted: events.find((e) => e.id === "evt-4")?.accepted || false,
                    reason:
                      "Your energy levels are typically highest on Wednesday mornings. Clearing this block ensures Project Alpha stays on track for Friday's deadline without overtime.",
                    day: "WED",
                  })
                }
                className={`absolute top-[64px] left-1 right-1 h-[128px] border-l-4 border-[#ac332a] dark:border-red-500 p-3 rounded-xl cursor-pointer hover:scale-[1.01] transition-all ${
                  events.find((e) => e.id === "evt-4")?.accepted
                    ? "bg-slate-100 dark:bg-slate-800 border-slate-500 text-slate-800 dark:text-slate-200"
                    : "bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs select-none">auto_awesome</span>
                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold">AI FOCUS</span>
                </div>
                <span className="block font-sans text-xs font-bold leading-tight mt-1">Project Alpha Core</span>
              </div>
            </div>

            {/* THU Column */}
            <div className="relative border-r border-slate-100 dark:border-slate-800/40">
              {/* Executive Board Review */}
              <div
                onClick={() =>
                  handleEventClick({
                    id: "evt-5",
                    uid: "any",
                    title: "Executive Board Review",
                    description: "Quarterly projection review and budget allocations.",
                    start: "01:00 PM",
                    end: "03:00 PM",
                    type: "manual",
                    accepted: true,
                    reason: "",
                    day: "THU",
                  })
                }
                className="absolute top-[320px] left-1 right-1 h-[128px] bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-3 rounded-xl shadow-md cursor-pointer border-l-4 border-slate-400 hover:scale-[1.01] transition-transform"
              >
                <span className="block font-mono text-[10px] uppercase opacity-70">01:00 PM</span>
                <span className="block font-sans text-xs font-bold leading-tight mt-1">Executive Board Review</span>
              </div>
            </div>

            {/* FRI Column */}
            <div className="relative border-r border-slate-100 dark:border-slate-800/40">
              {/* Weekly Roundup */}
              <div
                onClick={() =>
                  handleEventClick({
                    id: "evt-6",
                    uid: "any",
                    title: "Weekly Roundup",
                    description: "End-of-week synthesis suggested to clear headspace for the weekend.",
                    start: "02:00 PM",
                    end: "03:00 PM",
                    type: "ai-suggested",
                    accepted: events.find((e) => e.id === "evt-6")?.accepted || false,
                    reason:
                      "A 30-minute synthesis slot recommended on Fridays to log achievements, tidy active tickets, and reset workflow headers.",
                    day: "FRI",
                  })
                }
                className={`absolute top-[384px] left-1 right-1 h-[64px] border-l-4 border-[#ac332a] dark:border-red-500 p-3 rounded-xl cursor-pointer hover:scale-[1.01] transition-all ${
                  events.find((e) => e.id === "evt-6")?.accepted
                    ? "bg-slate-100 dark:bg-slate-800 border-slate-500 text-slate-800 dark:text-slate-200"
                    : "bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs select-none">auto_awesome</span>
                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold">AI BLOCK</span>
                </div>
                <span className="block font-sans text-xs font-bold leading-tight mt-0.5">Weekly Roundup</span>
              </div>
            </div>

            {/* SAT Column */}
            <div className="relative"></div>
          </div>
        </div>
      </div>

      {/* AI Reasoning Glassmorphism Panel overlay */}
      {selectedEvent && (
        <div className="fixed right-8 bottom-8 w-[380px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="min-w-0 flex-1">
              <span
                className={`font-mono text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border mb-3 inline-block ${
                  selectedEvent.type === "manual"
                    ? "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    : "bg-red-50 dark:bg-red-950/20 text-[#ac332a] dark:text-red-400 border-red-200/40 dark:border-red-900/40"
                }`}
              >
                {selectedEvent.type === "manual" ? "MANUAL EVENT" : "AI PROPOSED"}
              </span>
              <h3 className="font-sans text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                {selectedEvent.title}
              </h3>
              <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mt-1">
                {selectedEvent.start} - {selectedEvent.end}
              </p>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined select-none">close</span>
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl mb-6 border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#ac332a] dark:text-red-400 select-none animate-pulse">
                {selectedEvent.type === "manual" ? "event" : "auto_awesome"}
              </span>
              <div>
                <p className="font-mono text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">
                  {selectedEvent.type === "manual" ? "Details" : "Chief-of-Staff Recommendation"}
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  {selectedEvent.type === "manual" ? selectedEvent.description : selectedEvent.reason}
                </p>
              </div>
            </div>
          </div>

          {selectedEvent.type !== "manual" && (
            <div className="flex gap-3">
              <button
                disabled={selectedEvent.accepted}
                onClick={() => handleAcceptBlock(selectedEvent.id)}
                className={`flex-1 py-3 rounded-xl font-sans font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 duration-100 cursor-pointer text-center ${
                  selectedEvent.accepted
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-700 pointer-events-none"
                    : "bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100"
                }`}
              >
                {selectedEvent.accepted ? "Block Accepted" : "Accept Block"}
              </button>
              {!selectedEvent.accepted && (
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 border border-slate-200 dark:border-slate-800 py-3 rounded-xl font-sans font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  Reschedule
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
