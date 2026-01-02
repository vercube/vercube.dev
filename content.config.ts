import { defineContentConfig, defineCollection, z } from '@nuxt/content';

const createAuthorSchema = () =>
  z.object({
    name: z.string(),
    description: z.string().optional(),
    username: z.string().optional(),
    twitter: z.string().optional(),
    to: z.string().optional(),
    avatar: createImageSchema().optional(),
  });

const createImageSchema = () =>
  z.object({
    src: z.string().editor({ input: 'media' }),
    alt: z.string(),
  });

const docsSource = {
  cwd: process.env.VERCUBE_PATH ?? undefined,
  repository: process.env.VERCUBE_PATH ? undefined : 'https://github.com/vercube/vercube/tree/main',
  include: 'docs/**/*',
  exclude: ['docs/**/*.json'],
  prefix: '/docs',
};

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'data',
      source: 'index.yml',
      schema: z.object({
        hero: z.object({
          title: z.string(),
          description: z.string(),
          slug: z.string(),
          tabs: z.array(
            z.object({
              title: z.string(),
              content: z.string(),
            }),
          ),
        }),
      }),
    }),
    landing: defineCollection({
      type: 'page',
      source: 'index.md',
    }),
    docs: defineCollection({
      type: 'page',
      source: [docsSource],
      schema: z.object({
        links: z
          .array(
            z.object({
              label: z.string(),
              icon: z.string(),
              to: z.string(),
              target: z.string().optional(),
            }),
          )
          .optional(),
      }),
    }),
    pages: defineCollection({
      type: 'page',
      source: [{ include: 'blog.yml' }],
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        minRead: z.number(),
        date: z.date(),
        image: z.string().nonempty().editor({ input: 'media' }).optional(),
        shortImage: z.string().nonempty().editor({ input: 'media' }).optional(),
        author: createAuthorSchema(),
      }),
    }),
  },
});
