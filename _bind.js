/**
 * 模拟实现 bind 方法
 * 来源于 MDN: bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。
 *
 * 实现原理：
 * 1. 返回一个函数
 * 2. 返回的这个函数的 this 绑定传入的对象调用
 * 3. 返回的这个函数还可以分 2 种情况调用：
 *    3.1.普通函数调用，this 绑定传入的对象，同时此函数还能传入参数
 *    3.2.new 操作符构造函数调用，此时 this 绑定失效，同时此函数还能传入参数
 * 4. 注意一点，可以使用一个技巧：使用一个内部函数实现继承方式，优化代码
 * @param context
 * @return {function(): *}
 */
Function.prototype._bind = function (context) {
  if (typeof this !== 'function') {
    throw new Error('需要函数调用')
  }

  context = context || window

  // 取出bind函数调用时传入的参数
  var args = Array.prototype.slice.call(arguments, 1)
  // 保存当前的函数
  var _this = this

  function F() {
  }

  var _fn = function () {
    // 取出bind返回的函数传入的参数
    var bindArgs = Array.prototype.slice.call(arguments)
    // 判断是否 new 调用，如果不是绑定传入的对象
    return _this.apply(this instanceof F ? this : context, args.concat(bindArgs))
  }
  // 原型链继承，类似 Object.create() 方式继承
  F.prototype = this.prototype
  _fn.prototype = new F()

  return _fn
}


/**
 * 原理不变，ES6 方法实现
 * @param context
 * @param args
 * @return {_fn}
 */
Function.prototype._bind2 = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('需要函数调用')
  }

  context = context || window
  const _this = this

  function F() {
  }

  var _fn = function () {
    const bindArgs = [...arguments]

    if (this instanceof F) {
      return new _this(...args, ...arguments)
    } else {
      return _this.apply(context, args.concat(bindArgs))
    }
  }
  F.prototype = this.prototype
  _fn.prototype = new F()

  return _fn
}


/**
 * 测试
 * @type {string}
 */
var name = 'lynn'
var o = {
  name: 'bob'
}

function foo(age, like) {
  console.log(this.name)
  console.log(age)
  console.log(like)
}

var fn1 = foo._bind(o, 12)
fn1('coding')
/**
 * 输出结果
 bob
 12
 coding
 */

var fn2 = foo._bind2(o, 16)
fn2('doctor')
/**
 * 输出结果
 bob
 16
 doctor
 */

var fn3 = foo._bind(o, 18)
var fn3Obj = new fn3('baba')
console.log(fn3Obj)
/**
 * 输出结果
 undefined
 18
 baba
 foo {}
 */

var fn4 = foo._bind2(o, 16)
var fn4Obj = new fn4('mama')
console.log(fn4Obj)

/**
 * 输出结果
 undefined
 16
 mama
 foo {}
 */