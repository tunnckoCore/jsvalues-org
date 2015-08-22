'use strict'

/**
 * assign-value
 * - use `assign-deep`
 *
 * extend-value
 * - use `extend-shallow`
 *
 * set-value
 * - use `extend-shallow`
 *
 * put-value (in `create`)
 * - use `defaults-deep` ?
 */







// var test = require('assertit')
// // var assign = require('../index').assign

// var assign = require('assign-value')
// var upsert = require('../index').upsert

// // test('assign', function () {
// //   test('should throw TypeError if `obj` not an object', function (done) {
// //     function fixture () {
// //       assign(123)
// //     }
// //     test.throws(fixture, TypeError)
// //     test.throws(fixture, /expects 1st argument to be an object/)
// //     done()
// //   })
// // })

var mixinObject = require('mixin-object')
var mixinDeep = require('mixin-deep')
var assignDeep = require('assign-deep')
var defaultsDeep = require('defaults-deep')
var extendShallow = require('extend-shallow')


var o = {
  a: 'b',
  c: {
    d: 'e',
    f: 'g'
  }
}

/**
 * assign-deep
 *
 * - if not exist, write
 * - if same type, overwrite (object type is specific case)
 * - if object and if key not exists, append
 * - if object and if key exists, overwrite
 */

// var res = assignDeep(o, {a: {aa: 'aaa'}})  //=> { a: 'b', c: { d: 'e', f: 'g' } }
// var res = assignDeep(o, {a: 'xyz'})        //=> { a: 'xyz', c: { d: 'e', f: 'g' } }
// var res = assignDeep(o, {c: 'ccc'})        //=> { a: 'b', c: { d: 'e', f: 'g', h: 'i' } }
// var res = assignDeep(o, {c: {h: 'i'}})     //=> { a: 'b', c: { d: 'e', f: 'g', h: 'i' } }
// var res = assignDeep(o, {c: {d: 'aaa'}})   //=> { a: 'b', c: { d: 'aaa', f: 'g' } }
// var res = assignDeep(o, {x: 'y'})          //=> { a: 'b', c: { d: 'e', f: 'g' }, x: 'y' }

/**
 * defaults-deep
 *
 * - only if not exist, write
 * - otherwise do nothing
 */

// var res = defaultsDeep(o, {a: {aa: 'aaa'}})  //=> { a: 'b', c: { d: 'e', f: 'g' } }
// var res = defaultsDeep(o, {a: 'xyz'})        //=> { a: 'b', c: { d: 'e', f: 'g' } }
// var res = defaultsDeep(o, {c: 'ccc'})        //=> { a: 'b', c: { d: 'e', f: 'g' } }
// var res = defaultsDeep(o, {c: {h: 'i'}})     //=> { a: 'b', c: { d: 'e', f: 'g', h: 'i' } }
// var res = defaultsDeep(o, {c: {d: 'aaa'}})   //=> { a: 'b', c: { d: 'e', f: 'g' } }
// var res = defaultsDeep(o, {x: 'y'})          //=> { a: 'b', c: { d: 'e', f: 'g' }, x: 'y' }

/**
 * extend-shallow
 *
 * - if exists, overwrite
 * - if not exist, write
 */

// var res = extendShallow(o, {a: {aa: 'aaa'}})  //=> { a: {aa: 'aaa'}, c: { d: 'e', f: 'g' } }
// var res = extendShallow(o, {a: 'xyz'})        //=> { a: 'xyz', c: { d: 'e', f: 'g' } }
// var res = extendShallow(o, {c: 'ccc'})        //=> { a: 'b', c: 'ccc' }
// var res = extendShallow(o, {c: {h: 'i'}})     //=> { a: 'b', c: { h: 'i' } }
// var res = extendShallow(o, {c: {d: 'aaa'}})   //=> { a: 'b', c: { d: 'aaa' } }
// var res = extendShallow(o, {x: 'y'})          //=> { a: 'b', c: { d: 'e', f: 'g' }, x: 'y' }

/**
 * mixin-deep
 *
 * - save object reference
 * - if exists, overwrite
 * - if not exist, write
 */

// var res = mixinDeep(o, {a: {aa: 'aaa'}})  //=> { a: { aa: 'aaa' }, c: { d: 'e', f: 'g' } }
// var res = mixinDeep(o, {a: 'xyz'})        //=> { a: 'xyz', c: { d: 'e', f: 'g' } }
// var res = mixinDeep(o, {c: 'ccc'})        //=> { a: 'b', c: 'ccc' }
// var res = mixinDeep(o, {c: {h: 'i'}})     //=> { a: 'b', c: { d: 'e', f: 'g', h: 'i' } }
// var res = mixinDeep(o, {c: {d: 'aaa'}})   //=> { a: 'b', c: { d: 'aaa', f: 'g' } }
// var res = mixinDeep(o, {x: 'y'})          //=> { a: 'b', c: { d: 'e', f: 'g' }, x: 'y' }

/**
 * mixin-object
 *
 * - if exists, overwrite
 * - if not exist, write
 * - exact same as `extend-shallow`
 */

// var res = mixinObject(o, {a: {aa: 'aaa'}})  //=> { a: { aa: 'aaa' }, c: { d: 'e', f: 'g' } }
// var res = mixinObject(o, {a: 'xyz'})        //=> { a: 'xyz', c: { d: 'e', f: 'g' } }
// var res = mixinObject(o, {c: 'ccc'})        //=> { a: 'b', c: 'ccc' }
// var res = mixinObject(o, {c: {h: 'i'}})     //=> { a: 'b', c: { h: 'i' } }
// var res = mixinObject(o, {c: {d: 'aaa'}})   //=> { a: 'b', c: { d: 'aaa' } }
// var res = mixinObject(o, {x: 'y'})          //=> {  a: 'b', c: { d: 'e', f: 'g' }, x: 'y' }

// console.log(res)

