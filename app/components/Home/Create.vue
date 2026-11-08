<template>
  <section class="band">
    <div class="frame wrap">
      <HomeSectionHead
        index="03"
        label="Project generator · new in 1.5"
        :chips="['2 templates', '10 modules', '3 deploy targets', 'vercube add']"
        to="/docs/getting-started/project-generator"
        link="Generator reference"
      >
        <template #title>One command.<br />The project you meant<span class="dot">.</span></template>
        create-vercube pins every @vercube package, applies a recipe per module and per deploy target, and adds the services they
        need to docker-compose. Edit the command below and watch the project change.
      </HomeSectionHead>

      <div class="pair" data-reveal style="--r: 2">
        <HomeWindow title="~/projects — zsh" class="term">
          <template #right>
            <span class="mono hint">click the command to edit</span>
          </template>
          <div class="screen" @click="focusInput">
            <label for="create-cmd" class="sr-only">Command</label>
            <p class="cmd-line">
              <span class="prompt">$</span>
              <input
                id="create-cmd"
                ref="input"
                v-model="command"
                class="cmd"
                type="text"
                spellcheck="false"
                autocomplete="off"
                autocapitalize="off"
              />
            </p>
            <ol class="out" aria-live="polite">
              <li v-for="(line, i) in printed.slice(0, shownCount)" :key="`${runId}-${i}`" class="out-line" :class="line.cls">
                <span class="mark">{{ line.mark }}</span>
                <span class="text">
                  <span v-for="(part, j) in line.parts" :key="j" :class="part.c">{{ part.t }}</span>
                </span>
              </li>
            </ol>
            <p v-if="shownCount >= printed.length" class="cmd-line idle">
              <span class="prompt">$</span>
              <span class="caret" />
            </p>
          </div>
        </HomeWindow>

        <HomeWindow :title="`${ran.dir}/`" class="tree-win">
          <template #right>
            <span v-if="!ran.error" class="mono count">{{ treeSummary }}</span>
          </template>
          <TransitionGroup v-if="!ran.error" name="file" tag="ul" class="tree">
            <li
              v-for="(row, i) in ran.tree"
              :key="row.path"
              class="file"
              :class="{ folder: row.folder, added: row.origin }"
              :style="{ '--i': i }"
            >
              <span v-for="level in row.depth" :key="level" class="guide" aria-hidden="true" />
              <UIcon :name="iconFor(row)" class="ico" />
              <span class="name">{{ row.name }}</span>
              <span v-if="row.origin" class="origin">{{ row.origin }}</span>
            </li>
          </TransitionGroup>
          <p v-else class="dim">Nothing created.</p>
        </HomeWindow>
      </div>

      <div class="examples" data-reveal style="--r: 3">
        <span class="try mono">Try</span>
        <button v-for="example in examples" :key="example.label" type="button" class="chip ex" @click="run(example.cmd)">
          {{ example.label }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/*
 * A faithful, small model of `create-vercube` (docs: getting-started/project-generator).
 * It parses the same flags and answers with what the real recipes add. It runs
 * nothing: the CLI itself is the source of truth.
 */
interface ModuleInfo {
  name: string;
  plugin: string;
  files: string[];
  needs?: string[];
}

const MODULES: Record<string, ModuleInfo> = {
  schema: { name: 'Schema', plugin: 'SchemaPlugin, docs at /_schema/docs', files: ['src/controller/GreetingController.ts'] },
  auth: {
    name: 'Auth',
    plugin: 'API key provider, API_KEY in .env',
    files: ['src/services/ApiKeyAuthProvider.ts', 'src/controller/ProfileController.ts'],
  },
  storage: { name: 'Storage', plugin: 'StorageManager on a {storage} mount', files: ['src/controller/FilesController.ts'] },
  cache: {
    name: 'Cache',
    plugin: 'CacheManager, a @Cache() route',
    files: ['src/controller/TimeController.ts'],
    needs: ['storage'],
  },
  queue: {
    name: 'Queue',
    plugin: 'QueuePlugin on {queue}',
    files: ['src/consumers/EmailConsumer.ts', 'src/controller/JobsController.ts'],
  },
  scheduler: { name: 'Scheduler', plugin: 'SchedulerPlugin, {scheduler} store', files: ['src/jobs/ReportJobs.ts'] },
  ws: { name: 'WebSockets', plugin: 'WebsocketPlugin, a gateway at /chat', files: ['src/gateways/ChatGateway.ts'] },
  telemetry: { name: 'Telemetry', plugin: 'TelemetryPlugin, OTLP exporter', files: [] },
  devtools: { name: 'Devtools', plugin: 'DevtoolsPlugin at /_devtools', files: [] },
  testing: {
    name: 'Testing',
    plugin: 'vitest and @vercube/testing',
    files: ['src/controller/FooController.ts', 'test/FooController.test.ts'],
  },
};

const ORDER = ['schema', 'auth', 'storage', 'cache', 'queue', 'scheduler', 'ws', 'telemetry', 'devtools', 'testing'];
const DEFAULT_MODULES = ['schema', 'testing', 'devtools'];
const CHOICES: Record<string, string[]> = {
  '--template': ['api', 'fullstack-vue'],
  '--deploy': ['node', 'aws-lambda', 'azure-functions'],
  '--queue': ['bullmq', 'rabbitmq', 'kafka', 'memory'],
  '--scheduler-store': ['memory', 'redis', 'postgres'],
  '--storage': ['memory', 's3'],
  '--package-manager': ['pnpm', 'npm', 'yarn', 'bun', 'deno'],
};
const BOOLEAN_FLAGS = new Set(['--yes', '--force', '--no-install', '--no-git-init']);

const examples = [
  { label: 'A fullstack app', cmd: 'pnpm create vercube shop --template fullstack-vue' },
  {
    label: 'Jobs on RabbitMQ',
    cmd: 'pnpm create vercube jobs --modules queue,scheduler --queue rabbitmq --scheduler-store redis',
  },
  { label: 'On AWS Lambda', cmd: 'bun create vercube edge --modules auth,cache --deploy aws-lambda' },
];

const command = ref('pnpm create vercube my-app');

interface TreeRow {
  path: string;
  name: string;
  depth: number;
  folder: boolean;
  /** The recipe that writes this file; template files have none. */
  origin?: string;
}

interface Plan {
  error?: string;
  template?: string;
  deploy?: string;
  modules?: string[];
  implied?: string[];
  dir: string;
  pm: string;
  tree: TreeRow[];
  recipes: { name: string; what: string }[];
  services: string[];
}

function parse(input: string): Plan {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  const empty: Plan = { dir: 'my-app', pm: 'pnpm', tree: [], recipes: [], services: [] };

  let pm = 'pnpm';
  const head = tokens.slice(0, 3).join(' ');
  const create = /^(pnpm|npm|yarn|bun|deno) (create|init) vercube$/.exec(head);
  if (create) {
    pm = create[1]!;
    tokens.splice(0, 3);
  } else if (tokens[0] === 'vercube' && tokens[1] === 'init') {
    tokens.splice(0, 2);
  } else {
    return { ...empty, error: 'Start with pnpm create vercube, or vercube init.' };
  }

  const flags: Record<string, string> = {};
  let dir = '';
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    if (!token.startsWith('--')) {
      if (dir) return { ...empty, error: `Unexpected argument ${token}.` };
      dir = token;
      continue;
    }
    const [name, inline] = token.split('=') as [string, string | undefined];
    if (BOOLEAN_FLAGS.has(name)) {
      flags[name] = 'true';
      continue;
    }
    if (!(name in CHOICES) && name !== '--modules') return { ...empty, error: `Unknown flag ${name}.` };
    const value = inline ?? tokens[++i];
    if (!value || value.startsWith('--')) return { ...empty, error: `${name} needs a value.` };
    if (CHOICES[name] && !CHOICES[name]!.includes(value)) {
      return { ...empty, error: `${name} takes ${CHOICES[name]!.join(', ')}.` };
    }
    flags[name] = value;
  }

  dir ||= 'my-app';
  pm = flags['--package-manager'] ?? pm;
  const template = flags['--template'] ?? 'api';
  const deploy = flags['--deploy'] ?? 'node';

  if (pm === 'deno' && template !== 'api') return { ...empty, error: 'Deno supports the api template only.' };

  let picked = DEFAULT_MODULES;
  if (flags['--modules']) {
    picked = flags['--modules'] === 'none' ? [] : flags['--modules'].split(',').filter(Boolean);
    const unknown = picked.find((id) => !MODULES[id]);
    if (unknown) return { ...empty, error: `Unknown module ${unknown}. Try ${ORDER.join(', ')}.` };
  }

  const owners: Record<string, string> = { '--queue': 'queue', '--scheduler-store': 'scheduler', '--storage': 'storage' };
  const selected = new Set(picked);
  for (const id of picked) for (const need of MODULES[id]!.needs ?? []) selected.add(need);
  for (const [flag, owner] of Object.entries(owners)) {
    if (flags[flag] && !selected.has(owner))
      return { ...empty, error: `${flag} is set, but the ${owner} module is not selected.` };
  }

  const queue = flags['--queue'] ?? 'bullmq';
  const scheduler = flags['--scheduler-store'] ?? 'memory';
  const storage = flags['--storage'] ?? 'memory';
  const modules = ORDER.filter((id) => selected.has(id));

  const recipes = modules.map((id) => {
    const info = MODULES[id]!;
    let what = info.plugin.replace('{queue}', queue).replace('{scheduler}', scheduler).replace('{storage}', storage);
    if (id === 'storage' && !picked.includes('storage')) what += ' (Cache needs it)';
    return { name: info.name, what };
  });
  if (deploy === 'aws-lambda') recipes.push({ name: 'AWS Lambda', what: 'export const handler, serverless.yml' });
  if (deploy === 'azure-functions') recipes.push({ name: 'Azure Functions', what: 'an HTTP trigger and host.json' });
  if (recipes.length === 0) recipes.push({ name: 'None', what: 'the template as it is' });

  const services = new Set<string>();
  if (selected.has('queue') && queue !== 'memory') services.add(queue === 'bullmq' ? 'redis' : queue);
  if (selected.has('scheduler') && scheduler !== 'memory') services.add(scheduler);

  // Files: the template's own, then what each recipe writes (path -> recipe).
  const envOwner = ['auth', 'queue', 'scheduler', 'storage'].find((id) => selected.has(id));
  const composeOwner = selected.has('queue') && queue !== 'memory' ? 'queue' : 'scheduler';
  const files = new Map<string, string | undefined>([
    ['src/index.ts', undefined],
    ['src/boot/Container.ts', undefined],
  ]);
  for (const id of modules) for (const file of MODULES[id]!.files) files.set(file, id);
  if (deploy === 'azure-functions') files.set('src/functions/httpTrigger.ts', deploy);
  files.set('vercube.config.ts', undefined);
  files.set('package.json', undefined);
  if (selected.has('auth') || services.size > 0 || storage === 's3') {
    files.set('.env', envOwner);
    files.set('.env.example', envOwner);
  }
  if (services.size > 0) files.set('docker-compose.yml', composeOwner);
  if (deploy === 'aws-lambda') files.set('serverless.yml', deploy);
  if (deploy === 'azure-functions') {
    files.set('host.json', deploy);
    files.set('local.settings.json', deploy);
  }

  const tree = buildTree(
    template === 'fullstack-vue'
      ? new Map([
          ...[...files].map(([file, origin]) => [`apps/api/${file}`, origin] as [string, string | undefined]),
          ['apps/web/src/App.vue', undefined],
          ['apps/web/src/api.ts', undefined],
          ['apps/web/vite.config.ts', undefined],
          ['packages/', undefined],
          ['package.json', undefined],
        ])
      : files,
  );

  const implied = modules.filter((id) => !picked.includes(id));
  return { dir, pm, template, deploy, modules, implied, tree, recipes, services: [...services] };
}

