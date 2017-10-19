// @flow

import type { Char } from './typings.h'

class Buffer {
  _buffer: Char[][] = []

  allocRow (y: number): this {
    if (typeof this._buffer[y] !== 'object') this._buffer[y] = []

    return this
  }

  getRow (y: number): Char[] {
    return this._buffer[y]
  }

  addRow (y: number, row: Char[]): this {
    this._buffer.splice(y, 0, row)

    return this
  }

  removeRow (y: number): this {
    this._buffer.splice(y, 1)

    return this
  }

  isRowExists (y: number): boolean {
    return !!this.getRow(y)
  }

  length (): number {
    return this._buffer.length
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