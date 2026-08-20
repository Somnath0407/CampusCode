import { useId } from "react";

// "CM" monogram on the brand gradient.
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
            <text
                x="50"
                y="54"
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="Arial, Helvetica, sans-serif"
                fontWeight="800"
                fontSize="40"
                letterSpacing="-2"
                fill="#ffffff"
            >
                CM
            </text>
        </svg>
    );
};

export default Logo;
