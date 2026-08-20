import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { filmThumbnails } from "./films-section";

const FEED_URL = "https://feeds.behold.so/D2X4AdfgOxH3FmL64ae6";
const IMAGE_DURATION = 6000;

interface BeholdSize { width: number; height: number; mediaUrl: string; }
interface BeholdChild {
  id: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  thumbnailUrl?: string;
  sizes?: { small: BeholdSize; medium: BeholdSize; large: BeholdSize; full: BeholdSize };
}
interface BeholdPost {
  id: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaUrl: string;
  thumbnailUrl?: string;
  children?: BeholdChild[];
  sizes?: { small: BeholdSize; medium: BeholdSize; large: BeholdSize; full: BeholdSize };
}

interface HeroMedia {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

function extractMedia(posts: BeholdPost[]): HeroMedia[] {
  const items: HeroMedia[] = [];
  for (const post of posts) {
    const cover = post.sizes?.large?.mediaUrl;
    if (post.mediaType === "VIDEO") {
      if (post.mediaUrl) items.push({ type: "video", url: post.mediaUrl, thumbnail: cover ?? post.thumbnailUrl });
    } else if (post.mediaType === "CAROUSEL_ALBUM" && post.children?.length) {
      for (const child of post.children) {
        if (child.mediaType === "VIDEO" && child.mediaUrl) {
          items.push({ type: "video", url: child.mediaUrl, thumbnail: cover });
        } else if (child.mediaType === "IMAGE") {
          const url = child.sizes?.large?.mediaUrl ?? child.mediaUrl;
          if (url) items.push({ type: "image", url });
        }
      }
    } else {
      const url = cover ?? post.mediaUrl;
      if (url) items.push({ type: "image", url });
    }
  }
  return items.sort(() => Math.random() - 0.5);
}

interface HeroSectionProps {
  onNavigate: (section: string) => void;
  scrollProgress?: number;
}

export function HeroSection({ onNavigate, scrollProgress = 0 }: HeroSectionProps) {
  const [media, setMedia] = useState<HeroMedia[]>([]);
  const [index, setIndex] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const filmItems: HeroMedia[] = filmThumbnails.map(url => ({ type: "image", url }));
    fetch(FEED_URL)
      .then((r) => r.json())
      .then((data) => {
        const feedItems = extractMedia(data.posts ?? []);
        const all = [...feedItems, ...filmItems].sort(() => Math.random() - 0.5);
        if (all.length) setMedia(all);
      })
      .catch(() => {
        if (filmItems.length) setMedia(filmItems.sort(() => Math.random() - 0.5));
      });
  }, []);

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1) % media.length);
  }, [media.length]);

  // Reset video error state on slide change
  useEffect(() => { setVideoFailed(false); }, [index]);

  // Auto-advance images (and failed videos)
  useEffect(() => {
    if (!media.length) return;
    const current = media[index];
    if (current.type === "image" || videoFailed) {
      timerRef.current = setTimeout(advance, IMAGE_DURATION);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [index, media, advance, videoFailed]);

  const captionOpacity = Math.max(0, 1 - scrollProgress * 3);
  const current = media[index];

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Background media */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {current?.type === "video" && !videoFailed ? (
              <video
                key={current.url}
                src={current.url}
                poster={current.thumbnail}
                autoPlay
                muted
                playsInline
                onEnded={advance}
                onError={() => setVideoFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (current?.type === "image" || (current?.type === "video" && videoFailed)) && (current.thumbnail || current.url) ? (
              <img
                src={videoFailed ? (current.thumbnail ?? current.url) : current.url}
                alt=""
                className="h-full w-full object-cover"
                onError={advance}
              />
            ) : null}

            {/* Dark overlay + grain */}
            <div
              className="absolute inset-0 bg-black/10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Header Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: captionOpacity, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 z-10 px-8 py-6 md:px-16 lg:px-24"
        style={{ opacity: captionOpacity }}
      >
        {/* Mobile Navigation */}
        <nav className="lg:hidden flex justify-center items-baseline gap-8">
          {["films", "regards", "about"].map((s) => (
            <button
              key={s}
              onClick={() => onNavigate(s)}
              className="text-xs uppercase tracking-[0.25em] text-white/90 transition-opacity hover:opacity-60"
            >
              {s.toUpperCase()}
            </button>
          ))}
        </nav>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex justify-end">
          <nav className="flex items-baseline gap-12">
            {["films", "regards", "about"].map((s) => (
              <button
                key={s}
                onClick={() => onNavigate(s)}
                className="text-xs uppercase tracking-[0.25em] text-white/90 transition-opacity hover:opacity-60"
              >
                {s.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Name + Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: captionOpacity, y: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-start px-8 md:px-16 lg:px-24"
        style={{
          paddingTop: "calc(max(1.5rem, env(safe-area-inset-top)) + 2.75rem + 6rem)",
          opacity: captionOpacity,
        }}
      >
        <h1
          className="text-5xl leading-[0.85] tracking-tight text-white md:text-6xl lg:text-7xl"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
        >
          <span className="block">Laurent</span>
          <span className="block">Covet</span>
        </h1>

        <p
          className="mt-5 text-xs uppercase tracking-[0.06em] md:tracking-[0.25em] text-white/60 leading-relaxed"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Crafting visual narratives<br />
          elevating technological innovation<br />
          into singular imaginative worlds
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: captionOpacity }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{ opacity: captionOpacity }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <ChevronDown className="w-6 h-6 text-white/60" strokeWidth={1.5} />
          <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
