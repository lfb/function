/**
 * 选择排序
 *
 * 排序原理为：
 *   1. 第一次遍历查询都取出最小或者最大的值，放到首位
 *   2. 然后继续每次遍历查询出最小或者最大的值，放在排好序的值后面
 *
 * 时间复杂度: O(n²)
 *
 * 优点：不占用额外的内存空间
 *
 * @param array
 * @return {*}
 * @private
 */
function _select(array) {
  var len = array.length
  for (var i = 0; i < len - 1; i++) {
    var minIndex = i
    for (var j = i + 1; j < len; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j
      }
    }
    var temp = array[i]
    array[i] = array[minIndex]
    array[minIndex] = temp
  }
  return array
}

/**
 * 测试
 * @type {number[]}
 */
var array = [1, 23, 12, 221, 22, 12, 15]
var array2 = [1, 23, 23, 341, 15, 12, 15]
console.log(_select(array)) // [ 1, 12, 12, 15, 22, 23, 221 ]
console.log(_select(array2)) // [ 1, 12, 15, 15, 23, 23, 341 ]



