// src/content/config.ts
import { defineCollection, z } from "astro:content";

const imageBlock = ({ image }: { image: any }) =>
  z.object({
    type: z.literal("image"),
    src: image(),
    alt: z.string().optional(),
    credit: z.string().optional(),
  });

const textBlock = z.object({
  type: z.literal("text"),
  content: z.string(),
});

const videoBlock = z.object({
  type: z.union([z.literal("video"), z.literal("iframe")]),
  src: z.string(),
  title: z.string().optional(),
  provider: z.string().optional(),
  allow: z.string().optional(),
});

const stringList = z.union([z.string(), z.array(z.string())]).optional();

const localizedString = z
  .union([
    z.string(),
    z.object({
      en: z.string().optional(),
      zh: z.string().optional(),
    }),
  ])
  .optional();

const blocksSchema = ({ image }: { image: any }) =>
  z
    .object({
      en: z.array(z.union([textBlock, imageBlock({ image }), videoBlock])).optional(),
      zh: z.array(z.union([textBlock, imageBlock({ image }), videoBlock])).optional(),
    })
    .optional();

const workSchema = ({ image }: { image: any }) =>
  z.object({
    posttype: z.string().optional(),
    title: z.string(),
    date: z.string().optional(),
    material: stringList,
    category: z.string().optional(),
    event: z.string().optional(),
    venue: stringList,
    featuredImage: image().optional(),
    blocks: blocksSchema({ image }),
  });

const cvItem = z.object({
  year: z.string().optional(),
  text: z.string(),
});

const cvSection = z.object({
  title: z.string(),
  items: z.array(cvItem).optional(),
});

const cvLanguage = z.object({
  name: z.string(),
  bio: z.string().optional(),
  sections: z.array(cvSection).optional(),
});

const artworks = defineCollection({
  schema: ({ image }) => workSchema({ image }),
});

const collaborations = defineCollection({
  schema: ({ image }) => workSchema({ image }),
});

const reflections = defineCollection({
  schema: ({ image }) => workSchema({ image }),
});

const themeWork = z.union([
  z.string(),
  z.object({
    title: localizedString,
    slug: z.string().optional(),
  }),
]);

const themes = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: localizedString,
      title_en: z.string().optional(),
      title_zh: z.string().optional(),

      description: localizedString,
      description_en: z.string().optional(),
      description_zh: z.string().optional(),

      introduction: localizedString,
      introduction_en: z.string().optional(),
      introduction_zh: z.string().optional(),

      featuredImage: image().optional(),
      works: z.array(themeWork).optional(),
      blocks: blocksSchema({ image }),
    }),
});

const cv = defineCollection({
  schema: ({ image }) =>
    z.object({
      portrait: image().optional(),
      cv: z.object({
        en: cvLanguage.optional(),
        zh: cvLanguage.optional(),
      }),
    }),
});

export const collections = {
  artworks,
  collaborations,
  reflections,
  themes,
  cv,
};