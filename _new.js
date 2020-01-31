/**
 * 模拟实现 new 操作符
 * @param Constructor
 * @return {*}
 * @private
 */
function _new(Constructor) {
  var obj = {}
  var args = Array.prototype.slice.call(arguments, 1)

  obj.__proto__ = Constructor.prototype
  const result = Constructor.apply(obj, args)

  return result instanceof Object ? result : obj
}

function Foo(name, age) {
  this.name = name
  this.age = age
}

var f = _new(Foo, 'bob', 12)
console.log(f.name)
console.log(f.age)