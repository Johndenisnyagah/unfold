import React, { useRef, useState } from 'react';
import { X, Download, Upload, Trash2, Plus, Play, Bookmark } from 'lucide-react';
import type { TimelineEvent, DailyTemplate } from '../types';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    events: TimelineEvent[];
    onImport: (events: TimelineEvent[]) => void;
    onClear: () => void;
    templates: DailyTemplate[];
    onSaveTemplate: (name: string) => void;
    onApplyTemplate: (template: DailyTemplate) => void;
    onDeleteTemplate: (id: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isOpen,
    onClose,
    events,
    onImport,
    onClear,
    templates,
    onSaveTemplate,
    onApplyTemplate,
    onDeleteTemplate
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [templateName, setTemplateName] = useState('');
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);

    if (!isOpen) return null;

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
            } catch (err) {
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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
        }}>
            <div style={{
                backgroundColor: 'rgba(28, 28, 30, 0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '24px',
                width: '100%',
                maxWidth: '430px',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
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
                                    backgroundColor: '#2c2c2e',
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
                                    backgroundColor: '#2c2c2e',
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
                                            backgroundColor: '#1c1c1e',
                                            border: 'none',
                                            color: 'white',
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
                                                backgroundColor: 'white',
                                                color: 'black',
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
                                                color: 'white',
                                                border: '1px solid #444',
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

                    {/* Data Management Section */}
                    <section>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 'bold' }}>DATA MANAGEMENT</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={handleExport}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    backgroundColor: '#2c2c2e',
                                    color: 'white',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                }}
                            >
                                <Download size={20} />
                                <div>
                                    <div style={{ fontWeight: '600' }}>Export Backup</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Download your timeline as a JSON file</div>
                                </div>
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    backgroundColor: '#2c2c2e',
                                    color: 'white',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                }}
                            >
                                <Upload size={20} />
                                <div>
                                    <div style={{ fontWeight: '600' }}>Import Backup</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Restore your timeline from a JSON file</div>
                                </div>
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
            </div>
        </div>
    );
};

export default SettingsPanel;
