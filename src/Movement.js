// @flow

import TextBuffer from './TextBuffer'
import Cursor from './Cursor'
import Scroll from './Scroll'
import Drawer from './Drawer'
import log from './logger'

export default class Movement {
  buffer: TextBuffer
  pos: Cursor
  scroll: Scroll
  drawer: Drawer
  width: number
  height: number

  constructor (
    buffer: TextBuffer,
    cursor: Cursor,
    scroll: Scroll,
    drawer: Drawer
  ) {
    this.buffer = buffer
    this.pos = cursor
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

    this.updateScroll()
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

    this.updateScroll()
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

    this.updateScroll()
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

    this.updateScroll()
    drawer.updateCursorPos()
    return this
  }

  updateScroll (noFullDraw?: true): this {
    const { pos, scroll, drawer } = this

    if (pos.y - scroll.top >= this.height) {
      scroll.top++
      if (!noFullDraw) drawer.fullDraw()

      log('scrollChangePlus', scroll.top)

    } else if (pos.y < scroll.top) {
      scroll.top--
      if (!noFullDraw) drawer.fullDraw()

      log('scrollChangeMinus', scroll.top)
    }

    return this
  }
}
