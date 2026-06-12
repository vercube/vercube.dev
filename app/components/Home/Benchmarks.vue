<template>
  <section class="w-full px-6 py-32">
    <div ref="root" class="mx-auto max-w-5xl" :class="{ 'in-view': inView }">
      <div class="reveal mx-auto mb-12 max-w-2xl text-center">
        <h2 class="text-4xl sm:text-5xl font-(family-name:--font-geist-pixel-circle)">
          <span class="text-foreground">Measurably </span><span class="text-[#bc4eff]">faster</span>
        </h2>
        <p class="mt-5 text-foreground/60 font-(family-name:--font-geist-mono) text-balance">
          Real numbers from the open benchmark suite. Same endpoints, comparable config, January 2026.
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
        <div class="space-y-5">
          <div v-for="(row, i) in activeMetric.rows" :key="row.name" class="bench-row" :style="{ '--d': `${i * 80}ms` }">
            <div class="mb-2 flex items-baseline justify-between gap-3">
              <span
                class="flex items-center gap-2 font-(family-name:--font-geist-mono) text-sm"
                :class="row.name === 'Vercube' ? 'text-foreground' : 'text-foreground/55'"
              >
                {{ row.name }}
                <span
                  v-if="row.name === 'Vercube'"
                  class="rounded-full border border-[#bc4eff]/30 bg-[#bc4eff]/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#bc4eff]"
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

        <p class="mt-10 text-center text-xs text-foreground/35 font-(family-name:--font-geist-mono)">
          <span v-if="!activeMetric.higherIsBetter">Lower is better. </span>
          Run it yourself:
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

interface Metric {
  key: string;
  label: string;
  unit: string;
  higherIsBetter: boolean;
  rows: BenchRow[];
}

// Source: github.com/vercube/benchmarks, latest published run (January 2026).
const metrics: Metric[] = [
  {
    key: 'throughput',
    label: 'Requests/s',
    unit: 'req/s',
    higherIsBetter: true,
    rows: [
      { name: 'Vercube', value: 95_588 },
      { name: 'NestJS', value: 82_705 },
      { name: 'Rikta', value: 81_156 },
      { name: 'Routing Controllers', value: 78_195 },
      { name: 'Ts.ED', value: 32_156 },
    ],
  },
  {
    key: 'coldstart',
    label: 'Cold start',
    unit: 'ms',
    higherIsBetter: false,
    rows: [
      { name: 'Vercube', value: 280 },
      { name: 'Rikta', value: 326 },
      { name: 'Routing Controllers', value: 329 },
      { name: 'NestJS', value: 377 },
      { name: 'Ts.ED', value: 946 },
    ],
  },
  {
    key: 'build',
    label: 'Build time',
    unit: 's',
    higherIsBetter: false,
    rows: [
      { name: 'Vercube', value: 0.28 },
      { name: 'Routing Controllers', value: 0.42 },
      { name: 'Ts.ED', value: 0.46 },
      { name: 'Rikta', value: 0.97 },
      { name: 'NestJS', value: 1.3 },
    ],
  },
];

const active = ref(0);
const activeMetric = computed(() => metrics[active.value]!);

const maxValue = computed(() => Math.max(...activeMetric.value.rows.map((row) => row.value)));

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
