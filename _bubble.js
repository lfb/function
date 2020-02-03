/**
 * 冒泡排序
 *
 * 从小到大排序原理：每次比较相邻的2个数字，如果左边大于右边，则交换2个数字的位置。
 *
 * @param array 数组
 * @return {Array|*} 数组
 * @private
 */
function _bubble(array) {
  if (!(array instanceof Array)) {
    return array
  }

  var len = array.length
  // // 设定一个标记，若为true，则表示此次循环没有进行交换，也就是待排序列已经有序，排序已经完成。
  var flag = true
  for (var i = 0; i < len - 1; i++) {
    for (var j = 0; j < len - 1 - i; j++) {
      // 如果前一个数字比后面的数字大，则交换位置
      // 如果是从大到大，大于号 > 改为 < 小于号
      if (array[j] > array[j + 1]) {
        var temp = array[j]
        array[j] = array[j + 1]
        array[j + 1] = temp
        flag = false
      }
    }
    if (flag) {
      break
    }
  }
  return array
}

/**
 * 测试
 * @type {number[]}
 */
var array = [1, 23, 12, 33, 22, 12, 15]
var array2 = [1, 23, 23, 33, 15, 12, 15]
console.log(_bubble(array))
console.log(_bubble(array2))