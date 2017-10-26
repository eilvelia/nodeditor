// @flow

import readline from 'readline'
import program from 'commander'
import keypress from 'keypress'
import Editor from './editor'
import pkg from '../package.json'

program
  .version(pkg.version)
  .parse(process.argv)

keypress(process.stdin)

readline.cursorTo(process.stdin, 0, 0)
readline.clearScreenDown(process.stdin)

// $FlowFixMe
process.stdin.setRawMode(true)

process.on('exit', () => {
  readline.cursorTo(process.stdin, 0, 0)
  readline.clearScreenDown(process.stdin)
})

const editor = new Editor()
const onKeypress = editor.keypress.bind(editor)

process.stdin.on('keypress', onKeypress)
