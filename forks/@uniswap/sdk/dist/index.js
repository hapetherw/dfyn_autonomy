
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./sdk.cjs.development.js')
} else {
  module.exports = require('./sdk.cjs.development.js')
}
