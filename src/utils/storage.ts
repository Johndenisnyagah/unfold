import type { TimelineEvent, DailyTemplate } from '../types';

const STORAGE_KEY = 'unfold_events';
const TEMPLATE_KEY = 'unfold_templates';

export const saveEvents = (events: Record<string, TimelineEvent[]>) => {
    try {
        const serializedEvents = JSON.stringify(events);
        localStorage.setItem(STORAGE_KEY, serializedEvents);
    } catch (err) {
        console.error('Could not save events', err);
    }
};

export const loadEvents = (): Record<string, TimelineEvent[]> | null => {
    try {
        const serializedEvents = localStorage.getItem(STORAGE_KEY);
        if (serializedEvents === null) return null;

        const data = JSON.parse(serializedEvents);

        // Migration: If it's a legacy array, wrap it in a "global" or current date key
        if (Array.isArray(data)) {
            const today = new Date().toISOString().split('T')[0];
            return { [today]: data };
        }

        return typeof data === 'object' ? data : null;
    } catch (err) {
        console.error('Could not load events', err);
        return null;
    }
};

export const saveTemplates = (templates: DailyTemplate[]) => {
    try {
        localStorage.setItem(TEMPLATE_KEY, JSON.stringify(templates));
    } catch (err) {
        console.error('Could not save templates', err);
    }
};

export const loadTemplates = (): DailyTemplate[] | null => {
    try {
        const serialized = localStorage.getItem(TEMPLATE_KEY);
        if (!serialized) return null;
        const templates = JSON.parse(serialized);
        return Array.isArray(templates) ? templates : null;
    } catch (err) {
        console.error('Could not load templates', err);
        return null;
    }
};
