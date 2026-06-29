export interface UserProfile {
  uid: string;
  name: string;
  preference: 'morning' | 'night' | '';
  calendarConnected: boolean;
  efficiency: number;
  email: string;
  theme: 'light' | 'dark';
}

export interface Task {
  id: string;
  uid: string;
  title: string;
  deadline: string;
  effort: string;
  criticality: number;
  notes: string;
  completed: boolean;
  createdAt: string;
}

export interface Goal {
  id: string;
  uid: string;
  title: string;
  description: string;
  progress: number;
  category: string;
  subtasks: { text: string; completed: boolean }[];
  createdAt: string;
}

export interface Ritual {
  id: string;
  uid: string;
  title: string;
  time: string;
  streak: number;
  lastCompleted: string | null; // ISO string or date
  completedToday: boolean;
}

export interface CalendarEvent {
  id: string;
  uid: string;
  title: string;
  description: string;
  start: string; // e.g. "09:00 AM" or datetime
  end: string;
  type: 'manual' | 'ai-suggested' | 'ai-focus';
  accepted: boolean;
  reason: string;
  day: string; // e.g., "SUN", "MON", "TUE", etc.
}

export interface PanicState {
  situation: string;
  steps: { title: string; description: string; completed: boolean }[];
  activeDraft: string;
  focusPrompt: string;
  timeRemaining: number; // in seconds
  isActive: boolean;
}
