import type { Vector2D } from './Vector'

export default class Path {
  private static newPath(fn: (path: Path2D) => void) {
    const path = new Path2D()
    fn(path)
    path.closePath()
    return path
  }

  static circle(pos: Vector2D, radius: number) {
    return this.newPath(path => {
      path.arc(pos.x, pos.y, radius, 0, 2 * Math.PI)
    })
  }

  static rectangle(pos: Vector2D, w: number, h: number) {
    return this.newPath(path => {
      path.rect(pos.x, pos.y, w, h)
    })
  }

  static oval(pos: Vector2D, radiusX, radiusY) {
    return this.newPath(path => {
      path.ellipse(pos.x, pos.y, radiusX, radiusY, 0, 0, 2 * Math.PI)
    })
  }

  static line(begin: Vector2D, end: Vector2D) {
    return this.newPath(path => {
      path.moveTo(begin.x, begin.y)
      path.lineTo(end.x, end.y)
    })
  }
}
