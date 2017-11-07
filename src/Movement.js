// @flow

import TextBuffer from './TextBuffer'
import Cursor from './Cursor'
import Scroll from './Scroll'
import Drawer from './Drawer'

export default class Movement {
  pos: Cursor
  buffer: TextBuffer
  scroll: Scroll
  drawer: Drawer
  width: number
  height: number

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

  up (): this {
    const { pos, buffer, drawer } = this

    if (pos.y > 0) {
      pos.y--
      const row = buffer.getRow(pos.y)
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
      const row = buffer.getRow(pos.y)
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

    if (
      pos.x < this.width &&
      pos.x < buffer.getRow(pos.y).length
    ) {
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
