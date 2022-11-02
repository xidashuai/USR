import { test, expect } from 'vitest'

function throttle(callback: (...args: any[]) => any, interval: number) {
  let enableCall = true

  return function (...args: any[]) {
    if (!enableCall) return

    enableCall = false
    callback.apply(this, args)
    setTimeout(() => (enableCall = true), interval)
  }
}

test('', () => {
  throttle(() => {}, 200)
  expect(1).toBe(1)
})
