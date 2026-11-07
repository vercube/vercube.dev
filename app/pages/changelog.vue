<script setup lang="ts">
definePageMeta({
  colorMode: 'dark',
});

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en',
  },
});

const title = 'Changelog - Vercube';
const description = 'Track our journey with a detailed history of updates, improvements, and new features.';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
});

defineOgImage('Vercube', {
  headline: 'Releases',
  title: 'Changelog',
  description: 'Track our journey with a detailed history of updates, improvements, and new features.',
});

const appConfig = useAppConfig();

const { data: versions } = await useFetch(
  computed(() => `https://ungh.cc/repos/${appConfig.repository}/releases`),
  {
    // Fresh data on every request (no payload / route cache reuse for this key).
    key: 'github-releases-changelog',
    getCachedData: () => undefined,
    transform: (data: {
      releases: {
        name?: string;
        tag: string;
        publishedAt: string;
        markdown: string;
      }[];
    }) => {
      return data.releases.map((release) => ({
        url: `https://github.com/${appConfig.repository}/releases/tag/${release.tag}`,
        tag: release.tag,
        title: release.name || release.tag,
        date: release.publishedAt,
        // Bare issue and pull links read as #1306, the way GitHub shows them.
        markdown: release.markdown.replaceAll(
          /(?<![(<[])https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/(?:issues|pull)\/(\d+)/g,
          (url, id) => `[#${id}](${url})`,
        ),
      }));
    },
  },
);

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
</script>

<template>
  <div>
    <SitePageHero kicker="Changelog" title="Changelog" :description="description">
      <div class="ctas">
        <NuxtLink to="/docs/getting-started" class="btn primary">Get started →</NuxtLink>
        <NuxtLink :to="`https://github.com/${appConfig.repository}/releases`" target="_blank" class="btn">
          <UIcon name="i-simple-icons-github" class="size-4" />
          All releases
        </NuxtLink>
      </div>
    </SitePageHero>

    <section class="band">
      <ol class="frame versions">
        <li v-for="(version, i) in versions" :key="version.tag" class="version">
          <div class="side">
            <div class="sticky">
              <p class="mono label">
                <span class="dot-mark" :class="{ latest: i === 0 }" />
                {{ i === 0 ? 'Latest' : 'Release' }}
              </p>
              <h2 class="tag">{{ version.title }}</h2>
              <time class="mono date" :datetime="version.date">{{ formatDate(version.date) }}</time>
              <NuxtLink :to="version.url" target="_blank" class="link-arrow">On GitHub →</NuxtLink>
            </div>
          </div>
          <div class="notes">
            <MDC v-if="version.markdown" :value="version.markdown" />
          </div>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.version {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
}

.version + .version {
  border-top: 1px solid var(--h-line);
}

.side {
  border-right: 1px solid var(--h-line);
}

.sticky {
  position: sticky;
  top: 57px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 32px var(--pad);
}

.label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--h-dim);
}

.dot-mark {
  width: 7px;
  height: 7px;
  background: #3f3f46;
}

.dot-mark.latest {
  background: var(--h-accent);
  box-shadow: 0 0 10px var(--h-accent);
}

.tag {
  font-family: 'Geist Pixel Line', 'Geist Mono', monospace;
  font-weight: 400;
  font-size: 32px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--h-ink);
}

.date {
  font-size: 11.5px;
  color: var(--h-dim);
}

.notes {
  min-width: 0;
  padding: 24px var(--pad) 40px;
}

@media (width < 860px) {
  .version {
    grid-template-columns: minmax(0, 1fr);
  }

  .side {
    border-right: 0;
    border-bottom: 1px solid var(--h-line);
  }

  .sticky {
    position: static;
    padding-bottom: 20px;
  }
}
</style>
