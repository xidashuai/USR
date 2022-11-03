import type { Vector2D } from './vector'

/**
 * 添加鼠标移动事件并在抬起时取消
 * @param moveFN
 */
export function moveUp(
  moveFN: {
    (e: MouseEvent): void
    (e: MouseEvent): void
    (e: MouseEvent): void
    (this: Window, ev: MouseEvent): any
    (this: Window, ev: MouseEvent): any
  },
  callback?: () => void
): void {
  window.addEventListener('mousemove', moveFN)
  window.addEventListener(
    'mouseup',
    () => {
      window.removeEventListener('mousemove', moveFN)
      if (callback) {
        callback()
      }
    },
    { once: true }
  )
}

/**
 * 计算鼠标与canvas的相对位置
 * @param e
 * @param canvas
 * @returns
 */
export function calcMousePos(
  e: MouseEvent,
  canvas: HTMLCanvasElement
): Vector2D {
  const rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  }
}

/**
 * 节流
 * @param callback
 * @param interval
 * @returns
 */
function throttle(callback: (...args: any[]) => any, interval: number) {
  let enableCall = true

  return function (...args: any[]) {
    if (!enableCall) return

    enableCall = false
    callback.apply(this, args)
    setTimeout(() => (enableCall = true), interval)
  }
}
