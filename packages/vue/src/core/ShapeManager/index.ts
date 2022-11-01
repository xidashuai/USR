import type { IShape } from '@/core/Shapes'

/**
 * 管理一个画布中的所有形状
 */
abstract class ShapeManager {
  static shapes: IShape[] = []
  static push(shape: IShape) {
    this.shapes.push(shape)
  }
  static pop() {
    return this.shapes.pop()
  }
  static remove(shape: IShape) {
    this.shapes = this.shapes.filter(s => s !== shape)
  }
  /**
   * 绘制所有形状
   */
  static drawShapes() {
    this.shapes.forEach(shape => {
      shape.draw()
    })
  }
}
