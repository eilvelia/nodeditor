// @flow

import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import { EOL } from 'os'
import persistPath from 'persist-path'
import pkg from '../package.json'

const LOG_FILE = 'latest.log'

const ppath = persistPath(`${pkg.name}`)

fse.mkdirpSync(ppath)

const stream = process.env.NODE_ENV === 'production'
  ? null
  : fs.createWriteStream(path.join(ppath, LOG_FILE))

const log = (...args: Array<*>) => {
  if (!stream) return

  const text = args.join(' ')
  stream.write(text + EOL)
}

export default log
