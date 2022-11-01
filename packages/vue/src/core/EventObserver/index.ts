type AnyFunction = (...args: any[]) => any
/**
 * 观察者模式，管理事件
 */
export default class EventObserver {
  events = []
  /**
   * 注册事件
   */
  on(event: string, listener: AnyFunction): void {}
  /**
   * 取消事件
   */
  off(event: string, listener?: AnyFunction): void {}
  /**
   * 执行事件
   */
  emit(event: string): void {}
}

type MouseFN = (this: GlobalEventHandlers, ev: MouseEvent) => any
type EventType = keyof HTMLElementEventMap
interface EventListener<T extends EventType> {
  (this: HTMLCanvasElement, ev: HTMLElementEventMap[T]): any
}
export class CanvasEvent {
  canvas: HTMLCanvasElement
  events: {
    [key in EventType]?: Set<EventListener<key>>
  } = {}
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }
  add(type: EventType, fn: EventListener<typeof type>) {
    this.getType(type).add(fn)
    this.canvas.addEventListener(type, fn)
  }
  remove(type: EventType, fn: EventListener<typeof type>) {
    this.getType(type).delete(fn)
    this.canvas.removeEventListener(type, fn)
  }
  getType(type: EventType) {
    if (this.events[type]) {
      return this.events[type]
    }
    this.events[type] = new Set<EventListener<typeof type>>()
    return this.events[type]
  }
  click(fn: MouseFN) {
    this.add('click', fn)
  }
  offClick() {
    this.getType('click').forEach(l => {
      this.canvas.removeEventListener('click', l)
    })
    this.getType('click').clear()
  }
  mouseDown(fn: MouseFN) {
    this.add('mousedown', fn)
  }
  offMouseDown() {
    this.getType('mousedown').forEach(l => {
      this.canvas.removeEventListener('mousedown', l)
    })
    this.getType('mousedown').clear()
  }
}
