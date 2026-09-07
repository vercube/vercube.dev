<template>
  <section class="w-full px-6 py-32">
    <div ref="root" class="mx-auto max-w-5xl" :class="{ 'in-view': inView }">
      <div class="reveal mx-auto mb-12 max-w-2xl text-center">
        <h2 class="text-4xl sm:text-5xl font-(family-name:--font-geist-pixel-circle)">
          <span class="text-foreground">Measurably </span><span class="text-[#bc4eff]">faster</span>
        </h2>
        <p class="mt-5 text-foreground/60 font-(family-name:--font-geist-mono) text-balance">
          A container and decorators, at the speed of a bare router. Same routes, same machine, one run of the open benchmark
          suite on Node, September 2026.
        </p>
      </div>

      <div class="reveal">
        <!-- metric tabs -->
        <div class="mb-8 flex justify-center" role="tablist">
          <div class="flex gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1">
            <button
              v-for="(metric, i) in metrics"
              :key="metric.key"
              type="button"
              role="tab"
              :aria-selected="active === i"
              class="rounded-full px-4 py-1.5 text-xs font-(family-name:--font-geist-mono) transition-colors"
              :class="active === i ? 'bg-[#bc4eff]/15 text-foreground' : 'text-foreground/50 hover:text-foreground/80'"
              @click="active = i"
            >
              {{ metric.label }}
            </button>
          </div>
        </div>

        <!-- chart -->
        <div class="space-y-12">
          <div v-for="group in activeMetric.groups" :key="group.title">
            <div class="mb-5 flex items-baseline justify-between gap-3 border-b border-white/[0.07] pb-2">
              <h3 class="font-(family-name:--font-geist-mono) text-xs uppercase tracking-wider text-foreground/50">
                {{ group.title }}
              </h3>
              <span class="font-(family-name:--font-geist-mono) text-[10px] text-foreground/30">
                {{ group.caption }}
              </span>
            </div>

            <div class="space-y-5">
              <div v-for="(row, i) in group.rows" :key="row.name" class="bench-row" :style="{ '--d': `${i * 80}ms` }">
                <div class="mb-2 flex items-baseline justify-between gap-3">
                  <span
                    class="flex items-center gap-2 font-(family-name:--font-geist-mono) text-sm"
                    :class="row.name === 'Vercube' ? 'text-foreground' : 'text-foreground/55'"
                  >
                    {{ row.name }}
                    <span
                      v-if="row.name === leaderOf(group)"
                      class="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-foreground/60"
                      :class="row.name === 'Vercube' ? 'border-[#bc4eff]/30 bg-[#bc4eff]/10 text-[#bc4eff]' : ''"
                    >
                      Fastest
                    </span>
                  </span>
                  <span
                    class="font-(family-name:--font-geist-mono) text-sm tabular-nums"
                    :class="row.name === 'Vercube' ? 'text-[#bc4eff]' : 'text-foreground/45'"
                  >
                    {{ format(row.value, activeMetric.unit) }} {{ activeMetric.unit }}
                  </span>
                </div>
                <div class="track">
                  <div
                    class="bar"
                    :class="row.name === 'Vercube' ? 'bar--primary' : 'bar--muted'"
                    :style="{ width: `${barWidth(row.value)}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p class="mt-8 text-center text-xs text-foreground/45 font-(family-name:--font-geist-mono)">
          {{ activeMetric.note }}
        </p>

        <p class="mt-3 text-center text-xs text-foreground/35 font-(family-name:--font-geist-mono)">
          <span v-if="!activeMetric.higherIsBetter">Lower is better. </span>
          Node 24, 500 connections, 10s per route. Run it yourself:
          <NuxtLink
            to="https://github.com/vercube/benchmarks"
            target="_blank"
            class="text-foreground/60 underline decoration-white/20 underline-offset-4 hover:text-[#bc4eff] hover:decoration-[#bc4eff]/50"
          >
            vercube/benchmarks
          </NuxtLink>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface BenchRow {
  name: string;
  value: number;
}

interface BenchGroup {
  title: string;
  caption: string;
  rows: BenchRow[];
}

interface Metric {
  key: string;
  label: string;
  unit: string;
  higherIsBetter: boolean;
  note: string;
  groups: BenchGroup[];
}

const ROUTERS = 'Against the fast routers';
const ROUTERS_CAPTION = 'no container, no decorators';
const FRAMEWORKS = 'Against frameworks with a container';
const FRAMEWORKS_CAPTION = 'the ones you actually choose between';

