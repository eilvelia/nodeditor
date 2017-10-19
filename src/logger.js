// @flow

import fs from 'fs'
import { EOL } from 'os'

const LOG_FILE = 'latest.log'

const stream = process.env.NODE_ENV === 'production'
  ? null
  : fs.createWriteStream(LOG_FILE)

const log = (...args: Array<*>) => {
  if (!stream) return

  const text = args.join(' ')
  stream.write(text + EOL)
}

export default log
