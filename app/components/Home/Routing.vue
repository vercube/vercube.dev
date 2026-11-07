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
          <div class="md"><LazyMDCRenderer v-if="blocks" :body="blocks.code" hydrate-on-idle /></div>
        </HomeWindow>

        <HomeWindow ref="logEl" title="requests" class="log">
          <template #right>
            <span class="live mono"><i />live</span>
          </template>
          <TransitionGroup name="row" tag="ul" class="rows">
            <li v-for="row in rows" :key="row.id" class="row">
              <span class="method" :class="row.method.toLowerCase()">{{ row.method }}</span>
              <span class="path">{{ row.path }}</span>
              <span class="status" :class="row.status >= 400 ? 'bad' : 'good'">{{ row.status }}</span>
              <span class="handler">{{ row.handler }}</span>
              <span v-if="row.note" class="note">{{ row.note }}</span>
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

interface Row {
  id: number;
  method: string;
  path: string;
  status: number;
  handler: string;
  note?: string;
}

const traffic: Omit<Row, 'id'>[] = [
  { method: 'GET', path: '/users/42', status: 200, handler: 'UserController.get' },
  { method: 'POST', path: '/users', status: 200, handler: 'UserController.create' },
  { method: 'GET', path: '/users/7', status: 200, handler: 'UserController.get' },
  { method: 'POST', path: '/users', status: 400, handler: 'validation', note: 'name: expected string, received undefined' },
  { method: 'GET', path: '/users/42', status: 200, handler: 'UserController.get' },
  { method: 'DELETE', path: '/users/42', status: 404, handler: 'router', note: 'no route for DELETE /users/42' },
  { method: 'POST', path: '/users', status: 200, handler: 'UserController.create' },
];

const MAX = 5;
const rows = ref<Row[]>(traffic.slice(0, 4).map((row, i) => ({ ...row, id: i })));
let next = 4;
let timer: ReturnType<typeof setInterval> | undefined;
let observer: IntersectionObserver | undefined;
const logEl = ref<{ $el: HTMLElement } | null>(null);

function tick() {
  const row = traffic[next % traffic.length]!;
  rows.value = [...rows.value, { ...row, id: next }].slice(-MAX);
  next++;
}

onMounted(() => {
  if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches || !logEl.value) return;
  observer = new IntersectionObserver(([entry]) => {
    clearInterval(timer);
    if (entry?.isIntersecting) timer = setInterval(tick, 1400);
  });
  observer.observe(logEl.value.$el);
});

onBeforeUnmount(() => {
  clearInterval(timer);
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

.rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.row {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) 34px;
  column-gap: 10px;
  padding: 6px 8px;
  background: var(--h-raise);
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

.status {
  text-align: right;
}

.status.good {
  color: var(--h-green);
}

.status.bad {
  color: var(--h-amber);
}

.handler {
  grid-column: 2 / -1;
  color: var(--h-dim);
}

.handler::before {
  content: '→ ';
  color: var(--h-accent);
}

.note {
  grid-column: 2 / -1;
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
