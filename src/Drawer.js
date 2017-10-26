// @flow

import TextBuffer from './TextBuffer'
import Cursor from './Cursor'
import Scroll from './Scroll'
import { cursorTo } from './util'
import log from './logger'

export default class Drawer {
  buffer: TextBuffer
  pos: Cursor
  scroll: Scroll
  width: number
  height: number

  constructor (buffer: TextBuffer, cursor: Cursor, scroll: Scroll) {
    this.buffer = buffer
    this.pos = cursor
    this.scroll = scroll
  }

  updateSize (width?: number, height?: number): this {
    if (width) this.width = width
    if (height) this.height = height

    return this
  }

  fullDraw (): this {
    for (let y = 0; y < this.height; y++) {
      this.drawLine(y)
    }

    this.updateCursorPos()

    return this
  }

  drawLine (y: number): this {
    const { buffer, scroll } = this

    const row = buffer.getRow(y + scroll.top) || []

    const parsedRow = []

    for (let x = 0; x < this.width; x++) {
      parsedRow.push(row[x] || ' ')
    }

    cursorTo(0, y)

    process.stdout.write(parsedRow.join(''))

    return this
  }

  drawLineSmart (y: number): this {
    const { buffer, pos, scroll } = this

    const row = buffer.getRow(y)

    const start = pos.x > 0 ? pos.x - 1 : 0
    const end = row.length + 1

    const parsedRow = []

    for (let x = start; x < end; x++) {
      parsedRow.push(row[x] || ' ')
    }

    cursorTo(start, y - scroll.top)

    process.stdout.write(parsedRow.join(''))

    this.updateCursorPos()

    return this
  }

  updateCursorPos (): this {
    const { pos, buffer, scroll } = this

    cursorTo(pos.x, pos.y - scroll.top)
    log(JSON.stringify(pos), JSON.stringify(buffer.toArray()))

    return this
  }
}
