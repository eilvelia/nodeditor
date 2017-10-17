// @flow

export type Char = string

export type Key = {
  name: string,
  ctrl: boolean,
  meta: boolean,
  shift: boolean,
  sequence: string,
  code?: string
}
