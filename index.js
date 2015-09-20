'use babel'

import ProviderMethods from './provider-methods'
import ProviderConstants from './provider-constants'

var completionProviders = [
  new ProviderMethods(),
  new ProviderConstants()
]

exports.provide = () => completionProviders
