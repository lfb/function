/**
 * 模拟实现数组的 findIndx 查找方法
 *
 * @param fn
 * @param context
 * @return {number}
 */
Array.prototype._findIndex = function (fn, context) {
  if (!(this instanceof Array)) {
    throw new Error('需要数组调用')
  }

  var arr = this, len = this.length
  for (var i = 0; i < len; i++) {
    // 原理就是：遍历数组，然后执行回调方法，保持参数正确~
    if (fn.call(context, arr[i], i, arr)) {
      return i
    }
  }
  return -1
}

/**
 * 测试
 * @type {number[]}
 */
var arr = [1, 2, 3, 4]
console.log(arr._findIndex(item => item === 2)) // 1
console.log(arr._findIndex(item => item === 10)) // -1


/**
 * findIndex 是正序查询的，原理不变，来实现一个倒序查询的
 * @param fn
 * @param context
 */
Array.prototype._lastIndexOf = function (fn, context) {
  if (!(this instanceof Array)) {
    throw new Error('需要数组调用')
  }
  var arr = this, len = this.length
  // 倒序遍历
  for (var i = len - 1; i >= 0; i--) {
    if (fn.call(context, arr[i], i, arr)) {
      return i
    }
  }
  return -1
}

/**
 * 测试
 * @type {number[]}
 */
var arr2 = [1, 2, 23, 21, 33, 2, 1]
console.log(arr2._lastIndexOf(item => item === 2)) // 5
console.log(arr2._lastIndexOf(item => item === 33)) // 4

/**
 * 其实findIndex 原理与 indexOf 用法差不多，也来实现一个 indexOf，
 * 最简单的原理就是遍历每个数组项，查询val是否出现在数组的位置，有则返回该下标，无则返回 -1
 * @param val 查询的数组项
 * @return {number}  有则返回该下标，无则返回 -1
 */
Array.prototype._indexOf = function (val) {
  if (!(this instanceof Array)) {
    throw new Error('需要数组调用')
  }

  var arr = this, len = this.length
  for (var i = 0; i < len; i++) {
    if (arr[i] === val) {
      return i
    }
  }
  return -1
}

/**
 * 测试
 */
var arr3 = [1, 3, 21, 32, 123, 92]
console.log(arr3._indexOf(33)) // -1
console.log(arr3._indexOf(3)) // 1
console.log(arr3._indexOf(123)) // 4
