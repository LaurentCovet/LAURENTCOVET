import { motion } from "motion/react";
import { useEffect } from "react";

interface NavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export function Navigation({
  currentSection,
  onNavigate,
}: NavigationProps) {
  useEffect(() => {
    const existing = document.querySelector('meta[name="viewport"]');
    const content = "width=device-width, initial-scale=1, viewport-fit=cover";
    if (existing) {
      existing.setAttribute("content", content);
    } else {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed left-0 right-0 top-0 z-50 bg-[#e9e9e9]/80 backdrop-blur-sm"
    >
      <div
        className="flex items-baseline justify-between px-8 md:px-16 lg:px-24"
        style={{
          paddingTop: "max(1.5rem, env(safe-area-inset-top))",
          paddingBottom: "1.5rem",
        }}
      >
        {/* LC Logo - Home Button */}
        <button
          onClick={() => onNavigate("home")}
          className="text-sm tracking-[0.15em] text-[#2a2a2a] transition-opacity hover:opacity-50"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
        >
          LC
        </button>

        {/* Navigation Links - Perfectly Aligned */}
        <nav className="flex items-baseline gap-8 md:gap-12">
          <button
            onClick={() => onNavigate("films")}
            className={`text-xs uppercase tracking-[0.25em] transition-opacity ${
              currentSection === "films"
                ? "text-[#2a2a2a]"
                : "text-[#999] hover:text-[#2a2a2a] hover:opacity-100"
            }`}
          >
            FILMS
          </button>
          <button
            onClick={() => onNavigate("regards")}
            className={`text-xs uppercase tracking-[0.25em] transition-opacity ${
              currentSection === "regards"
                ? "text-[#2a2a2a]"
                : "text-[#999] hover:text-[#2a2a2a] hover:opacity-100"
            }`}
          >
            REGARDS
          </button>
          <button
            onClick={() => onNavigate("about")}
            className={`text-xs uppercase tracking-[0.25em] transition-opacity ${
              currentSection === "about"
                ? "text-[#2a2a2a]"
                : "text-[#999] hover:text-[#2a2a2a] hover:opacity-100"
            }`}
          >
            ABOUT
          </button>
        </nav>
      </div>
    </motion.nav>
  );
}