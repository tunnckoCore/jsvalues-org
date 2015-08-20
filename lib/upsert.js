'use strict'

var isObject = require('is-extendable')
var lazy = require('lazy-cache')(require)
var has = lazy('has-own-deep')
var set = lazy('./set')
var put = lazy('./put')

module.exports = function upsertValue (obj, path, value) {
  if (!isObject(obj)) {
    throw new TypeError('upsert-value expects 1st argument to be an object')
  }
  if (has()(obj, path, true)) {
    return put()(obj, path, value)
  }
  return set()(obj, path, value)
}
