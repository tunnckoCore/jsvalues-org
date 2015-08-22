'use strict'

var lazy = require('lazy-cache')(require)
var isObject = lazy('is-extendable')
var extend = lazy('extend-shallow')
var nc = lazy('noncharacters')

// @todo check tests

module.exports = function setValue (obj, str, val) {
  if (!isObject()(obj)) {
    throw new TypeError('set-value expects 1st argument to be an object')
  }
  if (isObject()(str)) {
    extend()(obj, str)
    return obj
  }
  if (typeof str !== 'string') {
    return obj
  }

  if (str.indexOf('.') === -1) {
    if (!obj.hasOwnProperty(str)) obj[str] = val
    return obj
  }

  var paths = escapePath(str)
  create(obj, paths, val)
  return obj
}

function create (obj, paths, val) {
  var keys = paths.slice(0, -1)
  var last = paths[paths.length - 1]
  var len = keys.length
  var i = 0

  while (i < len) {
    var key = keys[i++]
    var has = obj.hasOwnProperty(key)

    if (!has) {
      obj[key] = {}
      obj = obj[key]
      if (i === len) {
        obj[last] = val
      }
    } else {
      if (isObject()(obj[key])) {
        obj = obj[key]
        if (i === len) {
          obj[last] = obj[last] || val
        }
      }
    }
  }

  return obj
}

function escape (str) {
  return str.split('\\.').join(nc()[1])
}

function unescape (str) {
  return str.split(nc()[1]).join('.')
}

function escapePath (str) {
  return escape(str).split('.').map(function (seg) {
    return unescape(seg)
  })
}
