import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    destructive?: boolean;
}

interface PillNavProps {
    items: NavItem[];
}

const PillNav: React.FC<PillNavProps> = ({ items }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div style={{
            backgroundColor: 'rgba(28, 28, 30, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '8px',
            borderRadius: '24px',
            display: 'flex',
            gap: '4px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
            width: '100%',
            maxWidth: '380px',
            margin: '0 auto',
            overflow: 'hidden',
            justifyContent: 'space-around'
        }}>
            {items.map((item, index) => (
                <button
                    key={item.id}
                    onClick={item.onClick}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: item.id === 'create' ? '12px 24px' : '12px',
                        minWidth: item.id === 'create' ? '140px' : '52px',
                        borderRadius: '16px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '600',
                        zIndex: 1,
                        transition: 'color 0.2s ease',
                        outline: 'none'
                    }}
                >
                    {/* Animated Background Pill */}
                    {hoveredIndex === index && (
                        <motion.div
                            layoutId="pill-hover"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: item.id === 'create' ? 'white' : 'rgba(255, 255, 255, 0.08)',
                                borderRadius: '16px',
                                zIndex: -1
                            }}
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}

                    <item.icon
                        size={20}
                        strokeWidth={item.id === 'create' ? 3 : 2}
                        style={{
                            color: hoveredIndex === index && item.id === 'create' ? 'black' : 'inherit',
                            transition: 'color 0.2s ease'
                        }}
                    />

                    {item.id === 'create' && (
                        <span style={{
                            color: hoveredIndex === index ? 'black' : 'white',
                            transition: 'color 0.2s ease'
                        }}>
                            {item.label}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default PillNav;
