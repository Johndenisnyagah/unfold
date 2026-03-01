import { type FC } from 'react';

interface AiIconProps {
    size?: number;
    color?: string;
    className?: string;
}

const AiIcon: FC<AiIconProps> = ({ size = 24, color = 'currentColor', className }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer "Unfolding" diamond frame */}
            <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Internal core sparkle */}
            <path
                d="M12 7V17M7 12H17"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
            />

            {/* Circular pulse aura */}
            <circle
                cx="12"
                cy="12"
                r="4"
                stroke={color}
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.5"
            />
        </svg>
    );
};

export default AiIcon;
