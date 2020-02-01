/**
 * 模拟实现 new 操作符
 *
 * 来源于 MDN:
 * new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。new 关键字会进行如下的操作：
 * 1. 创建一个空的简单JavaScript对象（即{}）；
 * 2. 链接该对象（即设置该对象的构造函数）到另一个对象 ；
 * 3. 将步骤1新创建的对象作为this的上下文 ；
 * 4. 如果该函数没有返回对象，则返回this。
 *
 * @param Constructor
 * @return {*}
 * @private
 */
function _new(Constructor) {
  // 步骤1
  var obj = {}
  var args = Array.prototype.slice.call(arguments, 1)

  // 步骤2
  obj.__proto__ = Constructor.prototype
  // 步骤3
  var result = Constructor.apply(obj, args)

  // 步骤4
  return result instanceof Object ? result : obj
}


/**
 * 原理不变，ES6 实现写法
 * @param Constructor
 * @param args
 * @private
 */
function _new2(Constructor, ...args) {
  var obj = {}
  Object.setPrototypeOf(obj, Constructor.prototype)
  const result = Constructor.call(obj, ...args)

  return result instanceof Object ? result : obj
}

/**
 * 测试
 */
function Foo(name, age) {
  this.name = name
  this.age = age
}

var f = _new(Foo, 'bob', 12)
console.log(f.name) // bob
console.log(f.age) // 12

var f2 = _new2(Foo, 'lynn', 16)
console.log(f2.name) // lynn
console.log(f2.age) // 16