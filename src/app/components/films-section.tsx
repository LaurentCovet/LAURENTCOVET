import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

function cleanVimeoUrl(url: string): string {
  if (!url.includes('player.vimeo.com')) return url;
  const params: Record<string, string> = {
    title: '0',
    byline: '0',
    portrait: '0',
    badge: '0',
    autopause: '0',
    dnt: '1',
  };
  const [base, query] = url.split('?');
  const existing = new URLSearchParams(query ?? '');
  Object.entries(params).forEach(([k, v]) => {
    if (!existing.has(k)) existing.set(k, v);
  });
  return base + '?' + existing.toString();
}

interface Film {
  id: number;
  thumbnail: string;
  title: string;
  brand: string;
  year?: string;
  description: string;
  role?: string;
  category: "hybrid" | "animated" | "archive";
  videoUrl?: string;
  credits?: {
    agency?: string;
    creativeDirector?: string;
    director?: string;
    artDirector?: string;
    production?: string;
    postProduction?: string;
    screenwriter?: string;
  };
  makingOfImages?: string[];
  collectionVideos?: string[];
  videoDurations?: number[]; // Duration in milliseconds for each video in collectionVideos
  aspectRatio?: "16/9" | "9/16"; // Video aspect ratio
}

const films: Film[] = [
  {
    id: 1,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/CHOPARD/ALPINE_EAGLE/image/11_CHOPARD_ALPINE_EAGLE_MONTAGE_LOGO_pakihz.jpg",
    title: "Alpine Eagle",
    brand: "CHOPARD",
    description: "Film co-directed with David Bouque. A contemporary reinterpretation of the St. Moritz watch, the Alpine Eagle is poised between natural power, horological precision, and sensory cinema. This piece is the fruit of a holistic visual language, where technique yields to pure immersion. A complete orchestration of the imagery, shaped from the drafting of styleframes and the complexity of VFX R&D, to materialize through 3D sculpture, editing, and voice-over direction.",
    role: "Co-Director • Concept Artist • 3D Artist • VFX Supervisor",
    category: "hybrid",
    videoUrl: "https://player.vimeo.com/video/1219316759?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    credits: {
      agency: "Mazarine Digital",
      creativeDirector: "Grégoire Chabridon",
      director: "Laurent Covet / David Bouque",
      production: "Freestudios",
      postProduction: "L Covet / N Ballu / Point Flottant"
    },
    makingOfImages: [
      "https://laurentcovet.com/SRCs/FILMS/CHOPARD/ALPINE_EAGLE/image/08_CHOPARD_ALPINE_EAGLE_ROSE_VENT_egwwyk.jpg",
      "https://laurentcovet.com/SRCs/FILMS/CHOPARD/ALPINE_EAGLE/image/03_CHOPARD_ALPINE_EAGLE_AIGLE_tyciih.jpg",
      "https://laurentcovet.com/SRCs/FILMS/CHOPARD/ALPINE_EAGLE/image/01_CHOPARD_ALPINE_EAGLE_MONTRE_LOGO_ng15kg.jpg"
    ]
  },
  {
    id: 2,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/CARTIER/SAVOIR_FAIRE/image/1920x1494_Tillandsia.jpg.transform.car2imagehd_uyzey5.avif",
    title: "Savoir-faire",
    brand: "CARTIER",
    description: "A series of twelve films developed, produced and post-produced to explore the creative vision of Cartier's artisans. Conceived through an immersive experience within Cartier's Haute Joaillerie workshops in Paris, the series was shaped by close encounters with artisans, master jewelers, passionate geologists, and technical experts. The films act as a visual bridge between savoir and faire, an open window onto the creative process, where close-up perspectives reveal the precision of the infinitesimal and the mastery behind each exceptional creation. Through a delicate visual allegory, each episode expresses the harmony between artistic intuition and absolute precision, revealing the timeless beauty of the jeweler's craft.",
    role: "Director • Art Director • Motion Designer • VFX Supervisor",
    category: "hybrid",
    videoUrl: "https://player.vimeo.com/video/1194295815?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    credits: {
      agency: "Mazarine Image",
      creativeDirector: "Grégoire Chabridon",
      director: "Laurent Covet",
      artDirector: "Adrien Dewisme",
      production: "Julien Claessens",
      postProduction: "Laurent Covet"
    },
    makingOfImages: [
      "",
      "",
      ""
    ],
    collectionVideos: [
      "https://player.vimeo.com/video/1194295878?badge=0&autopause=0&player_id=0&app_id=58479&muted=1",
      "https://player.vimeo.com/video/1194295813?badge=0&autopause=0&player_id=0&app_id=58479&muted=1",
      "https://player.vimeo.com/video/1194295853?badge=0&autopause=0&player_id=0&app_id=58479&muted=1",
      "https://player.vimeo.com/video/1194295870?badge=0&autopause=0&player_id=0&app_id=58479&muted=1",
      "https://player.vimeo.com/video/1194295812?badge=0&autopause=0&player_id=0&app_id=58479&muted=1",
      "https://player.vimeo.com/video/1194295851?badge=0&autopause=0&player_id=0&app_id=58479&muted=1",
      "https://player.vimeo.com/video/1194295871?badge=0&autopause=0&player_id=0&app_id=58479&muted=1",
      "https://player.vimeo.com/video/1194295847?badge=0&autopause=0&player_id=0&app_id=58479&muted=1",
      "https://player.vimeo.com/video/1194295875?badge=0&autopause=0&player_id=0&app_id=58479&muted=1",
      "https://player.vimeo.com/video/1194295852?badge=0&autopause=0&player_id=0&app_id=58479&muted=1",
      "https://player.vimeo.com/video/1194295814?badge=0&autopause=0&player_id=0&app_id=58479&muted=1"
    ]
  },
  {
    id: 3,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/DOM_PERIGNON/image/02_DOM_PERIGNON_dxuoyb.png",
    title: "3 Plénitudes",
    brand: "Dom Pérignon",
    description: "Three dreamlike films created for Dom Pérignon. Conceived as a genesis unfolding from a primordial Big Bang, these films form a visual metaphor for the three exceptional cuvées P1, P2 and P3 revealing the precise moment when each wine reaches its gustatory apogee. P1 — Water · The birth of water from the Big Bang, and its essential role in shaping the vine and the grape. P2 — Time · Time slowly unfolds and intensifies, elevating the wine toward a new summit of expression. P3 — Rock · Matter settles through decades of sedimentation, refining the architecture of the wine to its purest essence.",
    role: "Co-Director • Concept Artist • 3D Artist • VFX Supervisor",
    category: "hybrid",
    videoUrl: "https://player.vimeo.com/video/1197769562?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    credits: {
      director: "L Covet / R Berthou / D Gourg",
      postProduction: "BCWALL"
    },
    makingOfImages: [
      "",
      "",
      ""
    ],
     collectionVideos: [
      "https://player.vimeo.com/video/1197769561?badge=0&autopause=0&player_id=0&app_id=58479&muted=1",
      "https://player.vimeo.com/video/1197769560?badge=0&autopause=0&player_id=0&app_id=58479&muted=1",
          ]
  },
  {
    id: 4,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/VCA/PERLEE%20COLLECTION/image/03_PERLEE_uf5amh.png",
    title: "Perlée Collection",
    brand: "VAN CLEEF & ARPELS",
    description: "Van Cleef & Arpels teams up with Arthur Hoffner for a graphic celebration of the Perlée collection. Following the joyful journey of rolling beads, the film unfolds within a playful, geometric sculpture imagined by Arthur Hoffner. An animated landscape where volumes, curves and colors guide the eye, inviting viewers to discover the new Perlée creations through surprise, movement and delight.",
    videoUrl: "https://player.vimeo.com/video/1219315721?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    role: "Co-Director",
    category: "animated",
    credits: {
      agency: "Mazarine Digital",
      creativeDirector: "Grégoire Chabridon",
      director: "Laurent Covet",
      artDirector: "Arthur Hoffner",
      postProduction: "Spacesheep"
    },
    makingOfImages: [
      "https://laurentcovet.com/SRCs/FILMS/VCA/PERLEE%20COLLECTION/image/01_PERLEE_SB_x31pbt.png",
      "https://laurentcovet.com/SRCs/FILMS/VCA/PERLEE%20COLLECTION/image/04_PERLEE_slmenx.png",
      "https://laurentcovet.com/SRCs/FILMS/VCA/PERLEE%20COLLECTION/image/02_PERLEE_jbe3ik.png"
    ]
  },
  {
    id: 5,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/VCA/PERLEE%20WINTER%20SEASON/image/000_PERLEE_BREEZE_gneikw.jpg",
    title: "Perlée Breeze",
    brand: "VAN CLEEF & ARPELS",
    description: "A playful, poetic, and unexpected ode unfolds across five acts, where enchanting décors and radiant jewels converge to create a singular moment of celebration. Inspired by the captivating worlds imagined by Arthur Hoffner, the film follows the Perlée jewels and pearls as they journey home, sharing in the magic of the festive season, from its joyful preparations to the splendour of the final celebration.",
    videoUrl: "https://player.vimeo.com/video/1219317883?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    role: "Co-Director • 3D Artist",
    category: "animated",
    credits: {
      agency: "Mazarine Digital",
      creativeDirector: "Grégoire Chabridon",
      director: "Laurent Covet",
      artDirector: "Arthur Hoffner",
      postProduction: "Spacesheep"
    },
    makingOfImages: [
      "https://laurentcovet.com/SRCs/FILMS/VCA/PERLEE%20WINTER%20SEASON/image/06_VCA_PERLEE_BREEZE_h6s4yp.png",
      "",
      ""
    ]
  },
  {
    id: 6,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/VCA/SPRING_ABN/image/00_VCA_SPRING_ws3nlw.jpg",
    title: "Spring",
    brand: "VAN CLEEF & ARPELS",
    description: "The Garden of Metamorphoses, a vibrant oversized nature transforms before our eyes, unveiling scenes of a spring imagined by Alexandre Benjamin Navet. Through a play of anamorphosis, we are invited to explore the sculptural dimension of the decor, where the Maison Van Cleef & Arpels' jewels are hidden like precious secrets.",
    videoUrl: "https://player.vimeo.com/video/1219318407?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    role: "Co-Director • 3D Artist • VFX Supervisor",
    category: "animated",
    credits: {
      agency: "Mazarine Digital",
      creativeDirector: "Grégoire Chabridon",
      director: "Laurent Covet",
      artDirector: "Alexandre Benjamin Navet",
      postProduction: "Laurent Covet / Monarch"
    },
    makingOfImages: [
      "",
      "",
      ""
    ],
    collectionVideos: [
      "https://laurentcovet.com/SRCs/FILMS/VCA/SPRING_ABN/image/SB_SPRING_VCA_lxqjvk.png",
      "https://player.vimeo.com/video/1219318408?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1",
      "https://player.vimeo.com/video/1219318409?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1",
      "https://laurentcovet.com/SRCs/FILMS/VCA/SPRING_ABN/image/VCA_DOOH_qdtads.jpg"
    ]
  },
  {
    id: 7,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/PRADA/image/00_PRADA_INFUSION_D_IRIS_1920_qvoj7s.jpg",
    title: "Enlighten Your Holidays",
    brand: "Prada",
    description: "Latest film co-directed for Prada for Enlighten Your Holidays. Set within a geometric labyrinth of mirrors and glass, the film unfolds inside a triangular architecture inspired by Prada’s iconic logo. Through infinite reflections, the brand’s iconic fragrances hide, refract and deconstruct themselves endlessly, offering a sensual journey of discovery.",
    role: "Co-Director • Concept Artist",
    category: "hybrid",
    videoUrl: "https://player.vimeo.com/video/1219653351?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    credits: {
      agency: "Mazarine Digital",
      creativeDirector: "Paul Gruber",
      director: "Laurent Covet / Claire Gouyet",
      postProduction: "Spacesheep"
    },
    makingOfImages: [
      "https://laurentcovet.com/SRCs/FILMS/PRADA/image/03_PRADA_LUNA_ROSSA_OCEAN_1920_rvxvuk.png",
      "https://laurentcovet.com/SRCs/FILMS/PRADA/image/02_PRADA_PARADOXE_1920_udemhj.png",
      "https://laurentcovet.com/SRCs/FILMS/PRADA/image/01_PRADA_CANDY_1920_oevcfg.png"
    ]
  },
  {
    id: 8,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/LA_PERLA/image/00_LA_PERLA_deu3sn.jpg",
    title: "Luminous",
    brand: "LA PERLA",
    description: "Full CGI film and print co-directed for La Perla, unveiling Luminous, the new fragrance. Conceived as a sensual play of light, the film draws inspiration from a solar eclipse — a moment where darkness and radiance coexist. Through subtle transitions, luminous reflections and soft obscurity, the bottle is gradually revealed, suspended between mystery and brilliance. Light caresses the glass, disappears, returns, and finally unveils a warm, enveloping glow. A visual metaphor for a fragrance that is intimate, radiant and deeply sensual.",
    role: "Co-Director • Concept Artist • 3D Artist • VFX Supervisor",
    category: "hybrid",
    videoUrl: "https://player.vimeo.com/video/1219654823?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    credits: {
      agency: "Mazarine Digital",
      creativeDirector: "Paul Gruber",
      director: "Laurent Covet / Natalya Novikova",
      postProduction: "Laurent Covet"
    },
    makingOfImages: [
      "https://laurentcovet.com/SRCs/FILMS/LA_PERLA/image/00_LA_PERLA_deu3sn.jpg",
      "https://laurentcovet.com/SRCs/FILMS/LA_PERLA/image/02_LA_PERLA_LOW_ANGLE_FULL_BOTTLE_qpzjma.jpg",
      "https://laurentcovet.com/SRCs/FILMS/LA_PERLA/image/01_LA_PERLA_DUO_onng52.jpg"
    ]
  },
  {
    id: 9,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/BELVEDERE/Janelle/image/00_Belvedere_Janelle_qgse4t.png",
    title: "Janelle Monae limited edition",
    brand: "BELVEDERE",
    description: "Presentation film for the limited edition Beautiful Future, created by Janelle Monáe for Belvedere. Conceived as an intimate act of revelation, the film unveils the bottle through an extreme close-up choreography. Layer by layer, strips of paper peel away like a slow, tactile striptease, gradually exposing the curves, textures and graphic identity of the bottle. A sensual play of concealment and disclosure, where desire is built through rhythm, proximity and restraint.",
    videoUrl: "https://player.vimeo.com/video/1194293077?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    role: "Director • Concept Artist • 3D Artist • VFX Supervisor",
    category: "hybrid",
    credits: {
      director: "Laurent Covet",
      postProduction: "Laurent Covet"
    },
    makingOfImages: [
      "https://laurentcovet.com/SRCs/FILMS/BELVEDERE/Janelle/image/01_Belvedere_Janelle_tuqe1o.png",
      "https://laurentcovet.com/SRCs/FILMS/BELVEDERE/Janelle/image/02_Belvedere_Janelle_cxj4jc.png",
      "https://laurentcovet.com/SRCs/FILMS/BELVEDERE/Janelle/image/00_Belvedere_Janelle_qgse4t.png"
    ]
  },
   {
    id: 10,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/BELVEDERE/NightB/image/01_BELVEDERE_B_NIGHT_icq0bq.png",
    title: "B Night",
    brand: "BELVEDERE",
    description: "B Night reveals a nocturnal vision of Belvedere. An electric, tightly edited film where stroboscopic light becomes a driving force. At its core, Belvedere’s B monogram transforms into an infinite neon vortex. It pulses, expands and contracts, drawing the eye into a hypnotic loop of light and motion. Flashes cut through the darkness, revealing the bottle’s contours and igniting its radiant logo. Balancing graphic abstraction and nightlife energy, the film elevates the bottle into a luminous icon — a distilled expression of Belvedere’s night-time identity.",
    videoUrl: "https://player.vimeo.com/video/1194293676?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    role: "Director • Concept Artist • 3D Artist • VFX Supervisor",
    category: "hybrid",
    credits: {
      director: "Laurent Covet",
      postProduction: "Laurent Covet"
    },
    makingOfImages: [
      "https://laurentcovet.com/SRCs/FILMS/BELVEDERE/NightB/image/01_BELVEDERE_B_NIGHT_icq0bq.png",
      "https://laurentcovet.com/SRCs/FILMS/BELVEDERE/NightB/image/05_BELVEDERE_B_NIGHT_ys3kb9.png",
      "https://laurentcovet.com/SRCs/FILMS/BELVEDERE/NightB/image/04_BELVEDERE_B_NIGHT_yxbjpa.png"
    ]
  },
  {
    id: 11,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/BALMAIN/BBUZZ/image/00_BALMAIN_fmcvj5.jpg",
    title: "BBUZZ",
    brand: "BALMAIN",
    description: "Co-direction of the launch campaign for the BBUZZ bags collection from BALMAIN.",
    videoUrl: "https://player.vimeo.com/video/1194292555?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    role: "Co-Director • Concept Artist • VFX Supervisor",
    category: "hybrid",
    credits: {
      agency: "Mazarine Digital",
      creativeDirector: "Paul Gruber",
      director: "Laurent Covet",
      postProduction: "Robin Curien"
    },
    makingOfImages: [
      "https://laurentcovet.com/SRCs/FILMS/BALMAIN/BBUZZ/image/01_BALMAIN_wfvyuc.jpg",
      "https://laurentcovet.com/SRCs/FILMS/BALMAIN/BBUZZ/image/02_BALMAIN_ivb15u.jpg",
      "https://laurentcovet.com/SRCs/FILMS/BALMAIN/BBUZZ/image/00_BALMAIN_fmcvj5.jpg"
    ]
  },
  {
    id: 12,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/C2C/image/C2C_CELL_BCWALL_01_szcxvy.jpg",
    title: "The Cell",
    brand: "C2C",
    description: "Teaser conceived as part of a music video project commissioned by C2C. Conceived as a visual prologue to the track “The Cell”, this teaser introduces a film project that was ultimately not completed. The narrative unfolds as a symbolic allegory, weaving together themes of God, science, humanity, the creation of the Earth, and the specter of apocalypse. Through a dense and evocative visual language, the teaser sketches the foundations of a larger cinematic vision — one exploring the fragile balance between origin and collapse, knowledge and belief, creation and destruction. What remains is a fragment: a distilled glimpse into the conceptual and aesthetic direction of the intended music video.",
    videoUrl: "https://player.vimeo.com/video/1194294747?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    role: "Co-Director • Concept Artist • 3D Artist • VFX Supervisor",
    category: "hybrid",
    credits: {
      director: "L Covet / R Berthou",
      postProduction: "L Covet / R Berthou"
    },
    makingOfImages: [
      "https://laurentcovet.com/SRCs/FILMS/C2C/image/C2C_CELL_BCWALL_02_apztpq.jpg",
      "https://laurentcovet.com/SRCs/FILMS/C2C/image/C2C_CELL_BCWALL_04_gygwvt.jpg",
      "https://laurentcovet.com/SRCs/FILMS/C2C/image/C2C_CELL_BCWALL_03_aajcp3.jpg"
    ]
  },
  {
    id: 13,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/CHOPARD/WINTER_SEASON/image/00_CHOPARD_ARTY_nkxl3r.jpg",
    title: "Winter Season",
    brand: "CHOPARD",
    description: "In 2019, the first chapter of The Adventures of Arty, a mischievous little polar bear, came to life on screen. Two further chapters followed, forming a festive trilogy animated and co-directed with Kippik. Conceived as a pictorial 3D animation series, these films blend poetic storytelling with a warm holiday spirit. Arty emerged from an initial creative vision, enriched and brought to life through the collaboration of all the talents involved in the film.”, this teaser introduces a film project that was ultimately not completed. The narrative unfolds as a symbolic allegory, weaving together themes of God, science, humanity, the creation of the Earth, and the specter of apocalypse. Through a dense and evocative visual language, the teaser sketches the foundations of a larger cinematic vision — one exploring the fragile balance between origin and collapse, knowledge and belief, creation and destruction. What remains is a fragment: a distilled glimpse into the conceptual and aesthetic direction of the intended music video.",
    videoUrl: "https://player.vimeo.com/video/1219337156?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    role: "Co-Director • Character Designer • VFX Supervisor",
    category: "animated",
    credits: {
      agency: "Mazarine Digital",
      creativeDirector: "Grégoire Chabridon",
      director: "L Covet / Kippik",
      screenwriter: "Michèle Sammour",
      postProduction: "Kippik"
    },
    makingOfImages: [
      "",
      "",
      ""
    ],
    collectionVideos: [
      "https://player.vimeo.com/video/1219337186?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1",
      "https://player.vimeo.com/video/1219337153?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1",
      "https://player.vimeo.com/video/1219337154?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1",
      "https://player.vimeo.com/video/1219337155?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1"
    ]
  },
  {
    id: 14,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/ATELIER%20COLOGNE/Orange_Sanguine/image/ATELIER_COLOGNE_hc7mwf.jpg",
    title: "Orange Sanguine by LLH",
    brand: "ATELIER COLOGNE",
    description: "A collaboration with artist Lucky Left Hand for Atelier Cologne, resulting in a limited-edition screen print celebrating the brand’s best-selling fragrance, Orange Sanguine. Direction and computer-generated animation.",
    videoUrl: "https://player.vimeo.com/video/1197783979?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    role: "Director • Animation",
    category: "animated",
    credits: {
      agency: "Mazarine Digital",
      creativeDirector: "Grégoire Chabridon",
      director: "Laurent Covet",
      postProduction: "Laurent Covet"
    },
    makingOfImages: [
      "",
      "",
      ""
    ],
  },
  {
    id: 15,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/CHOPARD/CNY/image/CHOPARD_CNY_OX_mymp98.jpg",
    title: "Year of the Ox",
    brand: "CHOPARD",
    description: "Short 3D animated films created for Chopard to unveil two new editions of the L.U.C. and Happy Sport watches, celebrating the Chinese New Year under the sign of the Metal Ox. The project features a stylized ox with a soft, endearing presence, subtly leaning toward a kawaii-inspired aesthetic. Set within a fire-red paper-cut decor and enhanced with gold embossing, the character echoes the traditional colors and symbols associated with Lunar New Year celebrations.",
    videoUrl: "https://player.vimeo.com/video/1219335409?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    role: "Director • Character Designer • Animation • VFX Supervisor",
    category: "animated",
    credits: {
      agency: "Mazarine Digital",
      creativeDirector: "Grégoire Chabridon",
      director: "Laurent Covet",
      postProduction: "Laurent Covet"
    },
    makingOfImages: [
      "",
      "",
      ""
    ],
    collectionVideos: [
      "https://laurentcovet.com/SRCs/FILMS/CHOPARD/CNY/image/CNY_CHOPARD_xmyjwx.png",
      "https://player.vimeo.com/video/1219335410?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1"
    ]
  },
    {
    id: 16,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/VCA/RAMADAN_22/image/VCA_FDM_gwdonh.jpg",
    title: "Fête des mères",
    brand: "VAN CLEEF & ARPELS",
    description: "A series of three animated films directed for Mother’s Day. Bringing the delicate illustrations of Charlotte Gastaut to life, these films capture fleeting moments of tenderness between two birds. Set against a lush, floral landscape, the animation serves as a tribute to the elegance and whimsical spirit of Van Cleef & Arpels.",
    role: "Director • Animation • VFX Supervisor",
    category: "animated",
    videoUrl: "https://player.vimeo.com/video/1219333974?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    credits: {
      agency: "Mazarine Digital",
      director: "Laurent Covet",
      artDirector: "Charlotte Gastaut",
      postProduction: "Laurent Covet"
    },
    makingOfImages: [
      "",
      "",
      ""
    ],
    collectionVideos: [
      "https://player.vimeo.com/video/1219333970?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1",
      "https://player.vimeo.com/video/1219333973?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1"
    ]
  },
        {
    id: 17,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/VCA/RAMADAN_22/image/RAMADAN_23_ux8cie.jpg",
    title: "Ramadan",
    brand: "VAN CLEEF & ARPELS",
    description: "A magical animated collaboration featuring the vivid artwork of Alexandre Benjamin Navet. This film explores a mesmerizing transformation: as moonlight touches the desert floor, it breathes life into the landscape. Navet's signature floral motifs unfurl under the night sky, creating a bold and vibrant homage to the vitality of nature.",
    role: "Co-Director",
    category: "animated",
    videoUrl: "https://player.vimeo.com/video/1219329565?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    credits: {
      agency: "Mazarine Digital",
     creativeDirector: "Grégoire Chabridon",
      director: "Laurent Covet",
      artDirector: "Alexandre Benjamin Navet",
      screenwriter: "Michèle Sammour",
      postProduction: "Kippik"
    },
    makingOfImages: [
      "",
      "",
      ""
    ],
    collectionVideos: [
      "https://player.vimeo.com/video/1219329562?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1",
      "https://player.vimeo.com/video/1219329563?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1",
      "https://player.vimeo.com/video/1219329637?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1",
      "https://laurentcovet.com/SRCs/FILMS/VCA/RAMADAN_22/image/RAMADAN_23_SB_rh7srz.png"
    ]
  },
      {
    id: 18,
    thumbnail: "https://laurentcovet.com/SRCs/FILMS/VCA/RAMADAN_23/image/RAMADAN_CG_tfsbgj.jpg",
    title: "Ramadan",
    brand: "VAN CLEEF & ARPELS",
    description: "A luminous animated journey directed to celebrate Ramadan. Continuing my collaboration with illustrator Charlotte Gastaut, this film follows a solitary bird through a lush, moonlit oasis toward an enchanting palace. Playful and mesmerizing, the animation employs a visual poetry of 'reveal and conceal,' guiding the eye to discover precious pieces from the Maison's Lucky Spring collection nestled within the foisonnant décor.",
    role: "Co-Director",
    category: "animated",
    videoUrl: "https://player.vimeo.com/video/1219328791?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
    credits: {
      agency: "Mazarine Digital",
     creativeDirector: "Grégoire Chabridon",
      director: "Laurent Covet",
      artDirector: "Charlotte Gastaut",
      screenwriter: "Michèle Sammour",
      postProduction: "Kippik"
    },
    makingOfImages: [
      "https://laurentcovet.com/SRCs/FILMS/VCA/RAMADAN_23/image/RAMADAN_CG_SB_luynyy.png",
      "",
      ""
    ],
  },
  // ARCHIVE PROJECTS
  {
    id: 19,
    thumbnail: "https://laurentcovet.com/SRCs/ARCHIVE/PRINTEMPS_DU_CINEMA/LE_PRINTEMPS_DU_CINEMA_l1nlqh_poster.jpg",
    title: "Le Printemps du Cinéma",
    brand: "FNCF",
    year: "2013",
    description: "I remain incredibly proud of this animated short, co-directed with Romain Berthou and Blackmeal. As spring awakens, bees and swallows join forces to build a whimsical movie theater. In addition to co-directing, I also crafted the character designs to bring these joyful creatures to life.",
    role: "Co-Director • Character Designer",
    category: "archive",
    videoUrl: "https://player.vimeo.com/video/1219644699?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
  },
  {
    id: 20,
    thumbnail: "https://laurentcovet.com/SRCs/ARCHIVE/FRIDAY/HUNGER_GAMES_-_OPENER_ojgcky_poster.jpg",
    title: "Hunger Games",
    brand: "FRIDAY",
    year: "2013",
    description: "Opening sequence for the French TV premiere of Hunger Games on Friday channel. A dynamic montage combining fire, gold textures and cinematic typography to capture the spirit of the Panem games.",
    role: "Co-Director • Character Designer",
    category: "archive",
    videoUrl: "https://player.vimeo.com/video/1219643978?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
  },
  {
    id: 21,
    thumbnail: "https://laurentcovet.com/SRCs/ARCHIVE/ATELIER%20COLOGNE/AC_XMAS_2021_16-9_v-longue_ghhr9x_poster.jpg",
    title: "The path of the stars",
    brand: "ATELIER COLOGNE",
    year: "2021",
    description: "Directed for Atelier Cologne’s holiday campaign, The Path of the Stars translates the brand's magical scents into a visual journey. Bringing Daria Hlazatova’s intricate limited-edition designs to life, the film captures a sensory reverie—an enchanting awakening under a shimmering, starlit night.",
    role: "Director • VFX Supervisor",
    category: "archive",
    videoUrl: "https://player.vimeo.com/video/1219642641?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
  },
  {
    id: 22,
    thumbnail: "https://laurentcovet.com/SRCs/ARCHIVE/DKNY/DKNY_HOLIDAY19_WATCH_B_16-9_btet5u_poster.jpg",
    title: "Holiday",
    brand: "DKNY",
    year: "2019",
    description: "Directed for DKNY, these two graphic animations provide a sharp, stylish focus on the brand's watches. A pure exploration of shape, modern design, and sleek motion.",
    role: "Director • VFX Supervisor",
    category: "archive",
    collectionVideos: [
      "https://player.vimeo.com/video/1219643327?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1",
      "https://player.vimeo.com/video/1219652409?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1"
    ],
    videoDurations: [10000, 10000] // 10 seconds each
  },
  {
    id: 23,
    thumbnail: "https://laurentcovet.com/SRCs/ARCHIVE/VUITTON/RedJourney_-_LouisVuitton_zepfmp_poster.jpg",
    title: "Red Journey",
    brand: "LOUIS VUITTON",
    year: "2012",
    description: "A highly unique, contemplative short film co-directed for Louis Vuitton alongside Régis Raffin and Romain Berthou. Spanning three minutes, this dreamlike cinematic piece serves as an invitation to explore the majestic, untouched wonders of Mars. A mesmerizing and otherworldly visual experience.",
    role: "Co-Director • VFX Supervisor",
    category: "archive",
    videoUrl: "https://player.vimeo.com/video/1219645315?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
  },
    {
    id: 24,
    thumbnail: "https://laurentcovet.com/SRCs/ARCHIVE/VCA/01_BASSIN_GIVRE_9-16_h264_pfg0o9_poster.jpg",
    title: "Bassin Givré",
    brand: "VAN CLEEF & ARPELS",
    year: "2021",
    description: "Van Cleef & Arpels x Alexandre Benjamin Navet. Three animated capsules crafted for Van Cleef & Arpels. Through traditional digital painting, Navet’s vibrant strokes and pop imagination seamlessly transform a frosted winter landscape into a lively, colorful celebration.",
    role: "Director • VFX Supervisor",
    category: "archive",
    collectionVideos: [
      "https://player.vimeo.com/video/1219645885?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1",
      "https://player.vimeo.com/video/1219645884?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1",
      "https://player.vimeo.com/video/1219645886?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1"
    ],
    videoDurations: [15000, 15000, 15000], // 15 seconds each
    aspectRatio: "9/16"
  },
  {
    id: 25,
    thumbnail: "",
    title: "L'étrange Noël de la famille Winter",
    brand: "The Walt Disney Company",
    year: "2013",
    description: "A thrilling creative marathon co-directed with Romain Berthou for Disney. This interactive holiday mini-series relied on a collaborative script, where the audience wrote the unfolding story week by week. To keep pace with the viewers' imagination, we led a tight-knit team of ten artists in an intense weekly production cycle. By merging 3D animation with the beautiful 2D illustrations of Camille André, we successfully translated the audience's ideas into a vibrant, broadcast-ready Christmas fairy tale.",
    role: "Co-Director • VFX Supervisor",
    category: "archive",
    videoUrl: "https://player.vimeo.com/video/1219646870?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
  },
];

