<template>
  <section class="hero band">
    <ClientOnly>
      <HomeBackground class="field" />
    </ClientOnly>
    <div class="veil" aria-hidden="true" />

    <div class="frame inner">
      <div class="copy">
        <h1 class="pixel title hero-in" style="--i: 0">
          Unleash your server<br />
          development<span class="dot">.</span>
        </h1>

        <p class="lead hero-in" style="--i: 1">{{ page?.hero.description }}</p>

        <div class="ctas hero-in" style="--i: 2">
          <NuxtLink to="/docs/getting-started" class="btn primary">Get started →</NuxtLink>
          <button type="button" class="btn install mono" :aria-label="`Copy ${installCmd}`" @click="copyInstall">
            <span class="prompt">$</span>
            {{ installCmd }}
            <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="copy" />
          </button>
        </div>
      </div>

      <div class="term-wrap hero-in" style="--i: 3">
        <HomeWindow title="~/projects" class="term">
          <template #right>
            <span class="mono status" :class="{ done: step >= script.length }">{{
              step >= script.length ? 'ready' : 'running'
            }}</span>
          </template>
          <div class="lines" aria-label="pnpm create vercube my-app, then pnpm dev">
            <p class="cmd">
              <span class="prompt">$</span>
              {{ typed }}<span v-if="step === 0" class="caret" />
            </p>
            <p v-for="(line, i) in shown" :key="i" class="line" :class="line.kind">
              <span v-if="line.mark" class="mark">{{ line.mark }}</span>
              <span v-html="line.html" />
            </p>
            <p v-if="step >= script.length" class="cmd">
              <span class="prompt">$</span>
              <span class="caret" />
            </p>
          </div>
        </HomeWindow>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('hero', () => queryCollection('index').first());

const installCmd = 'pnpm create vercube';
const copied = ref(false);

async function copyInstall() {
  try {
    await navigator.clipboard.writeText(installCmd);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1600);
  } catch {
    // Clipboard unavailable (insecure context); the command is on screen.
  }
}

// Wording follows the CLI: `vercube init` (packages/cli, Init.ts and Scaffold.ts).
const command = 'pnpm create vercube my-app';
const script = [
  { mark: 'ℹ', kind: 'info', html: 'Welcome to <b>Vercube</b>!' },
  { mark: '◇', kind: 'ask', html: 'Template <i>›</i> api' },
  { mark: '◇', kind: 'ask', html: 'Modules <i>›</i> schema, testing, devtools' },
  { mark: '◇', kind: 'ask', html: 'Deploy target <i>›</i> node' },
  { mark: '◒', kind: 'dim', html: 'Applying recipes, installing dependencies…' },
  { mark: '✔', kind: 'ok', html: 'Created my-app from the api template' },
  { mark: '', kind: 'dim', html: 'Modules: schema, testing, devtools' },
  { mark: '', kind: 'dim', html: 'Next: <b>cd my-app &amp;&amp; pnpm dev</b>' },
];

const typed = ref(command);
const step = ref(script.length + 1);
const shown = computed(() => script.slice(0, Math.max(0, step.value - 1)));
const timers: ReturnType<typeof setTimeout>[] = [];

onMounted(() => {
  if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  typed.value = '';
  step.value = 0;
  let t = 700;
  for (let i = 1; i <= command.length; i++) {
    timers.push(setTimeout(() => (typed.value = command.slice(0, i)), t));
    t += 38;
  }
  for (let s = 1; s <= script.length + 1; s++) {
    // a short pause before the first line, a longer one while dependencies install
    const pause: Record<number, number> = { 1: 260, 6: 900 };
    t += pause[s] ?? 320;
    timers.push(setTimeout(() => (step.value = s), t));
  }
});

onBeforeUnmount(() => {
  for (const timer of timers) clearTimeout(timer);
});
</script>

<style scoped>
.hero {
  overflow: hidden;
  border-top: 0;
  background: #000;
  /* Sits under the translucent header, so the field shows through its blur. */
  margin-top: -57px;
}

.field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.veil {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 42% at 50% 30%, rgb(0 0 0 / 0.75), transparent 78%),
    linear-gradient(to bottom, transparent 50%, var(--h-bg) 96%), rgb(0 0 0 / 0.45);
  pointer-events: none;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 56px;
  border-inline-color: transparent;
  background:
    linear-gradient(to bottom, var(--h-line), transparent 22%, transparent 70%, var(--h-line)) left / 1px 100% no-repeat,
    linear-gradient(to bottom, var(--h-line), transparent 22%, transparent 70%, var(--h-line)) right / 1px 100% no-repeat;
  padding: 145px var(--pad) 72px;
}

.copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  text-align: center;
}

.title {
  font-size: clamp(2.4rem, 1.4rem + 3.6vw, 4rem);
  line-height: 1.05;
  text-shadow: 0 4px 24px rgb(0 0 0 / 0.5);
}

.dot {
  color: var(--h-accent);
}

.lead {
  max-width: 52ch;
  font-size: 16px;
}

.ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
}

.install {
  font-size: 12.5px;
  font-weight: 400;
}

.install .prompt {
  color: var(--h-accent);
}

.install .copy {
  width: 14px;
  height: 14px;
  color: var(--h-dim);
}

.term-wrap {
  width: min(100%, 680px);
}

.term {
  height: 300px;
}

.term :deep(.body) {
  overflow: hidden;
}

.status {
  font-size: 10.5px;
  color: var(--h-amber);
}

.status.done {
  color: var(--h-green);
}

.lines p {
  display: flex;
  gap: 10px;
  white-space: pre-wrap;
}

.cmd {
  color: var(--h-ink);
}

.prompt {
  color: var(--h-accent);
}

.caret {
  display: inline-block;
  width: 7px;
  height: 15px;
  margin-top: 3px;
  background: var(--h-ink);
  animation: blink 1s steps(1) infinite;
}

.line {
  animation: line-in 260ms var(--ease) both;
}

.mark {
  width: 1ch;
  flex: 0 0 auto;
}

.line :deep(b) {
  color: var(--h-ink);
  font-weight: 500;
}

.line :deep(i) {
  font-style: normal;
  color: var(--h-dim);
}

.info .mark {
  color: var(--h-blue);
}

.ask .mark {
  color: var(--h-accent);
}

.ok .mark {
  color: var(--h-green);
}

.dim {
  color: var(--h-dim);
}

.lines p:first-child + .line {
  margin-top: 6px;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@keyframes line-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .hero-in {
    animation: hero-rise 800ms var(--ease) both;
    animation-delay: calc(var(--i) * 110ms + 100ms);
  }
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}

@media (width < 720px) {
  .inner {
    padding-top: 113px;
    gap: 40px;
  }

  .term {
    height: 316px;
  }

  .term :deep(.body) {
    font-size: 11px;
  }
}
</style>
