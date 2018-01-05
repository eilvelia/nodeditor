// @flow

import type { Char } from './Char'

export default class TextBuffer {
  /** @private */
  +_buffer: Char[][]

  constructor (buffer?: Char[][] = []) {
    this._buffer = buffer
    this.allocRow(0)
  }

  toArray (): $ReadOnlyArray<$ReadOnlyArray<Char>> {
    return this._buffer
  }

  rowToArray (y: number): $ReadOnlyArray<Char> {
    return this._buffer[y]
  }

  isRowExists (y: number): boolean {
    return !!this._buffer[y]
  }

  getRowLength (y: number): number {
    return this._buffer[y].length
  }

  getCountOfRows (): number {
    return this._buffer.length
  }

  allocRow (y: number = this._buffer.length): this {
    if (typeof this._buffer[y] !== 'object') this._buffer[y] = []

    return this
  }

  addRow (y: number, row: Char[]): this {
    this._buffer.splice(y, 0, row)

    return this
  }

  removeRow (y: number): Char[] {
    return this._buffer.splice(y, 1)[0]
  }

  cutPartOfRow (
    y: number,
    start: number = 0,
    end: number = this._buffer[y].length
  ): Char[] {
    return this._buffer[y].splice(start, end - start)
  }

  concatRows (y: number, row: Char[]): this {
    this._buffer[y] = this._buffer[y].concat(row)

    return this
  }

  getChar (y: number, x: number): Char {
    return this._buffer[y][x]
  }

  addChar (y: number, x: number, ch: Char): this {
    this._buffer[y].splice(x, 0, ch)

    return this
  }

  removeChar (y: number, x: number): Char {
    return this._buffer[y].splice(x, 1)[0]
  }
}
