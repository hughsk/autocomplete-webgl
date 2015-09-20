'use babel'

import { filter as fuzzaldrin } from 'fuzzaldrin'
import constants from 'gl-constants'

const constList = Object.keys(constants)

export default class WebGLConstantsProvider {
  constructor () {
    this.selector = '.source.js'
    this.inclusionPriority = 9
    this.excludeLowerPriority = false
  }

  getSuggestions ({ editor, bufferPosition }) {
    const prefix = this.getPrefix(editor, bufferPosition)
    if (!prefix) return []

    const matches = fuzzaldrin(constList, prefix.replace('gl.', ''))
    if (!matches.length) return []

    return matches.map(constant => {
      return {
        type: 'constant',
        snippet: constant,
        displayText: `gl.${constant}`,
        leftLabel: String(constants[constant])
      }
    })
  }

  getPrefix (editor, bufferPosition) {
    const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])
    const idx = line.lastIndexOf('gl.')

    return idx === -1
      ? ''
      : line.slice(idx)
  }
}
