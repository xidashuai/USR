import { Brush } from './Brush'
import { Circle } from './Circle'
import { ImageBrush } from './ImageBrush'
import { Line } from './Line'
import { Ellipes } from './Ellipes'
import { Rectangle } from './Rectangle'
import type { ShapeMap, ShapeOptionMap } from '.'

export function createShape<K extends keyof ShapeMap>(
  options: ShapeOptionMap[K]
): ShapeMap[K] {
  switch (options.type) {
    case 'brush':
      return new Brush(options) as ShapeMap[K]
    case 'circle':
      return new Circle(options) as ShapeMap[K]
    case 'imageBrush':
      return new ImageBrush(options) as ShapeMap[K]
    case 'line':
      return new Line(options) as ShapeMap[K]
    case 'ellipes':
      return new Ellipes(options) as ShapeMap[K]
    case 'rectangle':
      return new Rectangle(options) as ShapeMap[K]
    default:
      break
  }
}