/** Turns file paths into the rows of a tree, folders first. A trailing slash marks an empty folder. */
function buildTree(files: Map<string, string | undefined>): TreeRow[] {
  interface Node {
    children: Map<string, Node>;
    folder: boolean;
    origin?: string;
  }
  const root: Node = { children: new Map(), folder: true };
  for (const [path, origin] of files) {
    const parts = path.split('/').filter(Boolean);
    let node = root;
    for (const [i, part] of parts.entries()) {
      const leaf = i === parts.length - 1;
      if (!node.children.has(part)) node.children.set(part, { children: new Map(), folder: !leaf || path.endsWith('/') });
      node = node.children.get(part)!;
    }
    node.origin = origin;
  }
  const rows: TreeRow[] = [];
  const walk = (node: Node, prefix: string, depth: number) => {
    const entries = [...node.children].toSorted(([, a], [, b]) => Number(b.folder) - Number(a.folder));
    for (const [name, child] of entries) {
      const path = `${prefix}${name}`;
      rows.push({ path, name, depth, folder: child.folder, origin: child.origin });
      walk(child, `${path}/`, depth + 1);
    }
  };
  walk(root, '', 0);
  return rows;
}

// Full names on purpose: these are listed in `icon.clientBundle` (nuxt.config),
// so the static site never asks the Iconify API for them.
function iconFor(row: TreeRow): string {
  if (row.folder) return 'lucide:folder-open';
  if (row.name.endsWith('.test.ts')) return 'vscode-icons:file-type-testts';
  if (row.name === 'vite.config.ts') return 'vscode-icons:file-type-vite';
  if (row.name === 'package.json') return 'vscode-icons:file-type-npm';
  if (row.name.startsWith('.env')) return 'vscode-icons:file-type-dotenv';
  if (row.name === 'docker-compose.yml') return 'vscode-icons:file-type-docker2';
  if (row.name.endsWith('.vue')) return 'vscode-icons:file-type-vue';
  if (row.name.endsWith('.json')) return 'vscode-icons:file-type-json';
  if (row.name.endsWith('.yml')) return 'vscode-icons:file-type-yaml';
  return 'vscode-icons:file-type-typescript-official';
}

