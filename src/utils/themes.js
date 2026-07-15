import { getEntries } from "./content.js";

const themeOrder = [
  "Sonic Alchemy",
  "Light as Signal",
  "The System",
  "Geometry",
  "Audio Visual Animate",
  "Wrong Sound"
];

function getTitleText(title) {
  if (!title) return "";
  if (typeof title === "string") return title;
  return title.en || title.zh || "";
}

function normalizeWork(work, artworks) {
  const bySlug = new Map(artworks.map((entry) => [entry.slug, entry]));
  const byTitle = new Map(artworks.map((entry) => [entry.data.title, entry]));

  if (typeof work === "string") {
    const artwork = byTitle.get(work);

    return {
      title: work,
      href: artwork?.href || "#"
    };
  }

  const title = getTitleText(work.title);
  const artwork = work.slug ? bySlug.get(work.slug) : byTitle.get(title);

  return {
    title: title || artwork?.data.title || "",
    href: artwork?.href || (work.slug ? `/artworks/${work.slug}/` : "#")
  };
}

export function getThemeEntries() {
  const entries = getEntries("themes");
  const byTitle = new Map(entries.map((entry) => [entry.data.title, entry]));

  const ordered = themeOrder
    .map((title) => byTitle.get(title))
    .filter(Boolean);

  const seen = new Set(ordered.map((entry) => entry.slug));
  const unordered = entries.filter((entry) => !seen.has(entry.slug));

  return [...ordered, ...unordered];
}

export function getThemeWorks(themeEntry) {
  const artworks = getEntries("artworks");
  const works = themeEntry.data.works || [];

  return works.map((work) => normalizeWork(work, artworks));
}