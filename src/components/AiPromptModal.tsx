import { useState, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import AiIcon from './AiIcon';

interface AiPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (prompt: string) => Promise<void>;
    isGenerating: boolean;
}

/**
 * Modal component for entering AI prompts.
 * Allows users to describe their day and trigger timeline generation.
 */
const AiPromptModal: FC<AiPromptModalProps> = ({ isOpen, onClose, onGenerate, isGenerating }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onGenerate(prompt);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'var(--overlay-bg)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    backdropFilter: 'blur(8px)',
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{
                            backgroundColor: 'var(--card-bg-translucent)',
                            backdropFilter: 'blur(40px)',
                            WebkitBackdropFilter: 'blur(40px)',
                            borderRadius: '24px',
                            padding: '24px',
                            width: '100%',
                            maxWidth: '400px',
                            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                            border: '1px solid var(--border-subtle)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AiIcon size={20} className="sparkle-icon" color="var(--accent-orange-vibrant)" />
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Magic Timeline</h2>
                            </div>
                            <button
                                onClick={onClose}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                Describe your day and AI will "unfold" the timeline for you.
                            </p>

                            <textarea
                                autoFocus
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., I have a busy day tomorrow starting at 9 AM with 3 hours of deep work, lunch at noon, then a massage at 2 PM for an hour."
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    backgroundColor: 'var(--input-bg)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    resize: 'none',
                                    outline: 'none',
                                    marginBottom: '20px',
                                }}
                            />

                            <button
                                type="submit"
                                disabled={isGenerating || !prompt.trim()}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    backgroundColor: isGenerating ? 'var(--selection-bg)' : (prompt.trim() ? 'var(--accent-orange)' : 'rgba(255, 94, 0, 0.1)'),
                                    color: (prompt.trim() && !isGenerating) ? '#000' : 'var(--accent-orange-vibrant)',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    border: isGenerating || !prompt.trim() ? '1px solid var(--border-subtle)' : 'none',
                                    cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.2s ease',
                                    opacity: !prompt.trim() && !isGenerating ? 0.5 : 1,
                                    boxShadow: 'none',
                                }}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Unfolding...
                                    </>
                                ) : (
                                    <>
                                        <AiIcon size={18} />
                                        Generate Timeline
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AiPromptModal;
