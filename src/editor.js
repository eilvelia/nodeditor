// @flow

import readline from 'readline'
import Buffer from './Buffer'
import log from './logger'

import type { Char, Key } from './typings.h'

const cursorTo = readline.cursorTo.bind(null, process.stdin)
//const moveCursor = readline.moveCursor.bind(null, process.stdin)

let width: number = 0
let height: number = 0

const pos = { x: 0, y: 0 }
const buffer = new Buffer()

buffer.allocRow(0)

updateWindow()

const editor = { keypress }

export default editor

class Movement {
  static up () {
    if (pos.y > 0) {
      pos.y--
      const row = buffer.getRow(pos.y)
      pos.x = row[pos.x] ? pos.x : row.length
    }
  }

  static down () {
    if (pos.y < height-1 && buffer.isRowExists(pos.y+1)) {
      pos.y++
      const row = buffer.getRow(pos.y)
      pos.x = row[pos.x] ? pos.x : row.length
    }
  }

  static left () {
    if (pos.x > 0) pos.x--
    else if (pos.y > 0) {
      pos.y--
      pos.x = buffer.getRow(pos.y).length
    }
  }

  static right () {
    if (pos.x < width && pos.x < buffer.getRow(pos.y).length) pos.x++
    else if (buffer.isRowExists(pos.y+1)) {
      pos.y++
      pos.x = 0
    }
  }
}

function keypress (ch: ?Char, key: ?Key): void {
  //console.log(ch, key)

  updateWindow()

  if (key) {
    if (key.ctrl && key.name === 'c') {
      process.stdin.pause()
      return
    }

    switch (key.name) {
    case 'backspace':
      if (pos.x > 0) {
        buffer.removeChar(pos.y, pos.x-1)
        pos.x--
        drawLine(pos.y)
      } else if (pos.y > 0 && pos.y === buffer.length()-1) {
        buffer.removeRow(pos.y)
        pos.y--
        pos.x = buffer.getRow(pos.y).length
        updateCursorPos()
      }

      return
    case 'return':
      newLine()
      return

    case 'up':
      Movement.up()
      break
    case 'down':
      Movement.down()
      break
    case 'left':
      Movement.left()
      break
    case 'right':
      Movement.right()
    }

    updateCursorPos()
  }

  if (ch && isEditable(key)) {
    buffer.addChar(pos.y, pos.x, ch)
    pos.x++
    drawLine(pos.y)
  }
}

function updateWindow (): void {
  // $FlowFixMe
  width = process.stdout.columns
  // $FlowFixMe
  height = process.stdout.rows
}

function newLine (): void {
  pos.y++
  buffer.allocRow(pos.y)
  pos.x = buffer.getRow(pos.y).length
  updateCursorPos()
}

function isEditable (key: ?Key): boolean {
  if (pos.x >= width) return false
  if (key && key.ctrl) return false
  if (buffer.getRow(pos.y).length >= width) return false

  return true
}

function drawLine (y: number): void {
  const row = buffer.getRow(y)

  const start = pos.x - 1
  const end = row.length + 1

  cursorTo(start, y)

  for (let x = start; x < end; x++) {
    process.stdout.write(row[x] || ' ')
  }

  updateCursorPos()
}

function updateCursorPos (): void {
  cursorTo(pos.x, pos.y)
  log(JSON.stringify(pos), JSON.stringify(buffer._buffer))
}
