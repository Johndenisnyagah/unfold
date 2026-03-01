import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    destructive?: boolean;
    color?: string;
    showLabel?: boolean;
}

interface PillNavProps {
    items: NavItem[];
}

const PillNav: React.FC<PillNavProps> = ({ items }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div style={{
            backgroundColor: 'var(--card-bg-translucent)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '8px',
            borderRadius: '32px', // Full pill shape
            display: 'flex',
            gap: '4px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '1px solid var(--border-subtle)',
            width: '100%',
            height: '64px', // Standard pill height
            margin: '0 auto',
            overflow: 'hidden',
            justifyContent: 'space-around',
            alignItems: 'center'
        }}>
            {items.map((item, index) => {
                const shouldShowLabel = !!item.showLabel;
                const isHovered = hoveredIndex === index;

                return (
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
                            gap: '6px',
                            padding: shouldShowLabel ? '12px 14px' : '10px',
                            minWidth: shouldShowLabel ? '80px' : '44px',
                            borderRadius: '16px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            zIndex: 1,
                            transition: 'all 0.2s ease',
                            outline: 'none'
                        }}
                    >
                        {/* Animated Background Pill */}
                        {isHovered && (
                            <motion.div
                                layoutId="pill-hover"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: item.color || (item.id === 'create' ? 'var(--text-primary)' : 'var(--pill-circle-bg)'),
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
                                color: isHovered && (item.color || item.id === 'create') ? 'var(--bg-black)' : (isHovered ? 'var(--text-primary)' : (item.color || 'inherit')),
                                transition: 'color 0.2s ease'
                            }}
                        />

                        {shouldShowLabel && (
                            <span style={{
                                color: isHovered && (item.color || item.id === 'create') ? 'var(--bg-black)' : 'inherit',
                                transition: 'color 0.2s ease'
                            }}>
                                {item.label}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default PillNav;
