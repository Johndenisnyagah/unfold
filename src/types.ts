export interface TimelineEvent {
  id: string;
  title: string;
  startTime: string; // ISO string or simple time format "HH:mm"
  endTime: string;
  durationMinutes: number;
  icon: any; // Lucide icon component or string
  color: string; // CSS variable or hex
  isCompleted: boolean;
}

export interface DayTimeline {
  date: string;
  events: TimelineEvent[];
}
