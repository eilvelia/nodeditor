// @flow

import TextBuffer from './TextBuffer'
import Cursor from './Cursor'
import Movement from './Movement'
import Scroll from './Scroll'
import Drawer from './Drawer'
import log from './logger'

import type { Char, Key } from './typings.h'

let width: number = 0
let height: number = 0

const pos = new Cursor(0, 0)
const buffer = new TextBuffer()
const scroll = new Scroll(0)

const drawer = new Drawer(buffer, pos, scroll)
const movement = new Movement(buffer, pos, scroll, drawer)

buffer.allocRow(0)

updateWindow()

export default class Editor {
  static keypress (ch: ?Char, key: ?Key): void {
    //console.log(ch, key)

    updateWindow()

    if (key) {
      if (key.ctrl) {
        switch (key.name) {
        case 'c':
        case 'x':
        case 'd':
          process.stdin.pause()
          return
        }
      }

      switch (key.name) {
      case 'backspace':
        backspace()
        return
      case 'return':
        newLine()
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

    if (ch && isEditable(key)) {
      buffer.addChar(pos.y, pos.x, ch)
      pos.x++
      drawer.drawLineSmart(pos.y)
    }
  }
}

function isEditable (key: ?Key): boolean {
  if (pos.x >= width) return false
  if (key && key.ctrl) return false
  if (buffer.getRow(pos.y).length >= width) return false

  return true
}

function backspace (): void {
  if (pos.x > 0) {
    buffer.removeChar(pos.y, pos.x-1)
    pos.x--
    drawer.drawLineSmart(pos.y)

  } else if (pos.y > 0) {
    removeLine()
  }
}

function removeLine (): void {
  pos.x = buffer.getRow(pos.y-1).length

  if (pos.y === buffer.length()-1 && buffer.getRow(pos.y).length === 0) {
    buffer.removeRow(pos.y)
    pos.y--
    drawer.updateCursorPos()
    return
  }

  pos.y--
  const removed = buffer.removeRow(pos.y+1)
  buffer.concatRows(pos.y, removed)

  movement.updateScroll(true)

  drawer.fullDraw()
  log('removeLine', scroll.top)
}

function newLine (): void {
  const row = buffer.getRow(pos.y)
  const removed = row.splice(pos.x, row.length - pos.x)
  pos.y++
  pos.x = 0
  buffer.addRow(pos.y, removed)

  movement.updateScroll(true)

  drawer.fullDraw()
  log('newLine', scroll.top)
}

function updateWindow (): void {
  // $FlowFixMe
  width = process.stdout.columns
  // $FlowFixMe
  height = process.stdout.rows

  movement.updateSize(width, height)
  drawer.updateSize(width, height)
}
