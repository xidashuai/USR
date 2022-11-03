import _ from 'lodash'

export interface SnapshotOriginator<T = any> {
  snapshot(): T
  restore(snapshot: T): void
}

/**
 * 快照，支持undo/redo, 使用时记得在修改状态前创建快照
 */
export class SnapshotManager {
  readonly undoStack: SnapshotOriginator[] = []
  readonly redoStack: SnapshotOriginator[] = []
  readonly limit: number = 100

  readonly origin: SnapshotOriginator
  constructor(origin: SnapshotOriginator) {
    this.origin = origin
  }
  /**
   * 创建快照
   */
  addSnapshot() {
    if (this.undoStack.length > this.limit) {
      this.undoStack.shift()
    }
    const snapshot = this.origin.snapshot()
    this.undoStack.push(snapshot)
    this.redoStack.slice(0, this.redoStack.length)
  }

  /**
   * 撤销
   */
  undo() {
    const snapshot = this.undoStack.pop()
    if (snapshot) {
      this.redoStack.push(this.origin.snapshot())
      this.origin.restore(snapshot)
    }
  }

  /**
   * 重做
   */
  redo() {
    const snapshot = this.redoStack.pop()
    if (snapshot) {
      this.undoStack.push(this.origin.snapshot())
      this.origin.restore(snapshot)
    }
  }
}

/**函数实现，需重构 */
// export function snapshotManager(origin: SnapshotOriginator): SnapshotManager {
//   const undoStack: SnapshotOriginator[] = []
//   const redoStack: SnapshotOriginator[] = []
//   const limit = 100

//   function create() {
//     if (undoStack.length === limit) {
//       undoStack.shift()
//     }
//     const snapshot = origin.snapshot()
//     undoStack.push(snapshot)
//     redoStack.splice(0, redoStack.length)
//   }

//   function undo() {
//     const snapshot = undoStack.pop()
//     if (snapshot) {
//       redoStack.push(origin.snapshot())
//       origin.restore(snapshot)
//     }
//   }

//   function redo() {
//     const snapshot = redoStack.pop()
//     if (snapshot) {
//       undoStack.push(origin.snapshot())
//       origin.restore(snapshot)
//     }
//   }

//   return {
//     origin,
//     limit,
//     undoStack,
//     redoStack,
//     addSnapshot: create,
//     undo,
//     redo
//   }
// }

// function cloneDeep(obj) {
//   return Object.assign({}, obj)
// }
