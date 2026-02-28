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

    return (
        <div
            ref={containerRef}
            style={{
                backgroundColor: 'transparent',
                padding: '24px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '428px',
                margin: '0 auto',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <div
                ref={scrollRef}
                style={{
                    display: 'flex',
                    gap: '12px',
                    width: '100%',
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    padding: '0 180px', // Large padding to center items
                    alignItems: 'center',
                    height: '140px'
                }}
                className="hide-scrollbar"
            >
                {days.map((date, index) => {
                    const active = isSameDay(date, selectedDate);

                    return (
                        <motion.button
                            key={index}
                            data-active={active}
                            onClick={() => onDateSelect(date)}
                            style={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '20px 0 16px 0',
                                minWidth: '56px',
                                height: '110px',
                                borderRadius: '28px',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                outline: 'none',
                                flexShrink: 0,
                                zIndex: 1,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {/* Animated Background Pill (Selection) */}
                            {active && (
                                <motion.div
                                    layoutId="calendar-pill-active"
                                    style={{
                                        position: 'absolute',
                                        inset: '10px 2px',
                                        backgroundColor: '#333333',
                                        borderRadius: '24px',
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                                        zIndex: 0
                                    }}
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Downward Triangle Indicator */}
                            {active ? (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        width: 0,
                                        height: 0,
                                        borderLeft: '5px solid transparent',
                                        borderRight: '5px solid transparent',
                                        borderTop: '6px solid white',
                                        marginTop: '-20px',
                                        marginBottom: '16px',
                                        zIndex: 2
                                    }}
                                />
                            ) : (
                                <div style={{ height: '0px', marginTop: '-20px', marginBottom: '16px' }} />
                            )}

                            <span style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                color: active ? 'white' : 'var(--text-secondary)',
                                textTransform: 'uppercase',
                                marginBottom: '12px',
                                zIndex: 1
                            }}>
                                {date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                            </span>

                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: active ? 'white' : 'rgba(255,255,255,0.05)',
                                border: !active ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                zIndex: 1,
                                color: active ? 'black' : 'var(--text-secondary)',
                                fontWeight: '700',
                                fontSize: '18px',
                                boxShadow: active ? '0 4px 12px rgba(255, 255, 255, 0.2)' : 'none'
                            }}>
                                {date.getDate()}
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default CalendarPill;
