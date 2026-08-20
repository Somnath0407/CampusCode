import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`btn btn-ghost btn-sm btn-circle ${className}`}
        >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
    );
};

export default ThemeToggle;