const plan = computed(() => parse(command.value));
interface Part {
  t: string;
  c?: string;
}
interface OutLine {
  mark: string;
  cls: string;
  parts: Part[];
}

// What `create-vercube` prints for this command: the answers it settled on,
// one line per recipe it applied, then the summary from Scaffold.formatSummary.
const output = computed<OutLine[]>(() => {
  const p = plan.value;
  if (p.error) return [{ mark: '✖', cls: 'err', parts: [{ t: 'ERROR', c: 'badge' }, { t: ` ${p.error}` }] }];
  const lines: OutLine[] = [
    { mark: 'ℹ', cls: 'info', parts: [{ t: 'Welcome to ' }, { t: 'Vercube', c: 'b' }, { t: '!' }] },
    { mark: '◇', cls: 'ask', parts: [{ t: 'Template ' }, { t: '› ', c: 'i' }, { t: p.template ?? 'api' }] },
    { mark: '◇', cls: 'ask', parts: [{ t: 'Modules ' }, { t: '› ', c: 'i' }, { t: p.modules?.join(', ') || 'none' }] },
    { mark: '◇', cls: 'ask', parts: [{ t: 'Deploy target ' }, { t: '› ', c: 'i' }, { t: p.deploy ?? 'node' }] },
    ...p.recipes.map((row) => ({ mark: '+', cls: 'add', parts: [{ t: row.name.padEnd(16), c: 'r' }, { t: row.what }] })),
  ];
  if (p.services.length > 0) {
    lines.push({
      mark: '+',
      cls: 'add',
      parts: [{ t: 'docker-compose'.padEnd(16), c: 'r' }, { t: `${p.services.join(', ')} on 127.0.0.1` }],
    });
  }
  lines.push({ mark: '✔', cls: 'ok', parts: [{ t: `Created ${p.dir} from the ${p.template} template` }] });
  if (p.modules?.length) {
    const implied = p.implied?.length ? ` (${p.implied.join(', ')} added because another module needs it)` : '';
    lines.push({ mark: '', cls: 'dim', parts: [{ t: `Modules: ${p.modules.join(', ')}${implied}` }] });
  }
  if (p.deploy && p.deploy !== 'node') lines.push({ mark: '', cls: 'dim', parts: [{ t: `Deploy target: ${p.deploy}` }] });
  lines.push({ mark: '', cls: 'dim', parts: [{ t: 'Next: ' }, { t: `cd ${p.dir} && ${devCommand.value}`, c: 'b' }] });
  return lines;
});

