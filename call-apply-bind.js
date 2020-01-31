/**
 * 模拟实现 call
 * @param context
 * @return {*}
 */
Function.prototype.call2 = function (context) {
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


/**
 * 模拟实现 apply
 * @param context
 * @param arr
 * @return {*}
 */
Function.prototype.apply2 = function (context, arr) {
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

/**
 * 模拟实现bind
 *
 * @param context
 * @return {function(): *}
 */
Function.prototype.bind2 = function (context) {
  if (typeof this !== 'function') {
    throw new Error('需要函数调用')
  }

  context = context || window
  var args = Array.prototype.slice.call2(arguments, 1)
  var _this = this

  function F() {
  }

  var _fn = function () {
    var bindArgs = Array.prototype.slice.call2(arguments)
    return _this.apply2(this instanceof F ? this : context, args.concat(bindArgs))
  }

  F.prototype = this.prototype
  _fn.prototype = new F()

  return _fn
}

var name = 'lynn'
var o = {
  name: 'bob'
}


function getName(age, kill) {
  console.log(this.name)
  console.log(age)
  console.log(kill)
}

getName.call2(o, 22, 'f')
getName.apply2(o, [12, 'g'])
var f = getName.bind2(o, 13333, '222')
f()