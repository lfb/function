/**
 * 模拟实现 call 方法，call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。
 *
 * 实现的原理：利用 this 绑定的一条规则：函数在作为对象的方法调用时，this 指向的是该对象。那么实现的步骤为：
 *
 * - 首先，把传入绑定的 context 对象上新增一个 _fn 方法
 * - 然后，把原调用的方法赋给这个 _fn 方法
 * - 再处理一下传入的参数，传入 context._fn() 参数进行调用
 * - 最后删除 _fn 方法，返回结果
 *
 * @param context
 * @return 函数调用的结果
 */
Function.prototype._call = function (context) {
  // 判断一下是否是函数调用
  if (typeof this !== 'function') {
    throw new Error('需要函数调用')
  }
  // 判断一下传入绑定的 this 是否为 null
  context = context || window
  // 把调用的函数赋给绑定对象
  context._fn = this

  var args = [], result

  // 如果传入有参数，遍历处理，把参数存在数组中
  if (arguments.length > 1) {
    for (var i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']')
    }

    // 理解一下：
    // args 等于 [arguments[1], arguments[2]]
    // 'context._fn(' + args + ')' 等于 'context._fn(arguments[1], arguments[2])'

    result = eval('context._fn(' + args + ')')

  } else {
    result = context._fn()
  }

  // 删除方法
  delete context._fn

  // 返回函数调用结果
  return result
}

/**
 * ES6 写法
 * @param context
 * @param args
 * @return {*}
 * @private
 */
Function.prototype._call2 = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('需要函数调用')
  }

  context = context || window
  context._fn = this
  return context._fn(...args)
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

foo._call(o, 1024) // bob, 1024
foo._call2(o, 1024) // bob, 1024
