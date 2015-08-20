'use strict'

var test = require('assertit')
var set = require('../index').set

test('set', function () {
  test('should throw TypeError if `obj` not an object', function (done) {
    function fixture () {
      set(123)
    }

    test.throws(fixture, TypeError)
    test.throws(fixture, /expects 1st argument to be an object/)
    done()
  })
  test('should mixin deep if property is object', function (done) {
    var o = {a: 'b', c: 'd', x: {y: 'z'}}
    set(o, {a: 'aa'})
    set(o, {c: 'cc'})
    set(o, {e: {f: 'g'}})
    set(o, {x: 'xx'})
    test.deepEqual(o, {a: 'aa', c: 'cc', x: 'xx', e: {f: 'g'}})
    done()
  })
  test('should return the entire object if property not object or string', function (done) {
    var o = {a: 'b', c: 'd'}
    test.deepEqual(set(o), o)
    set(o, 123)
    test.deepEqual(o, {a: 'b', c: 'd'})
    done()
  })
  test('should support immediate properties', function (done) {
    var o = {}
    set(o, 'a')
    set(o, 'b')
    set(o, 'c')
    test.deepEqual(o, {a: undefined, b: undefined, c: undefined})
    done()
  })
  test('should not overwrite property if exists', function (done) {
    var o = {a: 'b'}
    set(o, 'a')
    set(o, 'a', 'c')
    set(o, 'a', {b: 'c'})
    test.deepEqual(o, {a: 'b'})
    done()
  })
  test('should create property in given empty object', function (done) {
    var o = {}
    set(o, 'a')
    set(o, 'a', false)
    set(o, 'a', null)
    set(o, 'a', 0)
    set(o, 'b', 'b')
    set(o, 'b', false)
    set(o, 'c', {d: 'e'})
    test.deepEqual(o, {a: undefined, b: 'b', c: {d: 'e'}})
    done()
  })
  test('should create a nested property if does not exist already', function (done) {
    var o = {x: {y: 'z'}}
    set(o, 'a.b', 'c')
    set(o, 'a.b', {f: 'g'})
    set(o, 'x', 'yy')
    set(o, 'x.y', 'zz')
    test.deepEqual(o, {a: {b: 'c'}, x: {y: 'z'}})
    set(o, 'a.k', 'j')
    set(o, 'a.g', {h: 'i'})
    test.deepEqual(o, {a: {b: 'c', k: 'j', g: {h: 'i'}}, x: {y: 'z'}})
    done()
  })
  test('should create a deeply nested property if does not exist already', function (done) {
    var o = {}
    set(o, 'a.b.c.d.e', 'c')
    test.equal(o.a.b.c.d.e, 'c')
    test.deepEqual(o, {a: {b: {c: {d: {e: 'c'}}}}})
    done()
  })
  test('should add the property even if a value is not defined', function (done) {
    var o = {}
    set(o, 'a.locals.name')
    set(o, 'b.locals.name')
    test.deepEqual(o, {
      a: {locals: {name: undefined}},
      b: {locals: {name: undefined}}
    })
    done()
  })
  test('should not overwrite a nested property if it exist as string', function (done) {
    var first = {name: 'Halle'}
    var o = {a: first}
    set(o, 'a.b', 'yes')
    set(o, 'a.name', 'charlike')
    test.deepEqual(o.a, first)
    test.equal(o.a.name, 'Halle')
    test.deepEqual(o, {a: {name: 'Halle', b: 'yes'}})
    done()
  })
})

test('set escaping', function () {
  test('should recognize escaped dots', function (done) {
    var o = {}
    set(o, 'a\\.b.c.d.e', 'fff')
    test.equal(o['a.b'].c.d.e, 'fff')
    test.deepEqual(o, {'a.b': {c: {d: {e: 'fff'}}}})
    done()
  })
  test('should work with multple escaped dots', function (done) {
    var o = {}
    set(o, 'a\\.b\\.c.d.e', 'fff')
    test.equal(o['a.b.c'].d.e, 'fff')
    test.deepEqual(o, {'a.b.c': {d: {e: 'fff'}}})
    done()
  })
  test('should work with multiple level nested escaped dots', function (done) {
    var o = {}
    set(o, 'a.e\\.f.g\\.h\\.i.j', 123)
    test.deepEqual(o, {a: {'e.f': {'g.h.i': {j: 123}}}})
    done()
  })
})
