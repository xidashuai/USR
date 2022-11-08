import type { RectBounding, Vector2D } from '../utils/Vector'

export * from './createShape'

export * from './Line'
export * from './Circle'
export * from './Rectangle'
export * from './Oval'
export * from './Brush'
export * from './ImageBrush'

export interface ShapeOptions {
  fillStyle?: string
  strokeStyle?: string
  pos?: Vector2D
}

export interface Shape extends ShapeOptions {
  draw(ctx: CanvasRenderingContext2D): void
  isInnerPos(pos: Vector2D): boolean
  isInArea(area: RectBounding): boolean
  move(x: number, y: number): void
  getRectBounding(): RectBounding
}

export interface CircleOptions extends ShapeOptions {
  radius?: number
}

export interface LineOptions extends ShapeOptions {
  begin?: Vector2D
  end?: Vector2D
}

export interface RectangleOptions extends ShapeOptions {
  w?: number
  h?: number
}

export interface OvalOptions extends ShapeOptions {
  radiusX?: number
  radiusY?: number
  rotation?: number
  startAngle?: number
  endAngle?: number
  counterclockwise?: boolean
}

export interface CurveOptions extends LineOptions {}

export interface BrushOptions extends ShapeOptions, CurveOptions {
  vectors?: Vector2D[]
}
