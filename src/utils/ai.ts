import type { TimelineEvent } from "../types";

/**
 * Client-side AI utility for timeline generation.
 * Communicates with the proxy API to securely generate events.
 */
export async function generateTimelineEvents(prompt: string): Promise<TimelineEvent[]> {
    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const events: TimelineEvent[] = await response.json();
        return events;
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
}
