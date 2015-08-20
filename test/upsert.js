'use strict'

var test = require('assertit')
var upsert = require('../index').upsert

test('upsert', function () {
  test('should throw TypeError if `obj` not an object', function (done) {
    function fixture () {
      upsert(123)
    }

    test.throws(fixture, TypeError)
    test.throws(fixture, /expects 1st argument to be an object/)
    done()
  })
  test('should mixin deep if property is object', function (done) {
    var o = {a: 'b', c: 'd', x: {y: 'z'}}
    upsert(o, {a: 'aa'})
    upsert(o, {c: 'cc'})
    upsert(o, {e: {f: 'g'}})
    upsert(o, {x: 'xx'})
    test.deepEqual(o, {a: 'aa', c: 'cc', x: 'xx', e: {f: 'g'}})
    done()
  })
  test('should return the entire object if property not object or string', function (done) {
    var o = {a: 'b', c: 'd'}
    test.deepEqual(upsert(o), o)
    upsert(o, 123)
    test.deepEqual(o, {a: 'b', c: 'd'})
    done()
  })
  test('should create immediate properties', function (done) {
    var o = {}
    upsert(o, 'a')
    upsert(o, 'b')
    upsert(o, 'c')
    test.deepEqual(o, {a: undefined, b: undefined, c: undefined})
    done()
  })
  test('should update property if does exist already', function (done) {
    var o = {a: 'b'}
    upsert(o, 'a')
    upsert(o, 'a', 'c')
    upsert(o, 'a', {b: 'c'})
    test.deepEqual(o, {a: {b: 'c'}})
    done()
  })
  test('should create property if does not exist already', function (done) {
    var o = {a: 'b'}
    upsert(o, 'c')
    upsert(o, 'd', 123)
    upsert(o, 'e', {f: 'g'})
    test.deepEqual(o, {a: 'b', c: undefined, d: 123, e: {f: 'g'}})
    done()
  })
  test('should update a nested property if does exist already', function (done) {
    var o = {
      x: {
        y: 'z',
        g: 123,
        w: {a: {b: 'c'}}
      }
    }
    upsert(o, 'x.y', 'yy')
    upsert(o, 'x.w', 'zz')
    upsert(o, 'x.g', 'gg')
    test.deepEqual(o, {x: {y: 'yy', w: 'zz', g: 'gg'}})
    done()
  })
  test('should create a nested property if does not exist already', function (done) {
    var o = {}
    upsert(o, 'a.b', 'c')
    upsert(o, 'd.e', 'f')
    upsert(o, 'd.g', 'h')
    test.deepEqual(o, {a: {b: 'c'}, d: {e: 'f', g: 'h'}})
    done()
  })
  test('should update a deeply nested property if does exist already', function (done) {
    var o = {a: {b: {c: {d: 'e'}, x: 'y'}}}

    upsert(o, 'a.b.c.d', 123)
    test.deepEqual(o, {a: {b: {c: {d: 123}, x: 'y'}}})

    upsert(o, 'a.b.c', 'qux')
    test.deepEqual(o, {a: {b: {c: 'qux', x: 'y'}}})

    upsert(o, 'a.b.c', {bar: 'qux'})
    test.deepEqual(o, {a: {b: {c: {bar: 'qux'}, x: 'y'}}})

    upsert(o, 'a.b.x', {z: 'zz'})
    test.deepEqual(o, {a: {b: {c: {bar: 'qux'}, x: {z: 'zz'}}}})

    upsert(o, 'a.b.c', 'cc')
    upsert(o, 'a.b', {c: 1, x: 2})
    test.deepEqual(o, {a: {b: {c: 1, x: 2}}})
    done()
  })
  test('should create a deeply nested property if does not exist already', function (done) {
    var o = {}

    upsert(o, 'a.b.c.x', 'xx')
    upsert(o, 'a.b.c.y', {z: 'zz'})
    upsert(o, 'a.b.g', 'gg')
    upsert(o, 'a.b.w', {ww: 'aaa'})
    test.deepEqual(o, {
      a: {
        b: {
          c: {x: 'xx', y: {z: 'zz'}},
          g: 'gg',
          w: {ww: 'aaa'}
        }
      }
    })

    upsert(o, 'a.b', 1)
    upsert(o, 'x.y', 2)
    test.deepEqual(o, {a: {b: 1}, x: {y: 2}})
    done()
  })
  test('should update the property even if a value is not defined', function (done) {
    var o = {
      foo: {locals: {name: 'charlike'}},
      bar: {locals: {name: 'charlike'}}
    }

    upsert(o, 'foo.locals.name')
    upsert(o, 'bar.locals.name')
    upsert(o, 'baz.locals.qux')
    upsert(o, 'qux.locals.baz')

    test.deepEqual(o, {
      foo: {locals: {name: undefined}},
      bar: {locals: {name: undefined}},
      baz: {locals: {qux: undefined}},
      qux: {locals: {baz: undefined}}
    })
    done()
  })
  test('should overwrite a nested property if it exist as string', function (done) {
    var first = {name: 'Halle'}
    var o = {a: first}
    upsert(o, 'a.b', 'yes')
    upsert(o, 'x.y.z', 1)
    upsert(o, 'a.name', 'charlike')
    test.deepEqual(o.a, first)
    test.equal(o.a.name, 'charlike')
    test.deepEqual(o, {a: {name: 'charlike', b: 'yes'}, x: {y: {z: 1}}})
    done()
  })
})

test('upsert escaping', function () {
  test('should recognize escaped dots', function (done) {
    var o = {'a.b': {c: {d: {e: 'fff'}}}}
    upsert(o, 'a\\.b.c.d.e', 'bar')
    upsert(o, 'a\\.b.c.name', 'charlike')
    test.equal(o['a.b'].c.d.e, 'bar')
    test.equal(o['a.b'].c.name, 'charlike')
    test.deepEqual(o, {'a.b': {c: {d: {e: 'bar'}, name: 'charlike'}}})
    done()
  })
  test('should work with multple escaped dots', function (done) {
    var o = {'a.b.c': {d: {e: 123}}}
    upsert(o, 'a\\.b\\.c.d.e', 'charlike')
    upsert(o, 'a\\.b\\.c.d.zzz', 'www')
    test.equal(o['a.b.c'].d.e, 'charlike')
    test.equal(o['a.b.c'].d.zzz, 'www')
    test.deepEqual(o, {'a.b.c': {d: {e: 'charlike', zzz: 'www'}}})
    done()
  })
  test('should work with multiple level nested escaped dots', function (done) {
    var o = {a: {'e.f': {'g.h.i': {j: 'foo'}}}}
    upsert(o, 'a.e\\.f.g\\.h\\.i.j', 'bar')
    upsert(o, 'a.e\\.f.x.y', 'foo')
    test.deepEqual(o, {a: {'e.f': {'g.h.i': {j: 'bar'}, x: {y: 'foo'}}}})
    done()
  })
})
