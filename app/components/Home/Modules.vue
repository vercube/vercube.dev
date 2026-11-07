<template>
  <section class="band">
    <div class="frame top">
      <HomeSectionHead index="06" label="Modules" to="/docs/modules/auth/overview" link="All modules">
        <template #title>Add what you need,<br />when you need it<span class="dot">.</span></template>
        Every module is a package with a recipe: <code class="mono">vercube add queue</code> installs it, registers the plugin and
        writes a working example into your project.
      </HomeSectionHead>
    </div>
    <ul class="frame grid">
      <li v-for="(mod, i) in modules" :key="mod.pkg" data-reveal :style="{ '--r': i % 3 }">
        <NuxtLink :to="mod.to" class="cell">
          <span class="meta mono">
            <span class="kind">
              <UIcon :name="mod.icon" class="ico" />
              {{ mod.kind }}
            </span>
            <span>{{ mod.pkg }}</span>
          </span>
          <span class="name">{{ mod.name }}</span>
          <span class="desc">{{ mod.text }}</span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const modules = [
  {
    name: 'Validation & OpenAPI',
    pkg: '@vercube/schema',
    kind: 'core',
    icon: 'i-lucide-shield-check',
    text: 'Standard Schema on @Body and @Query, documented at /_schema/docs.',
    to: '/docs/modules/schema/overview',
  },
  {
    name: 'Auth',
    pkg: '@vercube/auth',
    kind: 'security',
    icon: 'i-lucide-key-round',
    text: '@Auth() on a route or a controller, with your own provider behind it.',
    to: '/docs/modules/auth/overview',
  },
  {
    name: 'Typed client',
    pkg: '@vercube/client',
    kind: 'frontend',
    icon: 'i-lucide-plug',
    text: 'fetch typed by your controllers, about 1.5 kB. A changed handler breaks the build, not prod.',
    to: '/docs/modules/client/overview',
  },
  {
    name: 'Queues',
    pkg: '@vercube/queue',
    kind: 'jobs',
    icon: 'i-lucide-send',
    text: 'Publish and consume on BullMQ, RabbitMQ, Kafka, or in memory while you develop.',
    to: '/docs/modules/queue/overview',
  },
  {
    name: 'Scheduler',
    pkg: '@vercube/scheduler',
    kind: 'jobs',
    icon: 'i-lucide-timer',
    text: 'Interval and cron jobs, with memory, Redis or Postgres keeping the schedule.',
    to: '/docs/modules/scheduler/overview',
  },
  {
    name: 'WebSockets',
    pkg: '@vercube/ws',
    kind: 'realtime',
    icon: 'i-lucide-radio',
    text: 'Gateways on the same server, written with the same decorators.',
    to: '/docs/modules/web-sockets/overview',
  },
  {
    name: 'Cache',
    pkg: '@vercube/cache',
    kind: 'data',
    icon: 'i-lucide-gauge',
    text: '@Cache({ maxAge }) on a route, over any storage mount.',
    to: '/docs/modules/cache/overview',
  },
  {
    name: 'Storage',
    pkg: '@vercube/storage',
    kind: 'data',
    icon: 'i-lucide-hard-drive',
    text: 'One API over memory and S3 mounts, swappable per environment.',
    to: '/docs/modules/storage/overview',
  },
  {
    name: 'Telemetry',
    pkg: '@vercube/telemetry',
    kind: 'observability',
    icon: 'i-lucide-activity',
    text: 'OpenTelemetry traces, metrics and logs, exported over OTLP.',
    to: '/docs/modules/telemetry/overview',
  },
  {
    name: 'Logger',
    pkg: '@vercube/logger',
    kind: 'observability',
    icon: 'i-lucide-scroll-text',
    text: 'Structured logs through one service, with drains you choose.',
    to: '/docs/modules/logger/overview',
  },
  {
    name: 'Serverless',
    pkg: '@vercube/serverless',
    kind: 'deploy',
    icon: 'i-lucide-cloud',
    text: 'Adapters for AWS Lambda and Azure Functions around the same app.',
    to: '/docs/modules/serverless/overview',
  },
  {
    name: 'Testing',
    pkg: '@vercube/testing',
    kind: 'quality',
    icon: 'i-lucide-test-tube',
    text: 'Boot the app in a test, call routes, mock what the container gives out.',
    to: '/docs/modules/testing/overview',
  },
];
</script>

<style scoped>
.top {
  padding: 88px var(--pad) 48px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--h-line);
}

.grid li {
  border-bottom: 1px solid var(--h-line);
}

.grid li:not(:nth-child(3n + 1)) {
  border-left: 1px solid var(--h-line);
}

.grid li:nth-last-child(-n + 3) {
  border-bottom: 0;
}

.cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
  padding: 18px 20px 22px;
  transition: background-color 200ms ease;
}

.cell:hover {
  background: var(--h-panel);
}

.meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 10.5px;
  color: var(--h-dim);
}

.kind {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ico {
  width: 13px;
  height: 13px;
  color: var(--h-accent);
}

.name {
  font-size: 15px;
  font-weight: 500;
  color: var(--h-ink);
}

.desc {
  font-size: 13px;
  line-height: 1.6;
}

code {
  padding: 1px 5px;
  border: 1px solid var(--h-line);
  background: var(--h-raise);
  font-size: 0.88em;
  color: var(--h-ink);
}

@media (width < 860px) {
  .top {
    padding: 64px var(--pad) 40px;
  }

  .grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .grid li:not(:nth-child(3n + 1)) {
    border-left: 0;
  }

  .grid li:nth-last-child(-n + 3) {
    border-bottom: 1px solid var(--h-line);
  }

  .grid li:last-child {
    border-bottom: 0;
  }
}
</style>
