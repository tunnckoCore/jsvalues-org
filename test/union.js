'use strict'

var test = require('assertit')
var union = require('../index').union

test('union', function () {
  test('should throw TypeError if `obj` not an object', function (done) {
    function fixture () {
      union(123)
    }
    test.throws(fixture, TypeError)
    test.throws(fixture, /expects 1st argument to be an object/)
    done()
  })
  test('should throw TypeError if `obj` not an object', function (done) {
    function fixture () {
      union({}, 123)
    }
    test.throws(fixture, TypeError)
    test.throws(fixture, /expects `prop` to be a string/)
    done()
  })
  test('should create an array property if does not exist already', function (done) {
    var o = {}
    union(o, 'foo', ['a', 'b'])
    test.deepEqual(o, {foo: ['a', 'b']})
    done()
  })
  test('should update a string property to array if does exist already', function (done) {
    var o = {foo: 'bar'}
    union(o, 'foo', ['baz', 'qux'])
    union(o, 'foo', ['xyz'])
    union(o, 'foo', 'www')
    test.deepEqual(o, {foo: ['bar', 'baz', 'qux', 'xyz', 'www']})
    done()
  })
  test('should union a value', function (done) {
    var o = {foo: ['a', 'b']}
    union(o, 'foo', ['c', 'd', 'e'])
    union(o, 'foo', 'last')
    test.deepEqual(o, {foo: ['a', 'b', 'c', 'd', 'e', 'last']})
    done()
  })
  test('should union a deeply nested value', function (done) {
    var o = {}
    union(o, 'a.x', {y: 'z'})
    union(o, 'a.x.y', ['q', 'w'])
    union(o, 'a.x.y', 'r')
    union(o, 'a.b.c', ['one', 'two'])
    union(o, 'a.b.c', ['three'])
    union(o, 'a.b.c', 'last')
    test.deepEqual(o.a.x.y, ['q', 'w', 'r'])
    test.deepEqual(o.a.b, {c: ['one', 'two', 'three', 'last']})
    test.deepEqual(o.a.b.c, ['one', 'two', 'three', 'last'])
    done()
  })
})

test('union escaping', function () {
  test('should recognize escaped dots', function (done) {
    var o = {'a.b': {c: {d: 'e'}}}
    union(o, 'a\\.b.c.x', ['f', 'g'])
    union(o, 'a\\.b.c.d', ['f', 'g'])
    union(o, 'a\\.b.c.d', 'h')
    union(o, 'a\\.b.c.d', ['i', 'j'])
    test.deepEqual(o['a.b'].c.d, ['e', 'f', 'g', 'h', 'i', 'j'])
    test.deepEqual(o['a.b'].c.x, ['f', 'g'])
    done()
  })
  test('should work with multple escaped dots', function (done) {
    var o = {'a.b.c': {d: {e: 'f'}}}
    union(o, 'a\\.b\\.c.d.e', 'g')
    union(o, 'a\\.b\\.c.d.zzz', ['x', 'y'])
    test.deepEqual(o['a.b.c'].d.e, ['f', 'g'])
    test.deepEqual(o['a.b.c'].d.zzz, ['x', 'y'])
    done()
  })
  test('should work with multiple level nested escaped dots', function (done) {
    var o = {a: {'e.f': {'g.h.i': {j: 'foo'}}}}
    union(o, 'a.e\\.f.g\\.h\\.i.j', 'bar')
    test.deepEqual(o, {a: {'e.f': {'g.h.i': {j: ['foo', 'bar']}}}})
    done()
  })
})
