<template>
  <section class="band">
    <div class="frame top">
      <HomeSectionHead
        index="04"
        label="Devtools"
        :chips="['/_devtools', 'local only', 'OpenTelemetry']"
        to="/docs/modules/devtools/overview"
        link="Devtools guide"
      >
        <template #title>See inside<br />the running app<span class="dot">.</span></template>
        One page served by your own app: the container, the route table, every request as a waterfall, logs, config and an audit.
        No outbound traffic, no second process.
      </HomeSectionHead>
    </div>
    <div class="frame body">
      <div class="tabs" role="tablist" aria-label="Devtools panels" @keydown="onKey">
        <button
          v-for="(panel, i) in panels"
          :id="`devtools-tab-${panel.id}`"
          :key="panel.id"
          ref="tabs"
          type="button"
          role="tab"
          class="tab"
          :class="{ on: active === i }"
          :aria-selected="active === i"
          :aria-controls="`devtools-panel-${panel.id}`"
          :tabindex="active === i ? 0 : -1"
          @click="active = i"
        >
          <UIcon :name="panel.icon" class="ico" />
          {{ panel.name }}
        </button>
      </div>

      <div class="screen">
        <img
          v-for="(panel, i) in panels"
          :id="`devtools-panel-${panel.id}`"
          :key="panel.id"
          class="shot"
          :class="{ on: active === i }"
          role="tabpanel"
          :aria-labelledby="`devtools-tab-${panel.id}`"
          :aria-hidden="active !== i"
          :src="`/images/devtools/${panel.id}.webp`"
          :alt="`Vercube Devtools, ${panel.name} panel`"
          :loading="i === 0 ? 'eager' : 'lazy'"
          decoding="async"
          width="2880"
          height="1620"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Screenshots of the real Devtools, captured with scripts/capture-devtools.mjs.
const panels = [
  {
    id: 'overview',
    name: 'Overview',
    icon: 'i-lucide-layout-grid',
  },
  {
    id: 'requests',
    name: 'Requests',
    icon: 'i-lucide-activity',
  },
  {
    id: 'routes',
    name: 'Routes',
    icon: 'i-lucide-route',
  },
  {
    id: 'graph',
    name: 'Graph',
    icon: 'i-lucide-network',
  },
  {
    id: 'logs',
    name: 'Logs',
    icon: 'i-lucide-scroll-text',
  },
  {
    id: 'config',
    name: 'Config',
    icon: 'i-lucide-settings-2',
  },
];

const active = ref(0);
const tabs = ref<HTMLButtonElement[]>([]);

// Arrow keys move between tabs, as the WAI-ARIA tabs pattern expects.
function onKey(event: KeyboardEvent) {
  const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
  if (!step) return;
  event.preventDefault();
  active.value = (active.value + step + panels.length) % panels.length;
  tabs.value[active.value]?.focus();
}
</script>

<style scoped>
.top {
  padding: 88px var(--pad) 48px;
}

.body {
  border-top: 1px solid var(--h-line);
}

.tabs {
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid var(--h-line);
  scrollbar-width: none;
}

.tab {
  position: relative;
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 18px;
  font-size: 13px;
  color: var(--h-dim);
  white-space: nowrap;
  transition: color 160ms ease;
}

.tab + .tab {
  border-left: 1px solid var(--h-line);
}

.tab:hover {
  color: var(--h-ink);
}

.tab.on {
  color: var(--h-ink);
  background: var(--h-raise);
}

.tab::after {
  content: '';
  position: absolute;
  inset: auto 0 -1px;
  height: 1px;
  background: var(--h-accent);
  transform: scaleX(0);
  transition: transform 220ms ease;
}

.tab.on::after {
  transform: scaleX(1);
}

.tab:focus-visible {
  outline: 1px solid var(--h-accent);
  outline-offset: -1px;
}

.ico {
  width: 15px;
  height: 15px;
}

.tab.on .ico {
  color: var(--h-accent);
}

.screen {
  display: grid;
  background: var(--h-panel);
}

.shot {
  grid-area: 1 / 1;
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  opacity: 0;
  transition: opacity 240ms ease;
}

.shot.on {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .shot,
  .tab::after {
    transition: none;
  }
}

@media (width < 860px) {
  .top {
    padding: 64px var(--pad) 40px;
  }

  .tab {
    flex: 0 0 auto;
    padding: 12px 14px;
  }
}
</style>
