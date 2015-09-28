'use babel'

import { filter as fuzzaldrin } from 'fuzzaldrin'
import copy from 'shallow-copy'
import api from 'gl-api'

export default class WebGLProvider {
  constructor () {
    this.selector = '.source.js, .source.coffee'
    this.inclusionPriority = 10
    this.excludeLowerPriority = false
    this.methodCache = {}
  }

  getSuggestions ({ editor, bufferPosition }) {
    const prefix = this.getPrefix(editor, bufferPosition)
    const grammar = editor.getGrammar()

    if (!prefix) return []

    const matches = fuzzaldrin(api, prefix, { key: 'name' })
    if (!matches.length) return []

    return matches.map(method => {
      const name = method.name

      return copy(this.methodCache[name] = (
        this.methodCache[name] || this.getMethodSuggestion(method, grammar)
      ))
    })
  }

  getPrefix (editor, bufferPosition) {
    const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])
    const idx = line.lastIndexOf('gl.')

    return idx === -1
      ? ''
      : line.slice(idx)
  }

  getMethodSuggestion (method, grammar) {
    const name = method.name.replace('gl.', '')
    const params = Object.keys(method.parameters)
      .join(',').split(',')
      .map(name => name.trim())

    const snippet = params
      .map((name, i) => '${' + (i + 1) + ':' + name + '}')

    const isCoffee = grammar.name == "CoffeeScript"

    return {
      type: 'method',
      snippet: isCoffee ? `${name} ${snippet.join(', ')}` : `${name}(${snippet.join(', ')})`,
      displayText: isCoffee ? `gl.${name} ${params.join(', ')}` : `gl.${name}(${params.join(', ')})`,
      leftLabel: method.usage.split(/\s/).shift() || '',
      description: method.description.split(/\n/).shift() || '',
      descriptionMoreURL: method.href
    }
  }
}
