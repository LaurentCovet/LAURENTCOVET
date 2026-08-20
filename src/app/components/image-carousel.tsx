import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
  interval?: number;
  showDots?: boolean;
}

export function ImageCarousel({ 
  images, 
  alt = "", 
  className = "",
  interval = 3500,
  showDots = true
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInCenter, setIsInCenter] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect if element is near the center of the viewport using a single
  // IntersectionObserver (far cheaper than a global scroll listener per carousel).
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // Fallback: always consider it visible if the API is unavailable.
      setIsInCenter(true);
      return;
    }

    // A centered band (~34% tall) of the viewport as the observation root margin.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setIsInCenter(entry.isIntersecting);
      },
      { rootMargin: "-33% 0px -33% 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Carousel timer - only runs when in center
  useEffect(() => {
    if (images.length <= 1 || !isInCenter) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, isInCenter]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Only show dots if there are multiple images and showDots is true
  const shouldShowDots = images.length > 1 && showDots;

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className={`h-full w-full ${className}`}>
        <AnimatePresence mode="sync">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.43, 0.13, 0.23, 0.96] 
            }}
          />
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      {shouldShowDots && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}