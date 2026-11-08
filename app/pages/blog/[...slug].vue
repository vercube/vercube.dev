<script setup lang="ts">
import { kebabCase } from 'scule';

definePageMeta({
  colorMode: 'dark',
});

const route = useRoute();

const { data: page } = await useAsyncData(kebabCase(route.path), () => queryCollection('blog').path(route.path).first());
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

// Posts are numbered by release, so the surroundings are the older and the
// newer post.
const { data: surround } = await useAsyncData(`${kebabCase(route.path)}-surround`, () =>
  queryCollectionItemSurroundings('blog', route.path, { fields: ['description'] }),
);
const older = computed(() => surround.value?.[0] ?? null);
const newer = computed(() => surround.value?.[1] ?? null);

const title = page.value.seo?.title || page.value.title;
const description = page.value.seo?.description || page.value.description;

const site = useSiteConfig();

if (page.value.image) {
  const imageUrl = page.value.image.startsWith('http')
    ? page.value.image
    : `${site.url || 'https://vercube.dev'}${page.value.image}`;
  // @ts-expect-error - url is not typed
  defineOgImage({ url: imageUrl });
} else {
  defineOgImage('Vercube', {
    headline: [
      'Blog',
      page.value.category,
      new Date(page.value.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    ]
      .filter(Boolean)
      .join(' · '),
    title,
    description,
  });
}
const titleTemplate = ref('%s - Vercube Blog');

const fullTitle = titleTemplate.value.replace('%s', title);

useSeoMeta({
  title,
  titleTemplate,
  description,
  ogDescription: description,
  ogTitle: fullTitle,
  twitterTitle: fullTitle,
  twitterDescription: description,
  ogType: 'article',
  articlePublishedTime: new Date(page.value.date).toISOString(),
  articleModifiedTime: new Date(page.value.date).toISOString(),
  articleAuthor: page.value.author.to ? [page.value.author.to] : undefined,
  articleSection: page.value.category,
});

// BlogPosting structured data, so search engines read the post as a dated article by a person.
const postUrl = `${site.url || 'https://vercube.dev'}${route.path}`;

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: page.value.title,
        description,
        datePublished: new Date(page.value.date).toISOString(),
        dateModified: new Date(page.value.date).toISOString(),
        url: postUrl,
        mainEntityOfPage: postUrl,
        inLanguage: 'en',
        articleSection: page.value.category,
        author: {
          '@type': 'Person',
          name: page.value.author.avatar?.alt || page.value.author.name,
          url: page.value.author.to,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Vercube',
          url: site.url || 'https://vercube.dev',
          logo: { '@type': 'ImageObject', url: `${site.url || 'https://vercube.dev'}/web-app-manifest-512x512.png` },
        },
      }),
    },
  ],
});

const editThisPage = computed(() => ({
  icon: 'i-heroicons-pencil-square-solid',
  label: 'Edit this page',
  to: `https://github.com/vercube/vercube.dev/tree/main/content/${page?.value?.stem}.md`,
  target: '_blank',
}));

const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script>

<template>
  <div v-if="page">
    <SitePageHero :title="page.title" :description="page.description" narrow plain>
      <template #kicker>
        <NuxtLink to="/blog" class="back">← Blog</NuxtLink>
        <span>·</span>
        <b>{{ page.category || 'Post' }}</b>
        <span>·</span>
        <time :datetime="String(page.date)">{{ formatDate(page.date) }}</time>
        <span>·</span>
        <span>{{ page.minRead }} min read</span>
      </template>
      <component
        :is="page.author.to ? 'a' : 'div'"
        class="author"
        :href="page.author.to"
        :target="page.author.to ? '_blank' : undefined"
        :rel="page.author.to ? 'noopener' : undefined"
      >
        <img v-if="page.author.avatar" :src="page.author.avatar.src" :alt="page.author.avatar.alt" class="avatar" />
        <span class="who">
          <b>{{ page.author.name }}</b>
          <span v-if="page.author.to" class="mono handle">@{{ page.author.to.split('/').pop() }}</span>
        </span>
      </component>
    </SitePageHero>

    <section class="band">
      <div class="frame body">
        <article class="article">
          <ContentRenderer v-if="page.body" :value="page" />
        </article>
      </div>
    </section>

    <nav class="band" aria-label="More posts">
      <div class="frame more">
        <NuxtLink v-if="older" :to="older.path" class="cell">
          <span class="mono dir">← Older</span>
          <span class="cell-title">{{ older.title }}</span>
          <span v-if="older.description" class="cell-desc">{{ older.description }}</span>
        </NuxtLink>
        <span v-else class="cell empty" />
        <NuxtLink v-if="newer" :to="newer.path" class="cell newer">
          <span class="mono dir">Newer →</span>
          <span class="cell-title">{{ newer.title }}</span>
          <span v-if="newer.description" class="cell-desc">{{ newer.description }}</span>
        </NuxtLink>
        <NuxtLink v-else to="/blog" class="cell newer">
          <span class="mono dir">All posts →</span>
          <span class="cell-title">This is the latest post</span>
          <span class="cell-desc">Every release note and write-up, newest first.</span>
        </NuxtLink>
      </div>
      <div class="frame meta-row mono">
        <NuxtLink to="/blog">← All posts</NuxtLink>
        <NuxtLink :to="editThisPage.to" target="_blank">Edit this page on GitHub →</NuxtLink>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.author {
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
}

a.author:hover .who b {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.avatar {
  width: 36px;
  height: 36px;
  border: 1px solid var(--h-line);
  object-fit: cover;
}

.who {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.who b {
  font-weight: 500;
  font-size: 14px;
  color: var(--h-ink);
}

.handle {
  font-size: 11px;
  color: var(--h-dim);
}

.back {
  color: var(--h-muted);
  transition: color 160ms ease;
}

.back:hover {
  color: var(--h-ink);
}

.body {
  padding: 56px var(--pad) 72px;
}

.article {
  width: min(100%, 720px);
  margin-inline: auto;
}

.more {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  padding: 28px var(--pad);
  transition: background-color 200ms ease;
}

.cell + .cell {
  border-left: 1px solid var(--h-line);
}

a.cell:hover {
  background: var(--h-panel);
}

.newer {
  text-align: right;
  align-items: flex-end;
}

.dir {
  font-size: 11px;
  color: var(--h-accent);
}

.cell-title {
  font-family: 'Geist Pixel Line', 'Geist Mono', monospace;
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--h-ink);
}

.cell-desc {
  max-width: 52ch;
  font-size: 13.5px;
  color: var(--h-dim);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px var(--pad);
  border-top: 1px solid var(--h-line);
  font-size: 11.5px;
  color: var(--h-dim);
}

.meta-row a {
  transition: color 160ms ease;
}

.meta-row a:hover {
  color: var(--h-ink);
}

@media (width < 720px) {
  .more {
    grid-template-columns: minmax(0, 1fr);
  }

  .cell + .cell {
    border-left: 0;
    border-top: 1px solid var(--h-line);
  }

  .newer {
    text-align: left;
    align-items: flex-start;
  }

  .empty {
    display: none;
  }
}
</style>
