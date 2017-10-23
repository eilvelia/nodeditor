// @flow

import TextBuffer from './TextBuffer'
import Cursor from './Cursor'

export default class Movement {
  buffer: TextBuffer
  pos: Cursor
  width: number
  height: number

  constructor (buffer: TextBuffer, cursor: Cursor) {
    this.buffer = buffer
    this.pos = cursor
  }

  updateSize (width?: number, height?: number) {
    if (width) this.width = width
    if (height) this.height = height
  }

  up () {
    if (this.pos.y > 0) {
      this.pos.y--
      const row = this.buffer.getRow(this.pos.y)
      this.pos.x = row[this.pos.x] ? this.pos.x : row.length
    }
  }

  down () {
    if (this.pos.y < this.height-1 && this.buffer.getRow(this.pos.y+1)) {
      this.pos.y++
      const row = this.buffer.getRow(this.pos.y)
      this.pos.x = row[this.pos.x] ? this.pos.x : row.length
    }
  }

  left () {
    if (this.pos.x > 0) this.pos.x--
    else if (this.pos.y > 0) {
      this.pos.y--
      this.pos.x = this.buffer.getRow(this.pos.y).length
    }
  }

  right () {
    if (
      this.pos.x < this.width &&
      this.pos.x < this.buffer.getRow(this.pos.y).length
    ) {
      this.pos.x++

    } else if (this.buffer.getRow(this.pos.y+1)) {
      this.pos.y++
      this.pos.x = 0
    }
  }
}
