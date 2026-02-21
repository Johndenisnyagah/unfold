import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CurrentTimeLineProps {
    top: number;
}

const CurrentTimeLine: React.FC<CurrentTimeLineProps> = ({ top }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return (
        <motion.div
            initial={false}
            animate={{ top: `${top}px` }}
            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
            style={{
                position: 'absolute',
                left: '0',
                right: '0',
                display: 'flex',
                alignItems: 'center',
                zIndex: 10,
                pointerEvents: 'none'
            }}
        >
            <div style={{
                color: 'var(--current-time-red)',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '0 8px',
                marginLeft: '-12px', // Balanced between original and tight
                zIndex: 11,
                backgroundColor: 'transparent'
            }}>
                {timeString}
            </div>
            <div style={{
                flexGrow: 1,
                height: '1px',
                backgroundColor: 'var(--current-time-red)'
                // Glow removed for a cleaner look
            }}></div>
        </motion.div>
    );
};

export default CurrentTimeLine;
