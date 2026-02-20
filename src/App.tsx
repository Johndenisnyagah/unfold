import { useState, useEffect } from 'react';
import type { TimelineEvent } from './types';
import { Dumbbell, Bath, Coffee, Mail, Sun, Moon } from 'lucide-react';
import EventCard from './components/EventCard';
import CurrentTimeLine from './components/CurrentTimeLine';

const initialEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'Morning Workout',
    startTime: '07:45',
    endTime: '08:15',
    durationMinutes: 30,
    icon: <Dumbbell size={20} color="white" />,
    color: 'var(--accent-pink)',
    isCompleted: true
  },
  {
    id: '2',
    title: 'Shower',
    startTime: '08:15',
    endTime: '08:30',
    durationMinutes: 15,
    icon: <Bath size={20} color="white" />,
    color: 'var(--accent-blue)',
    isCompleted: false
  },
  {
    id: '3',
    title: 'Breakfast',
    startTime: '08:30',
    endTime: '09:00',
    durationMinutes: 30,
    icon: <Coffee size={20} color="white" />,
    color: 'var(--accent-orange)',
    isCompleted: false
  },
  {
    id: '4',
    title: 'Check Email',
    startTime: '09:00',
    endTime: '09:15',
    durationMinutes: 15,
    icon: <Mail size={20} color="white" />,
    color: 'var(--accent-purple)',
    isCompleted: false
  }
];

const CARD_HEIGHT = 120;
const CARD_GAP = 20;
const START_OFFSET = 40; // Space for the Sun icon

function App() {
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
  const [timeLeft, setTimeLeft] = useState('');
  const [currentTimeTop, setCurrentTimeTop] = useState(0);

  // Helper to convert time string to total minutes
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // The Magic Logic: Non-Linear Mapping
  const getTimeY = (timeStr: string) => {
    const m = timeToMinutes(timeStr);

    // Sort events by start time just in case
    const sortedEvents = [...events].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    // 1. Before first event?
    const firstEventM = timeToMinutes(sortedEvents[0].startTime);
    if (m <= firstEventM) {
      // Linearly scale before first event (roughly 1px per min)
      return START_OFFSET - (firstEventM - m);
    }

    // 2. Iterate through events and gaps
    for (let i = 0; i < sortedEvents.length; i++) {
      const event = sortedEvents[i];
      const s = timeToMinutes(event.startTime);
      const e = timeToMinutes(event.endTime);
      const yStart = i * (CARD_HEIGHT + CARD_GAP) + START_OFFSET;
      const yEnd = yStart + CARD_HEIGHT;

      // During an event?
      if (m >= s && m <= e) {
        const progress = (m - s) / (e - s || 1);
        return yStart + progress * CARD_HEIGHT;
      }

      // Between this event and next?
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

      // Find the first incomplete event to snap the line to
      const nextEvent = events.find(e => !e.isCompleted);

      if (nextEvent) {
        // Snap to the start of the next incomplete task
        setCurrentTimeTop(getTimeY(nextEvent.startTime));
      } else {
        // If all done, snap to the Moon icon position
        const lastYEnd = events.length * (CARD_HEIGHT + CARD_GAP) + START_OFFSET;
        setCurrentTimeTop(lastYEnd);
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
  }, [events]); // Re-calculate if events change

  const toggleEvent = (id: string) => {
    setEvents(prev => prev.map(ev =>
      ev.id === id ? { ...ev, isCompleted: !ev.isCompleted } : ev
    ));
  };

  return (
    <div className="app-container" style={{
      padding: '40px 20px',
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Timeline Column */}
      <div style={{ position: 'relative', flexGrow: 1, marginLeft: '20px' }}>

        {/* Top Sun Icon */}
        <div style={{
          position: 'absolute',
          left: '40px',
          top: `${START_OFFSET - 40}px`,
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          backgroundColor: 'var(--bg-black)'
        }}>
          <Sun size={18} style={{ opacity: 0.6 }} />
        </div>

        {/* Vertical Spine (Connected from Sun to Moon) */}
        <div style={{
          position: 'absolute',
          left: '60px',
          top: '0px',
          bottom: '-20px', // Spans through the Moon icon
          width: '2px',
          backgroundColor: 'var(--spine-gray)',
          zIndex: 0
        }}></div>

        {/* Current Time Line */}
        <CurrentTimeLine top={currentTimeTop} />

        {/* Dynamic Hour Markers (Only for hours with events and within bounds) */}
        {Array.from(new Set(events.map(e => parseInt(e.startTime.split(':')[0])))).sort((a, b) => a - b).map(hour => {
          const y = getTimeY(`${String(hour).padStart(2, '0')}:00`);
          if (y < START_OFFSET) return null; // Hide if above the Sun icon
          return (
            <div key={hour} style={{
              position: 'absolute',
              left: '10px',
              top: `${y}px`,
              color: 'var(--text-secondary)',
              fontWeight: 'bold',
              fontSize: '24px',
              transform: 'translateY(-50%)',
              transition: 'top 0.5s ease'
            }}>
              {String(hour).padStart(2, '0')}
            </div>
          );
        })}

        {/* Events Stack (Linear Flow) */}
        <div className="events-list" style={{
          paddingTop: `${START_OFFSET}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: `${CARD_GAP}px`
        }}>
          {events.map(event => (
            <EventCard key={event.id} event={event} onToggle={toggleEvent} />
          ))}
        </div>

        {/* Bottom Moon Icon (Now relative to cards) */}
        <div style={{
          position: 'absolute',
          left: '40px',
          top: `${events.length * (CARD_HEIGHT + CARD_GAP) + START_OFFSET}px`,
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          backgroundColor: 'var(--bg-black)',
          transition: 'top 0.5s ease'
        }}>
          <Moon size={18} style={{ opacity: 0.6 }} />
        </div>

      </div>

      {/* Footer Info */}
      <div style={{
        marginLeft: '100px',
        marginTop: '60px',
        color: 'var(--text-secondary)',
        fontSize: '15px',
        paddingBottom: '80px'
      }}>
        <p>End of day: {timeLeft}</p>
        <button style={{
          marginTop: '16px',
          backgroundColor: '#2c2c2e',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          <span style={{ fontSize: '18px' }}>+</span> Create event
        </button>
      </div>
    </div>
  );
}

export default App;
