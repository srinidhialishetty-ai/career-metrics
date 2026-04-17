import { Moon, SunMedium } from "lucide-react";

export default function ThemeToggle({ themeMode, onToggle }) {
  const isLight = themeMode === "light";

  return (
    <button
      type="button"
      onClick={onToggle}
      data-magnetic
      className="motion-button theme-toggle fixed right-6 top-6 z-[70] inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(5,8,22,0.25)] backdrop-blur-2xl lg:right-10"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/10">
        <SunMedium className={`h-4 w-4 transition duration-300 ${isLight ? "scale-100 opacity-100" : "scale-75 opacity-0"}`} />
        <Moon className={`absolute h-4 w-4 transition duration-300 ${isLight ? "scale-75 opacity-0" : "scale-100 opacity-100"}`} />
      </span>
      <span className="hidden sm:inline">{isLight ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
