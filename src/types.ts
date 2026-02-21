export interface TimelineEvent {
  id: string;
  title: string;
  startTime: string; // ISO string or simple time format "HH:mm"
  endTime: string;
  durationMinutes: number;
  iconName: string; // Key for icon mapping
  color: string; // CSS variable or hex
  isCompleted: boolean;
}

export interface EventTemplate {
  title: string;
  startTime: string;
  endTime: string;
  iconName: string;
  color: string;
}

export interface DailyTemplate {
  id: string;
  name: string;
  events: EventTemplate[];
}

export interface DayTimeline {
  date: string;
  events: TimelineEvent[];
}
