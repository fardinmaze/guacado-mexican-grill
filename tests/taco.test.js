import { describe, expect, it } from 'vitest'
import { stepAt, tacoScroll } from '@/data/tacoScroll'

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
})
