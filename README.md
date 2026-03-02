# Unfold

A high-fidelity, personal daily timeline application with a premium aesthetic and a unique "Liquid Timeline" that prioritizes visual uniformity and clarity. Installable as a PWA for a native-app feel.

> 🚀 **What's New — AI Magic Timeline is LIVE!**
> Describe your day in plain language and let Gemini AI generate your entire timeline instantly. Just tap the ✨ Magic button in the navigation bar and watch your day unfold.

## Features

### Core
- **Liquid Timeline**: Non-linear mapping for even card spacing with mathematical time accuracy.
- **Smart Snapping**: A dynamic red indicator that snaps to your next pending activity.
- **End-of-Day Countdown**: Live real-time countdown to the end of your scheduled day.
- **Conflict Detection**: Visual warnings when tasks overlap in time.

### AI-Powered
- **Magic Timeline**: Describe your day in plain language and Gemini AI generates a full timeline of events for you.
- **Natural Language Input**: Simply tell the AI what your day looks like and it "unfolds" it into structured timeline events.

### Calendar & Planning
- **Calendar-First Entry**: The app opens directly to a premium circular date grid for intuitive day selection.
- **Full Month View**: The grid shows leading and trailing days from adjacent months as subtle hollow circles for a complete calendar feel.
- **Progress Rings**: Dynamic SVG rings around each day visualize task completion progress.
- **Pulsing Today Indicator**: The current day's progress ring features a smooth pulsing animation.

### Task Management
- **Create, Edit & Delete**: Full CRUD for timeline events with custom icons and colors.
- **Daily Templates**: Save and apply reusable routines (Morning, Work Day, etc.).
- **Export / Import**: JSON-based data portability for backup and restore.
- **Recurring Tasks**: Tag tasks as daily or weekly repeating.

### Navigation & UI
- **Premium View Transitions**: Smooth blur, scale, and slide transitions between calendar and timeline views powered by Framer Motion.
- **Circular Reveal Theme Switch**: Switching between Dark and Light modes triggers a sophisticated circular reveal animation using the View Transitions API.
- **Glassmorphic Settings**: A frosted-glass settings overlay with strict mobile stability (no jitter, locked background scrolling).
- **Pill Navigation**: A sleek bottom navigation bar with animated hover states and spring-based pill transitions.
- **Staggered Animations**: Cards animate in on scroll with blur and slide transitions.
- **Mobile Optimized**: Compressed timeline gutter for maximum card width on smaller screens.

### Themes
- **Dark Mode**: A rich, high-contrast dark theme with vibrant orange accents.
- **Light Mode**: A clean white theme with precise, theme-aware variables for overlays, borders, and inputs.

### Platform
- **PWA Support**: Installable on mobile and desktop with offline caching via Service Worker.
- **Responsive**: Optimized for mobile (iPhone 12 Pro Max) and desktop viewports.

## Tech Stack

- **React** + **TypeScript** — Core UI with type safety.
- **Vite** — Ultra-fast dev server and build tool.
- **Framer Motion** — Fluid animations and micro-interactions.
- **Google Gemini AI** — AI-powered timeline generation.
- **Lucide React** — Modern, professional icons.
- **LocalStorage** — Client-side persistence with encryption.

## Getting Started

```bash
npm install
npm run dev
```

Open the provided local URL in your browser.

### AI Setup (Required for "Magic" Feature)

To enable the Magic Timeline feature, you need a Gemini API key:

1.  **Get a API Key**: Visit [Google AI Studio](https://aistudio.google.com/apikey) and create a free key.
2.  **Local Setup**: Create a `.env` file in the project root:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
3.  **Vercel / Production Setup**: If you are deploying to Vercel, you must add the environment variable in your dashboard.
    *   👉 **Follow the [Vercel Setup Guide](vercel_setup.md)** for step-by-step instructions.

## License

MIT License — see the [LICENSE](LICENSE) file for details.
