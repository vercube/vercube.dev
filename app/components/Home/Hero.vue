<template>
  <section v-if="page" class="hero relative overflow-hidden">
    <!-- WebGL particle field: scoped to the hero only -->
    <ClientOnly>
      <template #fallback>
        <div class="absolute inset-0 bg-black" />
      </template>
      <HomeBackground class="absolute inset-0 h-full w-full overflow-hidden" />
    </ClientOnly>

    <!-- Mute the particle field so it sits behind the content -->
    <div class="pointer-events-none absolute inset-0 bg-[#010101]/35" />

    <!-- Readability scrim behind the centered content + bottom blend into the page -->
    <div class="scrim pointer-events-none absolute inset-0" />
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-[#010101]" />

    <div class="container relative z-10 mx-auto flex flex-col items-center px-6">
      <div class="hero-part flex min-h-[60vh] flex-col items-center justify-center pt-28 text-center" :style="{ '--i': 0 }">
        <p class="font-(family-name:--font-geist-mono) text-sm text-foreground/45">
          <span class="text-[#bc4eff]">//</span> {{ page.hero.slug }}
        </p>

        <h1 class="mt-5 text-5xl leading-[1.08] font-(family-name:--font-geist-pixel-circle) sm:text-6xl lg:text-7xl">
          {{ page.hero.title }}
        </h1>

        <p class="mx-auto mt-6 max-w-xl text-balance text-foreground/55 font-(family-name:--font-geist-mono)">
          {{ page.hero.description }}
        </p>

        <div class="mt-9 flex flex-col items-center gap-5">
          <button type="button" class="install group" :aria-label="`Copy: ${installCmd}`" @click="copyInstall">
            <span class="prompt">$</span>
            <code>{{ installCmd }}</code>
            <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="copy-ico size-4" />
          </button>

          <div class="flex flex-wrap items-center justify-center gap-3">
            <UButton
              icon="i-lucide-arrow-right"
              trailing
              size="md"
              variant="ghost"
              to="/docs"
              class="group relative border bg-[#bc4eff]/20 border-[#bc4eff]/50 hover:border-[#bc4eff] hover:bg-[#bc4eff]/10 rounded-full px-5 py-2 h-auto text-sm transition-all duration-300"
            >
              Get Started
            </UButton>

            <UButton
              icon="i-lucide-github"
              size="md"
              variant="outline"
              target="_blank"
              to="https://github.com/vercube/vercube"
              class="rounded-full px-5 py-2 h-auto text-sm"
            >
              View on GitHub
            </UButton>
          </div>
        </div>
      </div>

      <!-- The file starts inside the first screen: the fold crops it, which is
           what invites the scroll. -->
      <div class="hero-part mt-14 w-full max-w-6xl pb-24 text-left" :style="{ '--i': 1 }">
        <HomeCode />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('hero', () => queryCollection('index').first());

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const installCmd = 'pnpm create vercube';
const copied = ref(false);

async function copyInstall() {
  try {
    await navigator.clipboard.writeText(installCmd);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    // Clipboard unavailable (insecure context); ignore.
  }
}
</script>

<style scoped>
.scrim {
  /* Denser in the middle than it was: the display face is built from dots and
     so is the field behind it, so the headline needs the contrast. */
  background: radial-gradient(ellipse 72% 54% at 50% 38%, rgb(1 1 1 / 0.88), rgb(1 1 1 / 0.45) 56%, transparent 82%);
}

.install {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.9rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: 0.6rem;
  background: rgb(255 255 255 / 0.03);
  font-family: var(--font-geist-mono);
  font-size: 0.85rem;
  color: rgb(255 255 255 / 0.8);
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.15s ease;
}

.install:hover {
  border-color: rgb(188 78 255 / 0.45);
  background: rgb(188 78 255 / 0.05);
}

.install:active {
  transform: scale(0.98);
}

.install:focus-visible {
  outline: 2px solid #bc4eff;
  outline-offset: 3px;
}

.install .prompt {
  color: #bc4eff;
}

.install .copy-ico {
  color: rgb(255 255 255 / 0.4);
  transition: color 0.2s ease;
}

.install:hover .copy-ico {
  color: rgb(255 255 255 / 0.7);
}

@media (prefers-reduced-motion: no-preference) {
  /* One move, in two beats: the title card, then the file. */
  .hero-part {
    animation: hero-rise 0.75s cubic-bezier(0.23, 1, 0.32, 1) both;
    animation-delay: calc(var(--i) * 160ms + 120ms);
  }
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
