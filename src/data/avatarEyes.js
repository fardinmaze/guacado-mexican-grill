// Geometry of the Guacado avatar's eyes, in the coordinates of the ORIGINAL 1792 x 2400 artwork.
// The component draws an SVG with this viewBox over the picture: a patch that hides the painted
// iris, and an iris + pupil that move toward the cursor. Tune these numbers to re-fit the eyes.
export const AVATAR = {
  w: 1792,
  h: 2400,
  eyes: [
    // cx, cy, rx, ry = the visible opening (the clip); iris/pupil radii; travel = max shift of the iris centre
    { cx: 761, cy: 808, rx: 58, ry: 55, iris: 36, pupil: 22, glint: { x: -22, y: -19, r: 9 }, travel: { x: 20, y: 10 } },
    { cx: 958, cy: 789, rx: 74, ry: 61, iris: 41, pupil: 25, glint: { x: -23, y: -22, r: 11 }, travel: { x: 30, y: 15 } },
  ],
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/** Where an iris sits for a gaze vector (gx, gy each -1..1). */
export function irisCentre(eye, gx, gy) {
  return { x: eye.cx + clamp(gx, -1, 1) * eye.travel.x, y: eye.cy + clamp(gy, -1, 1) * eye.travel.y }
}
