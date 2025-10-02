<template>
  <section class="w-full py-32 px-4 relative">
    <div class="max-w-4xl mx-auto text-center">
      <div class="flex justify-center mb-8">
        <div class="relative w-32 h-32">
          <!-- Pulsing glow layers -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="absolute w-24 h-24 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
            <div
              class="absolute w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
              :style="{ animationDelay: '0.5s' }"
            />
          </div>

          <!-- Floating particles -->
          <div
            v-for="particle in particles"
            :key="particle.id"
            class="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2"
            :style="{
              animation: 'float 3s ease-in-out infinite',
              animationDelay: `${particle.delay}s`
            }"
          >
            <div
              class="w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 blur-sm"
              :style="{
                transform: `translate(${particle.x}px, ${particle.y}px)`
              }"
            />
          </div>

          <!-- Main heart with gradient and animation -->
          <div class="absolute inset-0 flex items-center justify-center">
            <svg
              class="relative w-16 h-16 animate-heartbeat"
              fill="url(#heartGradient)"
              viewBox="0 0 24 24"
              :style="{
                filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))'
              }"
            >
              <defs>
                <linearGradient
                  id="heartGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stop-color="#a855f7"
                  />
                  <stop
                    offset="50%"
                    stop-color="#ec4899"
                  />
                  <stop
                    offset="100%"
                    stop-color="#f97316"
                  />
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Main heading with gradient -->
      <h2 class="text-5xl md:text-6xl mb-6 text-foreground font-(family-name:--font-geist-mono)">
        Free & open source
      </h2>

      <!-- Subheading -->
      <p class="text-balance mt-6 text-foreground/60 font-(family-name:--font-geist-mono) mx-auto mb-12">
        Vercube is MIT Licensed and will always be free and open source.
      </p>

      <div class="flex flex-wrap justify-center gap-4">
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

        <UButton
          icon="i-lucide-heart"
          size="md"
          variant="ghost"
          to="https://github.com/sponsors/OskarLebuda"
          target="_blank"
          class="group relative border bg-[#bc4eff]/20 border-[#bc4eff]/50 hover:border-[#bc4eff] hover:bg-[#bc4eff]/10 rounded-full px-5 py-2 h-auto text-sm transition-all duration-300"
        >
          Sponsor
        </UButton>

        <UButton
          icon="i-simple-icons-x"
          size="md"
          variant="outline"
          target="_blank"
          to="https://x.com/vercubejs"
          class="rounded-full px-5 py-2 h-auto text-sm"
        >
          View on X
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Particle {
  id: number
  x: number
  y: number
  delay: number
}

const particles = ref<Array<Particle>>([])

onMounted(() => {
  const newParticles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.cos((i * Math.PI * 2) / 8) * 60,
    y: Math.sin((i * Math.PI * 2) / 8) * 60,
    delay: i * 0.2
  }))
  particles.value = newParticles
})
</script>

<style scoped>
@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  10%, 30% {
    transform: scale(1.1);
  }
  20%, 40% {
    transform: scale(1.05);
  }
}

@keyframes float {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-heartbeat {
  animation: heartbeat 2s ease-in-out infinite;
}
</style>
