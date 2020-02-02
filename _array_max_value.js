/**
 * 需求：求数组的最大值或最小值
 * 使用 JavaScript 内置的 Math.max() 和 Math.min() 方法基础上进行求值，其语法：Math.max([value1[,value2, ...]])
 * Math.max() 和 Math.min() 方法值得注意的是：
 *   如果有任一参数不能被转换为数值，则结果为 NaN。
 *   max 是 Math 的静态方法，所以应该像这样使用：Math.max()，而不是作为 Math 实例的方法 (简单的来说，就是不使用 new )
 *   如果没有参数，则结果为 -Infinity (注意是负无穷大)
 */

/**
 * 求数组的最大值方法1：遍历数组进行比较，首先拿第一个数组项，然后数组的每下一项进行比较
 *
 * @param array
 * @return {*|number}
 * @private
 */
function _ArrayMax(array) {
  var maxValue = array[0]
  for (var i = 1, len = array.length; i < len; i++) {
    maxValue = Math.max(maxValue, array[i])
  }
  return maxValue
}

/**
 * 求数组的最大值方法二：使用 reduce 方法，原理：每次传入进行迭代比较
 *
 * @param array
 * @private
 */
function _ArrayMax2(array) {
  return array.reduce(function (pre, next) {
    return Math.max(pre, next)
  })
}

/**
 * 求数组的最大值方法三：使用排序方法，先从小到大排序，最后一个值即就是最大值
 * @param array
 * @private
 */
function _ArrayMax3(array) {
  // array.concat().. 是为了尽量做到不影响原来的数组
  var newArr = array.concat().sort(function (a, b) {
    return a - b
  })
  return newArr[newArr.length - 1]
}

/**
 * 求数组的最大值方法四：使用 eval 方法，
 * 原理：eval 传入的都是字符串，数组会进行转为字符串，即类似 1, 2, 3 .. 这样
 *
 * @param array
 * @private
 */
function _ArrayMax4(array) {
  return eval("Math.max(" + array + ')')
}

/**
 * 求数组的最大值方法五：使用 apply 方法，apply 第二个传入的参数为数组，恰好利用好这点特性处理Match.max()的参数~
 * @param array
 * @private
 */
function _ArrayMax5(array) {
  return Math.max.apply(null, array)
}

/**
 * 求数组的最大值方法六：ES6 可拓展运算符(...)可以将一个数组变为参数序列
 * @param array
 * @private
 */
function _ArrayMax6(array) {
  return Math.max(...array)
}

/**
 * 求数组最小值同理，只不过将 Math.max 改为 Math.min 即可
 * 举个例子：
 */
function _ArrayMin(array) {
  return Math.min(...array)
}

/**
 * 测试
 * @type {number[]}
 */
var arr = [12, 3, 4, 1212, 312]
console.log(_ArrayMax(arr)) // 1212
console.log(_ArrayMax2(arr)) // 1212
console.log(_ArrayMax3(arr)) // 1212
console.log(_ArrayMax4(arr)) // 1212
console.log(_ArrayMax5(arr)) // 1212
console.log(_ArrayMax6(arr)) // 1212
console.log(_ArrayMin(arr)) // 3

console.log(arr) // 尽量做到不影响原来的数组