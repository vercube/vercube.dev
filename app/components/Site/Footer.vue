<template>
  <footer class="band foot">
    <div class="frame cols" :class="{ wide }">
      <div class="brand">
        <NuxtLink to="/" class="logo-link" aria-label="Vercube home">
          <AppLogo class="logo" />
          <span class="pixel name">vercube</span>
        </NuxtLink>
        <p class="note">The TypeScript server framework for Node.js, Bun and Deno.</p>
      </div>
      <nav v-for="col in cols" :key="col.title" :aria-label="col.title" class="col">
        <p class="mono col-title">{{ col.title }}</p>
        <ul>
          <li v-for="link in col.links" :key="link.label">
            <NuxtLink :to="link.to" :target="link.to.startsWith('http') ? '_blank' : undefined">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
    <div class="frame wordmark-row" :class="{ wide }">
      <p class="pixel wordmark" aria-hidden="true">vercube</p>
    </div>
    <div class="frame legal mono" :class="{ wide }">
      <span>© {{ year }} Vercube · MIT License</span>
      <span>
        Made by
        <a href="https://github.com/OskarLebuda" target="_blank" rel="noopener" class="maker">Oskar Lebuda</a>
        and contributors
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
const route = useRoute();
const wide = computed(() => route.path.startsWith('/docs'));

const cols = [
  {
    title: 'Docs',
    links: [
      { label: 'Introduction', to: '/docs/getting-started' },
      { label: 'Installation', to: '/docs/getting-started/installation' },
      { label: 'Project generator', to: '/docs/getting-started/project-generator' },
      { label: 'Examples', to: '/docs/getting-started/examples' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'Changelog', to: '/changelog' },
      { label: 'Blog', to: '/blog' },
      { label: 'Benchmarks', to: 'https://github.com/vercube/benchmarks' },
      { label: 'Sponsor', to: 'https://github.com/sponsors/OskarLebuda' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', to: 'https://github.com/vercube/vercube' },
      { label: 'Discord', to: 'https://chat.vercube.dev' },
      { label: 'X', to: 'https://x.com/vercubejs' },
    ],
  },
];
</script>

<style scoped>
.maker {
  color: inherit;
}

.maker:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.cols {
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: 24px;
  padding: 44px var(--pad);
}

.logo-link {
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

.note {
  max-width: 28ch;
  margin-top: 12px;
  font-size: 13px;
}

.col-title {
  margin-bottom: 10px;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--h-dim);
}

.col li + li {
  margin-top: 6px;
}

.col a {
  font-size: 13px;
  color: var(--h-muted);
  transition: color 160ms ease;
}

.col a:hover {
  color: var(--h-ink);
}

.wordmark-row {
  overflow: hidden;
  border-top: 1px solid var(--h-line);
}

.wordmark {
  margin-bottom: -0.2em;
  font-size: clamp(5rem, 22vw, 15.5rem);
  line-height: 1;
  letter-spacing: -0.04em;
  text-align: center;
  color: #18181b;
  user-select: none;
}

.legal {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px var(--pad);
  border-top: 1px solid var(--h-line);
  font-size: 11px;
  color: var(--h-dim);
}

@media (width < 860px) {
  .cols {
    grid-template-columns: repeat(2, 1fr);
  }

  .brand {
    grid-column: 1 / -1;
  }

  .legal {
    flex-direction: column;
  }
}
</style>
