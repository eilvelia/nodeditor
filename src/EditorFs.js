// @flow

import { EOL } from 'os'
import fs from 'fs'
import fse from 'fs-extra'
import TextBuffer from './TextBuffer'

import { type Char, toChar } from './Char'

// static class
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
    return EditorFs._bytesToTextBuffer(bytes)
  }

  static readFromFileSync (file: string): TextBuffer {
    const bytes: Buffer = fs.readFileSync(file)
    return EditorFs._bytesToTextBuffer(bytes)
  }

  static _bytesToTextBuffer (bytes: Buffer): TextBuffer {
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
