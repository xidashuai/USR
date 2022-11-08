import { createCanvas } from './utils/Canvas'
import { WhiteBoardPage } from './WhiteBoardPage'

export class WhiteBoard {
  // pages: Map<string, WhiteBoardPage> = new Map()
  pages: WhiteBoardPage[] = []
  defaultWidth = 1206
  defaultHeight = 800

  currentIndex: number = 0

  constructor() {
    this.newPage()
  }

  newPage() {
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
    this.pages.push(page)
    return page
  }

  deletePage(index: number): void {
    this.pages.splice(index, 1)
  }

  getPage(index: number) {
    return this.pages[index]
  }

  getCurrentPage() {
    return this.pages[this.currentIndex]
  }

  import() {}

  export() {
    return this.pages.map(page => page.layer.shapes)
  }
}

let id = 0
function newID() {
  return id++
}
