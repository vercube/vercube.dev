<template>
  <div class="relative w-full h-48 flex items-center justify-center overflow-hidden">
    <div class="relative w-full max-w-sm h-40 rounded-xl border border-green-500/30 bg-black/40 backdrop-blur-sm overflow-hidden">
      <!-- Terminal header -->
      <div class="h-8 border-b border-muted/30 border-border/30 flex items-center px-3 gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500/50" />
        <div class="w-3 h-3 rounded-full bg-yellow-500/50" />
        <div class="w-3 h-3 rounded-full bg-green-500/50" />
      </div>

      <!-- Terminal content -->
      <div class="p-4 space-y-2">
        <div class="h-2 w-32 bg-muted-foreground/20 rounded" />
        <div class="h-2 w-48 bg-muted-foreground/20 rounded" />
        <div class="h-2 w-24 bg-muted-foreground/20 rounded" />
      </div>

      <!-- Ready message with glow -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-green-500/50 bg-gradient-to-t from-green-500/10 to-transparent">
        <div class="absolute inset-0 bg-green-500/20 blur-xl" />
        <p class="relative text-green-400 font-mono text-lg font-semibold">
          Ready in 47ms
        </p>
      </div>
    </div>
  </div>
</template>
