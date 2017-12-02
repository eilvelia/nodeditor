// @flow

import type TextBuffer from './TextBuffer'
import type Cursor from './Cursor'
import type Scroll from './Scroll'
import type Drawer from './Drawer'
import type { Char } from './Char'

export default class Movement {
  pos: Cursor
  buffer: TextBuffer
  scroll: Scroll
  drawer: Drawer

  width: number = 0
  height: number = 0

  constructor (
    cursor: Cursor,
    buffer: TextBuffer,
    scroll: Scroll,
    drawer: Drawer
  ) {
    this.pos = cursor
    this.buffer = buffer
    this.scroll = scroll
    this.drawer = drawer
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

  up (): this {
    const { pos, buffer, drawer } = this

    if (pos.y > 0) {
      pos.y--
      const row: Char[] = buffer.getRow(pos.y)
      pos.x = row[pos.x] ? pos.x : row.length
    } else {
      pos.x = 0
    }

    drawer.updateScroll()
    drawer.updateCursorPos()

    return this
  }

  down (): this {
    const { pos, buffer, drawer } = this

    if (buffer.getRow(pos.y+1)) {
      pos.y++
      const row: Char[] = buffer.getRow(pos.y)
      pos.x = row[pos.x] ? pos.x : row.length
    } else {
      pos.x = buffer.getRow(pos.y).length
    }

    drawer.updateScroll()
    drawer.updateCursorPos()

    return this
  }

  left (): this {
    const { pos, buffer, drawer } = this

    if (pos.x > 0) pos.x--
    else if (pos.y > 0) {
      pos.y--
      pos.x = buffer.getRow(pos.y).length
    }

    drawer.updateScroll()
    drawer.updateCursorPos()

    return this
  }

  right (): this {
    const { pos, buffer, drawer } = this

    if (pos.x < this.width && pos.x < buffer.getRow(pos.y).length) {
      pos.x++
    } else if (buffer.getRow(pos.y+1)) {
      pos.y++
      pos.x = 0
    }

    drawer.updateScroll()
    drawer.updateCursorPos()

    return this
  }
}
