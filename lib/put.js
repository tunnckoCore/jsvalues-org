'use strict'

var lazy = require('lazy-cache')(require)
var isObject = lazy('is-extendable')
var nc = lazy('noncharacters')

module.exports = function putValue (obj, str, val) {
  if (!isObject()(obj)) {
    throw new TypeError('put-value expects 1st argument to be an object')
  }
  if (typeof str !== 'string') {
    return obj
  }
  if (str.indexOf('.') === -1) {
    if (obj.hasOwnProperty(str)) obj[str] = val
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

    if (obj.hasOwnProperty(key)) {
      obj = obj[key]
      if (i === len && obj.hasOwnProperty(last)) {
        obj[last] = val
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
