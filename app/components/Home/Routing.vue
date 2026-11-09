<template>
  <section class="band">
    <div class="frame wrap">
      <HomeSectionHead
        index="01"
        label="Controllers"
        :chips="['Decorators', 'Validation', 'Fetch Request / Response']"
        to="/docs/core-features/controllers"
        link="Controllers guide"
      >
        <template #title>Write a class.<br />Get a route<span class="dot">.</span></template>
        A controller is a class and a route is a decorated method. Arguments arrive parsed, and validated when you hand them a
        schema: a body that does not fit never reaches your code.
      </HomeSectionHead>

      <div class="pair" data-reveal style="--r: 2">
        <HomeWindow title="src/controller/UserController.ts">
          <div class="md" :data-hit="hit"><LazyMDCRenderer v-if="blocks" :body="blocks.code" hydrate-on-idle /></div>
        </HomeWindow>

        <HomeWindow ref="logEl" title="requests" flush class="log">
          <template #right>
            <span class="live mono"><i />live</span>
          </template>

          <div class="focus">
            <p class="request">
              <span class="method" :class="current.method.toLowerCase()">{{ current.method }}</span>
              <span class="path">{{ current.path }}</span>
              <span class="status" :class="{ shown: step >= LAST, bad: current.status >= 400 }">{{ current.status }}</span>
            </p>

            <div class="pipe" :style="{ '--p': progress }">
              <span class="rail" aria-hidden="true"><i /></span>
              <div v-for="(stage, i) in stages" :key="stage.name" class="stage" :class="stageState(i)">
                <span class="node" aria-hidden="true" />
                <b>{{ stage.name }}</b>
                <span class="detail">{{ stage.detail }}</span>
              </div>
            </div>

            <p class="reply" :class="{ shown: step >= LAST, bad: current.status >= 400 }">{{ current.reply }}</p>
          </div>

          <TransitionGroup name="row" tag="ul" class="rows">
            <li v-for="row in rows" :key="row.id" class="row">
              <span class="method" :class="row.method.toLowerCase()">{{ row.method }}</span>
              <span class="path">{{ row.path }}</span>
              <span class="ms">{{ row.ms }}ms</span>
              <span class="status" :class="{ bad: row.status >= 400 }">{{ row.status }}</span>
            </li>
          </TransitionGroup>
        </HomeWindow>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const code = `\`\`\`ts
@Controller('/users')
export class UserController {
  @Inject(UserService)
  private readonly users!: UserService;

  @Get('/:id')
  public get(@Param('id') id: string) {
    return this.users.find(id);
  }

  @Post('/')
  public create(@Body({ validationSchema: User }) body: User) {
    return this.users.create(body);
  }
}
\`\`\``;

const { data: blocks } = useCodeBlocks('home-routing', { code });

type Hit = 'get' | 'create';

interface Request {
  method: string;
  path: string;
  status: number;
  ms: number;
  route: string;
  args: string;
  handler: string;
  reply: string;
  /** Method lit in the code once the request reaches it. */
  hit?: Hit;
  /** Stage that rejected the request; the ones after it, up to the response, never run. */
  failed?: 0 | 1;
}

const get = { route: '/users/:id', args: 'id: string', handler: 'get()', hit: 'get' as const };
const create = { route: '/users', args: 'body: User', handler: 'create()', hit: 'create' as const };

const traffic: Request[] = [
  { method: 'GET', path: '/users/42', status: 200, ms: 3, reply: '{ "id": 42, "name": "Ada" }', ...get },
  { method: 'POST', path: '/users', status: 200, ms: 6, reply: '{ "id": 43, "name": "Grace" }', ...create },
  { method: 'GET', path: '/users/7', status: 200, ms: 2, reply: '{ "id": 7, "name": "Linus" }', ...get },
  {
    method: 'POST',
    path: '/users',
    status: 400,
    ms: 1,
    reply: 'name: expected string, received undefined',
    ...create,
    failed: 1,
  },
  { method: 'GET', path: '/users/42', status: 200, ms: 2, reply: '{ "id": 42, "name": "Ada" }', ...get },
  {
    method: 'DELETE',
    path: '/users/42',
    status: 404,
    ms: 1,
    reply: 'no route for DELETE /users/42',
    route: 'no match',
    args: '',
    handler: '',
    failed: 0,
  },
];

// Filled from the first paint, and for good under reduced motion.
const LAST = 3;
const STAGE_MS = 340;
const HOLD_MS = 1700;
const MAX = 5;

const index = ref(0);
const step = ref(LAST);
const current = computed(() => traffic[index.value % traffic.length]!);

let id = MAX;
const rows = ref(
  [0, 5, 4, 3, 2].map((n, i) => {
    const { method, path, status, ms } = traffic[n]!;
    return { id: i, method, path, status, ms };
  }),
);

const stages = computed(() => [
  { name: 'route', detail: current.value.route },
  { name: 'args', detail: current.value.args || 'skipped' },
  { name: 'handler', detail: current.value.failed === undefined ? current.value.handler : 'skipped' },
  { name: 'response', detail: step.value >= LAST ? `${current.value.status} · ${current.value.ms}ms` : '…' },
]);

// The line stops at the stage that refused the request.
const progress = computed(() => Math.min(step.value, current.value.failed ?? LAST) / LAST);

