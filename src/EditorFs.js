// @flow

import { EOL } from 'os'
import fse from 'fs-extra'
import TextBuffer from './TextBuffer'

import { type Char, toChar } from './Char'

export default class EditorFs {
  static saveToFile (file: string, buffer: TextBuffer): Promise<void> {
    const str = buffer
      .toArray()
      .map(row => row.join(''))
      .join(EOL)

    return fse.writeFile(file, str)
  }

  static async readFromFile (file: string): Promise<TextBuffer> {
    const bytes: Buffer = await fse.readFile(file)
    const buffer: Char[][] = bytes
      .toString()
      .split(/\r?\n/)
      .map((row: string): Char[] => row
        .split('') // string[]
        .map(toChar) // Char[]
      )

    return new TextBuffer(buffer)
  }
}
