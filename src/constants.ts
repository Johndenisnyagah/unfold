import type { TimelineEvent } from './types';

export const CARD_HEIGHT = 120;
export const CARD_GAP = 20;
export const START_OFFSET = 40;

export const initialEvents: TimelineEvent[] = [
    {
        id: '1',
        title: 'Morning Workout',
        startTime: '07:30',
        endTime: '08:30',
        durationMinutes: 60,
        iconName: 'Activity',
        color: 'var(--accent-pink)',
        isCompleted: false
    },
    {
        id: '2',
        title: 'Focus Work',
        startTime: '09:00',
        endTime: '11:00',
        durationMinutes: 120,
        iconName: 'Code',
        color: 'var(--accent-blue)',
        isCompleted: false
    },
    {
        id: '3',
        title: 'Team Meeting',
        startTime: '11:30',
        endTime: '12:30',
        durationMinutes: 60,
        iconName: 'MessageSquare',
        color: 'var(--accent-orange)',
        isCompleted: false
    },
    {
        id: '4',
        title: 'Strategy Session',
        startTime: '14:00',
        endTime: '15:30',
        durationMinutes: 90,
        iconName: 'Target',
        color: 'var(--accent-purple)',
        isCompleted: false
    }
];
