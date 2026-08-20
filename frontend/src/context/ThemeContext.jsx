import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "campuscode-theme";

const getInitialTheme = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "leetcode-dark" || stored === "leetcode-light") return stored;
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? "leetcode-light" : "leetcode-dark";
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "leetcode-dark" ? "leetcode-light" : "leetcode-dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "leetcode-dark" }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
};
