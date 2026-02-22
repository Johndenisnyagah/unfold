import React, { useState, useEffect, type FC } from 'react';
import { X, Check } from 'lucide-react';
import type { TimelineEvent } from '../types';
import { ICON_MAP } from '../utils/icons';

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (event: TimelineEvent) => void;
    eventToEdit?: TimelineEvent | null;
}

const COLORS = [
    'var(--accent-pink)',
    'var(--accent-blue)',
    'var(--accent-orange)',
    'var(--accent-purple)',
    'var(--accent-green)',
    '#5856d6', // Indigo
    '#af52de', // Purple
    '#ff3b30', // Red
    '#ffcc00', // Yellow
    '#34c759', // Green
    '#5ac8fa', // Sky Blue
    '#ff9500', // Orange
    '#8e8e93', // Grey
    '#ff2d55', // Rose
];

const ICONS = Object.keys(ICON_MAP);

const AddEventModal: FC<AddEventModalProps> = ({ isOpen, onClose, onAdd, eventToEdit }) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [iconName, setIconName] = useState(ICONS[0]);
    const [color, setColor] = useState(COLORS[0]);

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
    }, [eventToEdit, isOpen]);

    if (!isOpen) return null;

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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center', // Centered
            justifyContent: 'center',
            padding: '20px',
        }}>
            <div
                className="modal-content"
                style={{
                    width: '100%',
                    maxWidth: '430px', // Mobile width
                    backgroundColor: 'rgba(28, 28, 30, 0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '24px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
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
                                backgroundColor: '#2c2c2e',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '16px',
                                color: 'white',
                                fontSize: '16px',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>START TIME</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#2c2c2e',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    color: 'white',
                                    fontSize: '16px',
                                    outline: 'none',
                                    colorScheme: 'dark',
                                }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>END TIME</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#2c2c2e',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    color: 'white',
                                    fontSize: '16px',
                                    outline: 'none',
                                    colorScheme: 'dark',
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '14px' }}>ICON</label>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {ICONS.map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setIconName(icon)}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        backgroundColor: iconName === icon ? color : '#2c2c2e',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {React.cloneElement(ICON_MAP[icon] as React.ReactElement<{ size: number }>, { size: 20 })}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '14px' }}>COLOR</label>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        backgroundColor: c,
                                        border: color === c ? '3px solid white' : '3px solid transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '12px',
                            backgroundColor: 'white',
                            color: 'black',
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
            </div>
        </div>
    );
};

export default AddEventModal;
