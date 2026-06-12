<template>
  <div class="editor">
    <!-- window title bar -->
    <div class="bar">
      <div class="dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div class="filename">
        <UIcon name="i-vscode-icons-file-type-typescript-official" class="size-3.5" />
        {{ activeTab?.file }}
      </div>
      <button type="button" class="copy" :aria-label="copied ? 'Copied' : 'Copy code'" @click="copyCode">
        <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="size-4" />
      </button>
    </div>

    <!-- scenario tabs -->
    <div class="tabstrip" role="tablist">
      <button
        v-for="(tab, i) in tabs"
        :key="tab.label"
        type="button"
        role="tab"
        :aria-selected="active === i"
        class="tab"
        :class="{ 'tab--active': active === i }"
        @click="active = i"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- code -->
    <div class="code">
      <LazyMDC :value="activeTab?.content ?? ''" :cache-key="`hero-code-${active}`" hydrate-on-idle />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('hero', () => queryCollection('index').first());

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const tabs = computed(() =>
  (page.value?.hero.tabs ?? []).map((tab) => ({
    label: tab.title,
    file: tab.file,
    content: tab.content,
  })),
);

const active = ref(0);
const activeTab = computed(() => tabs.value[active.value]);
const copied = ref(false);

function rawCode(markdown: string): string {
  return markdown
    .replace(/^```[\w-]*\n/, '')
    .replace(/\n```\s*$/, '')
    .trim();
}

async function copyCode() {
  if (!activeTab.value) return;
  try {
    await navigator.clipboard.writeText(rawCode(activeTab.value.content));
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    // Clipboard unavailable (insecure context); ignore.
  }
}
</script>

<style scoped>
.editor {
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.1);
  border-radius: 0.85rem;
  background: #0c0c0f;
  box-shadow: 0 30px 80px -32px rgb(0 0 0 / 0.85);
}

.bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.07);
  background: rgb(255 255 255 / 0.015);
}

.dots {
  display: flex;
  flex: 0 0 auto;
  gap: 0.45rem;
}

.dots i {
  width: 11px;
  height: 11px;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.13);
}

.filename {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-family: var(--font-geist-mono);
  font-size: 0.72rem;
  color: rgb(255 255 255 / 0.42);
}

.copy {
  flex: 0 0 auto;
  padding: 0.3rem;
  border-radius: 0.4rem;
  color: rgb(255 255 255 / 0.4);
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.copy:hover {
  color: rgb(255 255 255 / 0.85);
  background: rgb(255 255 255 / 0.06);
}

.tabstrip {
  display: flex;
  gap: 0;
  padding: 0 0.7rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.07);
}

.tab {
  margin-bottom: -1px;
  padding: 0.65rem 0.85rem;
  border-bottom: 2px solid transparent;
  font-family: var(--font-geist-mono);
  font-size: 0.75rem;
  color: rgb(255 255 255 / 0.42);
  transition: color 0.2s ease;
}

.tab:hover {
  color: rgb(255 255 255 / 0.75);
}

.tab--active {
  border-bottom-color: #bc4eff;
  color: #fff;
}

.code {
  padding: 0.5rem 0.25rem 1rem;
  font-size: 0.85rem;
}

/* Neutralise the Prose/Shiki chrome so only the highlighted code shows */
.code :deep(pre) {
  margin: 0;
  border: 0;
  border-radius: 0;
  background: transparent !important;
  padding: 0.75rem 1.25rem;
  overflow-x: auto;
}

.code :deep(p) {
  margin: 0;
}

.code :deep(button) {
  display: none;
}

.code :deep(.shiki) {
  background: transparent !important;
  counter-reset: line;
}

.code :deep(.shiki .line) {
  line-height: 1.75;
}

.code :deep(.shiki .line)::before {
  counter-increment: line;
  content: counter(line);
  display: inline-block;
  width: 1.4rem;
  margin-right: 1.25rem;
  text-align: right;
  color: rgb(255 255 255 / 0.2);
}
</style>
