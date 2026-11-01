import { describe, expect, it } from 'vitest'
import { PLAY_SHARE, clipTime, stepAt, tacoScroll } from '@/data/tacoScroll'

describe('tacoScroll', () => {
  const { steps, duration } = tacoScroll
  it('steps start at 0, increase, and fit inside the clip', () => {
    expect(steps[0].at).toBe(0)
    steps.forEach((s, i) => {
      if (i) expect(s.at).toBeGreaterThan(steps[i - 1].at)
      expect(s.at).toBeLessThan(duration)
    })
  })
  it('maps clip time to the playing step', () => {
    expect(stepAt(steps, 0)).toBe(0)
    expect(stepAt(steps, 1.4)).toBe(1)
    expect(stepAt(steps, 6.9)).toBe(5)
    expect(stepAt(steps, 9.95)).toBe(steps.length - 1)
  })
  it('every step has tags with a known tone', () => {
    steps.forEach((s) => {
      expect(s.tags.length).toBeGreaterThan(0)
      s.tags.forEach((g) => expect(['lime', 'chili', 'leaf', 'ink']).toContain(g.tone))
    })
  })
  it('scroll maps to the clip, then holds the last frame for the finale', () => {
    expect(clipTime(0, 10)).toBe(0)
    expect(clipTime(PLAY_SHARE, 10)).toBeCloseTo(9.95)
    expect(clipTime(1, 10)).toBeCloseTo(9.95)
    expect(clipTime(PLAY_SHARE / 2, 10)).toBeCloseTo(4.975)
  })
})
