import _ from 'lodash'
export interface SnapshotOriginator {
  restore(snapshot: any): void
}
/**
 * @todo 快照，支持undo/redo
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
      console.table(this.origin)
      this.redoStack.push(this.origin)
      this.origin.restore(snapshot)
    }
  }
  redo() {
    const snapshot = this.redoStack.pop()
    if (snapshot) {
      this.undoStack.push(this.origin)
      this.origin.restore(snapshot)
    }
  }
}

export function snapshotManager(origin: SnapshotOriginator) {
  const undoStack: SnapshotOriginator[] = []
  const redoStack: SnapshotOriginator[] = []
  const _origin: SnapshotOriginator = origin

  function create() {
    const snapshot = _.cloneDeep(_origin)
    undoStack.push(snapshot)
    redoStack.splice(0, redoStack.length)
  }

  function undo() {
    const snapshot = undoStack.pop()
    if (snapshot) {
      console.table(_origin)
      redoStack.push(_origin)
      console.log(redoStack)

      _origin.restore(snapshot)
    }
  }

  function redo() {
    const snapshot = redoStack.pop()
    if (snapshot) {
      undoStack.push(_origin)
      _origin.restore(snapshot)
    }
  }

  return {
    undoStack,
    redoStack,
    create,
    undo,
    redo,
  }
}
