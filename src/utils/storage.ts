import type { TimelineEvent, DailyTemplate } from '../types';

const STORAGE_KEY = 'unfold_events';
const TEMPLATE_KEY = 'unfold_templates';

export const saveEvents = (events: TimelineEvent[]) => {
    try {
        const serializedEvents = JSON.stringify(events);
        localStorage.setItem(STORAGE_KEY, serializedEvents);
    } catch (err) {
        console.error('Could not save events', err);
    }
};

export const loadEvents = (): TimelineEvent[] | null => {
    try {
        const serializedEvents = localStorage.getItem(STORAGE_KEY);
        if (serializedEvents === null) return null;

        const events = JSON.parse(serializedEvents);
        return Array.isArray(events) ? events : null;
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
