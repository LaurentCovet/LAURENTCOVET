import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ImageCarousel } from "./image-carousel";
import { Settings, X, Eye, EyeOff } from "lucide-react";

const FEED_URLS = [
  "https://feeds.behold.so/mKMjvQtWclIDBUvYocKI",
  "https://feeds.behold.so/D2X4AdfgOxH3FmL64ae6",
];
const HIDDEN_KEY = "regards_hidden_posts";

interface BeholdSize {
  width: number;
  height: number;
  mediaUrl: string;
}

interface BeholdSizes {
  small: BeholdSize;
  medium: BeholdSize;
  large: BeholdSize;
  full: BeholdSize;
}

interface BeholdChild {
  id: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  thumbnailUrl?: string;
  sizes?: BeholdSizes;
}

interface BeholdPost {
  id: string;
  caption: string;
  permalink: string;
  timestamp: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaUrl: string;
  thumbnailUrl?: string;
  children?: BeholdChild[];
  sizes?: BeholdSizes;
}

// --- Helpers ---

function parseCaption(caption = "") {
  const cleaned = caption.replace(/#\S+/g, "").trim();
  const lines = cleaned.split("\n").map((l) => l.trim()).filter(Boolean);
  return {
    title: lines[0] ?? "",
    text: lines.slice(1).join(" "),
  };
}

function getImages(post: BeholdPost): string[] {
  if (post.mediaType === "VIDEO") {
    return post.thumbnailUrl ? [post.thumbnailUrl] : [];
  }
  if (post.mediaType === "CAROUSEL_ALBUM" && post.children?.length) {
    const imgs = post.children
      .filter((c) => c.mediaType === "IMAGE")
      .map((c) => c.sizes?.large?.mediaUrl ?? c.mediaUrl)
      .filter(Boolean) as string[];
    if (imgs.length) return imgs;
    // All-video carousel — use proxied parent cover
    const cover = post.sizes?.large?.mediaUrl;
    return cover ? [cover] : [];
  }
  const url = post.sizes?.large?.mediaUrl ?? post.mediaUrl;
  return url ? [url] : [];
}

function getCarouselVideos(post: BeholdPost): string[] {
  if (post.mediaType !== "CAROUSEL_ALBUM") return [];
  return (post.children ?? [])
    .filter((c) => c.mediaType === "VIDEO" && c.mediaUrl)
    .map((c) => c.mediaUrl);
}

function getThumbnail(post: BeholdPost): string {
  if (post.mediaType === "CAROUSEL_ALBUM") {
    // Prefer proxied parent cover
    const cover = post.sizes?.medium?.mediaUrl ?? post.sizes?.large?.mediaUrl;
    if (cover) return cover;
    const first = post.children?.[0];
    return first?.sizes?.medium?.mediaUrl ?? first?.mediaUrl ?? "";
  }
  return post.sizes?.medium?.mediaUrl ?? post.mediaUrl ?? "";
}

function getSizeRef(post: BeholdPost) {
  if (post.mediaType === "CAROUSEL_ALBUM") {
    // Prefer image child dimensions; fall back to parent (proxied cover)
    const imgChild = post.children?.find((c) => c.mediaType === "IMAGE");
    return imgChild?.sizes?.large ?? post.sizes?.large;
  }
  return post.sizes?.large;
}

function isLandscape(post: BeholdPost): boolean {
  const ref = getSizeRef(post);
  if (!ref) return false;
  return ref.width / ref.height > 1.3;
}

function getAspectClass(post: BeholdPost): string {
  const ref = getSizeRef(post);
  if (!ref) return "aspect-[4/5]";
  const ratio = ref.width / ref.height;
  if (ratio > 0.9) return "aspect-square";
  return "aspect-[4/5]";
}

type Segment =
  | { type: "columns"; posts: BeholdPost[] }
  | { type: "fullwidth"; post: BeholdPost };

function buildSegments(posts: BeholdPost[]): Segment[] {
  const segments: Segment[] = [];
  let batch: BeholdPost[] = [];
  for (const post of posts) {
    if (isLandscape(post)) {
      if (batch.length) { segments.push({ type: "columns", posts: batch }); batch = []; }
      segments.push({ type: "fullwidth", post });
    } else {
      batch.push(post);
    }
  }
  if (batch.length) segments.push({ type: "columns", posts: batch });
  return segments;
}

// --- Admin Panel ---

function AdminPanel({
  posts,
  hiddenIds,
  onToggle,
  onClose,
}: {
  posts: BeholdPost[];
  hiddenIds: Set<string>;
  onToggle: (id: string) => void;
  onClose: () => void;
}) {
  const visibleCount = posts.filter((p) => !hiddenIds.has(p.id)).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/95"
    >
      <div className="px-8 py-16 md:px-16 lg:px-24">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h3 className="text-2xl tracking-tight text-white">
              Visibilité des posts
            </h3>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
              {visibleCount} visible{visibleCount !== 1 ? "s" : ""} ·{" "}
              {hiddenIds.size} masqué{hiddenIds.size !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 transition-colors hover:text-white"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Thumbnails grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {posts.map((post) => {
            const hidden = hiddenIds.has(post.id);
            const thumb = getThumbnail(post);
            const { title } = parseCaption(post.caption);

            return (
              <button
                key={post.id}
                onClick={() => onToggle(post.id)}
                className="group relative aspect-square overflow-hidden transition-opacity duration-300"
                style={{ opacity: hidden ? 0.2 : 1 }}
                title={hidden ? "Afficher" : "Masquer"}
              >
                {thumb && (
                  <img
                    src={thumb}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Hover / state overlay */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                    hidden
                      ? "bg-black/10"
                      : "bg-transparent group-hover:bg-black/40"
                  }`}
                >
                  <span
                    className={`text-white transition-opacity duration-200 ${
                      hidden ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>

                {/* Title tooltip on hover */}
                {title && (
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-2 transition-transform duration-200 group-hover:translate-y-0">
                    <p className="truncate text-[10px] uppercase tracking-[0.15em] text-white/80">
                      {title}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// --- Video with image fallback ---

function VideoWithFallback({ src, poster }: { src: string; poster?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed && poster) {
    return <img src={poster} alt="" className="h-full w-full object-cover" />;
  }
  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}

// --- Full-width card (landscape 16/9) ---

function FullWidthCard({ post }: { post: BeholdPost }) {
  const images = getImages(post);
  const { title, text } = parseCaption(post.caption);
  const isVideo = post.mediaType === "VIDEO";
  const carouselVideos = getCarouselVideos(post);
  const cover = post.sizes?.large?.mediaUrl ?? post.thumbnailUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="aspect-video w-full overflow-hidden">
        {isVideo && post.mediaUrl ? (
          <VideoWithFallback src={post.mediaUrl} poster={post.thumbnailUrl} />
        ) : carouselVideos.length > 0 ? (
          <VideoWithFallback src={carouselVideos[0]} poster={cover} />
        ) : images.length > 0 ? (
          <ImageCarousel images={images} alt={title} />
        ) : null}
      </div>
      {(title || text) && (
        <div className="mt-3 space-y-1">
          {title && (
            <p className="text-xs uppercase tracking-[0.2em] text-[#2a2a2a]">{title}</p>
          )}
          {text && (
            <p className="text-xs leading-snug text-[#888]">{text}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}

// --- Post Card (portrait / square) ---

function PostCard({ post }: { post: BeholdPost }) {
  const images = getImages(post);
  const { title, text } = parseCaption(post.caption);
  const isVideo = post.mediaType === "VIDEO";
  const carouselVideos = getCarouselVideos(post);
  const cover = post.sizes?.large?.mediaUrl ?? post.thumbnailUrl;
  const aspectClass = getAspectClass(post);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
    >
      <div className={`${aspectClass} overflow-hidden`}>
        {isVideo && post.mediaUrl ? (
          <VideoWithFallback src={post.mediaUrl} poster={post.thumbnailUrl} />
        ) : carouselVideos.length > 0 ? (
          <VideoWithFallback src={carouselVideos[0]} poster={cover} />
        ) : images.length > 0 ? (
          <ImageCarousel images={images} alt={title} />
        ) : null}
      </div>

      {/* Caption below image */}
      {(title || text) && (
        <div className="mt-3 space-y-1">
          {title && (
            <p className="text-xs uppercase tracking-[0.2em] text-[#2a2a2a]">
              {title}
            </p>
          )}
          {text && (
            <p className="text-xs leading-snug text-[#888]">
              {text}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

// --- Main Section ---

export function RegardsSection({ onNavigate }: { onNavigate: (section: string) => void }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BeholdPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [headerHovered, setHeaderHovered] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(HIDDEN_KEY);
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  // Fetch Instagram feed via Behold
  useEffect(() => {
    Promise.all(FEED_URLS.map((url) => fetch(url).then((r) => r.json()).catch(() => ({ posts: [] }))))
      .then((results) => {
        const all = results.flatMap((data) => data.posts ?? []);
        setPosts(all);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleHidden = (id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const visiblePosts = posts.filter((p) => !hiddenIds.has(p.id));

  // Scroll to bottom → navigate to about
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100) onNavigate("about");
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [onNavigate]);

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5]" ref={scrollContainerRef}>
      <div className="px-8 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">

          {/* Header + admin trigger */}
          <div
            className="mb-6 flex items-end gap-3"
            onMouseEnter={() => setHeaderHovered(true)}
            onMouseLeave={() => setHeaderHovered(false)}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl leading-[0.85] tracking-tight text-[#2a2a2a] md:text-6xl lg:text-7xl"
            >
              Regards
            </motion.h2>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: headerHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setAdminOpen(true)}
              className="mb-2 text-[#bbb] transition-colors hover:text-[#555]"
              title="Gérer la visibilité"
            >
              <Settings size={14} />
            </motion.button>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-11 text-xs uppercase tracking-[0.25em] text-[#999]"
          >
            A BREEZE FOR VISUAL RESEARCH AND INTUITION.
          </motion.p>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-32">
              <p className="text-xs uppercase tracking-[0.25em] text-[#bbb]">
                Chargement…
              </p>
            </div>
          )}

          {/* Posts */}
          {!loading && (
            <>
              {visiblePosts.length === 0 ? (
                <p className="text-xs uppercase tracking-[0.25em] text-[#bbb]">
                  Tous les posts sont masqués.
                </p>
              ) : (
                <div className="flex flex-col gap-16">
                  {buildSegments(visiblePosts).map((segment, si) =>
                    segment.type === "fullwidth" ? (
                      <FullWidthCard key={segment.post.id} post={segment.post} />
                    ) : (
                      <div key={si}>
                        {/* Mobile — colonne unique */}
                        <div className="flex flex-col gap-10 md:hidden">
                          {segment.posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                          ))}
                        </div>

                        {/* Desktop — 2 colonnes en quinconce */}
                        <div className="hidden md:grid grid-cols-2 gap-x-10">
                          <div className="flex flex-col gap-10">
                            {segment.posts
                              .filter((_, i) => i % 2 === 0)
                              .map((post) => (
                                <PostCard key={post.id} post={post} />
                              ))}
                          </div>
                          <div className="flex flex-col gap-10" style={{ marginTop: "420px" }}>
                            {segment.posts
                              .filter((_, i) => i % 2 !== 0)
                              .map((post) => (
                                <PostCard key={post.id} post={post} />
                              ))}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="h-[50vh]" />

      {/* Admin Panel */}
      <AnimatePresence>
        {adminOpen && (
          <AdminPanel
            posts={posts}
            hiddenIds={hiddenIds}
            onToggle={toggleHidden}
            onClose={() => setAdminOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