// What the terminal shows: the output of the last run. It changes only when
// the command runs again, not on every keystroke.
const printed = shallowRef<OutLine[]>([]);

// The plan of that same run, for the tree: it must not flicker while a flag is
// half typed.
const ran = shallowRef<Plan>(plan.value);
const treeSummary = computed(() => {
  const files = ran.value.tree.filter((row) => !row.folder).length;
  const recipes = ran.value.recipes.filter((row) => row.name !== 'None').length;
  return `${files} files · ${recipes} ${recipes === 1 ? 'recipe' : 'recipes'}`;
});

const input = ref<HTMLInputElement | null>(null);
const runId = ref(0);
const shownCount = ref(Number.POSITIVE_INFINITY);
let typing: ReturnType<typeof setInterval> | undefined;
let settle: ReturnType<typeof setTimeout> | undefined;
const reduced = () => globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;

function focusInput() {
  input.value?.focus();
}

/** Prints the output again line by line, the way the CLI would. */
function replay() {
  clearInterval(typing);
  runId.value++;
  printed.value = output.value;
  ran.value = plan.value;
  if (reduced()) {
    shownCount.value = Number.POSITIVE_INFINITY;
    return;
  }
  shownCount.value = 0;
  typing = setInterval(() => {
    shownCount.value++;
    if (shownCount.value >= printed.value.length) clearInterval(typing);
  }, 90);
}

