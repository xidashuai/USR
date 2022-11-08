import { Brush } from './Brush'
import { Circle } from './Circle'
import { ImageBrush } from './ImageBrush'
import { Line } from './Line'
import { Oval } from './Oval'
import { Rectangle } from './Rectangle'

export function createShape(options) {
  switch (options.type) {
    case 'brush':
      return new Brush(options)
    case 'circle':
      return new Circle(options)
    case 'imageBrush':
      return new ImageBrush(options)
    case 'line':
      return new Line(options)
    case 'oval':
      return new Oval(options)
    case 'rectangle':
      return new Rectangle(options)
    default:
      break
  }
}
