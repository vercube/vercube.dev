<template>
  <div class="relative w-full h-48 flex items-center justify-center overflow-hidden">
    <div class="relative w-full max-w-sm h-40 rounded-xl border border-blue-500/30 bg-black/40 backdrop-blur-sm overflow-hidden">
      <!-- Browser header -->
      <div class="h-10 bg-gradient-to-b from-blue-500/20 to-blue-400/10 border-b border-blue-500/30 flex items-center px-3 gap-2" />

      <!-- Code lines with line numbers -->
      <div class="p-4 space-y-2 font-mono text-xs">
        <div class="flex items-center gap-3">
          <span class="text-muted-foreground/40">1</span>
          <div class="h-2 w-24 bg-blue-400/60 rounded" />
        </div>
        <div class="flex items-center gap-3">
          <span class="text-muted-foreground/40">2</span>
          <div class="h-2 w-32 bg-blue-400/60 rounded" />
        </div>
        <div class="flex items-center gap-3">
          <span class="text-muted-foreground/40">3</span>
          <div class="h-2 w-16 bg-blue-400/60 rounded" />
        </div>
        <div class="flex items-center gap-3">
          <span class="text-muted-foreground/40">4</span>
          <div class="h-2 w-40 bg-blue-400/60 rounded" />
        </div>
        <div class="flex items-center gap-3">
          <span class="text-muted-foreground/40">5</span>
          <div class="h-2 w-20 bg-purple-400/60 rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
