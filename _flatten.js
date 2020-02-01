/**
 * 递归
 *
 * @param array
 * @return {Array}
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
 * toString 如果数组全是数字的情况下
 *
 * @param array
 * @private
 */
function _flatten2(array) {
  return array.toString().split(',').map(function (item) {
    return +item
  })
}

/**
 * reduce 实现
 *
 * @param array
 * @return {*}
 * @private
 */
function _flatten3(array) {
  return array.reduce(function (pre, next) {
    return pre.concat(Array.isArray(next) ? _flatten3(next) : next)
  }, [])
}


/**
 * 使用ES6 拓展符实现
 *
 * @param array
 * @return {*|*[]}
 * @private
 */
function _flatten4(array) {
  while (array.some(item => Array.isArray(item))) {
    array = [].concat(...array)
  }
  return array
}

var arr = [1, [2, 3, [4, 5, 6]]]
console.log(_flatten(arr))
console.log(_flatten2(arr))
console.log(_flatten3(arr))
console.log(_flatten4(arr))
