/**
 * 模拟实现 instanceof 操作符
 * instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上
 *
 * @param L
 * @param R
 * @return {boolean}
 * @private
 */
function _instanceof(L, R) {
  // 传入是 undefined 或 null 直接 返回 false
  if (L == null) {
    return false
  }

  // 取左边对象的 __proto__
  L = L.__proto__
  // 取右边构造函数的 prototype
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

/**
 * 测试
 */
var arr = []

function F() {
}

console.log(_instanceof(arr, Array)) // true
console.log(_instanceof(123, Object)) // true
console.log(_instanceof(null, Object)) // false
console.log(_instanceof(undefined, Object)) // false
console.log(_instanceof({}, F)) // false
console.log(_instanceof({}, Object)) // true
console.log(_instanceof(new F(), Object)) // true

