// @flow

import type { Char } from './typings.h'

class Buffer {
  _buffer: Char[][] = []

  allocRow (y: number): this {
    if (typeof this._buffer[y] !== 'object') this._buffer[y] = []

    return this
  }

  getRow (y: number): Char[] {
    return this
      .allocRow(y)
      ._buffer[y]
  }

  addChar (y: number, x: number, ch: Char): this {
    this.getRow(y).splice(x, 0, ch)

    return this
  }

  removeChar (y: number, x: number): this {
    this.getRow(y).splice(x, 1)

    return this
  }
}

export default Buffer
