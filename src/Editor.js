// @flow

import TextBuffer from './TextBuffer'
import Cursor from './Cursor'
import Movement from './Movement'
import Scroll from './Scroll'
import Drawer from './Drawer'
import EditorFs from './EditorFs'
import log from './logger'

import { type Char, toChar } from './Char'

type Key = {
  name: string,
  ctrl: boolean,
  meta: boolean,
  shift: boolean,
  sequence: string,
  code?: string
}

export default class Editor {
  stdin: tty$ReadStream
  stdout: tty$WriteStream

  filename: string = ''

  pos: Cursor = new Cursor(0, 0)
  scroll: Scroll = new Scroll(0)
  buffer: TextBuffer = new TextBuffer()
  drawer: Drawer
  movement: Movement

  width: number = 0 // columns
  height: number = 0 // rows

  constructor (stdin: tty$ReadStream, stdout: tty$WriteStream) {
    this.stdin = stdin
    this.stdout = stdout

    const { buffer, pos, scroll } = this

    this.drawer = new Drawer(stdin, stdout, buffer, pos, scroll)
    this.movement = new Movement(pos, buffer, scroll, this.drawer)

    this.updateWindow()
  }

  loadFile (filename: string, buffer: ?TextBuffer): this {
    log('loadFile', filename)

    this.filename = filename

    if (buffer) {
      this.buffer = buffer

      const { drawer, movement, pos } = this

      drawer.updateBuffer(buffer)
      movement.updateBuffer(buffer)

      pos.x = 0
      pos.y = 0

      drawer.fullDraw()
    }

    return this
  }

  keypress (str: ?string, key: ?Key): void {
    const { movement, stdin } = this

    const ch: ?Char = str ? toChar(str) : undefined

    //console.log(ch, key)

    this.updateWindow()

    if (key) {
      if (key.ctrl) {
        /* eslint-disable no-fallthrough */
        switch (key.name) {
          case 'd':
            stdin.pause()
            return
          case 'c':
          case 'x':
            stdin.pause()
          case 's':
            if (this.filename) EditorFs.saveToFile(this.filename, this.buffer)
            return
        }
        /* eslint-enable no-fallthrough */
      }

      switch (key.name) {
        case 'backspace':
          this.backspace()
          return
        case 'return':
          this.newLine()
          return
        case 'up':
          movement.up()
          break
        case 'down':
          movement.down()
          break
        case 'left':
          movement.left()
          break
        case 'right':
          movement.right()
      }
    }

    if (ch && this.isEditable(key)) {
      const { buffer, pos, drawer } = this

      buffer.addChar(pos.y, pos.x, ch)
      pos.x++
      drawer.drawLineSmart(pos.y)
    }
  }

  isEditable (key: ?Key): boolean {
    const { pos, buffer, width } = this

    if (pos.x >= width) return false
    if (key && key.ctrl) return false
    if (buffer.getRow(pos.y).length >= width) return false

    return true
  }

  backspace (): this {
    const { pos, buffer, drawer } = this

    if (pos.x > 0) {
      buffer.removeChar(pos.y, pos.x-1)
      pos.x--
      drawer.drawLineSmart(pos.y)

    } else if (pos.y > 0) {
      this.removeLine()
    }

    return this
  }

  removeLine (): this {
    const { buffer, pos, drawer } = this

    pos.x = buffer.getRow(pos.y-1).length

    if (pos.y === buffer.length()-1 && buffer.getRow(pos.y).length === 0) {
      buffer.removeRow(pos.y)
      pos.y--
      drawer.updateCursorPos()
      return this
    }

    pos.y--
    const removed: Char[] = buffer.removeRow(pos.y+1)
    buffer.concatRows(pos.y, removed)

    drawer.updateScroll(true)
    drawer.fullDraw()

    return this
  }

  newLine (): this {
    const { buffer, pos, drawer } = this

    const row = buffer.getRow(pos.y)
    const removed: Char[] = row.splice(pos.x, row.length - pos.x)
    pos.y++
    pos.x = 0
    buffer.addRow(pos.y, removed)

    drawer.updateScroll(true)
    drawer.fullDraw()

    return this
  }

  updateWindow (): this {
    this.width = this.stdout.columns
    this.height = this.stdout.rows

    this.movement.updateSize(this.width, this.height)
    this.drawer.updateSize(this.width, this.height)

    return this
  }
}
