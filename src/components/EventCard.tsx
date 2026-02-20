import type { FC } from 'react';
import type { TimelineEvent } from '../types';

interface EventCardProps {
    event: TimelineEvent;
    onToggle?: (id: string) => void;
}

const EventCard: FC<EventCardProps> = ({ event, onToggle }) => {
    return (
        <div className="event-card-container" style={{ height: '120px', position: 'relative' }}>
            <div className="event-card" style={{
                backgroundColor: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '15px 20px',
                marginLeft: '100px',
                height: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.05)',
                overflow: 'hidden'
            }}>
                <div className="event-info" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        textDecoration: event.isCompleted ? 'line-through' : 'none',
                        color: event.isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {event.title}
                    </h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <p>{event.startTime} - {event.endTime}</p>
                        <p style={{ opacity: 0.8 }}>({event.durationMinutes} min)</p>
                    </div>
                </div>

                <div
                    onClick={() => onToggle?.(event.id)}
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        border: `2px solid ${event.color}`,
                        backgroundColor: event.isCompleted ? event.color : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {event.isCompleted && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    )}
                </div>
            </div>

            {/* Icon on the timeline spine */}
            <div style={{
                position: 'absolute',
                left: '42px',
                top: '10%',
                width: '36px',
                height: '80%',
                borderRadius: '10px',
                backgroundColor: event.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                boxShadow: `0 0 15px ${event.color}44`
            }}>
                {event.icon}
            </div>
        </div>
    );
};

export default EventCard;
