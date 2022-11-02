import _ from 'lodash'

export interface SnapshotOriginator {
  restore(snapshot: any): void
}

/**
 * 快照，支持undo/redo, 使用时记得在修改状态前创建快照
 */
export class SnapshotManager {
  readonly undoStack: SnapshotOriginator[] = []
  readonly redoStack: SnapshotOriginator[] = []
  readonly origin: SnapshotOriginator
  readonly limit: number = 100
  constructor(origin: SnapshotOriginator) {
    this.origin = origin
    ;(window as any).sm = this
  }
  /**
   * 创建快照
   */
  create() {
    if (this.undoStack.length > this.limit) {
      this.undoStack.shift()
    }
    const snapshot = _.cloneDeep(this.origin)
    this.undoStack.push(snapshot)
    this.redoStack.slice(0, this.redoStack.length)
  }

  /**
   * 撤销
   */
  undo() {
    const snapshot = this.undoStack.pop()
    console.log(snapshot)

    if (snapshot) {
      this.redoStack.push(_.cloneDeep(this.origin))
      this.origin.restore(snapshot)
    }
  }

  /**
   * 重做
   */
  redo() {
    const snapshot = this.redoStack.pop()
    if (snapshot) {
      this.undoStack.push(_.cloneDeep(this.origin))
      this.origin.restore(snapshot)
    }
  }
}

/**函数实现，需重构 */
export function snapshotManager(origin: SnapshotOriginator): SnapshotManager {
  const undoStack: SnapshotOriginator[] = []
  const redoStack: SnapshotOriginator[] = []
  const limit = 100

  function create() {
    if (undoStack.length === limit) {
      undoStack.shift()
    }
    const snapshot = cloneDeep(origin)
    undoStack.push(snapshot)
    redoStack.splice(0, redoStack.length)
  }

  function undo() {
    const snapshot = undoStack.pop()
    if (snapshot) {
      redoStack.push(cloneDeep(origin))
      origin.restore(snapshot)
    }
  }

  function redo() {
    const snapshot = redoStack.pop()
    if (snapshot) {
      undoStack.push(cloneDeep(origin))
      origin.restore(snapshot)
    }
  }

  return {
    origin,
    limit,
    undoStack,
    redoStack,
    create,
    undo,
    redo,
  }
}

function cloneDeep(obj) {
  return Object.assign({}, obj)
}
