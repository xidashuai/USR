import type { Vector2D } from './Vector'

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
}
