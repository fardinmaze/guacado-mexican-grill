// Scroll-scrubbed "taco being made" video (components/sections/TacoScroll.vue).
// `at` = the second of the clip where each step starts (the clip is 10 s). Edit to re-time a step.
// `tags` are the little stickers shown with the step; `tone` picks their colour.
// The wording describes what the footage shows; it is not a recipe or menu claim.
export const tacoScroll = {
  src: '/media/taco-build.mp4',
  poster: '/media/taco-poster.jpg',
  duration: 10,
  steps: [
    { at: 0, name: 'The shell', note: 'It all starts with a warm, golden tortilla.', tags: [{ t: 'Golden', tone: 'lime' }, { t: 'Warm', tone: 'chili' }] },
    { at: 1, name: 'Grilled chicken', note: 'Fresh off the flat-top, still sizzling.', tags: [{ t: 'Sizzling', tone: 'chili' }, { t: 'Grilled', tone: 'ink' }] },
    { at: 2, name: 'Crisp lettuce', note: 'A fresh crunch, shredded to order.', tags: [{ t: 'Fresh', tone: 'leaf' }, { t: 'Crunchy', tone: 'ink' }] },
    { at: 3, name: 'Tomato', note: 'Diced and bright.', tags: [{ t: 'Diced', tone: 'chili' }, { t: 'Bright', tone: 'lime' }] },
    { at: 4, name: 'Onion & cilantro', note: 'The fresh finish.', tags: [{ t: 'Finishing touch', tone: 'leaf' }, { t: 'Fresh', tone: 'ink' }] },
    { at: 5, name: 'Shredded cheese', note: 'A generous snowfall.', tags: [{ t: 'Shredded', tone: 'lime' }, { t: 'Melty', tone: 'chili' }] },
    { at: 7, name: 'Sauce', note: 'Creamy, then a drizzle of red.', tags: [{ t: 'Creamy', tone: 'ink' }, { t: 'Drizzled', tone: 'chili' }] },
    { at: 8, name: 'Folded & ready', note: 'Fold it, grab it, eat it.', tags: [{ t: 'Made fresh', tone: 'lime' }, { t: 'Ready!', tone: 'chili' }] },
  ],
}

/** Index of the step playing at clip time `t` (seconds). */
export function stepAt(steps, t) {
  let idx = 0
  steps.forEach((s, i) => {
    if (t >= s.at) idx = i
  })
  return idx
}

/** Share of the scroll spent on the clip; the rest holds the last frame so the finale can play. */
export const PLAY_SHARE = 0.9

/** Scroll progress (0..1) -> clip time in seconds. */
export const clipTime = (progress, duration) => Math.min(1, progress / PLAY_SHARE) * (duration - 0.05)
