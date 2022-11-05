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
/**
 * 策略模式，更换canvas事件
 */
export class CanvasEvent {
  canvas: HTMLCanvasElement
  events: {
    [key in EventType]?: Set<EventListener<key>>
  } = {}

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  add(type: EventType, fn: EventListener<typeof type>) {
    this.getEventListener(type).add(fn)
    this.canvas.addEventListener(type, fn)
  }

  remove(type: EventType, fn: EventListener<typeof type>) {
    this.getEventListener(type).delete(fn)
    this.canvas.removeEventListener(type, fn)
  }

  getEventListener(type: EventType) {
    if (this.events[type]) {
      return this.events[type]
    }
    this.events[type] = new Set<EventListener<typeof type>>()
    return this.events[type]
  }

  /**
   * 确保click事件只有一个listener
   * @param fn
   */
  setClick(fn: MouseFN) {
    this.offClick()
    this.add('click', fn)
  }
  offClick() {
    this.getEventListener('click').forEach(l => {
      this.canvas.removeEventListener('click', l)
    })
    this.getEventListener('click').clear()
  }

  /**
   * 确保mousedown事件只有一个listener
   * @param fn
   */
  setMouseDown(fn: MouseFN) {
    this.offMouseDown()
    this.add('mousedown', fn)
  }
  offMouseDown() {
    this.getEventListener('mousedown').forEach(l => {
      this.canvas.removeEventListener('mousedown', l)
    })
    this.getEventListener('mousedown').clear()
  }
}
