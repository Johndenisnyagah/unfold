import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CalendarPillProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

const CalendarPill: React.FC<CalendarPillProps> = ({ selectedDate, onDateSelect }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const today = new Date();

    // Generate 30 days (14 before today, today, 15 after today)
    const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - 14 + i);
        return d;
    });

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const isFirstRender = useRef(true);

    // Auto-center the selected date
    useEffect(() => {
        const centerDate = (behavior: ScrollBehavior = 'smooth') => {
            if (scrollRef.current && containerRef.current) {
                const scrollArea = scrollRef.current;
                const pill = containerRef.current;
                const activeItem = scrollArea.querySelector('[data-active="true"]') as HTMLElement;

                if (activeItem) {
                    // Calculate center relative to the entire PILL, not just the scroll div
                    // This ensures the active date is in the visual center of the component
                    const itemCenter = activeItem.offsetLeft + activeItem.offsetWidth / 2;
                    const pillCenter = pill.offsetWidth / 2;

                    // We need to account for the fact that scrollRef might be offset by the Month label
                    const scrollAreaOffset = scrollArea.offsetLeft;

                    const scrollLeft = itemCenter - (pillCenter - scrollAreaOffset);
                    scrollArea.scrollTo({ left: scrollLeft, behavior });
                }
            }
        };

        if (isFirstRender.current) {
            centerDate('auto');
            const timer = setTimeout(() => centerDate('auto'), 50);
            isFirstRender.current = false;
            return () => clearTimeout(timer);
        } else {
            centerDate('smooth');
        }
    }, [selectedDate]);

    const monthName = selectedDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

    return (
        <div
            ref={containerRef}
            style={{
                backgroundColor: 'rgba(28, 28, 30, 0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '8px 12px',
                borderRadius: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
                width: '100%',
                maxWidth: '380px',
                margin: '0 auto',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Elegant Side Label: Month Name */}
            <div style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '10px',
                fontWeight: '900',
                padding: '0 10px 0 6px',
                letterSpacing: '0.1em',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                whiteSpace: 'nowrap',
                flexShrink: 0
            }}>
                {monthName}
            </div>

            <div
                ref={scrollRef}
                style={{
                    display: 'flex',
                    gap: '4px',
                    flexGrow: 1,
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none', // Hide scrollbar Firefox
                    msOverflowStyle: 'none', // Hide scrollbar IE/Edge
                    padding: '0 40px' // Add padding so far-left/right items can center
                }}
                className="hide-scrollbar"
            >
                {days.map((date, index) => {
                    const active = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, today);

                    return (
                        <motion.button
                            key={index}
                            data-active={active}
                            onClick={() => onDateSelect(date)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '40px',
                                height: '56px',
                                borderRadius: '18px',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                outline: 'none',
                                transition: 'color 0.3s ease',
                                flexShrink: 0,
                                zIndex: 1
                            }}
                        >
                            {/* Animated Background Pill (Selection) */}
                            {active && (
                                <motion.div
                                    layoutId="calendar-pill-active"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: 'white',
                                        borderRadius: '18px',
                                        boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
                                        zIndex: 0
                                    }}
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Today Indicator (Subtle ring) */}
                            {isToday && !active && (
                                <div style={{
                                    position: 'absolute',
                                    inset: '4px',
                                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                                    borderRadius: '14px',
                                    zIndex: 0
                                }} />
                            )}

                            {/* Hover Highlight (Subtle) */}
                            {!active && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '18px',
                                        zIndex: 0
                                    }}
                                />
                            )}

                            <span style={{
                                fontSize: '9px',
                                fontWeight: '700',
                                color: active ? 'black' : 'var(--text-secondary)',
                                textTransform: 'uppercase',
                                marginBottom: '2px',
                                zIndex: 1
                            }}>
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <span style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: active ? 'black' : 'var(--text-primary)',
                                zIndex: 1
                            }}>
                                {String(date.getDate()).padStart(2, '0')}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div >
    );
};

export default CalendarPill;
