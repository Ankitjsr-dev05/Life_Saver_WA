import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { Task, Goal, Ritual, CalendarEvent, UserProfile, PanicState } from "./types";

// Components
import Auth from "./components/Auth";
import Onboarding from "./components/Onboarding";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AddTask from "./components/AddTask";
import Calendar from "./components/Calendar";
import GoalsHabits from "./components/GoalsHabits";
import PanicMode from "./components/PanicMode";
import Settings from "./components/Settings";

// Seed data fallback for rich initial developer/guest presentation
const SEED_TASKS: Task[] = [
  {
    id: "seed-1",
    uid: "seed-user",
    title: "Finalize Quarter Budget Sheets",
    deadline: "11:30 AM",
    effort: "2h 15m",
    notes: "Complete all department reconciliations for Q3 before the board review session.",
    criticality: 9,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    uid: "seed-user",
    title: "Review Server Deployment Pipeline Logs",
    deadline: "01:00 PM",
    effort: "1h",
    notes: "Deploy safe rollbacks if socket timeouts are above 50ms.",
    criticality: 7,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    uid: "seed-user",
    title: "Draft Executive Brief on Infrastructure Scaling",
    deadline: "04:30 PM",
    effort: "2h",
    notes: "Summarize scaling risks and performance margins.",
    criticality: 7,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-4",
    uid: "seed-user",
    title: "Schedule weekly engineering sync",
    deadline: "Tomorrow",
    effort: "15m",
    notes: "Coordinate milestone updates with platform leads.",
    criticality: 5,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-5",
    uid: "seed-user",
    title: "Clean focus workspace",
    deadline: "Weekly",
    effort: "15m",
    notes: "Organize desk and disable redundant telemetry notifications.",
    criticality: 2,
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

const SEED_GOALS: Goal[] = [
  {
    id: "seed-goal-1",
    uid: "seed-user",
    title: "Scale Product Infrastructure",
    description: "Establish reliable pipelines and robust performance margins.",
    progress: 50,
    category: "Engineering",
    subtasks: [
      { text: "Verify load-balancer configs", completed: true },
      { text: "Configure Firestore schema backup", completed: true },
      { text: "Implement responsive error fallback", completed: false },
      { text: "Setup multi-tab persistence", completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
];

const SEED_RITUALS: Ritual[] = [
  {
    id: "seed-ritual-1",
    uid: "seed-user",
    title: "Deep Work Block",
    time: "Morning",
    streak: 8,
    lastCompleted: null,
    completedToday: false,
  },
  {
    id: "seed-ritual-2",
    uid: "seed-user",
    title: "Zero-Inbox Purge",
    time: "Evening",
    streak: 5,
    lastCompleted: null,
    completedToday: false,
  },
  {
    id: "seed-ritual-3",
    uid: "seed-user",
    title: "Evening Reflection",
    time: "Night",
    streak: 12,
    lastCompleted: null,
    completedToday: false,
  },
];

const SEED_EVENTS: CalendarEvent[] = [
  {
    id: "evt-2",
    uid: "seed-user",
    title: "Research Analysis",
    description: "AI Proposed block based on your optimal morning velocity.",
    start: "11:00 AM",
    end: "12:00 PM",
    type: "ai-suggested",
    accepted: false,
    reason: "Your focus energy peaks around 11 AM. Completing research now protects your afternoon from backlogs.",
    day: "MON",
  },
  {
    id: "evt-4",
    uid: "seed-user",
    title: "Project Alpha Core",
    description: "AI Proposed focus session when your meeting slot is clear.",
    start: "09:00 AM",
    end: "11:00 AM",
    type: "ai-focus",
    accepted: false,
    reason: "Your energy levels are typically highest on Wednesday mornings. Clearing this block ensures Project Alpha stays on track for Friday.",
    day: "WED",
  },
  {
    id: "evt-6",
    uid: "seed-user",
    title: "Weekly Roundup",
    description: "AI Proposed retrospective block to secure peace of mind.",
    start: "02:00 PM",
    end: "03:00 PM",
    type: "ai-suggested",
    accepted: false,
    reason: "A 30-minute synthesis slot recommended on Fridays to log achievements, tidy active tickets, and reset workflow headers.",
    day: "FRI",
  },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // App tabs & view managers
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // User Preferences / Profile state
  const [profile, setProfile] = useState<UserProfile>({
    uid: "",
    name: "",
    preference: "",
    calendarConnected: false,
    efficiency: 84,
    email: "",
    theme: "light",
  });

  // Database list states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [panicState, setPanicState] = useState<PanicState>({
    situation: "",
    steps: [],
    activeDraft: "",
    focusPrompt: "",
    timeRemaining: 0,
    isActive: false,
  });

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingAuth(false);
      if (firebaseUser) {
        setIsGuest(false);
      }
    });
    return unsubscribe;
  }, []);

  // Sync profile theme to standard HTML class list
  useEffect(() => {
    const root = window.document.documentElement;
    if (profile.theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [profile.theme]);

  // Load and subscribe to real-time Firestore synchronization
  useEffect(() => {
    const activeUid = user ? user.uid : isGuest ? "guest-user" : "";
    if (!activeUid) return;

    // LocalStorage fallback cache logic for offline synchronization support
    const localTasks = localStorage.getItem(`tasks_${activeUid}`);
    const localGoals = localStorage.getItem(`goals_${activeUid}`);
    const localRituals = localStorage.getItem(`rituals_${activeUid}`);
    const localEvents = localStorage.getItem(`events_${activeUid}`);
    const localProfile = localStorage.getItem(`profile_${activeUid}`);
    const localPanic = localStorage.getItem(`panic_${activeUid}`);

    if (localTasks) setTasks(JSON.parse(localTasks));
    else if (isGuest) setTasks(SEED_TASKS);

    if (localGoals) setGoals(JSON.parse(localGoals));
    else if (isGuest) setGoals(SEED_GOALS);

    if (localRituals) setRituals(JSON.parse(localRituals));
    else if (isGuest) setRituals(SEED_RITUALS);

    if (localEvents) setCalendarEvents(JSON.parse(localEvents));
    else if (isGuest) setCalendarEvents(SEED_EVENTS);

    if (localProfile) setProfile(JSON.parse(localProfile));
    else if (isGuest) {
      setProfile({
        uid: "guest-user",
        name: "Alex",
        preference: "morning",
        calendarConnected: true,
        efficiency: 88,
        email: "guest@example.com",
        theme: "light",
      });
    }

    if (localPanic) setPanicState(JSON.parse(localPanic));

    // If logged in via Firebase, synchronize in real-time with Firestore database
    if (user) {
      // 1. Subscribe Profile
      const profileRef = doc(db, "users", user.uid);
      getDoc(profileRef).then((docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          const initialProfile: UserProfile = {
            uid: user.uid,
            name: user.displayName || "",
            preference: "",
            calendarConnected: false,
            efficiency: 84,
            email: user.email || "",
            theme: "light",
          };
          setDoc(profileRef, initialProfile);
          setProfile(initialProfile);
        }
      });

      // 2. Subscribe Tasks
      const tasksQuery = query(collection(db, "tasks"), where("uid", "==", user.uid));
      const unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
        const fetchedTasks: Task[] = [];
        snapshot.forEach((docSnap) => {
          fetchedTasks.push({ id: docSnap.id, ...docSnap.data() } as Task);
        });
        if (fetchedTasks.length > 0) {
          setTasks(fetchedTasks);
          localStorage.setItem(`tasks_${user.uid}`, JSON.stringify(fetchedTasks));
        } else {
          // Seed initial tasks if empty
          const seedTasksForUser = SEED_TASKS.map((t) => ({ ...t, uid: user.uid }));
          setTasks(seedTasksForUser);
          seedTasksForUser.forEach((t) => {
            addDoc(collection(db, "tasks"), t);
          });
        }
      });

      // 3. Subscribe Goals
      const goalsQuery = query(collection(db, "goals"), where("uid", "==", user.uid));
      const unsubGoals = onSnapshot(goalsQuery, (snapshot) => {
        const fetchedGoals: Goal[] = [];
        snapshot.forEach((docSnap) => {
          fetchedGoals.push({ id: docSnap.id, ...docSnap.data() } as Goal);
        });
        if (fetchedGoals.length > 0) {
          setGoals(fetchedGoals);
          localStorage.setItem(`goals_${user.uid}`, JSON.stringify(fetchedGoals));
        } else {
          const seedGoalsForUser = SEED_GOALS.map((g) => ({ ...g, uid: user.uid }));
          setGoals(seedGoalsForUser);
          seedGoalsForUser.forEach((g) => {
            addDoc(collection(db, "goals"), g);
          });
        }
      });

      // 4. Subscribe Rituals
      const ritualsQuery = query(collection(db, "rituals"), where("uid", "==", user.uid));
      const unsubRituals = onSnapshot(ritualsQuery, (snapshot) => {
        const fetchedRituals: Ritual[] = [];
        snapshot.forEach((docSnap) => {
          fetchedRituals.push({ id: docSnap.id, ...docSnap.data() } as Ritual);
        });
        if (fetchedRituals.length > 0) {
          setRituals(fetchedRituals);
          localStorage.setItem(`rituals_${user.uid}`, JSON.stringify(fetchedRituals));
        } else {
          const seedRitualsForUser = SEED_RITUALS.map((r) => ({ ...r, uid: user.uid }));
          setRituals(seedRitualsForUser);
          seedRitualsForUser.forEach((r) => {
            addDoc(collection(db, "rituals"), r);
          });
        }
      });

      // 5. Subscribe Events
      const eventsQuery = query(collection(db, "events"), where("uid", "==", user.uid));
      const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
        const fetchedEvents: CalendarEvent[] = [];
        snapshot.forEach((docSnap) => {
          fetchedEvents.push({ id: docSnap.id, ...docSnap.data() } as CalendarEvent);
        });
        if (fetchedEvents.length > 0) {
          setCalendarEvents(fetchedEvents);
          localStorage.setItem(`events_${user.uid}`, JSON.stringify(fetchedEvents));
        } else {
          const seedEventsForUser = SEED_EVENTS.map((e) => ({ ...e, uid: user.uid }));
          setCalendarEvents(seedEventsForUser);
          seedEventsForUser.forEach((e) => {
            addDoc(collection(db, "events"), e);
          });
        }
      });

      return () => {
        unsubTasks();
        unsubGoals();
        unsubRituals();
        unsubEvents();
      };
    }
  }, [user, isGuest]);

  // Synchronize dynamic state to localCache whenever they change
  useEffect(() => {
    const activeUid = user ? user.uid : isGuest ? "guest-user" : "";
    if (!activeUid) return;

    localStorage.setItem(`tasks_${activeUid}`, JSON.stringify(tasks));
    localStorage.setItem(`goals_${activeUid}`, JSON.stringify(goals));
    localStorage.setItem(`rituals_${activeUid}`, JSON.stringify(rituals));
    localStorage.setItem(`events_${activeUid}`, JSON.stringify(calendarEvents));
    localStorage.setItem(`profile_${activeUid}`, JSON.stringify(profile));
    localStorage.setItem(`panic_${activeUid}`, JSON.stringify(panicState));
  }, [tasks, goals, rituals, calendarEvents, profile, panicState, user, isGuest]);

  // --- ACTIONS & PERSISTENCE WRAPPERS ---

  const handleToggleTask = async (id: string, completed: boolean) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));

    if (user && !id.startsWith("seed-")) {
      try {
        const taskRef = doc(db, "tasks", id);
        await updateDoc(taskRef, { completed });
      } catch (err) {
        console.warn("Offline: Cached action to LocalStorage natively.");
      }
    }
  };

  const handleAddTask = async (taskInput: {
    title: string;
    deadline: string;
    effort: string;
    criticality: number;
    notes: string;
  }) => {
    const activeUid = user ? user.uid : "guest-user";
    const newTask: Task = {
      id: "task-" + Date.now(),
      uid: activeUid,
      completed: false,
      createdAt: new Date().toISOString(),
      ...taskInput,
    };

    setTasks((prev) => [newTask, ...prev]);
    setShowAddTaskModal(false);
    setActiveTab("dashboard");

    if (user) {
      try {
        await addDoc(collection(db, "tasks"), { ...newTask, id: "" }); // Firebase generates real ID
      } catch (err) {
        console.warn("Offline: Saved successfully in local offline cache.");
      }
    }
  };

  const handleAddGoal = async (goalInput: Omit<Goal, "id" | "uid" | "createdAt">) => {
    const activeUid = user ? user.uid : "guest-user";
    const newGoal: Goal = {
      id: "goal-" + Date.now(),
      uid: activeUid,
      createdAt: new Date().toISOString(),
      ...goalInput,
    };

    setGoals((prev) => [newGoal, ...prev]);

    if (user) {
      try {
        await addDoc(collection(db, "goals"), { ...newGoal, id: "" });
      } catch (err) {
        console.warn("Offline: Saved to LocalStorage offline sandbox.");
      }
    }
  };

  const handleToggleSubtask = async (goalId: string, subtaskText: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedSubtasks = g.subtasks.map((s) =>
          s.text === subtaskText ? { ...s, completed: !s.completed } : s
        );
        const completedCount = updatedSubtasks.filter((s) => s.completed).length;
        const progress = Math.round((completedCount / updatedSubtasks.length) * 100);
        
        // Update in DB if logged in
        if (user && !goalId.startsWith("seed-")) {
          const goalRef = doc(db, "goals", goalId);
          updateDoc(goalRef, { subtasks: updatedSubtasks, progress });
        }
        
        return { ...g, subtasks: updatedSubtasks, progress };
      })
    );
  };

  const handleCompleteRitual = async (id: string) => {
    setRituals((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = {
          ...r,
          streak: r.streak + 1,
          completedToday: true,
          lastCompleted: new Date().toISOString(),
        };

        if (user && !id.startsWith("seed-")) {
          const ritualRef = doc(db, "rituals", id);
          updateDoc(ritualRef, {
            streak: updated.streak,
            completedToday: true,
            lastCompleted: updated.lastCompleted,
          });
        }

        return updated;
      })
    );
  };

  const handleAcceptCalendarEvent = async (id: string) => {
    setCalendarEvents((prev) => prev.map((e) => (e.id === id ? { ...e, accepted: true } : e)));

    if (user && !id.startsWith("seed-")) {
      try {
        const eventRef = doc(db, "events", id);
        await updateDoc(eventRef, { accepted: true });
      } catch (err) {
        console.warn("Offline synchronization cached.");
      }
    }
  };

  const handleOnboardingComplete = async (
    name: string,
    preference: 'morning' | 'night',
    calendarConnected: boolean
  ) => {
    setProfile((prev) => ({ ...prev, name, preference, calendarConnected }));

    if (user) {
      try {
        const profileRef = doc(db, "users", user.uid);
        await setDoc(profileRef, {
          uid: user.uid,
          name,
          preference,
          calendarConnected,
          efficiency: 84,
          email: user.email || "",
          theme: "light",
        });
      } catch (err) {
        console.error("Firestore onboarding sync failed:", err);
      }
    }
  };

  const handleUpdatePreference = async (pref: 'morning' | 'night') => {
    setProfile((prev) => ({ ...prev, preference: pref }));
    if (user) {
      const profileRef = doc(db, "users", user.uid);
      await updateDoc(profileRef, { preference: pref });
    }
  };

  const handleUpdateCalendar = async (connected: boolean) => {
    setProfile((prev) => ({ ...prev, calendarConnected: connected }));
    if (user) {
      const profileRef = doc(db, "users", user.uid);
      await updateDoc(profileRef, { calendarConnected: connected });
    }
  };

  const handleUpdateTheme = async (themeVal: 'light' | 'dark') => {
    setProfile((prev) => ({ ...prev, theme: themeVal }));
    if (user) {
      const profileRef = doc(db, "users", user.uid);
      await updateDoc(profileRef, { theme: themeVal });
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ tasks, goals, rituals, calendarEvents, profile }, null, 2)
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lifesaver_sovereign_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePurgeData = () => {
    const activeUid = user ? user.uid : "guest-user";
    localStorage.removeItem(`tasks_${activeUid}`);
    localStorage.removeItem(`goals_${activeUid}`);
    localStorage.removeItem(`rituals_${activeUid}`);
    localStorage.removeItem(`events_${activeUid}`);
    localStorage.removeItem(`profile_${activeUid}`);
    localStorage.removeItem(`panic_${activeUid}`);

    setTasks(SEED_TASKS);
    setGoals(SEED_GOALS);
    setRituals(SEED_RITUALS);
    setCalendarEvents(SEED_EVENTS);
    setProfile({
      uid: activeUid,
      name: "",
      preference: "",
      calendarConnected: false,
      efficiency: 84,
      email: user?.email || "guest@example.com",
      theme: "light",
    });
    setPanicState({
      situation: "",
      steps: [],
      activeDraft: "",
      focusPrompt: "",
      timeRemaining: 0,
      isActive: false,
    });
    setActiveTab("dashboard");
    alert("Local offline data purged. Resetting to secure baseline.");
  };

  const handleSignOut = () => {
    signOut(auth);
    setIsGuest(false);
  };

  // Global loading
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#ac332a] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-xs uppercase tracking-widest text-slate-400 mt-4 font-bold">
          Decryption In Progress...
        </p>
      </div>
    );
  }

  // Auth screen guard
  if (!user && !isGuest) {
    return <Auth onGuestAccess={() => setIsGuest(true)} />;
  }

  // Onboarding screen guard
  if (!profile.name) {
    return (
      <Onboarding
        initialEmail={user?.email || "developer@lifesaver.com"}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onSignOut={handleSignOut}
        onAddTaskClick={() => setShowAddTaskModal(true)}
        darkMode={profile.theme === "dark"}
        setDarkMode={(val) => handleUpdateTheme(val ? "dark" : "light")}
      />

      {/* Main View Port Container */}
      <main className="pl-64 min-h-screen">
        <div className="max-w-[1200px] mx-auto p-8 md:p-12 pb-24">
          
          {/* Active Component routing */}
          {showAddTaskModal ? (
            <AddTask
              onAddTask={handleAddTask}
              onCancel={() => setShowAddTaskModal(false)}
            />
          ) : (
            <>
              {activeTab === "dashboard" && (
                <Dashboard
                  tasks={tasks}
                  profile={profile}
                  onToggleTask={handleToggleTask}
                  onHelpMeNow={() => setActiveTab("panic")}
                  onEnterDeepWork={() => {
                    alert("Flow State Secured. All notifications and pings muted. Focusing on critical path.");
                  }}
                />
              )}

              {activeTab === "calendar" && (
                <Calendar
                  events={calendarEvents}
                  onAcceptEvent={handleAcceptCalendarEvent}
                />
              )}

              {activeTab === "goals" && (
                <GoalsHabits
                  goals={goals}
                  rituals={rituals}
                  onToggleSubtask={handleToggleSubtask}
                  onCompleteRitual={handleCompleteRitual}
                  onAddGoal={handleAddGoal}
                />
              )}

              {activeTab === "panic" && (
                <PanicMode
                  panicState={panicState}
                  onUpdatePanicState={(updated) => setPanicState((prev) => ({ ...prev, ...updated }))}
                />
              )}

              {activeTab === "settings" && (
                <Settings
                  profile={profile}
                  onUpdatePreference={handleUpdatePreference}
                  onUpdateCalendar={handleUpdateCalendar}
                  onExportData={handleExportData}
                  onPurgeData={handlePurgeData}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
