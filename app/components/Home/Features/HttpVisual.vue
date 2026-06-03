<template>
  <div class="http font-(family-name:--font-geist-mono)">
    <div class="msg req">
      <div class="msg-head">
        <UIcon name="i-lucide-arrow-up-right" class="size-3" />
        Request
      </div>
      <div class="msg-line"><span class="accent">GET</span> <span class="dim">/users</span></div>
      <div class="msg-meta">accept: application/json</div>
    </div>

    <div class="wire"><span class="packet" /></div>

    <div class="msg res">
      <div class="msg-head">
        <UIcon name="i-lucide-arrow-down-left" class="size-3" />
        Response
      </div>
      <div class="msg-line"><span class="accent">200</span> <span class="dim">OK</span></div>
      <div class="msg-meta">content-type: application/json</div>
    </div>
  </div>
</template>

<style scoped>
.http {
  --ease-io: cubic-bezier(0.77, 0, 0.175, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}

.msg {
  flex: 0 1 auto;
  min-width: 0;
  padding: 0.2rem 0;
}

.req {
  text-align: right;
}

.req .msg-head {
  justify-content: flex-end;
}

.msg-head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.55rem;
  font-size: 0.62rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.4);
}

.msg-line {
  font-size: 0.92rem;
  color: rgb(255 255 255 / 0.75);
}

.accent {
  color: #bc4eff;
}

.dim {
  color: rgb(255 255 255 / 0.55);
}

.msg-meta {
  margin-top: 0.45rem;
  font-size: 0.62rem;
  color: rgb(255 255 255 / 0.28);
}

.wire {
  position: relative;
  flex: 0 0 48px;
  height: 1px;
  background: linear-gradient(90deg, rgb(255 255 255 / 0.08), rgb(188 78 255 / 0.35), rgb(255 255 255 / 0.08));
}

.packet {
  position: absolute;
  top: 50%;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: #bc4eff;
  box-shadow: 0 0 10px 2px rgb(188 78 255 / 0.7);
  transform: translate(-50%, -50%);
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .packet {
    animation: packet 3s var(--ease-io) infinite;
  }

  .req .accent {
    animation: send 3s ease-out infinite;
  }

  .res .accent {
    animation: arrive 3s ease-out infinite;
  }
}

@keyframes packet {
  0% {
    left: 0;
    opacity: 0;
  }
  6% {
    opacity: 1;
  }
  40% {
    left: 100%;
    opacity: 1;
  }
  48%,
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes send {
  0% {
    text-shadow: 0 0 0 rgb(188 78 255 / 0);
  }
  8% {
    text-shadow: 0 0 14px rgb(188 78 255 / 0.7);
  }
  24%,
  100% {
    text-shadow: 0 0 0 rgb(188 78 255 / 0);
  }
}

@keyframes arrive {
  0%,
  40% {
    text-shadow: 0 0 0 rgb(188 78 255 / 0);
  }
  48% {
    text-shadow: 0 0 14px rgb(188 78 255 / 0.7);
  }
  68%,
  100% {
    text-shadow: 0 0 0 rgb(188 78 255 / 0);
  }
}
</style>
