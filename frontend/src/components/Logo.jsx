import { useId } from "react";

// Hexagonal "C" bracket with a nested code-mark "C" and a </> glyph at its
// center. The inner C and glyph use theme tokens (not fixed white) so they
// stay visible on both the dark and light themes — a plain white stroke
// would vanish on the light theme's white background.
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
            <path
                d="M77.6,26.9 L46.2,14.2 L18.2,33.1 L18.2,66.9 L46.2,85.8 L77.6,73.1"
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M65.3,62.9 L62.4,65.7 L59,67.9 L55.2,69.3 L51.2,70 L47.1,69.8 L43.2,68.8 L39.5,67 L36.3,64.5 L33.6,61.5 L31.6,57.9 L30.4,54 L30,50 L30.4,46 L31.6,42.1 L33.6,38.5 L36.3,35.5 L39.5,33 L43.2,31.2 L47.1,30.2 L51.2,30 L55.2,30.7 L59,32.1 L62.4,34.3 L65.3,37.1"
                fill="none"
                stroke="var(--color-base-content)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <text
                x="50"
                y="51"
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="'JetBrains Mono', 'Courier New', monospace"
                fontWeight="700"
                fontSize="15"
                fill="var(--color-primary)"
            >
                {"</>"}
            </text>
        </svg>
    );
};

export default Logo;
