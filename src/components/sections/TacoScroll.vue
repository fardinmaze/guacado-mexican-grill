<script setup>
import { computed, ref } from 'vue'
import { site } from '@/data/site'
import { stepAt, tacoScroll } from '@/data/tacoScroll'
import { useMotion } from '@/composables/useMotion'
import BaseButton from '@/components/ui/BaseButton.vue'

// Same idea as the Mojito reference: scrolling scrubs a video's currentTime. The clip is encoded with
// every frame a keyframe (ffmpeg -g 1) so seeking is instant. The section is tall with a CSS-sticky
// stage; no reduced motion / no JS: normal height, the finished taco (poster) and the full step list.
const { src, poster, steps } = tacoScroll
const root = ref(null)
const video = ref(null)
const live = ref(false)
const active = ref(steps.length - 1)
const done = computed(() => active.value === steps.length - 1)

useMotion(root, ({ gsap, ScrollTrigger: ST, root: el }) => {
  const v = video.value
  live.value = true
  active.value = 0

  let dur = tacoScroll.duration
  let target = 0
  let cur = 0
  const onMeta = () => {
    dur = v.duration || dur
    // iOS only decodes seeks once the element has been "played" once.
    v.play?.().then(() => v.pause()).catch(() => {})
  }
  if (v.readyState >= 1) onMeta()
  else v.addEventListener('loadedmetadata', onMeta, { once: true })

  const st = ST.create({
    trigger: el,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      target = self.progress * (dur - 0.05)
      active.value = stepAt(steps, target)
    },
  })

  // Ease toward the scroll position; only seek once the previous seek has landed.
  const tick = () => {
    cur += (target - cur) * 0.2
    if (Math.abs(target - cur) < 0.004) cur = target
    if (!v.seeking && Math.abs(v.currentTime - cur) > 0.015) v.currentTime = cur
  }
  gsap.ticker.add(tick)

  // The tall height is applied on the next render; re-measure.
  requestAnimationFrame(() => ST.refresh())

  return () => {
    gsap.ticker.remove(tick)
    v.removeEventListener('loadedmetadata', onMeta)
    st.kill()
    live.value = false
    active.value = steps.length - 1
  }
})
</script>

<template>
  <section
    id="taco"
    ref="root"
    class="taco"
    :class="{ 'is-live': live }"
    :style="{ '--n': steps.length }"
    aria-label="How a taco is made"
  >
    <div class="pin">
      <div class="wrap pin__in">
        <header class="head">
          <p class="eyebrow">Made in front of you</p>
          <h2 class="h-sec">Layer by layer</h2>
        </header>

        <div class="grid">
          <ol class="rail" aria-label="Steps">
            <li v-for="(s, i) in steps" :key="s.name" :class="{ on: i === active, past: i < active }" :aria-current="i === active ? 'step' : undefined">
              <span class="rail__n" aria-hidden="true">{{ i + 1 }}</span>{{ s.name }}
            </li>
          </ol>

          <div class="stage">
            <video ref="video" class="clip" :src="src" :poster="poster" muted playsinline preload="auto" disablepictureinpicture aria-label="A taco being built layer by layer" />
          </div>

          <div class="cap" aria-live="polite">
            <p class="cap__step">Step {{ active + 1 }} of {{ steps.length }}</p>
            <p class="cap__name">{{ steps[active].name }}</p>
            <p class="cap__note">{{ steps[active].note }}</p>
            <div v-if="done" class="cap__cta">
              <BaseButton to="/menu" variant="lime">SEE THE MENU</BaseButton>
              <BaseButton :href="site.orderUrl" variant="ghost">ORDER ONLINE</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.taco { background: var(--ground); }
.pin { padding-block: clamp(40px, 6vw, 88px); }
.head { display: grid; gap: 6px; text-align: center; justify-items: center; margin-bottom: 8px; }
.head .h-sec { font-size: clamp(32px, 6vw, 64px); }
.grid { display: grid; gap: 8px; justify-items: center; }

/* Black footage melts into the near-black ground: screen blend + a soft edge. */
.stage { width: min(100%, 880px); aspect-ratio: 16 / 9; }
.clip {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  mix-blend-mode: screen;
  -webkit-mask-image: radial-gradient(closest-side, #000 72%, transparent 100%);
  mask-image: radial-gradient(closest-side, #000 72%, transparent 100%);
  pointer-events: none;
}

.cap { text-align: center; display: grid; gap: 4px; justify-items: center; min-height: 150px; }
.cap__step { font: 400 16px/1 var(--f-cond); letter-spacing: 3px; text-transform: uppercase; color: var(--accent-text); }
.cap__name { font: 400 clamp(28px, 5vw, 44px)/1.05 var(--f-display); text-transform: uppercase; }
.cap__note { color: var(--ink-muted); max-width: 40ch; }
.cap__cta { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 12px; }

.rail { display: none; list-style: none; margin: 0; padding: 0; }
.rail li { display: flex; align-items: center; gap: 12px; padding: 8px 0; font: 400 20px/1 var(--f-cond); letter-spacing: 2px; text-transform: uppercase; color: var(--ink-muted); transition: color 0.2s; }
.rail__n { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid var(--line); display: grid; place-items: center; font-size: 15px; letter-spacing: 0; transition: background 0.2s, border-color 0.2s, color 0.2s; }
.rail li.past { color: var(--ink); }
.rail li.past .rail__n { border-color: var(--leaf); color: var(--leaf); }
.rail li.on { color: var(--lime); }
.rail li.on .rail__n { background: var(--lime); border-color: var(--lime); color: var(--on-lime); }

@media (min-width: 960px) {
  .grid { grid-template-columns: 200px minmax(0, 1fr) 200px; align-items: center; }
  .rail { display: block; }
  .cap { grid-column: 1 / -1; }
}

/* Live: tall track + sticky stage. */
.taco.is-live { height: calc(var(--n) * 55vh + 100vh); }
.taco.is-live .pin { position: sticky; top: 0; height: 100vh; height: 100svh; padding-block: 84px 20px; overflow: hidden; display: flex; }
.taco.is-live .pin__in { width: 100%; align-self: center; }
.taco.is-live .stage { width: min(100%, 880px, calc((100svh - 330px) * 16 / 9)); }
@media (max-width: 959px) {
  .taco.is-live .head .h-sec { font-size: 30px; }
  .taco.is-live .cap { min-height: 120px; }
  .taco.is-live .cap__note { display: none; }
}
</style>