function stageState(i: number) {
  const { failed, status } = current.value;
  if (i === LAST) return step.value >= LAST ? (status >= 400 ? 'bad' : 'done') : '';
  if (i > step.value) return '';
  if (failed === i) return 'bad';
  if (failed !== undefined && i > failed) return 'skip';
  return 'done';
}

// A rejected body lights the signature only: the method's body never runs.
const hit = computed(() => {
  const { failed, hit } = current.value;
  if (failed === 1 && step.value >= 1) return 'invalid';
  if (failed === undefined && step.value >= 2) return hit;
  return undefined;
});

let timer: ReturnType<typeof setTimeout> | undefined;
let observer: IntersectionObserver | undefined;
let visible = false;
const logEl = ref<{ $el: HTMLElement } | null>(null);

function advance() {
  if (step.value < LAST) {
    step.value++;
    if (step.value === LAST) {
      const { method, path, status, ms } = current.value;
      rows.value = [{ id: id++, method, path, status, ms }, ...rows.value].slice(0, MAX);
    }
  } else {
    index.value++;
    step.value = 0;
  }
  play();
}

function play() {
  clearTimeout(timer);
  if (visible) timer = setTimeout(advance, step.value === LAST ? HOLD_MS : STAGE_MS);
}

onMounted(() => {
  if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches || !logEl.value) return;
  observer = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible) play();
    else clearTimeout(timer);
  });
  observer.observe(logEl.value.$el);
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  observer?.disconnect();
});
</script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 44px;
  padding: 88px var(--pad);
}

.pair {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 14px;
}

.pair > * {
  height: 388px;
}

.log :deep(.body) {
  overflow: hidden;
}

.live {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  color: var(--h-green);
}

.live i {
  width: 6px;
  height: 6px;
  background: var(--h-green);
  animation: pulse 1.6s ease-in-out infinite;
}

/* The method the current request lands on, lit in the source. */
.md :deep(.line) {
  transition:
    background-color 220ms ease,
    box-shadow 220ms ease;
}

.md[data-hit='get'] :deep(.line:nth-child(n + 6):nth-child(-n + 9)),
.md[data-hit='create'] :deep(.line:nth-child(n + 11):nth-child(-n + 14)) {
  background: rgb(188 78 255 / 0.1);
  box-shadow: inset 2px 0 var(--h-accent);
}

.md[data-hit='invalid'] :deep(.line:nth-child(n + 11):nth-child(-n + 12)) {
  background: rgb(251 191 36 / 0.08);
  box-shadow: inset 2px 0 var(--h-amber);
}

.focus {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 16px;
  border-bottom: 1px solid var(--h-line);
}

.request {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-size: 14px;
}

.request .path {
  flex: 1;
  min-width: 0;
}

.request .status {
  opacity: 0;
  transition: opacity 200ms ease;
}

.request .status.shown {
  opacity: 1;
}

.pipe {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.rail {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 75%;
  height: 1px;
  background: var(--h-line);
}

.rail i {
  display: block;
  height: 100%;
  background: var(--h-accent);
  transform: scaleX(var(--p));
  transform-origin: left;
  transition: transform 300ms var(--ease);
}

.stage {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--h-dim);
}

.node {
  width: 9px;
  height: 9px;
  margin-bottom: 9px;
  border: 1px solid #52525b;
  background: var(--h-panel);
  transition:
    background-color 200ms ease,
    border-color 200ms ease;
}

.stage b {
  font-weight: 400;
  color: var(--h-muted);
  transition: color 200ms ease;
}

.detail {
  overflow: hidden;
  font-size: 10.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stage.done .node {
  border-color: var(--h-accent);
  background: var(--h-accent);
}

.stage.done b,
.stage.bad b {
  color: var(--h-ink);
}

.stage.bad .node {
  border-color: var(--h-amber);
  background: var(--h-amber);
}

.stage.bad .detail {
  color: var(--h-amber);
}

.stage.skip {
  opacity: 0.5;
}

.reply {
  overflow: hidden;
  padding: 7px 10px;
  border-left: 1px solid var(--h-line);
  background: var(--h-raise);
  font-size: 11.5px;
  line-height: 1.6;
  color: transparent;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 200ms ease;
}

.reply.shown {
  color: var(--h-muted);
}

.reply.shown.bad {
  border-left-color: var(--h-amber);
  color: var(--h-amber);
}

.rows {
  display: flex;
  flex-direction: column;
}

.row {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) auto 30px;
  column-gap: 10px;
  padding: 7px 16px;
  font-size: 11.5px;
  line-height: 1.6;
}

.row + .row {
  border-top: 1px solid var(--h-line);
}

.method {
  font-weight: 600;
}

.method.get {
  color: var(--h-green);
}

.method.post {
  color: var(--h-blue);
}

.method.delete {
  color: var(--h-red);
}

.path {
  color: var(--h-ink);
}

.ms {
  color: var(--h-dim);
}

.status {
  text-align: right;
  color: var(--h-green);
}

.status.bad {
  color: var(--h-amber);
}

.row-enter-active {
  transition:
    opacity 400ms var(--ease),
    transform 400ms var(--ease);
}

.row-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.row-leave-active {
  display: none;
}

.row-move {
  transition: transform 400ms var(--ease);
}

@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}

@media (width < 860px) {
  .wrap {
    padding: 64px var(--pad);
  }

  .pair {
    grid-template-columns: minmax(0, 1fr);
  }

  .pair > * {
    height: 400px;
  }
}
</style>
