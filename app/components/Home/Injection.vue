<template>
  <section class="band">
    <div class="frame wrap">
      <div class="side">
        <HomeSectionHead
          index="02"
          label="Dependency injection"
          :chips="['bind', 'bindTransient', 'bindMock']"
          to="/docs/core-features/container"
          link="Container guide"
        >
          <template #title>Bind once.<br />Inject anywhere<span class="dot">.</span></template>
          Services are classes the container builds for you. Bind a key to an implementation in one place, ask for it with
          @Inject, and swap it for a mock in a test without touching the code that uses it.
        </HomeSectionHead>

        <ul class="facts" data-reveal style="--r: 3">
          <li>
            <b>One place for wiring</b>
            src/boot/Container.ts decides what every key resolves to.
          </li>
          <li>
            <b>Mocks without ceremony</b>
            bindMock takes only the methods your test calls.
          </li>
          <li>
            <b>Seen before it throws</b>
            Devtools marks an @Inject that nothing binds.
          </li>
        </ul>
      </div>

      <HomeWindow title="src/boot/Container.ts" flush class="panel" data-reveal style="--r: 2">
        <template #right>
          <div class="toggle mono" role="tablist" aria-label="Environment">
            <button type="button" role="tab" :aria-selected="!test" :class="{ on: !test }" @click="test = false">app</button>
            <button type="button" role="tab" :aria-selected="test" :class="{ on: test }" @click="test = true">test</button>
          </div>
        </template>

        <div class="code">
          <div class="md"><LazyMDCRenderer v-if="blocks" :body="test ? blocks.test : blocks.app" hydrate-on-idle /></div>
        </div>

        <div ref="stage" class="resolve">
          <div class="registry">
            <p class="mono col-head">bindings</p>
            <ul>
              <li v-for="row in registry" :key="row.key" class="mono reg" :class="{ hit: current?.lookup === row.key }">
                <span class="k">{{ row.key }}</span>
                <span class="arrow">→</span>
                <span class="v" :class="{ mock: row.mock }">{{ row.value }}</span>
              </li>
            </ul>
          </div>
          <div class="trace" aria-live="off">
            <p class="mono col-head">trace</p>
            <ol class="mono lines">
              <li
                v-for="(line, i) in shown"
                :key="`${test}-${i}`"
                class="line"
                :class="[line.kind, { now: i === step }]"
                :style="{ '--d': line.depth }"
              >
                <span class="text" v-html="line.html" />
                <span v-if="line.tag" class="tag" :class="line.tag">{{ line.tag }}</span>
              </li>
            </ol>
          </div>
        </div>
      </HomeWindow>
    </div>
  </section>
</template>

<script setup lang="ts">
const test = ref(false);

interface Line {
  html: string;
  depth: number;
  kind: 'call' | 'look' | 'make' | 'done' | 'same';
  lookup?: string;
  tag?: string;
}

const registry = computed(() => [
  { key: 'Database', value: test.value ? 'mock { query }' : 'PostgresDatabase', mock: test.value },
  { key: 'Logger', value: 'ConsoleLogger', mock: false },
  { key: 'UserService', value: 'UserService', mock: false },
]);

// One get(), the way @vercube/di walks it (Container.internalConstruct): the
// class is constructed and cached as a singleton first, then each @Inject
// property is looked up and filled. A second get() returns the cached object.
const trace = computed<Line[]>(() => [
  { kind: 'call', depth: 0, html: '<b>container.get</b>(UserService)', lookup: 'UserService' },
  { kind: 'make', depth: 1, html: 'new UserService()', lookup: 'UserService', tag: 'cached' },
  { kind: 'look', depth: 1, html: '@Inject(Database)', lookup: 'Database' },
  test.value
    ? { kind: 'make', depth: 2, html: 'bindMock value', lookup: 'Database', tag: 'mock' }
    : { kind: 'make', depth: 2, html: 'new PostgresDatabase()', lookup: 'Database', tag: 'new' },
  { kind: 'look', depth: 1, html: '@Inject(Logger)', lookup: 'Logger' },
  { kind: 'make', depth: 2, html: 'new ConsoleLogger()', lookup: 'Logger', tag: 'new' },
  { kind: 'done', depth: 1, html: 'properties filled', lookup: 'UserService', tag: 'ready' },
  { kind: 'call', depth: 0, html: '<b>container.get</b>(UserService)', lookup: 'UserService' },
  { kind: 'same', depth: 1, html: 'same instance', lookup: 'UserService', tag: 'singleton' },
]);

const step = ref(trace.value.length - 1);
const shown = computed(() => trace.value.slice(0, step.value + 1));
const current = computed(() => (step.value < trace.value.length ? trace.value[step.value] : undefined));
const stage = ref<HTMLElement | null>(null);
let timer: ReturnType<typeof setTimeout> | undefined;
let observer: IntersectionObserver | undefined;
let visible = false;

