import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HeroSection } from "./components/hero-section";
import { Navigation } from "./components/navigation";
import { RegardsSection } from "./components/regards-section";
import { FilmsSection } from "./components/films-section";
import { AboutSection } from "./components/about-section";

type SectionType = "home" | "regards" | "films" | "about";

export default function App() {
  const [currentSection, setCurrentSection] =
    useState<SectionType>("home");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [homeKey, setHomeKey] = useState(0);

  useEffect(() => {
    const TITLE = "Laurent Covet | Director & Creative Technology Supervisor";
    const DESC =
      "Crafting visual narratives for the luxury sector. A multidisciplinary visual craftsman merging aesthetic emotion with technological innovation.";
    const URL = "https://www.laurentcovet.com/";
    const IMAGE = "https://www.laurentcovet.com/og-image.jpg";

    document.title = TITLE;

    const meta = (
      attrs: Record<string, string>,
      content: string
    ) => {
      const sel = Object.entries(attrs)
        .map(([k, v]) => `[${k}="${v}"]`)
        .join("");
      let el = document.querySelector<HTMLMetaElement>(`meta${sel}`);
      if (!el) {
        el = document.createElement("meta");
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const link = (attrs: Record<string, string>) => {
      const nonHref = Object.entries(attrs).filter(([k]) => k !== "href");
      const sel = nonHref.map(([k, v]) => `[${k}="${v}"]`).join("");
      let el = document.querySelector<HTMLLinkElement>(`link${sel}`);
      if (!el) {
        el = document.createElement("link");
        document.head.appendChild(el);
      }
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    };

    // Standard
    meta({ name: "description" }, DESC);
    meta({ "http-equiv": "content-language" }, "en-US");

    // Open Graph
    meta({ property: "og:title" }, TITLE);
    meta({ property: "og:description" }, DESC);
    meta({ property: "og:url" }, URL);
    meta({ property: "og:site_name" }, "Laurent Covet");
    meta({ property: "og:type" }, "website");
    meta({ property: "og:locale" }, "en_US");
    meta({ property: "og:image" }, IMAGE);
    meta({ property: "og:image:width" }, "1200");
    meta({ property: "og:image:height" }, "1200");
    meta({ property: "og:image:alt" }, TITLE);

    // Twitter / X Card
    meta({ name: "twitter:card" }, "summary_large_image");
    meta({ name: "twitter:title" }, TITLE);
    meta({ name: "twitter:description" }, DESC);
    meta({ name: "twitter:image" }, IMAGE);
    meta({ name: "twitter:image:alt" }, TITLE);

    // Canonical
    link({ rel: "canonical", href: URL });
  }, []);

  const handleNavigate = (section: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Reset scroll progress when navigating
    setScrollProgress(0);

    // If navigating to home, increment key to force full remount
    if (section === "home") {
      setHomeKey((prev) => prev + 1);
    }

    // Faster transition for confident, immediate feeling
    setTimeout(() => {
      setCurrentSection(section as SectionType);
      setIsTransitioning(false);
    }, 500);
  };

  // Handle scroll on homepage to trigger transition to FILMS
  useEffect(() => {
    if (currentSection !== "home") return;

    // Desktop: Mouse wheel detection
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && !isTransitioning) {
        // Single scroll down triggers navigation to FILMS
        handleNavigate("films");
      }
    };

    // Mobile: Touch gesture detection
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      const deltaY = touchStartY - touchEndY;
      const deltaTime = touchEndTime - touchStartTime;
      
      // Swipe up detection (minimum 50px, maximum 500ms)
      if (deltaY > 50 && deltaTime < 500) {
        handleNavigate("films");
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSection, isTransitioning]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#f5f5f5]">
      {/* Fixed Navigation - Hidden on Home */}
      {currentSection !== "home" && (
        <Navigation
          currentSection={currentSection}
          onNavigate={handleNavigate}
        />
      )}

      {/* Grain Overlay During Transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed inset-0 z-[100]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />
        )}
      </AnimatePresence>

      {/* Section Router with Crossfade */}
      <AnimatePresence mode="wait">
        {currentSection === "home" && (
          <motion.div
            key={`home-${homeKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <HeroSection onNavigate={handleNavigate} scrollProgress={scrollProgress} />
          </motion.div>
        )}

        {currentSection === "regards" && (
          <motion.div
            key="regards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <RegardsSection onNavigate={handleNavigate} />
          </motion.div>
        )}

        {currentSection === "films" && (
          <motion.div
            key="films"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <FilmsSection onNavigate={handleNavigate} />
          </motion.div>
        )}

        {currentSection === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <AboutSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}