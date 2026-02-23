import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    tags: z.array(z.string()),
    stack: z.array(z.string()),
    outcomes: z.array(z.string()),
    featured: z.boolean(),
    lang: z.enum(["en", "zh-TW"]),
    urlSlug: z.string(),
    thumbnail: z.string().optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    lang: z.enum(["en", "zh-TW"]),
    urlSlug: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { projects, writing };
