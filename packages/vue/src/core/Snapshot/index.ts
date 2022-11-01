/**
 * @todo 快照，支持undo/redo
 */
abstract class Snapshot {
  snapshots = []
  undo() {}
  redo() {}
}
