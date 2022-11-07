import type { RectBounding, Vector2D } from './Vector'

export default class Path {
  static newPath(fn: (path: Path2D) => void): Path2D {
    const path = new Path2D()
    fn(path)
    return path
  }

  static circle(pos: Vector2D, radius: number): Path2D {
    return this.newPath(path => {
      path.arc(pos.x, pos.y, radius, 0, 2 * Math.PI)
      path.closePath()
    })
  }

  static rectangle(pos: Vector2D, w: number, h: number): Path2D {
    return this.newPath(path => {
      path.rect(pos.x, pos.y, w, h)
      path.closePath()
    })
  }

  static oval(pos: Vector2D, radiusX: number, radiusY: number): Path2D {
    return this.newPath(path => {
      path.ellipse(pos.x, pos.y, radiusX, radiusY, 0, 0, 2 * Math.PI)
      path.closePath()
    })
  }

  static line(begin: Vector2D, end: Vector2D): Path2D {
    return this.newPath(path => {
      path.moveTo(begin.x, begin.y)
      path.lineTo(end.x, end.y)
    })
  }

  static rectBounding(_rectBounding: RectBounding) {
    const { left, top, width, height, right, bottom } = _rectBounding
    return this.newPath(path => {
      path.rect(left, top, width, height)
      path.closePath()

      const ltCircle = new Path2D()
      ltCircle.arc(left, top, 6, 0, 2 * Math.PI)
      ltCircle.closePath()

      const rtCircle = new Path2D()
      rtCircle.arc(right, top, 6, 0, 2 * Math.PI)
      rtCircle.closePath()

      const rbCircle = new Path2D()
      rbCircle.arc(right, bottom, 6, 0, 2 * Math.PI)
      rbCircle.closePath()

      const lbCircle = new Path2D()
      lbCircle.arc(left, bottom, 6, 0, 2 * Math.PI)
      lbCircle.closePath()

      const ax = left + width / 2
      const ay = top - 30
      const topCircle = new Path2D()
      topCircle.arc(ax, ay, 6, 0, 2 * Math.PI)
      topCircle.closePath()

      const topLine = new Path2D()
      topLine.moveTo(ax, ay)
      topLine.lineTo(ax, top)

      path.addPath(ltCircle)
      path.addPath(rtCircle)
      path.addPath(rbCircle)
      path.addPath(lbCircle)
      path.addPath(topCircle)
      path.addPath(topLine)
    })
  }
}
