'use strict'

var isObject = require('is-extendable')
var extend = require('extend-shallow')
var upsert = require('./upsert')
var get = require('get-value')

module.exports = function assignValue (obj, str, val) {
  if (!isObject(obj)) {
    throw new TypeError('assign-value expects 1st argument to be an object')
  }

  if (typeof str === 'undefined' && typeof val === 'undefined') {
    return obj
  }

  if (typeof val === 'undefined' && isObject(str)) {
    return extend(obj, str)
  }

  set(obj, str, extend({}, get(obj, str), val))
  return obj
}
