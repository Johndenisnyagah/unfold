import React, { type FC } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Bath, Coffee, Mail, Star, Book, Heart, Trash2, Utensils, Laptop, Car, Smartphone, GlassWater, Users, Music, Check, AlertCircle } from 'lucide-react';
import type { TimelineEvent } from '../types';

interface EventCardProps {
    event: TimelineEvent;
    index?: number;
    hasConflict?: boolean;
    onToggle?: (id: string) => void;
    onEdit?: (event: TimelineEvent) => void;
    onDelete?: (id: string) => void;
}

export const ICON_MAP: Record<string, React.ReactNode> = {
    'dumbbell': <Dumbbell size={20} color="white" />,
    'bath': <Bath size={20} color="white" />,
    'coffee': <Coffee size={20} color="white" />,
    'mail': <Mail size={20} color="white" />,
    'star': <Star size={20} color="white" />,
    'book': <Book size={20} color="white" />,
    'heart': <Heart size={20} color="white" />,
    'utensils': <Utensils size={20} color="white" />,
    'laptop': <Laptop size={20} color="white" />,
    'car': <Car size={20} color="white" />,
    'smartphone': <Smartphone size={20} color="white" />,
    'glass-water': <GlassWater size={20} color="white" />,
    'users': <Users size={20} color="white" />,
    'music': <Music size={20} color="white" />,
};

const EventCard: FC<EventCardProps> = ({ event, index = 0, hasConflict = false, onToggle, onEdit, onDelete }) => {
    const icon = ICON_MAP[event.iconName] || <Check size={20} color="white" />;

    return (
        <motion.div
            initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{
                duration: 0.7,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            className="event-card-container"
            style={{ height: '120px', position: 'relative' }}
        >
            {/* Conflict Indicator Badge */}
            {hasConflict && (
                <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '90px', // Re-adjusted for balanced card shift
                    backgroundColor: '#ff3b30',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 10px rgba(255, 59, 48, 0.4)'
                }}>
                    <AlertCircle size={10} strokeWidth={3} />
                    CONFLICT
                </div>
            )}

            <div className="event-card" style={{
                backgroundColor: 'rgba(44, 44, 46, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '15px 20px',
                marginLeft: '64px', // Closer to icons
                height: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: hasConflict ? '0 8px 32px rgba(255, 59, 48, 0.15)' : '0 8px 24px rgba(0,0,0,0.2)',
                border: hasConflict ? '1px solid rgba(255, 59, 48, 0.3)' : '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
            }}>
                <div
                    onClick={() => onEdit?.(event)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        cursor: 'pointer',
                        flexGrow: 1,
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'relative', width: 'fit-content' }}>
                        <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: event.isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            transition: 'color 0.4s ease'
                        }}>
                            {event.title}
                        </h3>
                        {/* Strikethrough Animation */}
                        <motion.div
                            initial={false}
                            animate={{ scaleX: event.isCompleted ? 1 : 0 }}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: '55%',
                                height: '3.5px',
                                background: event.color,
                                width: '100%',
                                originX: 0,
                                borderRadius: '2px',
                                opacity: 0.8
                            }}
                            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                        />
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <p>{event.startTime} - {event.endTime}</p>
                        <p style={{ opacity: 0.8 }}>({event.durationMinutes} min)</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete?.(event.id); }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            opacity: 0.6
                        }}
                    >
                        <Trash2 size={16} />
                    </button>

                    <div
                        onClick={(e) => { e.stopPropagation(); onToggle?.(event.id); }}
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
                            transition: 'all 0.2s ease',
                            flexShrink: 0
                        }}
                    >
                        {event.isCompleted && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        )}
                    </div>
                </div>
            </div>

            {/* Icon on the timeline spine */}
            <div style={{
                position: 'absolute',
                left: '18px', // Aligned with shifted spine
                top: '10%',
                width: '36px',
                height: '80%',
                borderRadius: '10px',
                backgroundColor: event.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                boxShadow: hasConflict ? '0 0 15px rgba(255, 59, 48, 0.4)' : 'none',
                border: hasConflict ? '2px solid rgba(255, 59, 48, 0.8)' : 'none',
                transition: 'all 0.3s ease'
            }}>
                {icon}
            </div>
        </motion.div>
    );
};

export default EventCard;
