/**
 * 模拟实现 instanceof 操作符
 *
 * @param L
 * @param R
 * @return {boolean}
 * @private
 */
function _instanceof(L, R) {
  if (L == null) {
    return false
  }

  L = L.__proto__
  R = R.prototype

  while (true) {
    if (L == null) {
      return false
    }
    if (L === R) {
      return true
    }
    L = L.__proto__
  }
}

var arr = []

function F() {
}

console.log(_instanceof(arr, Array))
console.log(_instanceof(123, Object))
console.log(_instanceof(null, Object))
console.log(_instanceof(undefined, Object))
