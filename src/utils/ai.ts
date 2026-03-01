import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TimelineEvent } from "../types";

const ICON_NAMES = [
    "Check", "Briefcase", "Coffee", "Dumbbell", "User", "Heart",
    "Plane", "Zap", "Star", "Flame", "Moon", "Sun"
];

const COLORS = [
    "#007AFF", "#34C759", "#FF9500", "#FF3B30", "#AF52DE", "#5856D6",
    "#FF2D55", "#FFD60A", "#64D2FF", "#00C7BE", "#DA8FFF"
];

export async function generateTimelineEvents(prompt: string): Promise<TimelineEvent[]> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_key_here') {
        const isProduction = import.meta.env.PROD;
        const errorMessage = isProduction
            ? "VITE_GEMINI_API_KEY is missing. Please ensure it's added to your Vercel Environment Variables."
            : "VITE_GEMINI_API_KEY is missing or invalid in .env";

        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const systemPrompt = `
      You are an expert scheduling assistant for the "Unfold" timeline app.
      Your goal is to parse user requests and return a structured list of timeline events.
      
      RULES:
      1. ONLY return a JSON array of events. Do not include any text before or after the JSON.
      2. Each event MUST have:
         - id: a unique string (generate a short random one)
         - title: string
         - startTime: string (HH:mm format)
         - endTime: string (HH:mm format)
         - durationMinutes: number
         - color: hex string (choose from: ${COLORS.join(", ")})
         - iconName: string (must be one of: ${ICON_NAMES.join(", ")})
         - isCompleted: false
      3. Ensure times are logical (startTime before endTime) and durations match.
      4. Try to make the schedule balanced and realistic.
    `;

        const result = await model.generateContent([systemPrompt, prompt]);
        const responseText = result.response.text();

        // Attempt to parse. Gemini 1.5 with JSON mime-type should be very reliable.
        const events = JSON.parse(responseText);

        if (Array.isArray(events)) {
            return events as TimelineEvent[];
        }

        throw new Error("Invalid format returned from AI");
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
}
