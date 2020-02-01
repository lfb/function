/**
 * 数组去重，兼容好
 *
 * @param array
 * @return {Array}
 */
function _unique(array) {
  var res = []

  for (var i = 0, len = array.length; i < len; i++) {
    for (var j = 0, resLen = res.length; j < resLen; j++) {
      if (array[i] === res[j]) {
        break
      }
    }
    // 如果array[i]是唯一的，那么执行完循环，j等于resLen
    if (j === resLen) {
      res.push(array[i])
    }
  }
  return res
}

/**
 * 简单直接，兼容好
 *
 * @param array
 * @return {Array}
 * @private
 */
function _unique2(array) {
  var indexOf = [].indexOf ? function (arr, item) {
    return arr.indexOf(item)
  } : function (arr, item) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === item) {
        return i
      }
    }
    return -1
  }

  var resArr = []

  for (var i = 0, len = array.length; i < len; i++) {
    var item = array[i]
    if (indexOf(resArr, item) === -1) {
      resArr.push(item)
    }
  }
  return resArr
}

/**
 * 兼容好，性能好
 *
 * @param array
 * @return {Array}
 * @private
 */
function _unique3(array) {
  var resArr = [], hash = {}

  for (var i = 0, len = array.length; i < len; i++) {
    var item = array[i]
    var key = typeof (item) + item

    if (hash[key] !== 1) {
      resArr.push(item)
      hash[key] = 1
    }
  }

  return resArr
}

/**
 * 速度快
 *
 * @param array
 * @return {Array}
 * @private
 */
function _unique4(array) {
  var resArr = []
  var sortArray = array.concat().sort()
  var seen

  for (var i = 0, len = sortArray.length; i < len; i++) {
    var item = sortArray[i]
    if (i === 0 || seen !== item) {
      resArr.push(item)
    }
    seen = item
  }

  return resArr
}

/**
 * 新需求：字母大小写视为相同，如：a 和 A 是相同的
 *
 * @param array
 * @param iteratee
 */
function _unique5(array, iteratee) {
  var resArr = []
  var indexOf = [].indexOf ? function (arr, item) {
    return arr.indexOf(item)
  } : function (arr, item) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === item) {
        return i
      }
    }
    return -1
  }

  for (var i = 0, len = array.length; i < len; i++) {
    var item = array[i]
    var value = iteratee ? iteratee(item) : value
    if (iteratee) {
      if (indexOf(resArr, value) === -1) {
        resArr.push(value)
      }

    } else {
      if (indexOf(resArr, item) === -1) {
        resArr.push(item)
      }
    }
  }

  return resArr
}

/**
 * 使用 filter 方法去重
 * @param array
 * @private
 */
function _unique6(array) {
  return array.filter(function (item, index, array) {
    console.log(array.indexOf(item))
    return array.indexOf(item) === index
  })
}

/**
 * 排序去重
 *
 * @param array
 * @return {*}
 * @private
 */
function _unique7(array) {
  return array.concat().sort().filter(function (item, index, array) {
    return index === 0 || item !== array[index - 1]
  })
}

/**
 * 对象 key 去重
 * @param array
 * @return {*}
 * @private
 */
function _unique8(array) {
  var obj = {}
  return array.filter(function (item, index, array) {
    var key = typeof item + item
    return obj.hasOwnProperty(key) ? false : obj[key] = true
  })
}

/**
 * ES6 Set 去重
 *
 * @param array
 * @private
 */
var _unique9 = array => [...new Set(array)]


/**
 * ES6 Map 去重
 *
 * @param array
 * @private
 */
function _unique10(array) {
  const map = new Map()
  return array.filter(item => !map.has(item) && map.set(item, 1))
}

console.log(_unique([1, '1', 2, 3, 3, 22, 2]))
console.log(_unique2([1, '1', 2, 3, 3, 22, 2]))
console.log(_unique3([1, '1', 2, 3, 3, 22, 2]))
console.log(_unique4([1, '1', 2, 3, 3, 22, 2]))
console.log(_unique5([1, '1', 2, 'a', 'A', 3, 3, 22, 2]))
console.log(_unique5([1, '1', 2, 'a', 'A', 3, 3, 22, 2], function (item) {
  return typeof item === 'string' ? item.toLowerCase() : item
}))

console.log(_unique6([1, '1', 2, 3, 3, 22, 2]))
console.log(_unique7([1, '1', 2, 3, 3, 22, 2]))
console.log(_unique8([1, '1', 2, 3, 3, 22, 2]))
console.log(_unique9([1, '1', 2, 3, 3, 22, 2]))
console.log(_unique10([1, '1', 2, 3, 3, 22, 2]))