'use strict'

var test = require('assertit')
var assign = require('../index').assign

test('assign', function () {
  test('should throw TypeError if `obj` not an object', function (done) {
    function fixture () {
      assign(123)
    }
    test.throws(fixture, TypeError)
    test.throws(fixture, /expects 1st argument to be an object/)
    done()
  })
})
