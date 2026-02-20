import React, { useEffect, useState } from 'react';

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
        <div style={{
            position: 'absolute',
            left: '0',
            right: '0',
            top: `${top}px`,
            display: 'flex',
            alignItems: 'center',
            zIndex: 10,
            pointerEvents: 'none',
            transition: 'top 0.3s ease-out'
        }}>
            <div style={{
                color: 'var(--current-time-red)',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '0 8px',
                marginLeft: '20px',
                zIndex: 11
            }}>
                {timeString}
            </div>
            <div style={{
                flexGrow: 1,
                height: '1px',
                backgroundColor: 'var(--current-time-red)',
                boxShadow: '0 0 8px var(--current-time-red)'
            }}></div>
        </div>
    );
};

export default CurrentTimeLine;
