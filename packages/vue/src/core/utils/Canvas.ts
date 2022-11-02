export function createCanvas(): HTMLCanvasElement {
  return document.createElement('canvas')
}

export function createCtx(): CanvasRenderingContext2D {
  const canvas = createCanvas()
  canvas.width = 800
  canvas.height = 450
  const ctx = canvas.getContext('2d')
  return ctx!
}
