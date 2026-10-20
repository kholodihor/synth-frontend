<template>
  <div class="box">
    <div ref="stage" class="main" :style="depthStyle">
      <video class="layer-video" src="/video.mp4" autoplay loop muted type="mp4"></video>
      <img src="/mask.webp" alt="" class="mask layer-mask" />
      <h2 class="layer-title" :aria-label="title">
        <span
          v-for="(char, i) in chars"
          :key="i"
          class="char"
          :class="{ space: char === ' ', flicker: i === flickerIndex }"
          :style="{ '--i': i }"
          aria-hidden="true"
          >{{ char }}</span
        >
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

const title = 'Synth World'
const chars = [...title]
const flickerIndex = title.indexOf('W')

const stage = ref<HTMLElement | null>(null)

// Pointer target (-1..1) and scroll progress (0..1), eased toward each frame for inertia.
const target = { x: 0, y: 0, scroll: 0 }
const depth = reactive({ x: 0, y: 0, scroll: 0 })

const depthStyle = computed(() => ({
  '--px': depth.x.toFixed(4),
  '--py': depth.y.toFixed(4),
  '--sp': depth.scroll.toFixed(4)
}))

let frame = 0

const tick = () => {
  depth.x += (target.x - depth.x) * 0.08
  depth.y += (target.y - depth.y) * 0.08
  depth.scroll += (target.scroll - depth.scroll) * 0.15
  const settled =
    Math.abs(target.x - depth.x) < 0.001 &&
    Math.abs(target.y - depth.y) < 0.001 &&
    Math.abs(target.scroll - depth.scroll) < 0.001
  frame = settled ? 0 : requestAnimationFrame(tick)
}

const wake = () => {
  if (!frame) frame = requestAnimationFrame(tick)
}

const onPointerMove = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  target.x = (e.clientX / window.innerWidth) * 2 - 1
  target.y = (e.clientY / window.innerHeight) * 2 - 1
  wake()
}

const onScroll = () => {
  const height = stage.value?.offsetHeight || window.innerHeight
  target.scroll = Math.min(window.scrollY / height, 1)
  wake()
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  if (reducedMotion) return
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(frame)
})
</script>

<style scoped lang="scss">
.box {
  .main {
    --px: 0;
    --py: 0;
    --sp: 0;
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    perspective: 900px;
    animation: crt-on 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    @media (max-width: 1280px) {
      height: 40vh;
    }
    @media (max-width: 990px) {
      height: 50vh;
    }
    @media (max-width: 610px) {
      height: 70vh;
    }
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      user-select: none;
      filter: invert(1);
      mix-blend-mode: multiply;
    }
    h2 {
      position: relative;
      z-index: 3;
      font-size: 10vw;
      color: $white;
      white-space: nowrap;
    }
  }
}

// Depth layers: background drifts least, title most, opposite to the mask for parallax.
.layer-video {
  transform: translate3d(calc(var(--px) * -12px), calc(var(--py) * -8px + var(--sp) * 15vh), 0)
    scale(calc(1.06 + var(--sp) * 0.08));
}

.layer-mask {
  transform: translate3d(calc(var(--px) * 10px), calc(var(--py) * 6px + var(--sp) * 6vh), 0)
    scale(1.04);
}

.layer-title {
  transform: translate3d(calc(var(--px) * 26px), calc(var(--py) * 16px - var(--sp) * 12vh), 0)
    rotateY(calc(var(--px) * 6deg)) rotateX(calc(var(--py) * -5deg));
  opacity: calc(1 - var(--sp) * 1.4);
  transform-style: preserve-3d;
}

.char {
  display: inline-block;
  text-shadow: $text-shadow-header;
  animation: char-in 1.1s cubic-bezier(0.2, 1.3, 0.35, 1) both;
  animation-delay: calc(0.35s + var(--i) * 55ms);

  &.space {
    width: 0.28em;
  }

  &.flicker {
    animation: char-in 1.1s cubic-bezier(0.2, 1.3, 0.35, 1) both, neon-flicker 7s 3s infinite;
    animation-delay: calc(0.35s + var(--i) * 55ms), 3s;
  }
}

// Tube powers on: a bright scan line opens into the full picture.
@keyframes crt-on {
  0% {
    transform: scale(1, 0.004);
    filter: brightness(4) saturate(0);
  }
  45% {
    transform: scale(1, 0.004);
    filter: brightness(4) saturate(0);
  }
  100% {
    transform: none;
    filter: none;
  }
}

// Letters fly in from depth; pink and blue shadows split wide, then lock into place.
@keyframes char-in {
  0% {
    opacity: 0;
    transform: translateZ(420px) translateY(-0.2em) scale(1.4);
    filter: blur(14px);
    text-shadow: 60px 0 20px $pink, -60px 0 20px $blue;
  }
  55% {
    opacity: 1;
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: none;
    filter: none;
    text-shadow: $text-shadow-header;
  }
}

// A neon tube that occasionally stutters.
@keyframes neon-flicker {
  0%,
  86%,
  89%,
  92%,
  100% {
    opacity: 1;
  }
  87%,
  91% {
    opacity: 0.35;
    text-shadow: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .box .main,
  .char,
  .char.flicker {
    animation: none;
  }
}
</style>
