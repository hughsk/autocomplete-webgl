'use babel'

import Provider from './provider'

var completionProvider = new Provider()

exports.provide = () => completionProvider
