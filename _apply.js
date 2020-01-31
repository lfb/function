/**
 * 模拟实现 apply 方法
 * @param context
 * @param arr
 * @return {*}
 */
Function.prototype._apply = function (context, arr) {
  if (typeof this !== 'function') {
    throw new Error('需要函数调用')
  }

  context = context || window
  context._fn = this

  var args = [], result
  if (arr instanceof Array && arr.length > 0) {
    for (var i = 0; i < arr.length; i++) {
      args.push('arr[' + i + ']')
    }
    result = eval('context._fn(' + args + ')')

  } else {
    result = context._fn()
  }

  delete context._fn
  return result
}
