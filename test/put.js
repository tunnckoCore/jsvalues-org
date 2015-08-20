'use strict'

var test = require('assertit')
var put = require('../index').put

test('put', function () {
  test('should throw TypeError if `obj` not an object', function (done) {
    function fixture () {
      put(123)
    }

    test.throws(fixture, TypeError)
    test.throws(fixture, /expects 1st argument to be an object/)
    done()
  })
  test('should return the entire object if no property is passed.', function (done) {
    var o = {a: 'b', c: 'd'}
    test.deepEqual(put(o), o)
    done()
  })
  test('should update property if does exist already', function (done) {
    var o = {a: 'b'}
    put(o, 'a')
    put(o, 'a', {f: 'g'})
    put(o, 'a', 123)
    test.deepEqual(o, {a: 123})
    done()
  })
  test('should not create property if does not exist already', function (done) {
    var o = {a: 'b'}
    put(o, 'c')
    put(o, 'd', 123)
    put(o, 'e', {f: 'g'})
    test.deepEqual(o, {a: 'b'})
    done()
  })
  test('should update nested property if does exist already', function (done) {
    var o = {x: {y: 'z'}}
    put(o, 'a.b', 'c')
    put(o, 'a.c', {d: 'e'})
    put(o, 'x.a', 'www')
    put(o, 'x.y', 'bbb')
    test.deepEqual(o, {x: {y: 'bbb'}})
    done()
  })
  test('should not create a nested property if does not exist already', function (done) {
    var o = {x: {y: 'z'}}
    put(o, 'a.b', 'c')
    put(o, 'a.c', {d: 'e'})
    put(o, 'x.z', 'zzz')
    put(o, 'x.w', 'www')
    test.deepEqual(o, {x: {y: 'z'}})
    done()
  })
  test('should update deeply nested property if does exist already', function (done) {
    var o = {a: {b: {c: {d: 'e'}}}}

    put(o, 'a.b.c.d', 123)
    test.deepEqual(o, {a: {b: {c: {d: 123}}}})

    put(o, 'a.b.c', 'qux')
    test.deepEqual(o, {a: {b: {c: 'qux'}}})

    put(o, 'a.b.c', {bar: 'qux'})
    test.deepEqual(o, {a: {b: {c: {bar: 'qux'}}}})

    put(o, 'a.b', {ee: {ff: 'gg'}})
    test.deepEqual(o, {a: {b: {ee: {ff: 'gg'}}}})
    done()
  })
  test('should not create a deeply nested property if does not exist already', function (done) {
    var o = {a: {b: {c: {d: 'e'}}}}

    put(o, 'a.b.c.foo', 'qux')
    put(o, 'a.b.c.bar', {baz: 'qux'})
    put(o, 'a.b.baz', 'www')
    put(o, 'a.b.xxx', {yyy: 'zzz'})
    put(o, 'x.y.z.foo', 'bar')

    test.deepEqual(o, {a: {b: {c: {d: 'e'}}}})
    done()
  })
  test('should update the property even if a value is not defined', function (done) {
    var o = {
      foo: {locals: {name: 'charlike'}},
      bar: {locals: {name: 'charlike'}}
    }

    put(o, 'foo.locals.name')
    put(o, 'bar.locals.name')
    put(o, 'bar.locals.qux')
    put(o, 'bar.locals.baz')

    test.deepEqual(o, {
      foo: {locals: {name: undefined}},
      bar: {locals: {name: undefined}}
    })
    done()
  })
})

test('put escaping', function () {
  test('should recognize escaped dots', function (done) {
    var o = {'a.b': {c: {d: {e: 'fff'}}}}
    put(o, 'a\\.b.c.d.e', 'bar')
    put(o, 'a\\.b.c.name', 'charlike')
    test.equal(o['a.b'].c.d.e, 'bar')
    test.deepEqual(o, {'a.b': {c: {d: {e: 'bar'}}}})
    done()
  })
  test('should work with multple escaped dots', function (done) {
    var o = {'a.b.c': {d: {e: 123}}}
    put(o, 'a\\.b\\.c.d.e', 'charlike')
    put(o, 'a\\.b\\.c.d.zzz', 'www')
    test.equal(o['a.b.c'].d.e, 'charlike')
    test.deepEqual(o, {'a.b.c': {d: {e: 'charlike'}}})
    done()
  })
  test('should work with multiple level nested escaped dots', function (done) {
    var o = {a: {'e.f': {'g.h.i': {j: 'foo'}}}}
    put(o, 'a.e\\.f.g\\.h\\.i.j', 'bar')
    test.deepEqual(o, {a: {'e.f': {'g.h.i': {j: 'bar'}}}})
    done()
  })
})
