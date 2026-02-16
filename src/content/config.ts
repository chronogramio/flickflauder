/**
 * Content Collections Configuration
 * Defines schemas for blog posts and portfolio projects with i18n support
 */

import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Flickflauder'),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['de', 'en']),
  }),
});

const portfolioCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    technologies: z.array(z.string()),
    liveUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(999),
    lang: z.enum(['de', 'en']),
  }),
});

export const collections = {
  blog: blogCollection,
  portfolio: portfolioCollection,
};
