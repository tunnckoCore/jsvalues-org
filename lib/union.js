'use strict'

var isObject = require('is-extendable')
var upsert = require('./upsert')
var union = require('arr-union')
var get = require('get-value')

module.exports = function unionValue (obj, str, val) {
  if (!isObject(obj)) {
    throw new TypeError('union-value expects 1st argument to be an object')
  }
  if (typeof str !== 'string') {
    return obj
  }

  var arr = arrayify(get(obj, prop) || [])
  upsert(obj, str, union(arr, arrayify(val || [])))
  return obj
}

function arrayify (val) {
  return Array.isArray(val) ? val : [val]
}
