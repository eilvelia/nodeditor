// @flow

import pkg from '../package.json'
import program from 'commander'
import keypress from 'keypress'
import readline from 'readline'
import Editor from './editor'

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

process.stdin.on('keypress', Editor.keypress)
