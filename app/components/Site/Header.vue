<template>
  <header class="header">
    <div class="frame inner" :class="{ wide }">
      <NuxtLink to="/" class="brand" aria-label="Vercube home">
        <AppLogo class="logo" />
        <span class="pixel name">vercube</span>
      </NuxtLink>

      <nav class="nav" aria-label="Main">
        <NuxtLink v-for="link in header.nav" :key="link.label" :to="link.to" :class="{ on: isActive(link.to) }">
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="actions">
        <button type="button" class="search mono" aria-label="Search the docs" @click="search.open.value = true">
          <UIcon name="i-lucide-search" class="size-3.5" />
          <span class="search-label">Search</span>
          <kbd>⌘K</kbd>
        </button>
        <NuxtLink
          v-for="link in header.links"
          :key="link.to"
          :to="link.to"
          target="_blank"
          class="icon"
          :aria-label="link['aria-label']"
        >
          <UIcon :name="link.icon" class="size-4" />
        </NuxtLink>
        <NuxtLink to="/docs/getting-started" class="btn primary start">Get started</NuxtLink>
        <button type="button" class="menu-btn" aria-label="Open menu" @click="menu = true">
          <UIcon name="i-lucide-menu" class="size-5" />
        </button>
      </div>
    </div>

    <USlideover v-model:open="menu" side="right" title="Menu" :ui="{ content: 'max-w-xs' }">
      <template #body>
        <nav class="mobile-nav" aria-label="Main">
          <NuxtLink v-for="link in header.nav" :key="link.label" :to="link.to" @click="menu = false">
            {{ link.label }}
          </NuxtLink>
        </nav>
        <UContentNavigation
          v-if="route.path.startsWith('/docs') && docsNavigation.length"
          class="mt-6"
          :navigation="docsNavigation"
          highlight
        />
      </template>
    </USlideover>
  </header>
</template>

<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

const { header } = useAppConfig();
const route = useRoute();
const wide = computed(() => route.path.startsWith('/docs'));
const search = useContentSearch();
const menu = ref(false);

const navigationDisplay = inject<ComputedRef<ContentNavigationItem[]>>(
  'navigationDisplay',
  computed(() => []),
);
const docsNavigation = computed(
  () => navigationDisplay.value.find((item) => item.path === '/docs')?.children ?? navigationDisplay.value,
);

watch(
  () => route.path,
  () => (menu.value = false),
);

function isActive(to: string) {
  if (to === '/docs') return route.path.startsWith('/docs') && !route.path.startsWith('/docs/getting-started/examples');
  return route.path === to || route.path.startsWith(`${to}/`);
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--h-line);
  background: rgb(9 9 11 / 0.35);
  /* No hand-written -webkit- copy: the production minifier keeps only the
     prefixed one when both are present, and Chrome ignores it. It adds the
     prefix itself where the browser targets need it. */
  backdrop-filter: blur(16px) saturate(1.4);
}

.inner {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 56px;
  padding: 0 var(--pad);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 22px;
}

.name {
  font-size: 18px;
}

.nav {
  display: flex;
  gap: 24px;
  margin-left: auto;
  font-size: 13px;
}

.nav a,
.icon {
  color: var(--h-muted);
  transition: color 160ms ease;
}

.nav a:hover,
.nav a.on,
.icon:hover {
  color: var(--h-ink);
}

.actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 8px 0 10px;
  border: 1px solid var(--h-line);
  background: rgb(19 19 23 / 0.6);
  font-size: 11.5px;
  color: var(--h-dim);
  transition:
    border-color 160ms ease,
    color 160ms ease;
}

.search:hover {
  border-color: #52525b;
  color: var(--h-muted);
}

.search kbd {
  padding: 0 5px;
  border: 1px solid var(--h-line);
  font-family: inherit;
  font-size: 10px;
}

.icon {
  display: flex;
}

.start {
  height: 30px;
}

.menu-btn {
  display: none;
  color: var(--h-muted);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 15px;
}

.mobile-nav a {
  padding: 6px 0;
  color: var(--ui-text-highlighted);
}

@media (width < 960px) {
  .nav,
  .icon,
  .search-label,
  .search kbd {
    display: none;
  }

  .actions {
    margin-left: auto;
  }

  .menu-btn {
    display: flex;
  }
}

/* The docs sidebar folds at 1024px: its links move into this menu. */
@media (width < 1024px) {
  .wide .menu-btn {
    display: flex;
  }
}

@media (width < 480px) {
  .start {
    display: none;
  }
}
</style>
