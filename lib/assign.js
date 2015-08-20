'use strict'

var isObject = require('is-extendable')
var extend = require('extend-shallow')
var upsert = require('./upsert')
var get = require('get-value')

module.exports = function assignValue (obj, prop, value) {
  if (!isObject(obj)) {
    throw new TypeError('assign-value expects 1st argument to be an object')
  }

  if (typeof prop === 'undefined' && typeof value === 'undefined') {
    return obj
  }

  if (typeof value === 'undefined' && isObject(prop)) {
    return extend(obj, prop)
  }

  upsert(obj, prop, extend({}, get(obj, prop, true), value))
  return obj
}
