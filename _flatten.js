/**
 * 数组扁平化，递归实现
 *
 * @param array 需要扁平化的多维数组
 * @return {Array} 返回新的一维数组
 * @private
 */
function _flatten(array) {
  var res = []

  for (var i = 0, len = array.length; i < len; i++) {
    if (Array.isArray(array[i])) {
      res = res.concat(_flatten(array[i]))

    } else {
      res.push(array[i])
    }
  }

  return res
}

/**
 * 数组扁平化，toString 如果数组全是数字的情况下
 *
 * @param array 需要扁平化的多维数组
 * @return {Array} 返回新的一维数组
 * @private
 */
function _flatten2(array) {
  return array.toString().split(',').map(function (item) {
    return +item
  })
}

/**
 * 使用 reduce 实现数组扁平化
 *
 * @param array 需要扁平化的多维数组
 * @return {Array} 返回新的一维数组
 * @private
 */
function _flatten3(array) {
  return array.reduce(function (pre, next) {
    return pre.concat(Array.isArray(next) ? _flatten3(next) : next)
  }, [])
}


/**
 * 使用ES6 拓展符实现数组扁平化
 *
 * @param array 需要扁平化的多维数组
 * @return {Array} 返回新的一维数组
 * @private
 */
function _flatten4(array) {
  while (array.some(item => Array.isArray(item))) {
    array = [].concat(...array)
  }
  return array
}

/**
 * 测试
 * @type {*[]}
 */
var arr = [1, [2, 3, [4, 5, 6]]]
console.log(_flatten(arr))
console.log(_flatten2(arr))
console.log(_flatten3(arr))
console.log(_flatten4(arr))
