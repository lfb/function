/**
 * 模拟实现 apply 方法
 * apply() 方法调用一个具有给定this值的函数，以及作为一个数组（或类似数组对象）提供的参数。
 *
 * 实现原理与 call 差不多，只是处理参数不一样，call 是传每个参数，apply 第二个参数为数组
 * 实现的原理：利用 this 绑定的一条规则：函数在作为对象的方法调用时，this 指向的是该对象。那么实现的步骤为：
 *
 * - 首先，把传入绑定的 context 对象上新增一个 _fn 方法
 * - 然后，把原调用的方法赋给这个 _fn 方法
 * - 再处理一下传入的参数，传入 context._fn() 参数进行调用
 * - 最后删除 _fn 方法，返回结果
 *
 * @param context 绑定的上下文对象
 * @param arr 参数数组
 * @return {*}
 */
Function.prototype._apply = function (context, arr) {
  // 判断是否为函数调用
  if (typeof this !== 'function') {
    throw new Error('需要函数调用')
  }

  // 判断传入的对象是否为 null
  context = context || window
  // 把该函数绑定在对象上
  context._fn = this

  // 处理有传入参数的情况
  var args = [], result
  if (arr instanceof Array && arr.length > 0) {
    for (var i = 0; i < arr.length; i++) {
      args.push('arr[' + i + ']')
    }
    result = eval('context._fn(' + args + ')')

  } else {
    result = context._fn()
  }

  // 最后删除 _fn 方法，返回结果
  delete context._fn
  return result
}


/**
 * 原理不变，使用 ES6 实现
 * @param context 绑定的上下文对象
 * @param arr 参数数组
 */
Function.prototype._apply2 = function (context, arr) {
  if (typeof this !== 'function') {
    throw new Error('需要函数调用')
  }

  context = context || window
  context._fn = this

  let result = Array.isArray(arr) ? context._fn(...arr) : context._fn()
  delete context._fn

  return result
}


/**
 * 测试
 * @type {string}
 */
var name = 'lynn'
var o = {
  name: 'bob'
}

function foo(age) {
  console.log(this.name)
  console.log(age)
}


foo._apply(o, [1024]) // bob, 1024
foo._apply2(o, [2048]) // bob, 2048

