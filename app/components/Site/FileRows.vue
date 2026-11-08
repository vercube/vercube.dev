<template>
  <TransitionGroup name="file" tag="ul" class="tree" :class="{ plain }">
    <li
      v-for="(row, i) in rows"
      :key="row.path"
      class="file"
      :class="{ folder: row.folder, added: row.origin }"
      :style="{ '--i': i }"
    >
      <span v-for="level in row.depth" :key="level" class="guide" aria-hidden="true" />
      <UIcon :name="iconFor(row)" class="ico" />
      <span class="name">{{ row.name }}</span>
      <span v-if="row.origin" class="origin">{{ row.origin }}</span>
    </li>
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { TreeRow } from '~/utils/file-tree';

// `plain`: a static listing, every name readable and the notes quiet.
defineProps<{ rows: TreeRow[]; plain?: boolean }>();

// Full names on purpose: these are listed in `icon.clientBundle` (nuxt.config),
// so the static site never asks the Iconify API for them.
function iconFor(row: TreeRow): string {
  if (row.folder) return 'lucide:folder-open';
  if (row.name.endsWith('.test.ts')) return 'vscode-icons:file-type-testts';
  if (row.name === 'vite.config.ts') return 'vscode-icons:file-type-vite';
  if (row.name === 'package.json') return 'vscode-icons:file-type-npm';
  if (row.name.startsWith('.env')) return 'vscode-icons:file-type-dotenv';
  if (row.name === 'docker-compose.yml') return 'vscode-icons:file-type-docker2';
  if (row.name.endsWith('.vue')) return 'vscode-icons:file-type-vue';
  if (row.name.endsWith('.json')) return 'vscode-icons:file-type-json';
  if (row.name.endsWith('.yml')) return 'vscode-icons:file-type-yaml';
  return 'vscode-icons:file-type-typescript-official';
}
</script>

<style scoped>
.tree {
  margin: -2px -8px;
}

.file {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  padding: 0 8px;
  color: var(--h-dim);
  white-space: nowrap;
  transition: background-color 160ms ease;
}

.file:hover {
  background: var(--h-raise);
}

.file.folder {
  color: var(--h-muted);
}

.file.added .name {
  color: var(--h-ink);
}

/* Indent guides: a run of nested rows draws one continuous line. */
.guide {
  align-self: stretch;
  flex: 0 0 auto;
  width: 8px;
  margin-left: 7px;
  margin-right: -8px;
  border-left: 1px solid var(--h-line);
}

.ico {
  flex: 0 0 auto;
  width: 15px;
  height: 15px;
}

.folder .ico {
  color: var(--h-dim);
}

.name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.origin {
  flex: 0 0 auto;
  margin-left: auto;
  padding-left: 12px;
  font-size: 10.5px;
  color: var(--h-accent);
}

.file-move {
  transition: transform 280ms var(--ease);
}

.file-leave-active {
  display: none;
}

@media (prefers-reduced-motion: no-preference) {
  .file-enter-active {
    transition:
      opacity 280ms var(--ease) calc(var(--i) * 28ms),
      transform 280ms var(--ease) calc(var(--i) * 28ms),
      background-color 1100ms ease calc(var(--i) * 28ms);
  }

  .file-enter-from {
    opacity: 0;
    transform: translateX(-8px);
    background: rgb(188 78 255 / 0.22);
  }
}

.plain .file {
  color: #d4d4d8;
}

.plain .file.added .name {
  color: #d4d4d8;
}

.plain .origin {
  font-size: 11.5px;
  color: var(--h-dim);
}
</style>
