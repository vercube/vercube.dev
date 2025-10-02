<template>
  <div class="relative w-full h-48 flex items-center justify-center overflow-hidden">
    <div class="relative w-full h-full flex items-center justify-center">
      <!-- Background grid lines -->
      <div class="absolute inset-0 flex flex-col justify-center gap-4 px-8">
        <div
          v-for="i in 7"
          :key="i"
          class="h-px bg-gradient-to-r from-transparent via-border/20 to-transparent"
        />
      </div>

      <!-- Request arrow 1 - GET -->
      <div class="absolute left-4 top-[20%] transition-transform duration-500 group-hover:translate-x-4">
        <div class="flex items-center gap-2">
          <div class="px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 backdrop-blur-sm">
            <span class="text-xs font-mono font-semibold text-cyan-400">GET</span>
          </div>
          <div class="relative w-28 h-1 bg-gradient-to-r from-cyan-500/70 to-cyan-500/30">
            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-r-2 border-t-2 border-cyan-500/70" />
            <div class="absolute inset-0 bg-cyan-500/40 blur-md" />
          </div>
        </div>
      </div>

      <!-- Response arrow 1 - 200 -->
      <div class="absolute right-12 top-[30%] transition-transform duration-500 group-hover:-translate-x-4">
        <div class="flex items-center gap-2">
          <div class="relative w-36 h-0.5 bg-gradient-to-l from-green-500/70 to-green-500/30">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-l-2 border-b-2 border-green-500/70" />
            <div class="absolute inset-0 bg-green-500/40 blur-md" />
          </div>
          <div class="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/40 backdrop-blur-sm">
            <span class="text-xs font-mono font-semibold text-green-400">200</span>
          </div>
        </div>
      </div>

      <!-- Request arrow 2 - POST -->
      <div class="absolute left-10 top-[45%] transition-transform duration-500 group-hover:translate-x-4">
        <div class="flex items-center gap-2">
          <div class="px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/40 backdrop-blur-sm">
            <span class="text-xs font-mono font-semibold text-blue-400">POST</span>
          </div>
          <div class="relative w-36 h-1.5 bg-gradient-to-r from-blue-500/70 to-blue-500/30">
            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-r-2 border-t-2 border-blue-500/70" />
            <div class="absolute inset-0 bg-blue-500/40 blur-md" />
          </div>
        </div>
      </div>

      <!-- Response arrow 2 - 201 -->
      <div class="absolute right-4 top-[55%] transition-transform duration-500 group-hover:-translate-x-4">
        <div class="flex items-center gap-2">
          <div class="relative w-28 h-1 bg-gradient-to-l from-emerald-500/70 to-emerald-500/30">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-l-2 border-b-2 border-emerald-500/70" />
            <div class="absolute inset-0 bg-emerald-500/40 blur-md" />
          </div>
          <div class="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-sm">
            <span class="text-xs font-mono font-semibold text-emerald-400">201</span>
          </div>
        </div>
      </div>

      <!-- Request arrow 3 - PUT -->
      <div class="absolute left-8 top-[70%] transition-transform duration-500 group-hover:translate-x-4">
        <div class="flex items-center gap-2">
          <div class="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 backdrop-blur-sm">
            <span class="text-xs font-mono font-semibold text-purple-400">PUT</span>
          </div>
          <div class="relative w-32 h-0.5 bg-gradient-to-r from-purple-500/70 to-purple-500/30">
            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-r-2 border-t-2 border-purple-500/70" />
            <div class="absolute inset-0 bg-purple-500/40 blur-md" />
          </div>
        </div>
      </div>

      <!-- Response arrow 3 - 204 -->
      <div class="absolute right-12 top-[80%] transition-transform duration-500 group-hover:-translate-x-4">
        <div class="flex items-center gap-2">
          <div class="relative w-32 h-1.5 bg-gradient-to-l from-teal-500/70 to-teal-500/30">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-l-2 border-b-2 border-teal-500/70" />
            <div class="absolute inset-0 bg-teal-500/40 blur-md" />
          </div>
          <div class="px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/40 backdrop-blur-sm">
            <span class="text-xs font-mono font-semibold text-teal-400">204</span>
          </div>
        </div>
      </div>

      <!-- Center server icon with glow -->
      <div class="relative z-10">
        <div class="absolute inset-0 bg-blue-500/20 blur-2xl scale-150" />
        <div class="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/20 border border-blue-500/40 backdrop-blur-sm flex items-center justify-center">
          <UIcon
            name="i-lucide-server"
            class="text-blue-400 size-12"
          />
        </div>
      </div>
    </div>
  </div>
</template>
