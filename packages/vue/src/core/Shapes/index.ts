import type OffscreenCanvas from '../utils/OffscreenCanvas'
import type { RectBounding, Vector2D } from '../utils/Vector'
import type { Brush } from './Brush'
import type { Circle } from './Circle'
import type { Ellipes } from './Ellipes'
import type { ImageBrush } from './ImageBrush'
import type { Line } from './Line'
import type { Rectangle } from './Rectangle'

export * from './createShape'

export * from './Line'
export * from './Circle'
export * from './Rectangle'
export * from './Ellipes'
export * from './Brush'
export * from './ImageBrush'

export interface ShapeMap {
  brush: Brush
  circle: Circle
  ellipes: Ellipes
  imageBrush: ImageBrush
  line: Line
  rectangle: Rectangle
}

export type ShapeUnion =
  | Brush
  | Circle
  | Ellipes
  | ImageBrush
  | Line
  | Rectangle

export interface ShapeOptionMap {
  brush: BrushOptions
  circle: CircleOptions
  ellipes: EllipesOptions
  imageBrush: ImageBrushOptions
  line: LineOptions
  rectangle: RectangleOptions
}

export type ShapeOptionsUnion =
  | BrushOptions
  | CircleOptions
  | EllipesOptions
  | ImageBrushOptions
  | LineOptions
  | RectangleOptions

export type CtxSetting = {
  [key in keyof CanvasRenderingContext2D]?: any
}

export interface ShapeOptions {
  type: string
  pos?: Vector2D
  ctxSetting?: CtxSetting
}

export interface Shape {
  draw(ctx: CanvasRenderingContext2D): void
  isInnerPos(pos: Vector2D): boolean
  isInArea(area: RectBounding): boolean
  move(x: number, y: number): void
  getRectBounding(): RectBounding
}

export interface CircleOptions extends ShapeOptions {
  type: 'circle'
  radius?: number
  startAngle?: number
  endAngle?: number
  counterclockwise?: boolean
}

export interface LineOptions extends ShapeOptions {
  type: 'line'
  begin?: Vector2D
  end?: Vector2D
}

export interface RectangleOptions extends ShapeOptions {
  type: 'rectangle'
  w?: number
  h?: number
}

export interface EllipesOptions extends ShapeOptions {
  type: 'ellipes'
  radiusX?: number
  radiusY?: number
  rotation?: number
  startAngle?: number
  endAngle?: number
  counterclockwise?: boolean
}

export interface BrushOptions extends ShapeOptions {
  type: 'brush'
  vectors?: Vector2D[]
}

export interface ImageOptions extends ShapeOptions {
  type: 'image'
}

export interface ImageBrushOptions extends ShapeOptions {
  type: 'imageBrush'
  offScreenCanvas?: OffscreenCanvas
  cache?: HTMLCanvasElement
  cacheCtx?: CanvasRenderingContext2D
}
