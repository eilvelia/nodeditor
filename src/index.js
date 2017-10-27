// @flow

import readline from 'readline'
import path from 'path'
import fs from 'fs'
import program from 'commander'
import keypress from 'keypress'
import Editor from './editor'
import EditorFs from './EditorFs'
import TextBuffer from './TextBuffer'
import log from './logger'
import pkg from '../package.json'

let filename: string = ''

program
  .version(pkg.version)
  .arguments('[file]')
  .action((arg: string) => filename = arg)
  .parse(process.argv)

main()

async function main () {
  console.log('Loading...')

  let file: ?string
  let buffer: ?TextBuffer

  if (filename) {
    file = path.join(process.cwd(), filename)

    log(`File: ${file}`)

    const isDir = await fs.lstatSync(file).isDirectory()

    if (isDir) {
      log('isDir')
      console.log(`Error! ${file} is directory`)
      return
    }

    try {
      buffer = await EditorFs.readFromFile(file)
    } catch (e) {
      log(`Warning: ${e}`)
    }
  }

  keypress(process.stdin)

  readline.cursorTo(process.stdin, 0, 0)
  readline.clearScreenDown(process.stdin)

  // $FlowFixMe
  process.stdin.setRawMode(true)

  process.on('exit', () => {
    readline.cursorTo(process.stdin, 0, 0)
    readline.clearScreenDown(process.stdin)
  })

  const editor = new Editor(file, buffer)
  const onKeypress = editor.keypress.bind(editor)

  process.stdin.on('keypress', onKeypress)
}
