// @flow

import readline from 'readline'

export const cursorTo = readline.cursorTo.bind(null, process.stdin)
//export const moveCursor = readline.moveCursor.bind(null, process.stdin)
