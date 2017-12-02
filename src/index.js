// @flow

import readline from 'readline'
import path from 'path'
import fs from 'fs'
import tty from 'tty'
import program from 'commander'
import keypress from 'keypress'
import Editor from './Editor'
import EditorFs from './EditorFs'
import TextBuffer from './TextBuffer'
import log from './logger'
import pkg from '../package.json'

let filepath: string = ''

program
  .version(pkg.version)
  .arguments('[file]')
  .action((arg: string) => (filepath = arg))
  .parse(process.argv)

main()

async function main (): Promise<void> {
  const { stdin, stdout } = process

  if (!(stdin instanceof tty.ReadStream)) {
    console.log('Standard input is not a tty')
    return
  }

  if (!(stdout instanceof tty.WriteStream)) {
    console.log('Standard output is not a tty')
    return
  }

  console.log('Loading...')

  const editor = new Editor(stdin, stdout)

  let absolutePath: ?string
  let buffer: ?TextBuffer

  if (filepath) {
    absolutePath = path.join(process.cwd(), filepath)

    log(`File: ${absolutePath}`)

    let isDir: boolean = false

    try {
      const lstat: fs.Stats = fs.lstatSync(absolutePath)
      isDir = lstat.isDirectory()
    } catch (e) {
      log(`Warning: ${e}`)
    }

    if (isDir) {
      log('isDir')
      console.log(`Error! ${absolutePath} is a directory.`)
      return
    }

    try {
      buffer = await EditorFs.readFromFile(absolutePath)
    } catch (e) {
      log(`Warning: ${e}`)
    }

    if (absolutePath) editor.loadFile(absolutePath, buffer)
  }

  keypress(stdin)

  readline.cursorTo(stdin, 0, 0)
  readline.clearScreenDown(stdin)

  stdin.setRawMode(true)

  process.on('exit', () => {
    readline.cursorTo(stdin, 0, 0)
    readline.clearScreenDown(stdin)
  })

  const onKeypress = editor.keypress.bind(editor)

  stdin.on('keypress', onKeypress)
}
