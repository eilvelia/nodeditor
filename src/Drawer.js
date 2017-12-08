// @flow

import readline from 'readline'
import log from './logger'

import type TextBuffer from './TextBuffer'
import type Cursor from './Cursor'
import type Scroll from './Scroll'

export default class Drawer {
  stdout: tty$WriteStream
  buffer: TextBuffer
  pos: Cursor
  scroll: Scroll

  width: number = 0
  height: number = 0

  constructor (
    stdout: tty$WriteStream,
    buffer: TextBuffer,
    cursor: Cursor,
    scroll: Scroll
  ) {
    this.stdout = stdout
    this.buffer = buffer
    this.pos = cursor
    this.scroll = scroll
  }

  updateSize (width?: number, height?: number): this {
    if (width) this.width = width
    if (height) this.height = height

    return this
  }

  updateBuffer (buffer: TextBuffer): this {
    this.buffer = buffer
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
    const { buffer, scroll, stdout } = this

    const row = buffer.getRow(y + scroll.top) || []

    const parsedRow = []

    for (let x = 0; x < this.width; x++) {
      parsedRow.push(row[x] || ' ')
    }

    this.cursorTo(0, y)

    stdout.write(parsedRow.join(''))

    return this
  }

  drawLineSmart (y: number): this {
    const { buffer, pos, scroll, stdout } = this

    const row = buffer.getRow(y)

    const start = pos.x > 0 ? pos.x - 1 : 0
    const end = row.length + 1

    const parsedRow = []

    for (let x = start; x < end; x++) {
      parsedRow.push(row[x] || ' ')
    }

    this.cursorTo(start, y - scroll.top)

    stdout.write(parsedRow.join(''))

    this.updateCursorPos()

    return this
  }

  updateScroll (noFullDraw?: true): this {
    const { pos, scroll } = this

    if (pos.y - scroll.top >= this.height) {
      scroll.top++
      if (!noFullDraw) this.fullDraw()

      log('scrollChangePlus', scroll.top)

    } else if (pos.y < scroll.top) {
      scroll.top--
      if (!noFullDraw) this.fullDraw()

      log('scrollChangeMinus', scroll.top)
    }

    return this
  }

  updateCursorPos (): this {
    const { pos, buffer, scroll } = this

    this.cursorTo(pos.x, pos.y - scroll.top)
    log(JSON.stringify(pos), JSON.stringify(buffer.toArray()))

    return this
  }

  cursorTo (x?: number, y?: number): this {
    readline.cursorTo(this.stdout, x, y)

    return this
  }
}