// A command set by an example button has already been replayed; the watcher
// runs a tick later and must not schedule a second replay for it.
let replayedCommand: string | null = null;

function run(cmd: string) {
  clearTimeout(settle);
  replayedCommand = cmd === command.value ? null : cmd;
  command.value = cmd;
  replay();
}

watch(command, (value) => {
  clearTimeout(settle);
  if (value === replayedCommand) {
    replayedCommand = null;
    return;
  }
  replayedCommand = null;
  settle = setTimeout(replay, 450);
});

onBeforeUnmount(() => {
  clearInterval(typing);
  clearTimeout(settle);
});

const devCommand = computed(
  () => ({ pnpm: 'pnpm dev', yarn: 'yarn dev', deno: 'deno task dev' })[plan.value.pm] ?? `${plan.value.pm} run dev`,
);
printed.value = output.value;
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
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 14px;
}

.pair > * {
  height: 380px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

.hint {
  font-size: 10.5px;
  color: var(--h-dim);
}

.screen {
  min-height: 100%;
  cursor: text;
}

.cmd-line {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--h-ink);
}

.prompt {
  color: var(--h-accent);
}

.cmd {
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--h-ink);
  caret-color: var(--h-accent);
  font: inherit;
  outline: none;
}

.cmd:focus-visible {
  outline: 0;
}

.screen:has(.cmd:focus) .cmd {
  text-decoration: underline;
  text-decoration-color: rgb(188 78 255 / 0.5);
  text-underline-offset: 4px;
}

.out {
  margin: 6px 0 2px;
}

.out-line {
  display: flex;
  gap: 10px;
  white-space: pre-wrap;
  animation: out-in 200ms var(--ease) both;
}

.mark {
  flex: 0 0 auto;
  width: 1ch;
}

.info .mark {
  color: var(--h-blue);
}

.ask .mark {
  color: var(--h-accent);
}

.add .mark,
.ok .mark {
  color: var(--h-green);
}

.dim {
  color: var(--h-dim);
}

.err {
  color: var(--h-red);
}

.text :deep(.b),
.text .b {
  color: var(--h-ink);
  font-weight: 500;
}

.text .i {
  color: var(--h-dim);
}

.text .r {
  color: var(--h-accent);
  white-space: pre;
}

.text .badge {
  padding: 0 6px;
  background: var(--h-red);
  color: var(--h-bg);
}

.caret {
  display: inline-block;
  width: 7px;
  height: 15px;
  background: var(--h-ink);
  animation: blink 1s steps(1) infinite;
}

.examples {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: -30px;
}

.try {
  margin-right: 6px;
  font-size: 11px;
  color: var(--h-dim);
}

.ex {
  cursor: pointer;
  transition:
    border-color 160ms ease,
    color 160ms ease;
}

.ex:hover {
  border-color: var(--h-accent);
  color: var(--h-ink);
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.count {
  font-size: 10.5px;
  color: var(--h-accent);
}

.tree {
  margin: -2px -8px;
}

.file {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  padding: 0 8px;
  color: var(--h-dim);
  white-space: nowrap;
  transition: background-color 160ms ease;
}

.file:hover {
  background: var(--h-raise);
}

.file.folder {
  color: var(--h-muted);
}

.file.added .name {
  color: var(--h-ink);
}

/* Indent guides: a run of nested rows draws one continuous line. */
.guide {
  align-self: stretch;
  flex: 0 0 auto;
  width: 8px;
  margin-left: 7px;
  margin-right: -8px;
  border-left: 1px solid var(--h-line);
}

.ico {
  flex: 0 0 auto;
  width: 15px;
  height: 15px;
}

.folder .ico {
  color: var(--h-dim);
}

.name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.origin {
  flex: 0 0 auto;
  margin-left: auto;
  padding-left: 12px;
  font-size: 10.5px;
  color: var(--h-accent);
}

.file-move {
  transition: transform 280ms var(--ease);
}

.file-leave-active {
  display: none;
}

@media (prefers-reduced-motion: no-preference) {
  .file-enter-active {
    transition:
      opacity 280ms var(--ease) calc(var(--i) * 28ms),
      transform 280ms var(--ease) calc(var(--i) * 28ms),
      background-color 1100ms ease calc(var(--i) * 28ms);
  }

  .file-enter-from {
    opacity: 0;
    transform: translateX(-8px);
    background: rgb(188 78 255 / 0.22);
  }
}

@keyframes out-in {
  from {
    opacity: 0;
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
    height: auto;
  }

  .pair > .tree-win {
    height: 340px;
  }
}
</style>
