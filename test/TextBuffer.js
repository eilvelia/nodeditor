/* globals describe, it */

const assert = require('assert')
const { default: TextBuffer } = require('../dist/TextBuffer')

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

const cloneChars = () => chars.slice().map(r => r.slice())

describe('TextBuffer', () => {
  describe('constructor', () => {
    it('without arguments', () => {
      const { _buffer } = new TextBuffer()
      assert.deepEqual(_buffer, [ [] ])
    })

    it('with arguments', () => {
      const { _buffer } = new TextBuffer(chars)
      assert.deepEqual(_buffer, chars)
    })
  })

  it('toArray', () => {
    const buffer = new TextBuffer()
    const arr = buffer.toArray()
    assert.equal(arr, buffer._buffer)
  })

  it('rowToArray', () => {
    const buffer = new TextBuffer(chars)
    const arr = buffer.rowToArray(1)
    assert.deepEqual(arr, chars[1])
  })

  describe('isRowExists', () => {
    const buffer = new TextBuffer(chars)

    it('row exists', () => {
      const rowExists = buffer.isRowExists(6)
      assert.strictEqual(rowExists, true)
    })

    it('row doesn\'t exists', () => {
      const rowExists = buffer.isRowExists(9)
      assert.strictEqual(rowExists, false)
    })
  })

  it('getRowLength', () => {
    const buffer = new TextBuffer(chars)
    const length = buffer.getRowLength(2)
    assert.equal(length, chars[2].length)
  })

  it('getCountOfRows', () => {
    const buffer = new TextBuffer(chars)
    const rows = buffer.getCountOfRows()
    assert.equal(rows, chars.length)
  })

  it('allocRow', () => {
    const y = 35

    const buffer = new TextBuffer()
    const v = buffer.allocRow(y)
    assert(v instanceof TextBuffer, 'instanceof TextBuffer')
    assert.deepEqual(buffer._buffer[y], [])
    assert.notDeepEqual(buffer._buffer[y - 1], [])

    const arr = buffer._buffer[y]
    buffer.allocRow(y)
    assert.equal(buffer._buffer[y], arr)
  })

  it('addRow', () => {
    const y = 15
    const row = chars[1]

    const buffer = new TextBuffer()
    const v = buffer.addRow(y, row)
    assert(v instanceof TextBuffer, 'instanceof TextBuffer')
    assert.equal(buffer._buffer[1], row)
  })

  it('removeRow', () => {
    const y = 2

    const buffer = new TextBuffer(chars.slice())
    const row = buffer.removeRow(y)

    assert.notEqual(row, buffer._buffer[y])
    assert.equal(row, chars[y])
  })

  describe('cutPartOfRow', () => {
    const y = 2

    it('without start value', () => {
      const buffer = new TextBuffer(cloneChars())
      const row = buffer.cutPartOfRow(y)

      assert.deepEqual(buffer._buffer[y], [])
      assert.deepEqual(row, chars[y])
    })

    it('with start value', () => {
      const x = 5

      const buffer = new TextBuffer(cloneChars())
      const row = buffer.cutPartOfRow(y, x)

      assert.deepEqual(buffer._buffer[y], chars[y].slice(0, x))
      assert.deepEqual(row, chars[y].slice(x))
    })

    it('with end value', () => {
      const start = 5
      const end = 10
      const rest = [ ...chars[y].slice(0, start), ...chars[y].slice(end) ]

      const buffer = new TextBuffer(cloneChars())
      const row = buffer.cutPartOfRow(y, start, end)

      assert.deepEqual(buffer._buffer[y], rest)
      assert.deepEqual(row, chars[y].slice(start, end))
    })
  })

  it('concatRows', () => {
    const y1 = 5
    const y2 = 1

    const buffer = new TextBuffer(cloneChars())
    const v = buffer.concatRows(y1, chars[y2])
    assert(v instanceof TextBuffer, 'instanceof TextBuffer')

    const concatenated = [ ...chars[y1], ...chars[y2] ]
    assert.deepEqual(buffer._buffer[y1], concatenated)
  })

  it('getChar', () => {
    const y = 5
    const x = 2
    const ch = 's'

    const buffer = new TextBuffer(chars)
    const char = buffer.getChar(y, x)

    assert.equal(ch, char)
  })

  it('addChar', () => {
    const y = 5
    const x = 2
    const ch = 'L'

    const buffer = new TextBuffer(cloneChars())
    const v = buffer.addChar(y, x, ch)
    assert(v instanceof TextBuffer, 'instanceof TextBuffer')

    assert.equal(buffer.getChar(y, x), ch)
  })

  it('removeChar', () => {
    const y = 5
    const x = 2

    const buffer = new TextBuffer(cloneChars())
    const char = buffer.removeChar(y, x)

    assert.equal(char, chars[y][x])
  })
})
