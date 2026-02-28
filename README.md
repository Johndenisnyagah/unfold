# Unfold

A high-fidelity, personal daily timeline application with a premium dark aesthetic and a unique "Liquid Timeline" that prioritizes visual uniformity and clarity. Installable as a PWA for a native-app feel.

## Features

### Core
- **Liquid Timeline**: Non-linear mapping for even card spacing with mathematical time accuracy.
- **Smart Snapping**: A dynamic red indicator that snaps to your next pending activity.
- **End-of-Day Countdown**: Live real-time countdown to the end of your scheduled day.
- **Conflict Detection**: Visual warnings when tasks overlap in time.

### Task Management
- **Create, Edit & Delete**: Full CRUD for timeline events with custom icons and colors.
- **Daily Templates**: Save and apply reusable routines (Morning, Work Day, etc.).
- **Export / Import**: JSON-based data portability for backup and restore.
- **Recurring Tasks**: Tag tasks as daily or weekly repeating.

### Navigation & UI
- **Fluid Calendar**: Horizontally scrollable date picker with premium grey selection pills, high-contrast white active text, and a centered triangle indicator.
- **Glassmorphic Design**: Premium frosted-glass navigation bars with balanced symmetry and updated icon presence.
- **Timeline Refinement**: A perfectly aligned vertical spine spanning between larger Sun and Moon icons for a cleaner, unified aesthetic.
- **Staggered Animations**: Cards animate in on scroll with blur and slide transitions — replays on every scroll.
- **Mobile Optimized**: Compressed timeline gutter for maximum card width on smaller screens, with refined spacing for readability.

### Platform
- **PWA Support**: Installable on mobile and desktop with offline caching via Service Worker.
- **Responsive**: Optimized for mobile (iPhone 12 Pro Max) and desktop viewports.

## Tech Stack

- **React** + **TypeScript** — Core UI with type safety.
- **Vite** — Ultra-fast dev server and build tool.
- **Framer Motion** — Fluid animations and micro-interactions.
- **Lucide React** — Modern, professional icons.
- **LocalStorage** — Client-side persistence with encryption.

## Getting Started

```bash
npm install
npm run dev
```

Open the provided local URL in your browser.

## License

MIT License — see the [LICENSE](LICENSE) file for details.
