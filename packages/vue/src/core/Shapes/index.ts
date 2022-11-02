export interface Shape {
  fill?: string
  draw(ctx: CanvasRenderingContext2D): void
}
