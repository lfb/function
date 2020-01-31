/**
 * 模拟实现 call 方法
 * @param context
 * @return {*}
 */
Function.prototype._call = function (context) {
  if (typeof this !== 'function') {
    throw new Error('需要函数调用')
  }

  context = context || window
  context._fn = this

  var args = [], result
  if (arguments.length > 1) {
    for (var i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']')
    }
    result = eval('context._fn(' + args + ')')

  } else {
    result = context._fn()
  }

  delete context._fn

  return result
}

