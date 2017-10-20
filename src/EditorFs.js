// @flow

import { EOL } from 'os'
import fse from 'fs-extra'
import Buffer from './Buffer'

import type { Char } from './typings.h'

class EditorFs {
  static saveToFile (file: string, buffer: Buffer): Promise<void> {
    const str = buffer
      .toArray()
      .map(row => row.join(''))
      .join(EOL)

    return fse.writeFile(file, str)
  }

  static async readFromFile (file: string): Promise<Buffer> {
    const bytes = await fse.readFile(file)
    const str: string = bytes.toString()
    const buffer: Char[][] = str
      .split(/\r?\n/)
      .map(row => row.split(''))

    return new Buffer(buffer)
  }
}

export default EditorFs
