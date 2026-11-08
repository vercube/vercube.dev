<script setup lang="ts">
// Runnable examples from the repository: what each one is, and the command that fetches it.
interface Example {
  name: string;
  description: string;
  /** Folder under `examples/`. */
  path: string;
  /** Local directory the command creates. */
  target: string;
}

defineProps<{ examples: Example[] }>();

const copied = ref('');
let reset: ReturnType<typeof setTimeout> | undefined;

function command(example: Example) {
  return `npx giget gh:vercube/vercube/examples/${example.path} ${example.target}`;
}

async function copy(example: Example) {
  try {
    await navigator.clipboard.writeText(command(example));
  } catch {
    return;
  }
  copied.value = example.name;
  clearTimeout(reset);
  reset = setTimeout(() => (copied.value = ''), 1600);
}

onBeforeUnmount(() => clearTimeout(reset));
</script>

<template>
  <ul class="examples">
    <li v-for="example in examples" :key="example.name" class="example">
      <div class="head">
        <div class="about">
          <h3 class="name mono">{{ example.name }}</h3>
          <p class="description">{{ example.description }}</p>
        </div>
        <a
          :href="`https://github.com/vercube/vercube/tree/main/examples/${example.path}/`"
          target="_blank"
          rel="noopener"
          class="source mono"
        >
          <UIcon name="i-simple-icons-github" class="size-3.5" />
          Source
        </a>
      </div>
      <div class="run mono">
        <code class="command"><span class="prompt" aria-hidden="true">$ </span>{{ command(example) }}</code>
        <button type="button" class="copy" :aria-label="`Copy the ${example.name} command`" @click="copy(example)">
          <UIcon v-if="copied === example.name" name="i-lucide-check" class="size-3.5 done" />
          <UIcon v-else name="i-lucide-copy" class="size-3.5" />
        </button>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.examples {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-block: 20px;
}

.example {
  border: 1px solid var(--h-line);
  background: var(--h-panel);
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px 12px;
}

.about {
  min-width: 0;
}

.name {
  margin: 0;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--h-ink);
}

.description {
  margin: 2px 0 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--h-muted);
}

.source {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--h-dim);
  transition: color 160ms ease;
}

.source:hover {
  color: var(--h-ink);
}

.run {
  display: flex;
  align-items: center;
  border-top: 1px solid var(--h-line);
  background: var(--h-bg);
}

.command {
  flex: 1;
  min-width: 0;
  padding: 9px 16px;
  overflow-x: auto;
  font-family: inherit;
  font-size: 12.5px;
  color: var(--h-muted);
  white-space: nowrap;
  scrollbar-width: none;
}

.prompt {
  color: var(--h-accent);
}

.copy {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  width: 38px;
  border-left: 1px solid var(--h-line);
  color: var(--h-dim);
  cursor: pointer;
  transition:
    color 160ms ease,
    background-color 160ms ease;
}

.copy:hover {
  background: var(--h-raise);
  color: var(--h-ink);
}

.done {
  color: var(--h-green);
}
</style>
