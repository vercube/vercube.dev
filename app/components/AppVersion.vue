<template>
  <NuxtLink
    to="/changelog"
    class="bg-transparent rounded-full font-medium text-foreground/50 backdrop-blur-xs text-xs inline-flex items-center justify-center px-3 h-8  border border-muted/30 font-(family-name:--font-geist-mono)"
  >
    <span class="inline-block size-2.5 rounded-full bg-[#bc4eff] mr-3 shadow-glow shadow-primary/50" />
    {{ version }}
  </NuxtLink>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

const { data: version } = await useFetch(computed(() => `https://ungh.cc/repos/${appConfig.repository}/releases/latest`), {
  transform: (data: {
    release: {
      name?: string
      tag: string
      publishedAt: string
      markdown: string
    }
  }) => {
    return data.release.tag.replace('v', 'Version ')
  }
})
</script>