// Source: github.com/vercube/benchmarks, results/results.md, September 2026.
// One run of the whole suite on one machine, Node 24. Every framework answers
// the same four routes on top of the same 112-route table. Video throughput is
// left out on purpose: it moves +/-13% between runs of identical code, and the
// suite's Average column includes it.
const metrics: Metric[] = [
  {
    key: 'ping',
    label: 'Plain text',
    unit: 'req/s',
    higherIsBetter: true,
    note: 'GET /, a two-byte text response.',
    groups: [
      {
        title: ROUTERS,
        caption: ROUTERS_CAPTION,
        rows: [
          { name: 'Vercube', value: 99_030 },
          { name: 'Fastify', value: 97_072 },
          { name: 'Hono', value: 91_927 },
          { name: 'Elysia', value: 90_005 },
          { name: 'h3', value: 87_526 },
        ],
      },
      {
        title: FRAMEWORKS,
        caption: FRAMEWORKS_CAPTION,
        rows: [
          { name: 'Vercube', value: 99_030 },
          { name: 'Rikta', value: 98_682 },
          { name: 'Ts.ED', value: 46_909 },
          { name: 'NestJS', value: 39_833 },
          { name: 'routing-controllers', value: 35_155 },
        ],
      },
    ],
  },
  {
    key: 'query',
    label: 'Path + query',
    unit: 'req/s',
    higherIsBetter: true,
    note: 'GET /id/:id?name=, one path parameter and one query parameter.',
    groups: [
      {
        title: ROUTERS,
        caption: ROUTERS_CAPTION,
        rows: [
          { name: 'Vercube', value: 96_682 },
          { name: 'Fastify', value: 95_679 },
          { name: 'h3', value: 82_481 },
          { name: 'Hono', value: 80_426 },
          { name: 'Elysia', value: 78_683 },
        ],
      },
      {
        title: FRAMEWORKS,
        caption: FRAMEWORKS_CAPTION,
        rows: [
          { name: 'Rikta', value: 98_508 },
          { name: 'Vercube', value: 96_682 },
          { name: 'NestJS', value: 36_823 },
          { name: 'routing-controllers', value: 36_294 },
          { name: 'Ts.ED', value: 36_099 },
        ],
      },
    ],
  },
  {
    key: 'body',
    label: 'JSON body',
    unit: 'req/s',
    higherIsBetter: true,
    note: 'POST /json, parsed and echoed back.',
    groups: [
      {
        title: ROUTERS,
        caption: ROUTERS_CAPTION,
        rows: [
          { name: 'Vercube', value: 86_259 },
          { name: 'Elysia', value: 77_725 },
          { name: 'h3', value: 77_637 },
          { name: 'Hono', value: 73_333 },
          { name: 'Fastify', value: 66_571 },
        ],
      },
      {
        title: FRAMEWORKS,
        caption: FRAMEWORKS_CAPTION,
        rows: [
          { name: 'Vercube', value: 86_259 },
          { name: 'Rikta', value: 77_353 },
          { name: 'Ts.ED', value: 35_691 },
          { name: 'routing-controllers', value: 33_644 },
          { name: 'NestJS', value: 31_224 },
        ],
      },
    ],
  },
];

const active = ref(0);
const activeMetric = computed(() => metrics[active.value]!);

// One scale for both groups of a metric, so the row Vercube shares between them
// is the same width twice and the two groups can be read against each other.
const maxValue = computed(() => Math.max(...activeMetric.value.groups.flatMap((group) => group.rows.map((row) => row.value))));

// The badge marks whichever framework actually leads its group. Vercube leads
// one group on one tab, so hard-coding it here would be a lie everywhere else.
function leaderOf(group: BenchGroup): string | undefined {
  const best = activeMetric.value.higherIsBetter
    ? Math.max(...group.rows.map((row) => row.value))
    : Math.min(...group.rows.map((row) => row.value));

  return group.rows.find((row) => row.value === best)?.name;
}

function barWidth(value: number): number {
  // Bars represent the real value; min 6% so the smallest is still visible.
  return Math.max((value / maxValue.value) * 100, 6);
}

function format(value: number, unit: string): string {
  return unit === 's' ? value.toFixed(2) : Math.round(value).toLocaleString('en-US');
}

const root = ref<HTMLElement | null>(null);
const inView = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!root.value) return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          inView.value = true;
          observer?.disconnect();
        }
      }
    },
    { threshold: 0.25 },
  );
  observer.observe(root.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped>
.track {
  height: 0.5rem;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.05);
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: 9999px;
  transform-origin: left;
}

.bar--primary {
  background: linear-gradient(90deg, #bc4eff, #d9a9ff);
  box-shadow: 0 0 20px -2px rgb(188 78 255 / 0.5);
}

.bar--muted {
  background: rgb(255 255 255 / 0.18);
}

@media (prefers-reduced-motion: no-preference) {
  .bench-row .bar {
    transform: scaleX(0);
    transition: transform 0.95s cubic-bezier(0.23, 1, 0.32, 1);
    transition-delay: var(--d);
  }

  .in-view .bench-row .bar {
    transform: scaleX(1);
  }
}
</style>
