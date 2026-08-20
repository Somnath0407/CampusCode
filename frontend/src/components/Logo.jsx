import { useId } from "react";

// Graduation cap whose tassel doubles as a ">" code chevron — campus + code.
const Logo = ({ size = 24, className = "" }) => {
    const gradientId = useId();

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={className}
            role="img"
            aria-label="CampusCode logo"
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffa116" />
                    <stop offset="55%" stopColor="#ff6b6b" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
            <rect width="100" height="100" rx="24" fill={`url(#${gradientId})`} />
            <polygon points="50,20 82,35 50,50 18,35" fill="#ffffff" />
            <path d="M32,38 L68,38 L62,54 Q50,58 38,54 Z" fill="#ffffff" fillOpacity="0.88" />
            <polyline
                points="44,53 60,62 44,71"
                fill="none"
                stroke="#ffffff"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Logo;
