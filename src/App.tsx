import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimelineEvent, DailyTemplate } from './types';
import DateGrid from './components/DateGrid';
import AiPromptModal from './components/AiPromptModal';
import AiIcon from './components/AiIcon';
import EventCard from './components/EventCard';
import CurrentTimeLine from './components/CurrentTimeLine';
import AddEventModal from './components/AddEventModal';
import SettingsPanel from './components/SettingsPanel';
import PillNav from './components/PillNav';
import { loadEvents, saveEvents, loadTemplates, saveTemplates } from './utils/storage';
import { generateTimelineEvents } from './utils/ai';
import { Sun, Moon, Plus, Trash2, Settings, Calendar } from 'lucide-react';

import { initialEvents, CARD_HEIGHT, CARD_GAP, START_OFFSET } from './constants';

/**
 * Main Application Component
 * Manages global state including events, themes, templates, and view transitions.
 * Features a unique "Liquid Timeline" with non-linear time-to-Y mapping.
 */
function App() {
  // State for all events, keyed by date string (YYYY-MM-DD)
  const [allEvents, setAllEvents] = useState<Record<string, TimelineEvent[]>>(() => {
    const saved = loadEvents();
    if (saved) return saved;

    // Initial data for today if no saved data exists
    const today = new Date().toISOString().split('T')[0];
    return { [today]: initialEvents };
  });

  // State for user-defined reusable daily templates
  const [templates, setTemplates] = useState<DailyTemplate[]>(() => {
    return loadTemplates() || [];
  });

  const [timeLeft, setTimeLeft] = useState('');
  const [currentTimeTop, setCurrentTimeTop] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'timeline'>('calendar');

  const dateProgress = useMemo(() => {
    const progress: Record<string, number> = {};
    Object.entries(allEvents).forEach(([date, dayEvents]) => {
      if (dayEvents.length === 0) {
        progress[date] = 0;
      } else {
        const completed = dayEvents.filter(e => e.isCompleted).length;
        progress[date] = completed / dayEvents.length;
      }
    });
    return progress;
  }, [allEvents]);

  const getDateKey = (date: Date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const dateKey = getDateKey(selectedDate);
  const events = allEvents[dateKey] || [];

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('unfold-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  // Theme persistence
  useEffect(() => {
    localStorage.setItem('unfold-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  // Persistence
  useEffect(() => {
    saveEvents(allEvents);
  }, [allEvents]);

  useEffect(() => {
    saveTemplates(templates);
  }, [templates]);

  // Helper to convert time string to total minutes
  const timeToMinutes = (timeStr: string) => {
    if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
  };

  const sortEvents = (evs: TimelineEvent[]) => {
    return [...evs].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  };

  /**
   * The "Magic" Logic: Non-Linear Mapping
   * Converts a time string (HH:mm) into a vertical Y coordinate.
   * Ensures that cards are spaced evenly regardless of the actual time duration between them,
   * while still maintaining mathematical accuracy within gaps.
   * 
   * @param timeStr - Time in "HH:mm" format
   * @returns Y pixel coordinate on the timeline
   */
  const getTimeY = (timeStr: string | undefined): number => {
    if (events.length === 0 || !timeStr) return START_OFFSET;

    const m = timeToMinutes(timeStr);
    const sortedEvents = sortEvents(events);

    // 1. Logic for time before the first event of the day
    const firstEvent = sortedEvents[0];
    const firstS = timeToMinutes(firstEvent.startTime);
    if (m <= firstS) {
      return START_OFFSET - (firstS - m);
    }

    // 2. Iterate through events and gaps to find where the time falls
    for (let i = 0; i < sortedEvents.length; i++) {
      const event = sortedEvents[i];
      const s = timeToMinutes(event.startTime);
      const e = timeToMinutes(event.endTime);
      const yStart = i * (CARD_HEIGHT + CARD_GAP) + START_OFFSET;
      const yEnd = yStart + CARD_HEIGHT;

      // Time is within an actual event block
      if (m >= s && m <= e) {
        const progress = (m - s) / (e - s || 1);
        return yStart + progress * CARD_HEIGHT;
      }

      // Time is in a gap between two events
      if (i < sortedEvents.length - 1) {
        const nextEvent = sortedEvents[i + 1];
        const nextS = timeToMinutes(nextEvent.startTime);
        if (m > e && m < nextS) {
          const progress = (m - e) / (nextS - e);
          return yEnd + progress * CARD_GAP;
        }
      }
    }

    // 3. Logic for time after the last event of the day
    const lastEvent = sortedEvents[sortedEvents.length - 1];
    const lastE = timeToMinutes(lastEvent.endTime);
    const lastYEnd = (sortedEvents.length - 1) * (CARD_HEIGHT + CARD_GAP) + START_OFFSET + CARD_HEIGHT;
    return lastYEnd + (m - lastE);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const nextEvent = events.find(e => !e.isCompleted);

      if (nextEvent) {
        // Offset by half the gap to center the line between cards
        setCurrentTimeTop(getTimeY(nextEvent.startTime) - CARD_GAP / 2);
      } else {
        // Offset by half the gap to center the line after the last card
        const lastYEnd = events.length * (CARD_HEIGHT + CARD_GAP) + START_OFFSET;
        setCurrentTimeTop(lastYEnd - CARD_GAP / 2);
      }

      const target = new Date();
      target.setHours(23, 59, 59);
      const diff = target.getTime() - now.getTime();
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hrs} hrs, ${mins} min, ${secs} secs`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [events]);

  const toggleEvent = (id: string) => {
    setAllEvents(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).map(ev =>
        ev.id === id ? { ...ev, isCompleted: !ev.isCompleted } : ev
      )
    }));
  };

  /**
   * Adds or updates an event in the current date's timeline.
   * Ensures UI remains solid by updating the global state and persisting to localStorage.
   */
  const handleAddOrUpdateEvent = (event: TimelineEvent) => {
    setAllEvents(prev => {
      const currentDayEvents = prev[dateKey] || [];
      const exists = currentDayEvents.find(e => e.id === event.id);
      let updatedDayEvents;
      if (exists) {
        updatedDayEvents = sortEvents(currentDayEvents.map(e => e.id === event.id ? event : e));
      } else {
        updatedDayEvents = sortEvents([...currentDayEvents, event]);
      }
      return { ...prev, [dateKey]: updatedDayEvents };
    });
    setEditingEvent(null);
  };

  const deleteEvent = (id: string) => {
    if (window.confirm('Delete this event?')) {
      setAllEvents(prev => ({
        ...prev,
        [dateKey]: (prev[dateKey] || []).filter(e => e.id !== id)
      }));
    }
  };

  const startEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const clearEvents = () => {
    if (window.confirm('Clear all events for this day?')) {
      setAllEvents(prev => ({ ...prev, [dateKey]: [] }));
    }
  };

  const handleImportEvents = (newEvents: TimelineEvent[]) => {
    setAllEvents(prev => ({ ...prev, [dateKey]: sortEvents(newEvents) }));
  };

  /**
   * Generates a complete daily timeline using Google Gemini AI.
   * Parses natural language input into structured TimelineEvent objects.
   */
  const handleAiGenerate = async (prompt: string) => {
    try {
      setIsGeneratingAi(true);
      const generatedEvents = await generateTimelineEvents(prompt);

      if (generatedEvents.length > 0) {
        setAllEvents(prev => ({
          ...prev,
          [dateKey]: sortEvents([...(prev[dateKey] || []), ...generatedEvents])
        }));
        setIsAiModalOpen(false);
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      let message = err.message || 'Unknown error';
      if (message.includes('429') || message.includes('quota')) {
        message = "AI Quota exceeded. Please wait a few seconds and try again, or check your rate limits in Google AI Studio.";
      }
      alert(`Failed to generate events: ${message}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveTemplate = (name: string) => {
    const newTemplate: DailyTemplate = {
      id: Date.now().toString(),
      name,
      events: events.map(e => ({
        title: e.title,
        startTime: e.startTime,
        endTime: e.endTime,
        iconName: e.iconName,
        color: e.color
      }))
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const handleApplyTemplate = (template: DailyTemplate) => {
    if (events.length > 0 && !window.confirm('Apply template? This will replace your current timeline for this day.')) {
      return;
    }

    const templateEvents: TimelineEvent[] = template.events.map(te => {
      const [startH, startM] = te.startTime.split(':').map(Number);
      const [endH, endM] = te.endTime.split(':').map(Number);
      const duration = (endH * 60 + endM) - (startH * 60 + startM);

      return {
        ...te,
        id: Math.random().toString(36).substr(2, 9),
        isCompleted: false,
        durationMinutes: duration > 0 ? duration : 30,
      };
    });

    setAllEvents(prev => ({ ...prev, [dateKey]: sortEvents(templateEvents) }));
    setIsSettingsOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('Delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  const checkConflict = (event: TimelineEvent, allEvents: TimelineEvent[]) => {
    const start = timeToMinutes(event.startTime);
    const end = timeToMinutes(event.endTime);

    return allEvents.some(other => {
      if (other.id === event.id) return false;
      const otherStart = timeToMinutes(other.startTime);
      const otherEnd = timeToMinutes(other.endTime);
      // Check for overlap: (StartA < EndB) and (EndA > StartB)
      return start < otherEnd && end > otherStart;
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setView('timeline');
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    // @ts-ignore - document.startViewTransition is not yet in TypeScript types
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    // @ts-ignore
    document.startViewTransition(() => {
      setTheme(newTheme);
    });
  };

  const viewTransition = {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1] as any // Premium cubic-bezier
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {view === 'calendar' ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={viewTransition}
            className="app-container"
            style={{
              padding: '40px 16px',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <DateGrid
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              dateProgress={dateProgress}
            />

            <div style={{
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              zIndex: 100,
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <button
                onClick={() => setIsAiModalOpen(true)}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '28px',
                  backgroundColor: 'var(--selection-bg)',
                  border: 'none',
                  color: 'var(--accent-orange-vibrant)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}
              >
                <AiIcon size={24} />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '28px',
                  backgroundColor: 'var(--selection-bg)',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}
              >
                <Settings size={24} />
              </button>
            </div>

            <AnimatePresence>
              {isSettingsOpen && (
                <SettingsPanel
                  onClose={() => setIsSettingsOpen(false)}
                  events={events}
                  onImport={handleImportEvents}
                  onClear={() => setAllEvents(prev => ({ ...prev, [dateKey]: [] }))}
                  templates={templates}
                  onSaveTemplate={handleSaveTemplate}
                  onApplyTemplate={handleApplyTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  theme={theme}
                  onThemeChange={handleThemeChange}
                />
              )}

              {isAiModalOpen && (
                <AiPromptModal
                  onClose={() => setIsAiModalOpen(false)}
                  onGenerate={handleAiGenerate}
                  isGenerating={isGeneratingAi}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
            transition={viewTransition}
            className="app-container"
            style={{
              padding: '40px 16px',
              minHeight: '100vh',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div
              onClick={() => setView('calendar')}
              style={{
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: 'fit-content'
              }}
            >
              <div style={{ fontSize: '48px', fontWeight: '800' }}>{selectedDate.getDate()}</div>
              <div>
                <div style={{ fontWeight: '700', textTransform: 'uppercase' }}>{selectedDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                <div style={{ opacity: 0.6 }}>{selectedDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              </div>
            </div>

            <div style={{ position: 'relative', flexGrow: 1, marginLeft: '40px' }}>
              <div style={{
                position: 'absolute',
                left: '24px',
                top: `${START_OFFSET - 40}px`,
                width: '24px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}>
                <Sun size={20} style={{ opacity: 0.6 }} />
              </div>

              <div style={{
                position: 'absolute',
                left: '36px',
                top: `${START_OFFSET - 20}px`,
                height: `${events.length * (CARD_HEIGHT + CARD_GAP) + 40}px`,
                width: '2px',
                backgroundColor: 'var(--spine-gray)',
                zIndex: 0
              }}></div>

              <CurrentTimeLine top={currentTimeTop} />

              <AnimatePresence>
                {Array.from(new Set(events.map(e => parseInt(e.startTime.split(':')[0])))).sort((a, b) => a - b).map(hour => {
                  const y = getTimeY(`${String(hour).padStart(2, '0')}:00`);
                  if (y < START_OFFSET) return null;
                  return (
                    <motion.div
                      key={hour}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 0.35, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      style={{
                        position: 'absolute',
                        left: '-32px',
                        top: `${y}px`,
                        color: 'var(--text-secondary)',
                        fontWeight: 'bold',
                        fontSize: '38px',
                        transform: 'translateY(-50%)',
                        letterSpacing: '-0.02em',
                        zIndex: 1
                      }}
                    >
                      {String(hour).padStart(2, '0')}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <div className="events-list" style={{
                paddingTop: `${START_OFFSET}px`,
                display: 'flex',
                flexDirection: 'column',
                gap: `${CARD_GAP}px`
              }}>
                <AnimatePresence mode="popLayout">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      hasConflict={checkConflict(event, events)}
                      onToggle={toggleEvent}
                      onDelete={deleteEvent}
                      onEdit={startEdit}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <motion.div
                layout
                style={{
                  position: 'absolute',
                  left: '24px',
                  top: `${events.length * (CARD_HEIGHT + CARD_GAP) + START_OFFSET}px`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  zIndex: 2,
                  paddingBottom: '100px',
                }}
              >
                <Moon size={20} style={{ opacity: 0.6 }} />
                <span style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}>
                  End of day: {timeLeft}
                </span>
              </motion.div>
            </div>

            <AnimatePresence>
              {isModalOpen && (
                <AddEventModal
                  onClose={() => { setIsModalOpen(false); setEditingEvent(null); }}
                  onAdd={handleAddOrUpdateEvent}
                  eventToEdit={editingEvent}
                  theme={theme}
                />
              )}

              {isSettingsOpen && (
                <SettingsPanel
                  onClose={() => setIsSettingsOpen(false)}
                  events={events}
                  onImport={handleImportEvents}
                  onClear={() => setAllEvents(prev => ({ ...prev, [dateKey]: [] }))}
                  templates={templates}
                  onSaveTemplate={handleSaveTemplate}
                  onApplyTemplate={handleApplyTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  theme={theme}
                  onThemeChange={setTheme}
                />
              )}

              {isAiModalOpen && (
                <AiPromptModal
                  onClose={() => setIsAiModalOpen(false)}
                  onGenerate={handleAiGenerate}
                  isGenerating={isGeneratingAi}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Navigation */}
      {
        view === 'timeline' && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '428px',
            padding: '12px 20px 24px',
            zIndex: 500,
            background: 'linear-gradient(transparent, var(--bg-black) 40%)',
          }}>
            <PillNav items={[
              {
                id: 'calendar',
                label: 'Calendar',
                icon: Calendar,
                onClick: () => setView('calendar')
              },
              {
                id: 'create',
                label: 'Create',
                icon: Plus,
                onClick: () => { setEditingEvent(null); setIsModalOpen(true); }
              },
              {
                id: 'clear',
                label: 'Clear',
                icon: Trash2,
                onClick: clearEvents,
                destructive: true
              },
              {
                id: 'magic',
                label: 'Magic',
                icon: AiIcon as any,
                onClick: () => setIsAiModalOpen(true),
                color: 'var(--accent-orange-vibrant)'
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: Settings,
                onClick: () => setIsSettingsOpen(true)
              }
            ]} />
          </div>
        )}
    </>
  );
}

export default App;
