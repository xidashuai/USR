import { test, expect } from 'vitest'
import { WhiteBoard } from '.'

const wb = new WhiteBoard()
test('adsfkad', () => {
  wb.newPage()
  wb.newPage()
  wb.newPage()
  wb.newPage()

  expect(wb.pages.size).toBe(4)
  expect(wb.ids()).toEqual(['0', '1', '2', '3'])

  const page1 = wb.getPage('1')
  expect(page1).toBeDefined()

  const page2 = wb.getPage('999')
  expect(page2).not.toBeDefined()

  const page3 = wb.getCurrentPage()
  expect(page3)
})
