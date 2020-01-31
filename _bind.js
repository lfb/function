/**
 * 模拟实现bind 方法
 *
 * @param context
 * @return {function(): *}
 */
Function.prototype._bind = function (context) {
  if (typeof this !== 'function') {
    throw new Error('需要函数调用')
  }

  context = context || window
  var args = Array.prototype.slice.call(arguments, 1)
  var _this = this

  function F() {
  }

  var _fn = function () {
    var bindArgs = Array.prototype.slice.call(arguments)
    return _this.apply(this instanceof F ? this : context, args.concat(bindArgs))
  }

  F.prototype = this.prototype
  _fn.prototype = new F()

  return _fn
}
