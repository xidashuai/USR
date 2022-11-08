import { test, expect } from 'vitest'
import { WhiteBoard } from './WhiteBoard'

const wb = new WhiteBoard()
test('White Board', () => {
  // 默认创建
  expect(wb.pages.length).toBe(1)

  wb.newPage()
  wb.newPage()
  wb.newPage()
  wb.newPage()

  expect(wb.pages.length).toBe(5)

  const page1 = wb.getPage(1)
  expect(page1).toBeDefined()

  const page2 = wb.getPage(999)
  expect(page2).not.toBeDefined()

  const page3 = wb.getCurrentPage()
  expect(page3)
})

const tdd = [
  [
    {
      type: 'rectangle',
      pos: {
        x: 362.5,
        y: 190.5
      },
      w: 76,
      h: 81
    },
    {
      type: 'rectangle',
      pos: {
        x: 392.5,
        y: 364.5
      },
      w: 128,
      h: 100
    },
    {
      type: 'rectangle',
      pos: {
        x: 685.5,
        y: 369.5
      },
      w: 169,
      h: 88
    },
    {
      type: 'rectangle',
      pos: {
        x: 741.5,
        y: 273.5
      },
      w: 105,
      h: 55
    }
  ],
  [
    {
      type: 'rectangle',
      pos: {
        x: 351.5,
        y: 124.5
      },
      w: 93,
      h: 60
    },
    {
      type: 'rectangle',
      pos: {
        x: 559.5,
        y: 304.5
      },
      w: 87,
      h: 157
    },
    {
      type: 'rectangle',
      pos: {
        x: 432.5,
        y: 566.5
      },
      w: 66,
      h: 150
    },
    {
      type: 'rectangle',
      pos: {
        x: 658.5,
        y: 764.5
      },
      w: 80,
      h: 28
    },
    {
      type: 'rectangle',
      pos: {
        x: 765.5,
        y: 270.5
      },
      w: 27,
      h: -8
    },
    {
      type: 'rectangle',
      pos: {
        x: 753.5,
        y: 129.5
      },
      w: 45,
      h: 20
    },
    {
      type: 'rectangle',
      pos: {
        x: 351.5,
        y: 260.5
      },
      w: 50,
      h: 71
    },
    {
      type: 'rectangle',
      pos: {
        x: 327.5,
        y: 389.5
      },
      w: 123,
      h: 69
    },
    {
      type: 'rectangle',
      pos: {
        x: 621.5,
        y: 490.5
      },
      w: 103,
      h: 75
    },
    {
      type: 'rectangle',
      pos: {
        x: 735.5,
        y: 572.5
      },
      w: 39,
      h: 27
    }
  ]
]