export const filmThumbnails = films.filter(f => f.category === "hybrid").map(f => f.thumbnail).filter(Boolean) as string[];

// Video Playlist Component with crossfade
function VideoPlaylist({ videos, videoDurations, aspectRatio = "16/9", loop = false, showControls = true, autoplay = true }: { videos: string[], videoDurations?: number[], aspectRatio?: "16/9" | "9/16", loop?: boolean, showControls?: boolean, autoplay?: boolean }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (videos.length <= 1 || !hasStarted) return;

    // Get duration for current video (default to 30 seconds if not specified)
    const currentDuration = videoDurations?.[currentVideoIndex] || 30000;

    // Auto-advance to next video after duration
    const timer = setTimeout(() => {
      if (currentVideoIndex < videos.length - 1) {
        setIsTransitioning(true);
        
        // Wait for fade out, then switch video
        setTimeout(() => {
          setCurrentVideoIndex(prev => prev + 1);
          setIsTransitioning(false);
        }, 600);
      } else if (loop && currentVideoIndex === videos.length - 1) {
        // Loop back to first video
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentVideoIndex(0);
          setIsTransitioning(false);
        }, 600);
      }
    }, currentDuration - 600); // Start fade 600ms before end

    return () => clearTimeout(timer);
  }, [currentVideoIndex, videos.length, videoDurations, hasStarted]);

  // Start playing when component mounts
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, 100);
    return () => clearTimeout(startTimer);
  }, []);

  const handleDotClick = (index: number) => {
    if (index === currentVideoIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentVideoIndex(index);
      setIsTransitioning(false);
      setHasStarted(true);
    }, 600);
  };

  if (videos.length === 0) return null;

  const aspectClass = aspectRatio === "9/16" ? "aspect-[9/16]" : "aspect-video";

  return (
    <div className={`relative ${aspectClass} overflow-hidden bg-black ${aspectRatio === "9/16" ? "w-[80%] md:w-full max-w-[400px]" : "w-full"}`}>
      {videos.map((videoUrl, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: index === currentVideoIndex ? (isTransitioning ? 0 : 1) : 0 
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ pointerEvents: index === currentVideoIndex ? 'auto' : 'none' }}
        >
          <iframe
            src={cleanVimeoUrl(index === currentVideoIndex
              ? videoUrl
                  .replace('autoplay=false', autoplay ? 'autoplay=true' : 'autoplay=false')
                  .replace('autoplay=1', autoplay ? 'autoplay=1' : 'autoplay=0')
                  .replace(/(&|\?)controls=true/g, '$1controls=false') + (videoUrl.includes('?') ? '&' : '?') + 'controls=false&playsinline=true'
              : videoUrl)}
            className="h-full w-full"
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          ></iframe>
        </motion.div>
      ))}
      
      {/* Progress indicator - clickable dots */}
      {videos.length > 1 && showControls && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-3">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentVideoIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Play video ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FilmsSection({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "hybrid" | "animated">("all");
  const [currentArchiveImageIndex, setCurrentArchiveImageIndex] = useState(0);
  const [isArchiveHovered, setIsArchiveHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filmRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleFilmClick = (film: Film) => {
    setSelectedFilm(film);
  };

  const handleCloseDetail = () => {
    const filmId = selectedFilm?.id;
    setSelectedFilm(null);
    // Scroll to the film thumbnail that was just closed
    if (filmId != null) {
      requestAnimationFrame(() => {
        const el = filmRefs.current[filmId];
        if (el && scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const elTop = el.offsetTop;
          const elHeight = el.offsetHeight;
          const containerHeight = container.clientHeight;
          container.scrollTop = elTop - (containerHeight / 2) + (elHeight / 2);
        }
      });
    }
  };

  const handleArchiveClick = () => {
    setShowArchive(true);
  };

  const handleCloseArchive = () => {
    setShowArchive(false);
    // Reset scroll position to prevent unwanted navigation
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  // Filter projects
  const archiveProjects = films.filter(film => film.category === "archive");
  const archiveImages = archiveProjects.map(project => project.thumbnail).filter(Boolean);

  // Auto-advance archive carousel with cross-fade
  useEffect(() => {
    if (archiveImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentArchiveImageIndex((prev) => (prev + 1) % archiveImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [archiveImages.length]);

  // Filter films based on active filter (exclude archive)
  const filteredFilms = films.filter(film => {
    if (film.category === "archive") return false;
    if (activeFilter === "all") return true;
    return film.category === activeFilter;
  });

  // Detect when user scrolls to bottom
  useEffect(() => {
    const container = scrollContainerRef.current;
    
    if (!container || selectedFilm || showArchive) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 50;
        
        // Only navigate if truly at bottom and not in a detail view
        if (scrolledToBottom && !selectedFilm && !showArchive) {
          onNavigate('about');
        }
      }, 150); // Debounce scroll events
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [onNavigate, selectedFilm, showArchive]);

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5]" ref={scrollContainerRef}>
      {/* Film Detail View */}
      <AnimatePresence>
        {selectedFilm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f5f5]"
          >
            {/* Close button */}
            <button
              onClick={handleCloseDetail}
              className="fixed right-8 top-8 z-50 text-sm uppercase tracking-[0.2em] text-[#2a2a2a] transition-opacity hover:opacity-60 md:right-16 md:top-16"
            >
              CLOSE
            </button>

            {/* Detail Content */}
            <div className="px-8 py-16 md:px-16 lg:px-24">
              <div className="mx-auto max-w-6xl">
                {/* Hero Video */}
                {selectedFilm.videoUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-5 aspect-video w-full overflow-hidden"
                  >
                    <iframe
                      src={cleanVimeoUrl(selectedFilm.videoUrl + (selectedFilm.videoUrl.includes('?') ? '&' : '?') + 'playsinline=true')}
                      className="h-full w-full"
                      loading="lazy"
                      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  </motion.div>
                )}

                {/* Title & Brand */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-4"
                >
                  <p className="mb-1 text-sm uppercase tracking-[0.2em] text-[#6a6a6a]">
                    {selectedFilm.brand}
                  </p>
                  <h2 className="mb-4 text-5xl leading-[0.85] tracking-tight text-[#2a2a2a] md:text-6xl">
                    {selectedFilm.title}
                  </h2>
                  <p className="text-sm italic text-[#6a6a6a]">
                    {selectedFilm.role}
                  </p>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mb-8"
                >
                  <p className="text-lg leading-snug text-[#4a4a4a]">
                    {selectedFilm.description}
                  </p>
                </motion.div>

                {/* Credits - Only for non-archive projects */}
                {selectedFilm.credits && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mb-10 border-t border-[#e0e0e0] pt-5"
                  >
                    <h3 className="mb-3 text-sm uppercase tracking-[0.2em] text-[#6a6a6a]">
                      Credits
                    </h3>
                    <div className="grid gap-2 text-sm leading-snug md:grid-cols-2">
                      {selectedFilm.credits.agency && (
                      <div>
                        <span className="font-medium text-[#2a2a2a]">Agency: </span>
                        <span className="text-[#4a4a4a]">{selectedFilm.credits.agency}</span>
                      </div>
                    )}
                    {selectedFilm.credits.creativeDirector && (
                      <div>
                        <span className="font-medium text-[#2a2a2a]">Creative Director: </span>
                        <span className="text-[#4a4a4a]">{selectedFilm.credits.creativeDirector}</span>
                      </div>
                    )}
                    {selectedFilm.credits.director && (
                      <div>
                        <span className="font-medium text-[#2a2a2a]">Director: </span>
                        <span className="text-[#4a4a4a]">{selectedFilm.credits.director}</span>
                      </div>
                    )}
                    {selectedFilm.credits.artDirector && (
                      <div>
                        <span className="font-medium text-[#2a2a2a]">Art Director: </span>
                        <span className="text-[#4a4a4a]">{selectedFilm.credits.artDirector}</span>
                      </div>
                    )}
                    {selectedFilm.credits.production && (
                      <div>
                        <span className="font-medium text-[#2a2a2a]">Production: </span>
                        <span className="text-[#4a4a4a]">{selectedFilm.credits.production}</span>
                      </div>
                    )}
                    {selectedFilm.credits.postProduction && (
                      <div>
                        <span className="font-medium text-[#2a2a2a]">Post Production: </span>
                        <span className="text-[#4a4a4a]">{selectedFilm.credits.postProduction}</span>
                      </div>
                    )}
                    {selectedFilm.credits.screenwriter && (
                      <div>
                        <span className="font-medium text-[#2a2a2a]">Screenwriter: </span>
                        <span className="text-[#4a4a4a]">{selectedFilm.credits.screenwriter}</span>
                      </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Making Of Images - Only for non-archive projects */}
                {selectedFilm.makingOfImages && selectedFilm.makingOfImages.some(img => img !== "") && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mb-10"
                  >
                    <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-[#6a6a6a]">
                      Stills
                    </h3>
                    <div className="space-y-4">
                      {selectedFilm.makingOfImages.filter(img => img !== "").map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="aspect-video w-full overflow-hidden"
                        >
                          <img
                            src={image}
                            alt={`Stills ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Collection Videos */}
                {selectedFilm.collectionVideos && selectedFilm.collectionVideos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  >
                    <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-[#6a6a6a]">
                      Collection
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {selectedFilm.collectionVideos.map((videoUrl, index) => {
                        // Detect aspect ratio from video URL or film ID
                        // Winter Season (id 13) videos are 4/5
                        // Fête des mères (id 16) videos are square
                        const isPortraitVideo = selectedFilm.id === 13 || videoUrl.includes('4-5');
                        const isSquareVideo = selectedFilm.id === 16 || videoUrl.includes('1-1');
                        const aspectRatioClass = isSquareVideo ? 'aspect-square' : (isPortraitVideo ? 'aspect-[4/5]' : 'aspect-video');
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`overflow-hidden ${aspectRatioClass}`}
                          >
                            {(videoUrl.includes('player.cloudinary') || videoUrl.includes('player.vimeo')) ? (
                              <iframe
                                src={cleanVimeoUrl(videoUrl + (videoUrl.includes('?') ? '&' : '?') + 'playsinline=true')}
                                className="h-full w-full"
                                loading="lazy"
                                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <img
                                src={videoUrl}
                                alt={`Collection ${index + 1}`}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover"
                              />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Films Grid */}
      <div className="px-8 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 text-5xl leading-[0.85] tracking-tight text-[#2a2a2a] md:text-6xl lg:text-7xl"
          >
            Films
          </motion.h2>

          {/* Editorial Filter Index */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-9 flex flex-col items-start gap-2 md:flex-row md:items-baseline md:gap-12"
          >
            <button
              onClick={() => setActiveFilter("all")}
              className={`text-xs uppercase tracking-[0.25em] transition-all duration-300 whitespace-nowrap ${
                activeFilter === "all"
                  ? "text-[#2a2a2a]"
                  : "text-[#999] hover:text-[#6a6a6a]"
              }`}
            >
              ALL FILMS
            </button>
            <button
              onClick={() => setActiveFilter("hybrid")}
              className={`text-xs uppercase tracking-[0.25em] transition-all duration-300 whitespace-nowrap ${
                activeFilter === "hybrid"
                  ? "text-[#2a2a2a]"
                  : "text-[#999] hover:text-[#6a6a6a]"
              }`}
            >
              HYBRID NARRATIVES
            </button>
            <button
              onClick={() => setActiveFilter("animated")}
              className={`text-xs uppercase tracking-[0.25em] transition-all duration-300 whitespace-nowrap ${
                activeFilter === "animated"
                  ? "text-[#2a2a2a]"
                  : "text-[#999] hover:text-[#6a6a6a]"
              }`}
            >
              ANIMATED WORLDS
            </button>
          </motion.nav>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredFilms.map((film, index) => (
                <motion.div
                  key={film.id}
                  ref={(el: HTMLDivElement | null) => { filmRefs.current[film.id] = el; }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  onMouseEnter={() => setHoveredId(film.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleFilmClick(film)}
                  className="group cursor-pointer"
                >
                  <div className="relative mb-2 aspect-[4/5] overflow-hidden">
                    <motion.img
                      src={film.thumbnail}
                      alt={film.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      animate={{
                        scale: hoveredId === film.id ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-black"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === film.id ? 0.1 : 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  
                  <div className="space-y-0">
                    <h3 className="text-lg tracking-tight text-[#2a2a2a]">
                      {film.title}
                    </h3>
                    <p className="text-sm uppercase tracking-[0.2em] text-[#6a6a6a]">
                      {film.brand}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Archive Separator and Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8"
          >
            <div className="border-t border-[#d0d0d0] mb-8"></div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6 text-5xl leading-[0.85] tracking-tight text-[#2a2a2a] md:text-6xl lg:text-7xl"
            >
              Archive
            </motion.h2>
            
            {/* Archive Image with Cross-fade */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div 
                onClick={handleArchiveClick}
                onMouseEnter={() => setIsArchiveHovered(true)}
                onMouseLeave={() => setIsArchiveHovered(false)}
                className="group cursor-pointer"
              >
                <div className="relative mb-3 aspect-[4/5] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentArchiveImageIndex}
                      src={archiveImages[currentArchiveImageIndex]}
                      alt="Archive"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        scale: isArchiveHovered ? 1.05 : 1,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </AnimatePresence>
                  <motion.div
                    className="absolute inset-0 bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isArchiveHovered ? 0.1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Archive View */}
      <AnimatePresence>
        {showArchive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f5f5]"
          >
            {/* Close button */}
            <button
              onClick={handleCloseArchive}
              className="fixed right-8 top-8 z-50 text-sm uppercase tracking-[0.2em] text-[#2a2a2a] transition-opacity hover:opacity-60 md:right-16 md:top-16"
            >
              CLOSE
            </button>

            {/* Archive Content */}
            <div className="px-8 py-16 md:px-16 lg:px-24">
              <div className="mx-auto max-w-6xl">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-12 text-5xl leading-[0.85] tracking-tight text-[#2a2a2a] md:text-6xl lg:text-7xl"
                >
                  Archive
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mb-10"
                >
                  <p className="text-lg leading-snug text-[#4a4a4a]">
                    A curated selection of past projects and explorations that have shaped the creative journey. 
                    These works represent moments of experimentation, collaboration, and visual storytelling 
                    across various mediums and brands.
                  </p>
                </motion.div>

                {/* Archive Projects - Two Column Staggered Layout */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="space-y-12"
                >
                  {archiveProjects.map((project, index) => {
                    const isEven = index % 2 === 0;

                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className="grid gap-5 md:grid-cols-2 md:items-center md:gap-8"
                      >
                        {/* Video/Image */}
                        <div 
                          className={`overflow-hidden ${project.aspectRatio === "9/16" ? "flex justify-center" : "aspect-video"}`}
                          style={{ order: isEven ? 0 : 1 }}
                        >
                          {project.collectionVideos && project.collectionVideos.length > 0 ? (
                            <VideoPlaylist
                              videos={project.collectionVideos}
                              videoDurations={project.videoDurations}
                              aspectRatio={project.aspectRatio}
                              loop={true}
                              showControls={true}
                              autoplay={false}
                            />
                          ) : project.videoUrl && (project.videoUrl.includes('player.cloudinary') || project.videoUrl.includes('player.vimeo')) ? (
                            <iframe
                              src={cleanVimeoUrl(project.videoUrl.replace('autoplay=true', 'autoplay=false').replace('autoplay=1', 'autoplay=0') + (project.videoUrl.includes('?') ? '&' : '?') + 'playsinline=true')}
                              className="h-full w-full"
                              loading="lazy"
                              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <img
                              src={project.videoUrl || project.thumbnail}
                              alt={project.title}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        {/* Text Content */}
                        <div 
                          className="space-y-3"
                          style={{ order: isEven ? 1 : 0 }}
                        >
                          <div>
                            {project.year && (
                              <p className="mb-1 text-xs uppercase tracking-[0.25em] text-[#999]">
                                {project.year}
                              </p>
                            )}
                            <p className="mb-1 text-sm uppercase tracking-[0.2em] text-[#6a6a6a]">
                              {project.brand}
                            </p>
                            <h3 className="mb-3 text-2xl tracking-tight text-[#2a2a2a] md:text-3xl">
                              {project.title}
                            </h3>
                            {project.role && (
                              <p className="text-sm italic text-[#6a6a6a]">
                                {project.role}
                              </p>
                            )}
                          </div>
                          <p className="leading-snug text-[#4a4a4a]">
                            {project.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Spacer to allow scrolling past last content */}
      <div className="h-[50vh]"></div>
    </div>
  );
}