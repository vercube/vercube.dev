<template>
  <section class="sponsor relative w-full overflow-hidden px-6 pb-44 pt-32">
    <!-- Soft, smoothly-faded brand glow (no hard clip edge) -->
    <div class="glow pointer-events-none absolute inset-0" />

    <div class="reveal relative mx-auto flex max-w-2xl flex-col items-center text-center">
      <span
        class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-(family-name:--font-geist-mono) text-foreground/60"
      >
        <UIcon name="i-lucide-scale" class="size-3.5 text-[#bc4eff]" />
        MIT Licensed
      </span>

      <h2 class="mt-7 text-4xl sm:text-5xl font-(family-name:--font-geist-pixel-circle) text-foreground">
        Free &amp; open source
      </h2>
      <p class="mx-auto mt-5 max-w-md text-balance text-foreground/55 font-(family-name:--font-geist-mono)">
        Vercube is and will always be free and open source. Built in the open, shaped by its community.
      </p>

      <div class="mt-10 flex flex-wrap justify-center gap-3">
        <UButton
          icon="i-lucide-heart"
          size="md"
          variant="ghost"
          to="https://github.com/sponsors/OskarLebuda"
          target="_blank"
          class="group relative border bg-[#bc4eff]/20 border-[#bc4eff]/50 hover:border-[#bc4eff] hover:bg-[#bc4eff]/10 rounded-full px-5 py-2 h-auto text-sm transition-all duration-300"
        >
          Become a Sponsor
        </UButton>

        <UButton
          icon="i-lucide-github"
          size="md"
          variant="outline"
          target="_blank"
          to="https://github.com/vercube/vercube"
          class="rounded-full px-5 py-2 h-auto text-sm"
        >
          Star on GitHub
        </UButton>

        <UButton
          icon="i-simple-icons-x"
          size="md"
          variant="outline"
          target="_blank"
          to="https://x.com/vercubejs"
          class="rounded-full px-5 py-2 h-auto text-sm"
        >
          Follow on X
        </UButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.glow {
  background: radial-gradient(ellipse 52% 56% at 50% 30%, rgb(188 78 255 / 0.13), transparent 70%);
}
</style>
