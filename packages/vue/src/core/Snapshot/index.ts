import _ from 'lodash'

/**在改变状态之前应该记录快照 */
export interface SnapshotOriginator {
  restore(snapshot: any): void
}

/**
 * 快照，支持undo/redo
 */
export class SnapshotManager {
  readonly undoStack: SnapshotOriginator[] = []
  readonly redoStack: SnapshotOriginator[] = []
  readonly origin: SnapshotOriginator
  constructor(origin: SnapshotOriginator) {
    this.origin = origin
  }
  create() {
    const snapshot = _.cloneDeep(this.origin)
    this.undoStack.push(snapshot)
    this.redoStack.slice(0, this.redoStack.length)
  }
  undo() {
    const snapshot = this.undoStack.pop()
    if (snapshot) {
      this.redoStack.push(_.cloneDeep(this.origin))
      this.origin.restore(snapshot)
    }
  }
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

  function create() {
    const snapshot = _.cloneDeep(origin)
    undoStack.push(snapshot)
    redoStack.splice(0, redoStack.length)
  }

  function undo() {
    const snapshot = undoStack.pop()
    if (snapshot) {
      redoStack.push(_.cloneDeep(origin))
      origin.restore(snapshot)
    }
  }

  function redo() {
    const snapshot = redoStack.pop()
    if (snapshot) {
      undoStack.push(_.cloneDeep(origin))
      origin.restore(snapshot)
    }
  }

  return {
    origin,
    undoStack,
    redoStack,
    create,
    undo,
    redo,
  }
}
