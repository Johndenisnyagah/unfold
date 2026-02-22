import { useState, useEffect } from 'react';
import type { TimelineEvent, DailyTemplate } from './types';
import { Sun, Moon, Plus, Trash2, Settings } from 'lucide-react';
import EventCard from './components/EventCard';
import CurrentTimeLine from './components/CurrentTimeLine';
import AddEventModal from './components/AddEventModal';
import SettingsPanel from './components/SettingsPanel';
import PillNav from './components/PillNav';
import CalendarPill from './components/CalendarPill';
import { loadEvents, saveEvents, loadTemplates, saveTemplates } from './utils/storage';

import { initialEvents, CARD_HEIGHT, CARD_GAP, START_OFFSET } from './constants';

function App() {
  const [events, setEvents] = useState<TimelineEvent[]>(() => {
    const saved = loadEvents();
    return saved || initialEvents;
  });
  const [templates, setTemplates] = useState<DailyTemplate[]>(() => {
    return loadTemplates() || [];
  });
  const [timeLeft, setTimeLeft] = useState('');
  const [currentTimeTop, setCurrentTimeTop] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Persistence
  useEffect(() => {
    saveEvents(events);
  }, [events]);

  useEffect(() => {
    saveTemplates(templates);
  }, [templates]);

  // Helper to convert time string to total minutes
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const sortEvents = (evs: TimelineEvent[]) => {
    return [...evs].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  };

  // The Magic Logic: Non-Linear Mapping
  const getTimeY = (timeStr: string) => {
    if (events.length === 0) return START_OFFSET;

    const m = timeToMinutes(timeStr);
    const sortedEvents = sortEvents(events);

    // 1. Before first event?
    const firstEventM = timeToMinutes(sortedEvents[0].startTime);
    if (m <= firstEventM) {
      return START_OFFSET - (firstEventM - m);
    }

    // 2. Iterate through events and gaps
    for (let i = 0; i < sortedEvents.length; i++) {
      const event = sortedEvents[i];
      const s = timeToMinutes(event.startTime);
      const e = timeToMinutes(event.endTime);
      const yStart = i * (CARD_HEIGHT + CARD_GAP) + START_OFFSET;
      const yEnd = yStart + CARD_HEIGHT;

      if (m >= s && m <= e) {
        const progress = (m - s) / (e - s || 1);
        return yStart + progress * CARD_HEIGHT;
      }

      if (i < sortedEvents.length - 1) {
        const nextEvent = sortedEvents[i + 1];
        const nextS = timeToMinutes(nextEvent.startTime);
        if (m > e && m < nextS) {
          const progress = (m - e) / (nextS - e);
          return yEnd + progress * CARD_GAP;
        }
      }
    }

    // 3. After last event?
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
    setEvents(prev => prev.map(ev =>
      ev.id === id ? { ...ev, isCompleted: !ev.isCompleted } : ev
    ));
  };

  const handleAddOrUpdateEvent = (event: TimelineEvent) => {
    setEvents(prev => {
      const exists = prev.find(e => e.id === event.id);
      if (exists) {
        return sortEvents(prev.map(e => e.id === event.id ? event : e));
      }
      return sortEvents([...prev, event]);
    });
    setEditingEvent(null);
  };

  const deleteEvent = (id: string) => {
    if (window.confirm('Delete this event?')) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const startEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const clearEvents = () => {
    if (window.confirm('Clear all events?')) {
      setEvents([]);
    }
  };

  const handleImportEvents = (newEvents: TimelineEvent[]) => {
    setEvents(sortEvents(newEvents));
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
    if (events.length > 0 && !window.confirm('Apply template? This will replace your current timeline.')) {
      return;
    }

    const templateEvents: TimelineEvent[] = template.events.map(te => {
      const [startH, startM] = te.startTime.split(':').map(Number);
      const [endH, endM] = te.endTime.split(':').map(Number);
      const duration = (endH * 60 + endM) - (startH * 60 + startM);

      return {
        ...te,
        id: Math.random().toString(36).substr(2, 9),
        durationMinutes: duration > 0 ? duration : 30,
        isCompleted: false
      };
    });

    setEvents(sortEvents(templateEvents));
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

  return (
    <>
      <div className="app-container" style={{
        padding: '40px 16px',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Top Calendar Navigation */}
        <CalendarPill
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Timeline Column */}
        <div style={{ position: 'relative', flexGrow: 1, marginLeft: '40px' }}> {/* Balanced margin */}

          {/* Top Sun Icon */}
          <div style={{
            position: 'absolute',
            left: '24px', // Shifted right to clear hour markers
            top: `${START_OFFSET - 40}px`,
            width: '24px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            backgroundColor: 'transparent'
          }}>
            <Sun size={16} style={{ opacity: 0.6 }} />
          </div>

          {/* Vertical Spine */}
          <div style={{
            position: 'absolute',
            left: '36px', // Shifted right to clear hour markers
            top: '0px',
            bottom: '-20px',
            width: '2px',
            backgroundColor: 'var(--spine-gray)',
            zIndex: 0
          }}></div>

          {/* Current Time Line */}
          <CurrentTimeLine top={currentTimeTop} />

          {/* Dynamic Hour Markers */}
          {Array.from(new Set(events.map(e => parseInt(e.startTime.split(':')[0])))).sort((a, b) => a - b).map(hour => {
            const y = getTimeY(`${String(hour).padStart(2, '0')}:00`);
            if (y < START_OFFSET) return null;
            return (
              <div key={hour} style={{
                position: 'absolute',
                left: '-32px', // Brought back into visible bounds (Absolute 8px)
                top: `${y}px`,
                color: 'var(--text-secondary)',
                fontWeight: 'bold',
                fontSize: '38px', // Slightly taller for prominence
                opacity: 0.35,
                transform: 'translateY(-50%)',
                transition: 'top 0.5s ease',
                letterSpacing: '-0.02em',
                zIndex: 1
              }}>
                {String(hour).padStart(2, '0')}
              </div>
            );
          })}

          {/* Events Stack */}
          <div className="events-list" style={{
            paddingTop: `${START_OFFSET}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: `${CARD_GAP}px`
          }}>
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
          </div>

          {/* Bottom Moon Icon */}
          <div style={{
            position: 'absolute',
            left: '24px', // Match Sun alignment
            top: `${events.length * (CARD_HEIGHT + CARD_GAP) + START_OFFSET}px`,
            width: '24px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            backgroundColor: 'transparent',
            transition: 'top 0.5s ease'
          }}>
            <Moon size={16} style={{ opacity: 0.6 }} />
          </div>

        </div>

        {/* Footer Info */}
        <div style={{
          marginLeft: '100px',
          marginTop: '60px',
          color: 'var(--text-secondary)',
          fontSize: '15px',
          paddingBottom: '120px', // Extra padding for the floating bar
        }}>
          <p>End of day: {timeLeft}</p>
        </div>

        {/* Animated Pill Nav Bar */}
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)', // Full width minus page padding
          maxWidth: '380px',
          zIndex: 100,
        }}>
          <PillNav items={[
            {
              id: 'create',
              label: 'Create event',
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
              id: 'settings',
              label: 'Settings',
              icon: Settings,
              onClick: () => setIsSettingsOpen(true)
            }
          ]} />
        </div>

        <AddEventModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingEvent(null); }}
          onAdd={handleAddOrUpdateEvent}
          eventToEdit={editingEvent}
        />

        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          events={events}
          onImport={handleImportEvents}
          onClear={() => setEvents([])}
          templates={templates}
          onSaveTemplate={handleSaveTemplate}
          onApplyTemplate={handleApplyTemplate}
          onDeleteTemplate={handleDeleteTemplate}
        />
      </div>
    </>
  );
}

export default App;

