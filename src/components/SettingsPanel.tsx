import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Upload, Trash2, Plus, Play, Bookmark, Sun, Moon } from 'lucide-react';
import type { TimelineEvent, DailyTemplate } from '../types';

interface SettingsPanelProps {
    onClose: () => void;
    events: TimelineEvent[];
    onImport: (events: TimelineEvent[]) => void;
    onClear: () => void;
    templates: DailyTemplate[];
    onSaveTemplate: (name: string) => void;
    onApplyTemplate: (template: DailyTemplate) => void;
    onDeleteTemplate: (id: string) => void;
    theme: 'dark' | 'light';
    onThemeChange: (theme: 'dark' | 'light') => void;
}

/**
 * Frosted-glass settings overlay component.
 * Manages daily templates, data export/import, and theme switching.
 */
const SettingsPanel: React.FC<SettingsPanelProps> = ({
    onClose,
    events,
    onImport,
    onClear,
    templates,
    onSaveTemplate,
    onApplyTemplate,
    onDeleteTemplate,
    theme,
    onThemeChange
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [templateName, setTemplateName] = useState('');
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);

    const handleExport = () => {
        const dataStr = JSON.stringify(events, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `unfold-backup-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                if (Array.isArray(json)) {
                    onImport(json);
                    onClose();
                } else {
                    alert('Invalid file format. Please upload a valid Unfold backup.');
                }
            } catch {
                alert('Error parsing file. Please ensure it is a valid JSON.');
            }
        };
        reader.readAsText(file);
    };

    const handleSaveTemplate = () => {
        if (!templateName.trim()) return;
        onSaveTemplate(templateName);
        setTemplateName('');
        setIsSavingTemplate(false);
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
                backgroundColor: 'var(--overlay-bg)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                touchAction: 'none', // Prevent background scrolling
                overflow: 'hidden',
                backdropFilter: 'blur(8px)', // Added consistent blur
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                    backgroundColor: 'var(--card-bg-translucent)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    borderRadius: '24px',
                    padding: '24px',
                    width: 'calc(100% - 40px)', // Precise viewport fit
                    maxWidth: '400px', // More compact, solid feel
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    overflowX: 'hidden', // Stop any horizontal jitter
                    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-subtle)',
                    userSelect: 'none', // Feel more like a native component
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Settings</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Templates Section */}
                    <section>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 'bold' }}>DAILY ROUTINES</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {templates.map(template => (
                                <div key={template.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: 'var(--pill-circle-bg)',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Bookmark size={18} color="var(--accent-blue)" />
                                        <span style={{ fontWeight: '600' }}>{template.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => onApplyTemplate(template)}
                                            style={{
                                                background: 'var(--accent-blue)',
                                                border: 'none',
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            <Play size={12} fill="white" /> Apply
                                        </button>
                                        <button
                                            onClick={() => onDeleteTemplate(template.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {!isSavingTemplate ? (
                                <button
                                    onClick={() => setIsSavingTemplate(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        backgroundColor: 'transparent',
                                        color: 'var(--accent-blue)',
                                        border: '1px dashed var(--accent-blue)',
                                        padding: '12px',
                                        borderRadius: '16px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Plus size={18} /> Save current as template
                                </button>
                            ) : (
                                <div style={{
                                    backgroundColor: 'var(--pill-circle-bg)',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    <input
                                        autoFocus
                                        placeholder="Template Name (e.g. Work Day)"
                                        value={templateName}
                                        onChange={(e) => setTemplateName(e.target.value)}
                                        style={{
                                            backgroundColor: 'var(--input-bg)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={handleSaveTemplate}
                                            disabled={!templateName.trim()}
                                            style={{
                                                flexGrow: 1,
                                                backgroundColor: 'var(--text-primary)',
                                                color: 'var(--bg-black)',
                                                border: 'none',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                fontWeight: 'bold',
                                                cursor: templateName.trim() ? 'pointer' : 'not-allowed',
                                                opacity: templateName.trim() ? 1 : 0.5
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsSavingTemplate(false)}
                                            style={{
                                                flexGrow: 1,
                                                backgroundColor: 'transparent',
                                                color: 'var(--text-primary)',
                                                border: '1px solid var(--border-subtle)',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Theme Section */}
                    <section>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 'bold' }}>APPEARANCE</h3>
                        <div style={{
                            display: 'flex',
                            backgroundColor: 'var(--pill-circle-bg)',
                            padding: '4px',
                            borderRadius: '12px',
                            gap: '4px'
                        }}>
                            <button
                                onClick={() => onThemeChange('dark')}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: theme === 'dark' ? 'var(--bg-black)' : 'transparent',
                                    color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Moon size={16} fill={theme === 'dark' ? 'var(--text-primary)' : 'none'} /> Dark
                            </button>
                            <button
                                onClick={() => onThemeChange('light')}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: theme === 'light' ? 'var(--bg-black)' : 'transparent',
                                    color: theme === 'light' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Sun size={16} fill={theme === 'light' ? 'var(--text-primary)' : 'none'} /> Light
                            </button>
                        </div>
                    </section>

                    {/* Data Management Section */}
                    <section>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 'bold' }}>DATA MANAGEMENT</h3>

                        <div style={{
                            display: 'flex',
                            backgroundColor: 'var(--pill-circle-bg)',
                            padding: '4px',
                            borderRadius: '12px',
                            gap: '4px'
                        }}>
                            <button
                                onClick={handleExport}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Download size={16} /> Export
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Upload size={16} /> Import
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImport}
                                accent-color="json"
                                style={{ display: 'none' }}
                            />
                        </div>
                    </section>

                    <section style={{ marginTop: '12px', borderTop: '1px solid #333', paddingTop: '16px' }}>
                        <button
                            onClick={() => { onClear(); onClose(); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                                color: '#ff3b30',
                                border: 'none',
                                padding: '16px',
                                borderRadius: '16px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            <Trash2 size={20} />
                            <div style={{ fontWeight: '600' }}>Clear All Data</div>
                        </button>
                    </section>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SettingsPanel;
