export function createCtx(): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 450
  const ctx = canvas.getContext('2d')
  return ctx!
}
