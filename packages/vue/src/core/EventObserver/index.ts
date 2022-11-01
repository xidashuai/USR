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
