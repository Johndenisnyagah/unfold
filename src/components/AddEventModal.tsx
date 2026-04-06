import React, { useState, useEffect, type FC } from 'react';
import { X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimelineEvent } from '../types';
import { ICON_MAP } from '../utils/icons';

interface AddEventModalProps {
    onClose: () => void;
    onAdd: (event: TimelineEvent) => void;
    eventToEdit?: TimelineEvent | null;
    theme: 'dark' | 'light';
}

const COLORS = [
    '#C2D8C4',
    '#102E4A',
    '#004643',
    '#205030',
    '#B78E79',
    '#414751',
    '#919F90',
    '#B0C0CC',
    '#AE522F',
    '#C3CAB5',
    '#EFD17F',
    '#8CBEBF',
    '#344C4B',
    '#3E241A',
    '#A8622A',
    '#4B607F',
    '#2E211C',
    '#DDC5A3',
];

const ICONS = Object.keys(ICON_MAP);

/**
 * Modal component for creating or editing timeline events.
 * Features a solid background, responsive grid for icons/colors,
 * and specialized theme handling for premium light/dark modes.
 */
const AddEventModal: FC<AddEventModalProps> = ({ onClose, onAdd, eventToEdit, theme }) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [iconName, setIconName] = useState(ICONS[0]);
    const [color, setColor] = useState(COLORS[0]);
    const [showAllIcons, setShowAllIcons] = useState(false);
    const [showAllColors, setShowAllColors] = useState(false);

    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setStartTime(eventToEdit.startTime);
            setEndTime(eventToEdit.endTime);
            setIconName(eventToEdit.iconName);
            setColor(eventToEdit.color);
        } else {
            setTitle('');
            setStartTime('09:00');
            setEndTime('10:00');
            setIconName(ICONS[0]);
            setColor(COLORS[0]);
        }
    }, [eventToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        // Calculate duration
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);
        const duration = (endH * 60 + endM) - (startH * 60 + startM);

        const eventData: TimelineEvent = {
            id: eventToEdit ? eventToEdit.id : Date.now().toString(),
            title,
            startTime,
            endTime,
            durationMinutes: duration > 0 ? duration : 30,
            iconName,
            color,
            isCompleted: eventToEdit ? eventToEdit.isCompleted : false,
        };

        onAdd(eventData);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '20px',
                paddingTop: '80px',
                overflowY: 'auto',
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="modal-content"
                style={{
                    width: '100%',
                    maxWidth: '430px', // Mobile width
                    backgroundColor: 'var(--card-bg)', // Solid background
                    borderRadius: '24px',
                    padding: '24px',
                    marginBottom: '80px', // Bottom spacing
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-subtle)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Create Event</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>TITLE</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Morning Walk, Coding..."
                            required
                            autoFocus
                            style={{
                                width: '100%',
                                backgroundColor: theme === 'light' ? '#ffffff' : 'var(--selection-bg)',
                                border: theme === 'light' ? '1px solid var(--border-subtle)' : 'none',
                                borderRadius: '12px',
                                padding: '16px',
                                color: 'var(--text-primary)',
                                fontSize: '16px',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>START TIME</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                style={{
                                    width: '100%',
                                    backgroundColor: theme === 'light' ? '#ffffff' : 'var(--selection-bg)',
                                    border: theme === 'light' ? '1px solid var(--border-subtle)' : 'none',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    paddingLeft: '12px', // Tighter for mobile
                                    paddingRight: '12px', // Tighter for mobile
                                    color: 'var(--text-primary)',
                                    fontSize: '16px',
                                    outline: 'none',
                                    colorScheme: theme === 'light' ? 'light' : 'dark',
                                    minWidth: 0, // Prevent overflow
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>END TIME</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                style={{
                                    width: '100%',
                                    backgroundColor: theme === 'light' ? '#ffffff' : 'var(--selection-bg)',
                                    border: theme === 'light' ? '1px solid var(--border-subtle)' : 'none',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    paddingLeft: '12px', // Tighter for mobile
                                    paddingRight: '12px', // Tighter for mobile
                                    color: 'var(--text-primary)',
                                    fontSize: '16px',
                                    outline: 'none',
                                    colorScheme: theme === 'light' ? 'light' : 'dark',
                                    minWidth: 0, // Prevent overflow
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '14px' }}>ICON</label>
                        <motion.div
                            layout
                            style={{ overflow: 'hidden' }}
                            transition={{ 
                                duration: 0.6, 
                                ease: [0.32, 0.72, 0, 1] // Premium Apple-style easing
                            }}
                        >
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
                                gap: '12px',
                                paddingBottom: '4px'
                            }}>
                                {ICONS.slice(0, 6).map(icon => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => setIconName(icon)}
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '12px',
                                            backgroundColor: iconName === icon ? color : (theme === 'light' ? '#ffffff' : 'var(--selection-bg)'),
                                            border: iconName === icon ? 'none' : (theme === 'light' ? '1px solid var(--border-subtle)' : 'none'),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s, color 0.2s',
                                            color: iconName === icon ? 'white' : 'var(--text-primary)',
                                        }}
                                    >
                                        {React.cloneElement(ICON_MAP[icon] as React.ReactElement<{ size: number }>, { size: 20 })}
                                    </button>
                                ))}
                            </div>
                            <AnimatePresence>
                                {showAllIcons && (
                                    <motion.div
                                        key="additional-icons"
                                        initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98, height: 0 }}
                                        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, height: 'auto' }}
                                        exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98, height: 0 }}
                                        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
                                            gap: '12px',
                                            paddingTop: '12px', // Gap between grids
                                            paddingBottom: '4px'
                                        }}>
                                            {ICONS.slice(6).map(icon => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => setIconName(icon)}
                                                    style={{
                                                        width: '44px',
                                                        height: '44px',
                                                        borderRadius: '12px',
                                                        backgroundColor: iconName === icon ? color : (theme === 'light' ? '#ffffff' : 'var(--selection-bg)'),
                                                        border: iconName === icon ? 'none' : (theme === 'light' ? '1px solid var(--border-subtle)' : 'none'),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s, color 0.2s',
                                                        color: iconName === icon ? 'white' : 'var(--text-primary)',
                                                    }}
                                                >
                                                    {React.cloneElement(ICON_MAP[icon] as React.ReactElement<{ size: number }>, { size: 20 })}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        <button
                            type="button"
                            onClick={() => setShowAllIcons(!showAllIcons)}
                            style={{
                                marginTop: '12px',
                                background: 'none',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '12px',
                                padding: '8px 12px',
                                color: 'var(--text-secondary)',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                width: 'fit-content',
                                transition: 'all 0.2s',
                            }}
                        >
                            {showAllIcons ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {showAllIcons ? 'Show Less' : `Show More (${ICONS.length - 6} more)`}
                        </button>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '14px' }}>COLOR</label>
                        <motion.div
                            layout
                            style={{ overflow: 'hidden' }}
                            transition={{ 
                                duration: 0.6, 
                                ease: [0.32, 0.72, 0, 1] 
                            }}
                        >
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
                                gap: '12px',
                                paddingBottom: '4px'
                            }}>
                                {COLORS.slice(0, 6).map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            backgroundColor: c,
                                            border: color === c ? '3px solid var(--text-primary)' : '3px solid transparent',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s, border 0.2s',
                                        }}
                                    />
                                ))}
                            </div>
                            <AnimatePresence>
                                {showAllColors && (
                                    <motion.div
                                        key="additional-colors"
                                        initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98, height: 0 }}
                                        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, height: 'auto' }}
                                        exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98, height: 0 }}
                                        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
                                            gap: '12px',
                                            paddingTop: '12px',
                                            paddingBottom: '4px'
                                        }}>
                                            {COLORS.slice(6).map(c => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setColor(c)}
                                                    style={{
                                                        width: '44px',
                                                        height: '44px',
                                                        borderRadius: '50%',
                                                        backgroundColor: c,
                                                        border: color === c ? '3px solid var(--text-primary)' : '3px solid transparent',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s, border 0.2s',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        <button
                            type="button"
                            onClick={() => setShowAllColors(!showAllColors)}
                            style={{
                                marginTop: '12px',
                                background: 'none',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '12px',
                                padding: '8px 12px',
                                color: 'var(--text-secondary)',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                width: 'fit-content',
                                transition: 'all 0.2s',
                            }}
                        >
                            {showAllColors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {showAllColors ? 'Show Less' : `Show More (${COLORS.length - 6} more)`}
                        </button>
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '12px',
                            backgroundColor: 'var(--text-primary)',
                            color: 'var(--bg-black)',
                            border: 'none',
                            borderRadius: '16px',
                            padding: '18px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                        }}
                    >
                        <Check size={20} strokeWidth={3} />
                        Add to Timeline
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AddEventModal;
