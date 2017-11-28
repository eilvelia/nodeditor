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

let filename: string = ''

program
  .version(pkg.version)
  .arguments('[file]')
  .action((arg: string) => (filename = arg))
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

  let file: ?string
  let buffer: ?TextBuffer

  if (filename) {
    file = path.join(process.cwd(), filename)

    log(`File: ${file}`)

    let isDir: boolean = false

    try {
      const lstat: fs.Stats = fs.lstatSync(file)
      isDir = lstat.isDirectory()
    } catch (e) {
      log(`Warning: ${e}`)
    }

    if (isDir) {
      log('isDir')
      console.log(`Error! ${file} is a directory.`)
      return
    }

    try {
      buffer = await EditorFs.readFromFile(file)
    } catch (e) {
      log(`Warning: ${e}`)
    }
  }

  keypress(stdin)

  readline.cursorTo(stdin, 0, 0)
  readline.clearScreenDown(stdin)

  stdin.setRawMode(true)

  process.on('exit', () => {
    readline.cursorTo(stdin, 0, 0)
    readline.clearScreenDown(stdin)
  })

  const editor = new Editor(stdin, stdout, file, buffer)
  const onKeypress = editor.keypress.bind(editor)

  stdin.on('keypress', onKeypress)
}
