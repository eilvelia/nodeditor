/* globals describe, it */

const path = require('path')
const fse = require('fs-extra')
const assert = require('assert')
const { EOL } = require('os')
const { default: TextBuffer } = require('../../dist/TextBuffer')
const { default: EditorFs } = require('../../dist/EditorFs')

const TMP = path.join(__dirname, '.temp')

const chars = [
  ['T', 'e', 's', 't', '1'],
  ['T', 'e', 's', 't', '2'],
  ['T', 'e', 's', 't', '3', ' ', ' ', 'T', 'e', 's', 't', '4'],
  [],
  [],
  ['T', 'e', 's', 't', '5'],
  [],
  [],
  []
]

fse.removeSync(TMP)
fse.mkdirpSync(TMP)

describe('EditorFs', () => {
  describe('saveToFile', () => {
    it('save.1.txt', async () => {
      const filepath = path.join(TMP, 'save.1.txt')
      const buffer = new TextBuffer(chars)

      await EditorFs.saveToFile(filepath, buffer)

      const file = fse
        .readFileSync(filepath)
        .toString()

      const expected = [
        'Test1',
        'Test2',
        'Test3  Test4',
        '',
        '',
        'Test5',
        '',
        '',
        ''
      ].join(EOL)

      assert.equal(file, expected)
    })
  })

  describe('readFromFile', () => {
    it('test.1.txt', async () => {
      const filepath = path.join(__dirname, 'test.1.txt')

      const buffer = await EditorFs.readFromFile(filepath)
      assert.deepEqual(buffer.toArray(), chars)
    })
  })

  describe('readFromFileSync', () => {
    it('test.1.txt', () => {
      const filepath = path.join(__dirname, 'test.1.txt')

      const buffer = EditorFs.readFromFileSync(filepath)
      assert.deepEqual(buffer.toArray(), chars)
    })
  })
})
