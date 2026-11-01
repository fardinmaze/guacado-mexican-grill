// Scroll-scrubbed "taco being made" video (components/sections/TacoScroll.vue).
// `at` = the second of the clip where each step starts (the clip is 10 s). Edit to re-time a step.
// The wording describes what the footage shows; it is not a recipe or menu claim.
export const tacoScroll = {
  src: '/media/taco-build.mp4',
  poster: '/media/taco-poster.jpg',
  duration: 10,
  steps: [
    { at: 0, name: 'The shell', note: 'It all starts with a warm, golden tortilla.' },
    { at: 1, name: 'Grilled chicken', note: 'Fresh off the flat-top, still sizzling.' },
    { at: 2, name: 'Crisp lettuce', note: 'A fresh crunch, shredded to order.' },
    { at: 3, name: 'Tomato', note: 'Diced and bright.' },
    { at: 4, name: 'Onion & cilantro', note: 'The fresh finish.' },
    { at: 5, name: 'Shredded cheese', note: 'A generous snowfall.' },
    { at: 7, name: 'Sauce', note: 'Creamy, then a drizzle of red.' },
    { at: 8, name: 'Folded & ready', note: 'Fold it, grab it, eat it.' },
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
