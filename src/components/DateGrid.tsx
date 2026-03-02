import React from 'react';
import { motion } from 'framer-motion';

interface DateGridProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    dateProgress?: Record<string, number>;
}

/**
 * Premium circular date grid component.
 * Displays a full month view with progress rings and pulsing "today" animation.
 */
const DateGrid: React.FC<DateGridProps> = ({ selectedDate, onDateSelect, dateProgress = {} }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getDateKey = (date: Date) => {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
    };

    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Adjust for Monday start (0-6, where 0 is Monday)
    const startOffset = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);

    const days = Array.from({ length: 42 }, (_, i) => {
        const dayNum = i - startOffset + 1;
        const date = new Date(currentYear, currentMonth, dayNum);
        return date;
    });

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const getDayColor = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);

        if (isSameDay(d, today)) return 'var(--accent-orange-vibrant)';
        if (d < today) return 'var(--text-primary)'; // Black in light mode, White in dark mode (user asked for black, but following theme logic for visibility)
        return 'var(--text-secondary)'; // Gray for future
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '430px',
            margin: '0 auto',
            padding: '24px',
            color: 'var(--text-primary)',
            backgroundColor: 'transparent'
        }}>
            {/* Large Day Number */}
            <div style={{ fontSize: '120px', fontWeight: '800', lineHeight: '0.9', letterSpacing: '-4px', margin: '20px 0' }}>
                {selectedDate.getDate()}
            </div>

            {/* Date Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '24px', fontWeight: '800', textTransform: 'uppercase' }}>
                        {selectedDate.toLocaleDateString('en-US', { month: 'long' })}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '400', opacity: 0.6 }}>
                        {selectedDate.getFullYear()}
                    </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '600', opacity: 0.8 }}>
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
            </div>

            {/* Grid Header */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '8px',
                marginBottom: '16px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '700',
                opacity: 0.4
            }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} style={{ color: i === 1 ? 'var(--accent-orange-vibrant)' : 'inherit' }}>{d}</div>
                ))}
            </div>

            {/* Circular Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '12px'
            }}>
                {days.map((date, i) => {
                    const isCurrentMonth = date.getMonth() === currentMonth;
                    const isSelected = isSameDay(date, selectedDate);
                    const color = getDayColor(date);
                    const isToday = isSameDay(date, today);
                    const isPast = date < today;
                    const dateKey = getDateKey(date);
                    const progress = dateProgress[dateKey] || 0;

                    // SVG Ring Constants
                    const radius = 22;
                    const circumference = 2 * Math.PI * radius;
                    const offset = circumference - (progress * circumference);

                    // Show ring for: today (always), or past dates with progress
                    const showRing = isCurrentMonth && (isToday || (isPast && progress > 0));

                    return (
                        <div key={i} style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                            {/* Progress Ring / Today Pulse Ring */}
                            {showRing && (
                                <svg
                                    viewBox="0 0 50 50"
                                    style={{
                                        position: 'absolute',
                                        inset: '-6px',
                                        width: 'calc(100% + 12px)',
                                        height: 'calc(100% + 12px)',
                                        transform: 'rotate(-90deg)',
                                        pointerEvents: 'none',
                                        zIndex: 1
                                    }}
                                >
                                    {/* Background track ring for today */}
                                    {isToday && (
                                        <circle
                                            cx="25"
                                            cy="25"
                                            r={radius}
                                            fill="none"
                                            stroke="var(--accent-orange-vibrant)"
                                            strokeWidth="2.5"
                                            opacity="0.15"
                                            style={{ strokeDasharray: circumference }}
                                        />
                                    )}
                                    <motion.circle
                                        cx="25"
                                        cy="25"
                                        r={radius}
                                        fill="none"
                                        stroke="var(--accent-orange-vibrant)"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        initial={{ strokeDashoffset: circumference }}
                                        animate={{
                                            strokeDashoffset: isToday && progress === 0 ? circumference : offset,
                                            scale: isToday ? [1, 1.08, 1] : 1,
                                            opacity: isToday ? [0.6, 1, 0.6] : 1
                                        }}
                                        transition={{
                                            strokeDashoffset: { duration: 1, ease: "easeOut" },
                                            scale: isToday ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {},
                                            opacity: isToday ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}
                                        }}
                                        style={{
                                            strokeDasharray: circumference,
                                        }}
                                    />
                                </svg>
                            )}

                            <motion.button
                                onClick={() => onDateSelect(date)}
                                animate={isToday && isCurrentMonth ? {
                                    boxShadow: [
                                        '0 0 0px rgba(255, 94, 0, 0)',
                                        '0 0 12px rgba(255, 94, 0, 0.4)',
                                        '0 0 0px rgba(255, 94, 0, 0)'
                                    ]
                                } : {}}
                                transition={isToday && isCurrentMonth ? {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                } : {}}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    border: isCurrentMonth ? 'none' : '1px solid var(--text-secondary)',
                                    backgroundColor: isCurrentMonth ? color : 'transparent',
                                    opacity: isCurrentMonth ? (isSelected ? 1 : 0.8) : 0.3,
                                    cursor: 'pointer',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    outline: 'none',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    zIndex: 2
                                }}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="selected-ring"
                                        style={{
                                            position: 'absolute',
                                            inset: '-4px',
                                            borderRadius: '50%',
                                            border: `2px solid ${color}`,
                                        }}
                                    />
                                )}
                            </motion.button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DateGrid;
