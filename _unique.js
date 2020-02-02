/**
 * 双重遍历数组去重，优点：兼容好
 *
 * @param array 需要去重的数组
 * @return {Array} 返回去重后的新数组
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
 * 使用 indexOf 方法去重，优点：简单直接，兼容好
 *
 * @param array 需要去重的数组
 * @return {Array} 返回去重后的新数组
 * @private
 */
function _unique2(array) {
  // 兼容低版本数组没有 indexOf 方法，如果有直接使用，没有自定义创建
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
    // 判断数组项是否在新数组中存在了
    if (indexOf(resArr, item) === -1) {
      resArr.push(item)
    }
  }
  return resArr
}

/**
 * 使用对象唯一key去重
 * 优点：兼容好，性能好
 *
 * @param array  需要去重的数组
 * @return {Array} 返回去重后的新数组
 * @private
 */
function _unique3(array) {
  var resArr = [], hash = {}

  for (var i = 0, len = array.length; i < len; i++) {
    var item = array[i]

    // 生成的key
    var key = typeof (item) + item
    // 当对象的key值不等于1时，说明数组里面还没有该值，所以存进去
    if (hash[key] !== 1) {
      resArr.push(item)
      // 当存进去后，手动把对象的key值改为1
      hash[key] = 1
    }
  }

  return resArr
}

/**
 * 先把数组排序再进行前后2个对比进行去重
 *
 * 优点：速度快
 *
 * @param array 需要去重的数组
 * @return {Array} 返回去重后的新数组
 * @private
 */
function _unique4(array) {
  var resArr = []
  var sortArray = array.concat().sort()
  var seen

  for (var i = 0, len = sortArray.length; i < len; i++) {
    var item = sortArray[i]
    // 当排序好了的数组，第一个项就是未存进新数组里面的。
    if (i === 0 || seen !== item) {
      resArr.push(item)
    }
    seen = item
  }

  return resArr
}

/**
 * 新需求去重：字母大小写视为相同，如：a 和 A 是相同的
 * 同样使用 indexOf 方法
 *
 * @param array 需要去重的数组
 * @param iteratee 迭代器
 * @return {Array} 返回去重后的数组
 * @private
 */
function _unique5(array, iteratee) {
  // 兼容低版本数组没有 indexOf 方法 情况
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
    // 当存在迭代器时，先处理该项
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
 *
 * 使用 filter 与 indexOf 方法结合去重
 *
 * @param array 要处理去重的数组
 * @return 返回去重后的数组
 * @private
 */
function _unique6(array) {
  return array.filter(function (item, index, array) {
    return array.indexOf(item) === index
  })
}

/**
 * 使用 filter 与 排序结合去重
 *
 * @param array 要处理去重的数组
 * @private
 */
function _unique7(array) {
  return array.concat().sort().filter(function (item, index, array) {
    return index === 0 || item !== array[index - 1]
  })
}

/**
 * 使用 filter 与 对象唯一的key值 去重
 * @param array 要处理去重的数组
 * @return {*} 返回去重后的数组
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
 * ES6 Set 去重，优点：方便快捷
 *
 * @param array
 * @private
 */
var _unique9 = array => [...new Set(array)]


/**
 * ES6 Map 去重，优点：方便快捷
 *
 * @param array
 * @private
 */
function _unique10(array) {
  const map = new Map()
  return array.filter(item => !map.has(item) && map.set(item, 1))
}

/**
 * 测试
 */
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