<template>
  <div class="esm font-(family-name:--font-geist-mono)">
    <div class="code">
      <div><span class="kw">import</span> { createApp }</div>
      <div class="indent"><span class="kw">from</span> <span class="str">'@vercube/core'</span></div>
      <div class="spacer" />
      <div><span class="kw">export default</span> app<span class="cursor">_</span></div>
    </div>
  </div>
</template>

<style scoped>
.esm {
  width: 100%;
}

.code {
  font-size: 0.82rem;
  line-height: 1.85;
  color: rgb(255 255 255 / 0.62);
}

.indent {
  padding-left: 1.1rem;
}

.spacer {
  height: 0.5rem;
}

.kw {
  color: #bc4eff;
}

.str {
  color: rgb(255 255 255 / 0.42);
}

.cursor {
  color: #bc4eff;
}

@media (prefers-reduced-motion: no-preference) {
  .cursor {
    animation: blink 1.1s steps(1) infinite;
  }
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  50.01%,
  100% {
    opacity: 0;
  }
}
</style>
