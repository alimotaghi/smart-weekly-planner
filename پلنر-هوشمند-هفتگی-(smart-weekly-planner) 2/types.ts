
export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Event {
  id: string;
  time: string;
  text: string;
}

export interface DayData {
  priorities: string[];
  events: Event[];
  tasks: Task[];
}

export interface Habit {
  id: string;
  name: string;
  checks: boolean[]; // 7 days
}

export interface WeekData {
  quote: string;
  reminders: Task[];
  habits: Habit[];
  days: Record<string, DayData>; // Key: "0" through "6"
}

export enum Weekday {
  Saturday = 0,
  Sunday = 1,
  Monday = 2,
  Tuesday = 3,
  Wednesday = 4,
  Thursday = 5,
  Friday = 6
}

export const WEEKDAY_NAMES_FA = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه'
];
