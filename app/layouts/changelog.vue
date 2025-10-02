<template>
  <div class="relative min-h-screen xl:grid xl:grid-cols-2">
    <UPageSection
      title="Changelog"
      description="Track our journey with a detailed history of updates, improvements, and new features."
      class="relative"
      orientation="vertical"
      :links="[{
        label: 'Get started',
        icon: 'i-lucide-rocket',
        variant: 'ghost',
        to: '/docs',
        class: 'group relative border bg-[#bc4eff]/20 border-[#bc4eff]/50 hover:border-[#bc4eff] hover:bg-[#bc4eff]/10 rounded-full px-5 py-2 h-auto text-sm transition-all duration-300'
      }, {
        label: 'GitHub',
        icon: 'i-lucide-github',
        variant: 'ghost',
        class: 'rounded-full px-5 py-2 h-auto text-sm',
        to: 'https://github.com/vercube/vercube',
        target: '_blank'
      }]"
      :ui="{
        root: 'border-b border-default xl:border-b-0 xl:sticky xl:inset-y-0 xl:h-screen overflow-hidden',
        container: 'h-full items-center justify-center z-[10]',
        wrapper: 'relative flex flex-col',
        headline: 'mb-6',
        title: 'text-left text-4xl font-(family-name:--font-geist-mono)',
        description: 'text-left max-w-lg font-(family-name:--font-geist-mono)',
        links: 'gap-1 justify-start -ms-2.5'
      }"
    >
      <template #top>
        <div class="absolute inset-0 z-[-1] overflow-hidden">
          <HomeBackground class="inset-0" />
          <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />
        </div>
      </template>

      <template #default />
    </UPageSection>

    <section class="px-4 sm:px-6 xl:px-0 xl:-ms-30 xl:flex-1">
      <UColorModeButton class="fixed top-4 right-4 z-10" />

      <slot />
    </section>
  </div>
</template>
