import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ICON_NAMES = [
    "dumbbell", "bath", "coffee", "mail", "star", "book", "heart", "utensils",
    "laptop", "car", "smartphone", "glass-water", "users", "music", "Activity",
    "Code", "MessageSquare", "Target"
];

const COLORS = [
    "#ff2d55", "#007aff", "#ff9500", "#af52de", "#34c759", "#5856d6",
    "#af52de", "#ff3b30", "#ffcc00", "#34c759", "#5ac8fa", "#ff9500",
    "#8e8e93", "#ff2d55"
];

/**
 * Serverless function for AI-powered timeline generation.
 * Integrates with Google Gemini API to parse natural language into structured events.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set in environment variables.");
        return res.status(500).json({ error: "Server configuration error." });
    }

    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "A valid 'prompt' string is required." });
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

        const events = JSON.parse(responseText);

        if (!Array.isArray(events)) {
            return res.status(500).json({ error: "Invalid format returned from AI" });
        }

        return res.status(200).json(events);
    } catch (error) {
        console.error("AI Generation Error:", error);
        return res.status(500).json({ error: "Failed to generate events." });
    }
}
