export function createCanvas(
  width?: number,
  height?: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  if (width) canvas.width = width
  if (height) canvas.height = height
  return canvas
}

export function createCtx(): CanvasRenderingContext2D {
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  return ctx
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function drawNoSideEffect(ctx: CanvasRenderingContext2D) {
  return (cb: (ctx: CanvasRenderingContext2D) => void) => {
    ctx.save()
    cb(ctx)
    ctx.restore()
  }
}

export function drawAsEraser(ctx: CanvasRenderingContext2D, path: Path2D) {
  drawNoSideEffect(ctx)(ctx => {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fill(path)
  })
}

export function drawCanvasElement(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height)
}
