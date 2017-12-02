// @flow

import readline from 'readline'
import path from 'path'
import tty from 'tty'
import program from 'commander'
import keypress from 'keypress'
import Editor from './Editor'
import log from './logger'
import pkg from '../package.json'

let filepath: string = ''

program
  .version(pkg.version)
  .arguments('[file]')
  .action((arg: string) => (filepath = arg))
  .parse(process.argv)

main()

function main (): void {
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

  keypress(stdin)

  readline.cursorTo(stdin, 0, 0)
  readline.clearScreenDown(stdin)

  stdin.setRawMode(true)

  process.on('exit', () => {
    readline.cursorTo(stdin, 0, 0)
    readline.clearScreenDown(stdin)
  })

  const editor = new Editor(stdin, stdout)

  let absolutePath: ?string

  if (filepath) {
    absolutePath = path.join(process.cwd(), filepath)

    log(`File: ${absolutePath}`)

    try {
      editor.loadFile(absolutePath)
    } catch (e) {
      console.log(e.toString())
      return
    }
  }

  const onKeypress = editor.keypress.bind(editor)

  stdin.on('keypress', onKeypress)
}
