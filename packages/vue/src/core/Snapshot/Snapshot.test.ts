import { test, expect } from 'vitest'

import { SnapshotOriginator, SnapshotManager, snapshotManager } from './index'

class TestSnapshot implements SnapshotOriginator {
  value: number = 0
  restore(snapshot: any): void {
    this.value = snapshot.value
  }
}

const testOrigin = new TestSnapshot()
const sm = snapshotManager(testOrigin)

test('add snapshot', () => {
  sm.create()
  testOrigin.value = 1

  sm.create()
  testOrigin.value = 2

  sm.create()
  testOrigin.value = 3

  expect(sm.undoStack).toEqual([{ value: 0 }, { value: 1 }, { value: 2 }])

  sm.undo()
  expect(sm.undoStack).toEqual([{ value: 0 }, { value: 1 }])
  expect(testOrigin.value).toBe(2)
  expect(sm.redoStack).toEqual([{ value: 3 }])

  sm.undo()
  expect(testOrigin.value).toBe(1)

  sm.redo()
  expect(testOrigin.value).toBe(2)

  sm.redo()
  expect(testOrigin.value).toBe(3)
})