function tick() {
  clearTimeout(timer);
  if (!visible) return;
  const last = step.value >= trace.value.length - 1;
  timer = setTimeout(
    () => {
      step.value = last ? 0 : step.value + 1;
      tick();
    },
    last ? 2600 : 850,
  );
}

watch(test, () => {
  // Without playback the trace stays complete.
  step.value = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches ? trace.value.length - 1 : 0;
  tick();
});

onMounted(() => {
  if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches || !stage.value) return;
  step.value = 0;
  observer = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible) tick();
    else clearTimeout(timer);
  });
  observer.observe(stage.value);
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  observer?.disconnect();
});

const appCode = `\`\`\`ts
import type { Container } from '@vercube/di';
import { Database, PostgresDatabase } from '../services/Database';
import { ConsoleLogger, Logger } from '../services/Logger';
import { UserService } from '../services/UserService';

export function useContainer(container: Container): void {
  container.bind(Database, PostgresDatabase);
  container.bind(Logger, ConsoleLogger);
  container.bind(UserService);
}
\`\`\``;

const testCode = `\`\`\`ts
import { Container } from '@vercube/di';
import { Database } from '../services/Database';
import { ConsoleLogger, Logger } from '../services/Logger';
import { UserService } from '../services/UserService';

const container = new Container();
container.bindMock(Database, { query: async () => [{ id: 1 }] });
container.bind(Logger, ConsoleLogger);
container.bind(UserService);
\`\`\``;

// Both variants are parsed at prerender, so the test tab is highlighted too.
const { data: blocks } = useCodeBlocks('home-di', { app: appCode, test: testCode });
</script>

<style scoped>
.wrap {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 48px;
  align-items: start;
  padding: 88px var(--pad);
}

.side {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.facts {
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-size: 13px;
}

.facts li {
  padding-left: 14px;
  border-left: 1px solid var(--h-line);
}

.facts b {
  display: block;
  color: var(--h-ink);
  font-weight: 500;
}

.toggle {
  display: flex;
  border: 1px solid var(--h-line);
}

.toggle button {
  padding: 1px 9px;
  font-size: 10.5px;
  color: var(--h-dim);
  transition:
    color 160ms ease,
    background-color 160ms ease;
}

.toggle button.on {
  background: var(--h-accent);
  color: #0b0010;
}

.code {
  min-height: 190px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--h-line);
}

.resolve {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  height: 268px;
}

.registry {
  padding: 14px 16px;
  border-right: 1px solid var(--h-line);
}

.trace {
  padding: 14px 16px;
}

.col-head {
  margin-bottom: 10px;
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--h-dim);
}

.reg {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  gap: 8px;
  padding: 6px 8px;
  margin: 0 -8px 2px;
  font-size: 11.5px;
  border-left: 2px solid transparent;
  transition:
    background-color 200ms ease,
    border-color 200ms ease;
}

.reg .k {
  color: var(--h-ink);
}

.reg .arrow {
  color: var(--h-dim);
}

.reg .v {
  overflow: hidden;
  color: var(--h-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reg .v.mock {
  color: var(--h-amber);
}

.reg.hit {
  border-left-color: var(--h-accent);
  background: rgb(188 78 255 / 0.1);
}

.lines {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.line {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: calc(var(--d) * 16px);
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--h-muted);
  animation: line-in 300ms var(--ease) both;
}

.line .text::before {
  content: '└ ';
  color: #3f3f46;
}

.line.call .text::before {
  content: '› ';
  color: var(--h-accent);
}

.line :deep(b) {
  font-weight: 400;
  color: var(--h-ink);
}

.line.look {
  color: var(--h-ink);
}

.line.now .text {
  color: var(--h-ink);
}

.tag {
  padding: 0 6px;
  font-size: 10px;
  line-height: 1.6;
  border: 1px solid var(--h-line);
  color: var(--h-muted);
}

.make .tag {
  border-color: rgb(74 222 128 / 0.4);
  color: var(--h-green);
}

.done .tag {
  border-color: var(--h-accent);
  background: var(--h-accent);
  color: #0b0010;
}

.same .tag {
  border-color: rgb(96 165 250 / 0.5);
  color: var(--h-blue);
}

.tag.cached {
  border-color: rgb(96 165 250 / 0.5);
  color: var(--h-blue);
}

.tag.mock {
  border-color: rgb(251 191 36 / 0.45);
  color: var(--h-amber);
}

@keyframes line-in {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
}

@media (width < 860px) {
  .wrap {
    grid-template-columns: minmax(0, 1fr);
    padding: 64px var(--pad);
  }

  .resolve {
    grid-template-columns: minmax(0, 1fr);
  }

  .registry {
    border-right: 0;
    border-bottom: 1px solid var(--h-line);
  }
}
</style>
