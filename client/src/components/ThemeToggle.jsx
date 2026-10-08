import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "", size = "sm" }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`btn btn-ghost btn-circle btn-${size} text-base-content hover:bg-base-200 transition-transform active:scale-95 ${className}`}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-all transform rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-base-content/80 transition-all transform rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
