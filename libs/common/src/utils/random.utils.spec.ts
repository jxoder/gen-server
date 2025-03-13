import { RandomUtils } from './random.utils'

describe('RandomUtils', () => {
  it('RandomUtils.randomNumberBetween', () => {
    const r1 = RandomUtils.randomNumberBetween(100, 999)
    const r2 = RandomUtils.randomNumberBetween(100, 999)
    const r3 = RandomUtils.randomNumberBetween(100, 999)

    expect(r1).toBeGreaterThanOrEqual(100)
    expect(r1).toBeLessThanOrEqual(999)

    expect(r2).toBeGreaterThanOrEqual(100)
    expect(r2).toBeLessThanOrEqual(999)

    expect(r3).toBeGreaterThanOrEqual(100)
    expect(r3).toBeLessThanOrEqual(999)
  })

  it('RandomUtils.randomNumberDigits', () => {
    const r1 = RandomUtils.randomNumberDigits(6)
    const r2 = RandomUtils.randomNumberDigits(6)
    const r3 = RandomUtils.randomNumberDigits(7)

    expect(r1).toHaveLength(6)
    expect(r2).toHaveLength(6)
    expect(r3).toHaveLength(7)
  })

  it('RandomUtils.randomString', () => {
    const r1 = RandomUtils.randomString(6)
    const r2 = RandomUtils.randomString(6)
    const r3 = RandomUtils.randomString(7)

    expect(r1).toHaveLength(6)
    expect(r2).toHaveLength(6)
    expect(r3).toHaveLength(7)
  })
})
