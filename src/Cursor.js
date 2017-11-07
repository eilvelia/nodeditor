// @flow

export default class Cursor {
  /** @public */
  x: number
  /** @public */
  y: number

  constructor (x?: number, y?: number) {
    this.x = x || 0
    this.y = y || 0
  }
}
