import _ from 'lodash'
import type { Shape } from './Shapes'
import { createCanvas } from './utils/Canvas'
import { WhiteBoardPage } from './WhiteBoardPage'

export class WhiteBoard {
  // pages: Map<string, WhiteBoardPage> = new Map()
  // pages: WhiteBoardPage[] = []
  pages = new Object()
  defaultWidth = 1206
  defaultHeight = 800

  currentPageName

  // pageNumber() {
  //   return this.pages.length
  // }

  constructor() {
    this.newPage('default')
  }

  newPage(pagename: string) {
    const canvas = createCanvas(this.defaultWidth, this.defaultHeight)
    canvas.classList.add('canvas')
    canvas.setAttribute(
      'style',
      `
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: ${this.defaultWidth}px;
      height: ${this.defaultHeight}px;
      background:white;
    `
    )
    const page = new WhiteBoardPage(canvas)
    this.pages[pagename] = page
    this.currentPageName = pagename
    return page
  }

  deletePage(pagename: string): void {
    delete this.pages[pagename]
  }

  getPage(pagename: string) {
    return this.pages[pagename]
  }

  getCurrentPage() {
    return this.pages[this.currentPageName] as WhiteBoardPage
  }

  import(data) {
    const _data = JSON.parse(data)
    for (const [key, value] of Object.entries(_data)) {
      if (this.pages[key]) {
        this.pages[key].layer.import(value)
      } else {
        const page = this.newPage(key)
        page.layer.import(value as any)
      }
    }
  }

  export() {
    // return this.pages.map(page => page.layer.export())

    const result = new Object()
    for (const [key, value] of Object.entries(this.pages)) {
      result[key] = value.layer.export()
    }
    return JSON.stringify(result)
  }
}

let id = 0

function newID() {
  return id++
}
