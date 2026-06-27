import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const pagesRoot = path.join(process.cwd(), "public", "content", "pages");

export const orders = {
  artworks: [
    "Listen to the Light - Keelung ver.",
    "Sun Dairy",
    "Inert Gas Resonance",
    "Rainforest",
    "Aftershocks in the Crevice",
    "Myst(Box Version)",
    "Microbial Ensemble",
    "□○△",
    "Void",
    "Creature from Desolate Planet",
    "Listen to the Light - routine",
    "Chaotic City",
    "Myst",
    "Soul - Vinyl",
    "Dive in Architecture",
    "Vibration of Ink Fluid",
    "Space Surfing",
    "&#x611b (online version)",
    "Tree Noise",
    "Counter",
    "Portal",
    "Zebra's Dream",
    "Listen to the Light",
    "Soul",
    "Cross",
    "Pronunciation Exercise",
    "&#x611b",
    "Cyberfly",
    "Feeding",
    "Memory Noise",
    "Sketch of Audio Visual",
    "Couldn't Find"
  ],
  collaborations: [
    "Sparks",
    "Sense data: sensual measurement x LIN Ying-Chen x CHAO Ting-Ting",
    "reCONNECT2024 : NEW CANVAS",
    "Name x Elephant Gym",
    "Acoustics Mirror x 404 N.F",
    "C-LAB Sound Festival x Elephant Gym",
    "Taoyuan Art x Technology Festival x DJ RayRay",
    "TFN(Technological Finding Netbot)",
    "Genesis Part I. The Dream of Prometheus",
    "NCCU Music Festival x Hue",
    "Dark Species"
  ],
  projects: [
    "reCONNECT2021",
    "高樓",
    "顫弩的吟詠",
    "入眠自習",
    "1:1",
    "貴人散步音樂節",
    "後花園-科技與音樂跨域實驗劇場",
    "異日方梭",
    "歇斯底里的房間",
    "無光風景-NTT TIFA駐館藝術家王連晟創作",
    "浮田舞影─邵族水沙連湖畔的夏夜杵歌",
    "車過枋寮-余光中音樂劇"
  ],
  reflections: ["Origin"]
};

function exists(filePath) {
  return fs.existsSync(filePath);
}

function publicPath(...parts) {
  return `/content/pages/${parts.map((part) => encodeURIComponent(part)).join("/")}`;
}

function firstExistingImage(dir, category, slug, preferred) {
  const candidates = [];
  if (preferred) candidates.push(preferred);

  if (exists(dir)) {
    candidates.push(
      ...fs.readdirSync(dir).filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file))
    );
  }

  const image = candidates.find((file) => exists(path.join(dir, file)));
  return image ? publicPath(category, slug, image) : "";
}

function normalizeHtml(html, category, slug) {
  return html.replace(/src=(["'])\.\/([^"']+)\1/g, (_match, quote, file) => {
    return `src=${quote}${publicPath(category, slug, file)}${quote}`;
  });
}

function normalizeDescription(description) {
  if (!description) {
    return { en: "", zh: "" };
  }

  if (typeof description === "string") {
    return {
      en: description,
      zh: description
    };
  }

  return {
    en: description.en || description.zh || "",
    zh: description.zh || description.en || ""
  };
}

function normalizeMedia(media, category, slug) {
  if (!Array.isArray(media)) return [];

  return media.map((item) => {
    if (item.type === "image") {
      return {
        ...item,
        src: publicPath(category, slug, item.src)
      };
    }

    if (item.type === "video" || item.type === "iframe") {
      return {
        ...item,
        type: "video",
        title: item.title || "video",
        allow: item.allow || "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      };
    }

    return item;
  });
}

function normalizeWorks(works) {
  if (!Array.isArray(works)) return [];

  return works.map((work) => {
    if (typeof work === "string") {
      return {
        title: work,
        slug: ""
      };
    }

    return {
      title: work.title || "",
      slug: work.slug || ""
    };
  });
}

export function getEntries(category) {
  const categoryDir = path.join(pagesRoot, category);
  if (!exists(categoryDir)) return [];

  return fs.readdirSync(categoryDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => getEntry(category, entry.name))
    .filter(Boolean);
}

export function getEntry(category, slug) {
  const dir = path.join(pagesRoot, category, slug);
  const file = path.join(dir, "index.md");
  if (!exists(file)) return null;

  const source = fs.readFileSync(file, "utf8");
  const parsed = matter(source);
  const rawData = parsed.data || {};

  const description = normalizeDescription(rawData.description);
  const media = normalizeMedia(rawData.media, category, slug);
  const works = normalizeWorks(rawData.works);

  const html = normalizeHtml(marked.parse(parsed.content || ""), category, slug);

  const data = {
    ...rawData,
    description,
    media,
    works
  };

  return {
    category,
    slug,
    href: `/${category}/${slug}/`,
    data,
    html,
    languageHtml: {
      en: description.en,
      zh: description.zh
    },
    featuredImage: firstExistingImage(dir, category, slug, rawData.featuredImage)
  };
}

export function getOrderedEntries(category) {
  const entries = getEntries(category);

  if (!orders[category]) {
    return entries;
  }

  const byTitle = new Map(entries.map((entry) => [entry.data.title, entry]));
  const ordered = orders[category].map((title) => byTitle.get(title)).filter(Boolean);
  const seen = new Set(ordered.map((entry) => entry.slug));

  return [...ordered, ...entries.filter((entry) => !seen.has(entry.slug))];
}
