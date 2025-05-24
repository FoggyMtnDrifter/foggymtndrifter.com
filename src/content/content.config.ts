import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const legalCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    lastUpdated: z.date(),
  }),
});

export const collections = {
  blog: blogCollection,
  legal: legalCollection,
};
