import { useEffect } from "react";

/**
 * Manages the document <head> metadata (title, description, canonical,
 * Open Graph and Twitter cards) at runtime.
 *
 * NOTE: this project has no index.html to edit — the entry HTML is generated
 * at runtime — so head tags are injected here instead. This affects only the
 * <head>; nothing about the visible design, layout or text is touched.
 */

const TITLE = "Laurent Covet | Director & Creative Technology Supervisor";
const DESCRIPTION =
  "Crafting visual narratives for the luxury sector. A multidisciplinary visual craftsman merging aesthetic emotion with technological innovation.";
const URL = "https://www.laurentcovet.com/";
const IMAGE = "https://www.laurentcovet.com/og-image.jpg";

type Attr = "name" | "property";

function upsertMeta(attr: Attr, key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function SeoHead() {
  useEffect(() => {
    document.title = TITLE;

    upsertMeta("name", "title", TITLE);
    upsertMeta("name", "description", DESCRIPTION);
    upsertLink("canonical", URL);

    // Open Graph / Facebook / WhatsApp / LinkedIn
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", "Laurent Covet");
    upsertMeta("property", "og:url", URL);
    upsertMeta("property", "og:title", TITLE);
    upsertMeta("property", "og:description", DESCRIPTION);
    upsertMeta("property", "og:image", IMAGE);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");
    upsertMeta("property", "og:locale", "en_US");

    // Twitter
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:url", URL);
    upsertMeta("name", "twitter:title", TITLE);
    upsertMeta("name", "twitter:description", DESCRIPTION);
    upsertMeta("name", "twitter:image", IMAGE);
  }, []);

  return null;
}
