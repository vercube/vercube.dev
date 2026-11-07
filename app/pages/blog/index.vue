<script setup lang="ts">
definePageMeta({
  colorMode: 'dark',
});
const { data: page } = await useAsyncData('blog-page', () => {
  return queryCollection('pages').path('/blog').first();
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  });
}
const { data: posts } = await useAsyncData('blogs', () => queryCollection('blog').order('date', 'DESC').all());
if (!posts.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'blogs posts not found',
    fatal: true,
  });
}

const title = page.value?.seo?.title || page.value?.title || 'Blog';
const description = page.value?.seo?.description || page.value?.description || '';

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});

defineOgImage('Vercube', {
  headline: 'Releases and write-ups',
  title,
  description,
});

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
</script>

<template>
  <div v-if="page">
    <SitePageHero kicker="Blog" :title="page.title" :description="page.description" />

    <section class="band">
      <ol class="frame posts">
        <li v-for="(post, i) in posts" :key="post.path" class="post">
          <NuxtLink :to="post.path" class="row">
            <span class="meta mono">
              <span class="index">{{ String(posts!.length - i).padStart(2, '0') }}</span>
              <time :datetime="String(post.date)">{{ formatDate(post.date) }}</time>
            </span>
            <span class="text">
              <span class="tags mono">
                <span v-if="post.category" class="chip">{{ post.category }}</span>
                <span class="read">{{ post.minRead }} min read</span>
              </span>
              <span class="title">{{ post.title }}</span>
              <span class="desc">{{ post.description }}</span>
            </span>
            <span class="arrow mono" aria-hidden="true">→</span>
          </NuxtLink>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.posts {
  display: flex;
  flex-direction: column;
}

.post + .post {
  border-top: 1px solid var(--h-line);
}

.row {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr) 40px;
  gap: 24px;
  padding: 28px var(--pad);
  transition: background-color 200ms ease;
}

.row:hover {
  background: var(--h-panel);
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11.5px;
  color: var(--h-dim);
}

.index {
  color: var(--h-accent);
}

.text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tags {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: var(--h-dim);
}

.title {
  font-family: 'Geist Pixel Line', 'Geist Mono', monospace;
  font-size: 26px;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--h-ink);
}

.desc {
  max-width: 68ch;
  font-size: 14.5px;
}

.arrow {
  align-self: center;
  justify-self: end;
  color: var(--h-dim);
  transition:
    transform 200ms var(--ease),
    color 200ms ease;
}

.row:hover .arrow {
  color: var(--h-accent);
  transform: translateX(4px);
}

@media (width < 720px) {
  .row {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }

  .meta {
    flex-direction: row;
    gap: 12px;
  }

  .arrow {
    display: none;
  }
}
</style>
