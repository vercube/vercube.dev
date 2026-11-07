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
      <ul class="rail" role="tablist" aria-label="Devtools panels">
        <li v-for="(panel, i) in panels" :key="panel.id">
          <button
            type="button"
            role="tab"
            class="tab"
            :class="{ on: active === i }"
            :aria-selected="active === i"
            @click="active = i"
          >
            <UIcon :name="panel.icon" class="ico" />
            {{ panel.name }}
            <span class="key mono">{{ i + 1 }}</span>
          </button>
        </li>
      </ul>

      <div class="stage">
        <div class="text">
          <p class="mono kicker">{{ current.name }}</p>
          <p class="desc">{{ current.text }}</p>
        </div>
        <div class="screen">
          <video
            :key="current.id"
            ref="video"
            class="clip"
            :src="`/video/home/${current.id}.mp4`"
            :poster="`/images/devtools/${current.id}.jpg`"
            muted
            loop
            playsinline
            preload="none"
            width="1490"
            height="840"
            :aria-label="`Vercube Devtools, ${current.name} panel`"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Recordings of the real Devtools; panel copy from docs/modules/devtools.
const panels = [
  {
    id: 'routes',
    name: 'Routes',
    icon: 'i-lucide-route',
    text: 'The route table as the router sees it, with each route’s arguments and its middleware chain in order.',
  },
  {
    id: 'requests',
    name: 'Requests',
    icon: 'i-lucide-activity',
    text: 'Where the time went: a span per middleware, one for the handler, and the bodies and headers below.',
  },
  {
    id: 'graph',
    name: 'Graph',
    icon: 'i-lucide-network',
    text: 'The container drawn as a graph. An @Inject nothing binds is marked before it throws at runtime.',
  },
  {
    id: 'logs',
    name: 'Logs',
    icon: 'i-lucide-scroll-text',
    text: 'Every Logger line, filterable by level and stamped with the request that wrote it.',
  },
  {
    id: 'config',
    name: 'Config',
    icon: 'i-lucide-settings-2',
    text: 'The configuration the framework resolved, after defaults, files and environment were merged.',
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    icon: 'i-lucide-rocket',
    text: 'Startup as a trace: every service the container built, and how long each one took.',
  },
];

const active = ref(0);
const current = computed(() => panels[active.value]!);
const video = ref<HTMLVideoElement | null>(null);
let observer: IntersectionObserver | null = null;
let visible = false;

function play() {
  const el = video.value;
  if (!el || !visible) return;
  if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.play().catch(() => {});
}

watch(current, () => nextTick(play));

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) play();
      else video.value?.pause();
    },
    { threshold: 0.25 },
  );
  if (video.value?.parentElement) observer.observe(video.value.parentElement);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped>
.top {
  padding: 88px var(--pad) 48px;
}

.body {
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  border-top: 1px solid var(--h-line);
}

.rail {
  padding: 20px 12px;
  border-right: 1px solid var(--h-line);
}

.tab {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 10px;
  font-size: 13px;
  color: var(--h-dim);
  text-align: left;
  transition:
    color 160ms ease,
    background-color 160ms ease;
}

.tab:hover {
  color: var(--h-ink);
}

.tab.on {
  background: var(--h-raise);
  color: var(--h-ink);
}

.ico {
  width: 15px;
  height: 15px;
}

.tab.on .ico {
  color: var(--h-accent);
}

.key {
  margin-left: auto;
  font-size: 10px;
  color: var(--h-dim);
}

.stage {
  display: flex;
  flex-direction: column;
}

.text {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 16px;
  padding: 20px var(--pad);
  border-bottom: 1px solid var(--h-line);
}

.kicker {
  font-size: 12px;
  color: var(--h-accent);
}

.desc {
  font-size: 14px;
  color: var(--h-ink);
}

.screen {
  background: var(--h-panel);
}

.clip {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1490 / 840;
  object-fit: cover;
}

@media (width < 860px) {
  .top {
    padding: 64px var(--pad) 40px;
  }

  .body {
    grid-template-columns: minmax(0, 1fr);
  }

  .rail {
    display: flex;
    gap: 4px;
    padding: 10px;
    overflow-x: auto;
    border-right: 0;
    border-bottom: 1px solid var(--h-line);
  }

  .tab {
    width: auto;
    white-space: nowrap;
  }

  .key {
    display: none;
  }

  .text {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
}
</style>
