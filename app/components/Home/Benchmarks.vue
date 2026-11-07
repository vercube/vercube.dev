<template>
  <section ref="root" class="band">
    <div class="frame top">
      <HomeSectionHead index="05" label="Performance" to="https://github.com/vercube/benchmarks" link="Run the suite yourself">
        <template #title>The speed of a router,<br />with a container on<span class="dot">.</span></template>
        Same 112-route table, same machine, one run of the open benchmark suite. Node 24, 500 connections, 10 seconds per route,
        September 2026.
      </HomeSectionHead>
    </div>

    <div class="frame main">
      <div class="figure-cell">
        <p class="mono cell-label">Requests per second · {{ metric.route }}</p>
        <p class="figure pixel"><HomeRoller :text="format(vercube)" :on="inView" /></p>
        <div class="tabs mono" role="tablist" aria-label="Benchmark">
          <button
            v-for="(m, i) in metrics"
            :key="m.key"
            type="button"
            role="tab"
            :aria-selected="active === i"
            :class="{ on: active === i }"
            @click="active = i"
          >
            {{ m.label }}
          </button>
        </div>
      </div>

      <ul class="bars" :aria-label="`${metric.label}, requests per second`">
        <li v-for="row in metric.rows" :key="row.name" class="bar-row" :class="{ us: row.name === 'Vercube' }">
          <span class="who mono">{{ row.name }}</span>
          <span class="track">
            <span class="fill" :style="{ width: inView ? `${(row.value / max) * 100}%` : '0%' }" />
          </span>
          <span class="val mono">{{ format(row.value) }}</span>
        </li>
      </ul>
    </div>

    <div class="frame stats">
      <div v-for="stat in stats" :key="stat.label" class="stat">
        <p class="pixel big">
          <HomeRoller :text="stat.value" :on="inView" />
          <span class="unit">{{ stat.unit }}</span>
        </p>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Source: github.com/vercube/benchmarks, results/results.md, September 2026.
const metrics = [
  {
    key: 'ping',
    label: 'Plain text',
    route: 'GET /',
    rows: [
      { name: 'Vercube', value: 99_030 },
      { name: 'Fastify', value: 97_072 },
      { name: 'Hono', value: 91_927 },
      { name: 'Elysia', value: 90_005 },
      { name: 'h3', value: 87_526 },
      { name: 'Ts.ED', value: 46_909 },
      { name: 'NestJS', value: 39_833 },
      { name: 'routing-controllers', value: 35_155 },
    ],
  },
  {
    key: 'query',
    label: 'Path + query',
    route: 'GET /id/:id?name=',
    rows: [
      { name: 'Vercube', value: 96_682 },
      { name: 'Fastify', value: 95_679 },
      { name: 'h3', value: 82_481 },
      { name: 'Hono', value: 80_426 },
      { name: 'Elysia', value: 78_683 },
      { name: 'NestJS', value: 36_823 },
      { name: 'routing-controllers', value: 36_294 },
      { name: 'Ts.ED', value: 36_099 },
    ],
  },
  {
    key: 'body',
    label: 'JSON body',
    route: 'POST /json',
    rows: [
      { name: 'Vercube', value: 86_259 },
      { name: 'Elysia', value: 77_725 },
      { name: 'h3', value: 77_637 },
      { name: 'Hono', value: 73_333 },
      { name: 'Fastify', value: 66_571 },
      { name: 'Ts.ED', value: 35_691 },
      { name: 'routing-controllers', value: 33_644 },
      { name: 'NestJS', value: 31_224 },
    ],
  },
];

// Ratios computed from the rows above.
const stats = [
  { value: '2.5', unit: '×', label: 'NestJS throughput on plain text (99,030 vs 39,833)' },
  { value: '2.8', unit: '×', label: 'NestJS throughput on a JSON body (86,259 vs 31,224)' },
  { value: '30', unit: '%', label: 'more than Fastify on a JSON body (86,259 vs 66,571)' },
];

const active = ref(0);
const metric = computed(() => metrics[active.value]!);
const max = computed(() => Math.max(...metric.value.rows.map((row) => row.value)));
const vercube = computed(() => metric.value.rows.find((row) => row.name === 'Vercube')!.value);

function format(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

const root = ref<HTMLElement | null>(null);
const inView = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    inView.value = true;
    return;
  }
  if (!root.value) return;
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        inView.value = true;
        observer?.disconnect();
      }
    },
    { threshold: 0.2 },
  );
  observer.observe(root.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped>
.top {
  padding: 88px var(--pad) 48px;
}

.main {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  border-top: 1px solid var(--h-line);
}

.figure-cell {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 28px var(--pad);
  border-right: 1px solid var(--h-line);
}

.cell-label {
  font-size: 11px;
  color: var(--h-dim);
}

.figure {
  margin-top: auto;
  font-size: clamp(3rem, 2rem + 3vw, 4.5rem);
  line-height: 1;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tabs button {
  padding: 3px 10px;
  border: 1px solid var(--h-line);
  font-size: 11px;
  color: var(--h-dim);
  transition:
    color 160ms ease,
    border-color 160ms ease,
    background-color 160ms ease;
}

.tabs button:hover {
  color: var(--h-ink);
}

.tabs button.on {
  border-color: var(--h-accent);
  background: rgb(188 78 255 / 0.12);
  color: var(--h-ink);
}

.bars {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 28px var(--pad);
}

.bar-row {
  display: grid;
  grid-template-columns: 136px minmax(0, 1fr) 64px;
  align-items: center;
  gap: 12px;
}

.who,
.val {
  font-size: 11.5px;
  color: var(--h-dim);
}

.val {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.track {
  height: 8px;
  background: var(--h-raise);
}

.fill {
  display: block;
  height: 100%;
  background: #3f3f46;
  transition: width 900ms var(--ease);
}

.us .who,
.us .val {
  color: var(--h-ink);
}

.us .fill {
  background: var(--h-accent);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--h-line);
}

.stat {
  padding: 24px var(--pad);
}

.stat + .stat {
  border-left: 1px solid var(--h-line);
}

.big {
  display: flex;
  align-items: baseline;
  font-size: 2.6rem;
  line-height: 1;
}

.unit {
  margin-left: 2px;
  color: var(--h-accent);
}

.stat-label {
  margin-top: 10px;
  font-size: 13px;
}

@media (width < 860px) {
  .top {
    padding: 64px var(--pad) 40px;
  }

  .main,
  .stats {
    grid-template-columns: minmax(0, 1fr);
  }

  .figure-cell {
    border-right: 0;
    border-bottom: 1px solid var(--h-line);
  }

  .stat + .stat {
    border-left: 0;
    border-top: 1px solid var(--h-line);
  }

  .bar-row {
    grid-template-columns: 96px minmax(0, 1fr) 56px;
  }
}
</style>
