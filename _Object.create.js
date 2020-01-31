/**
 * 模拟实现 Object.create() 方法
 *
 * @param proto
 * @return {*}
 * @private
 */
function _ObjectCreate(proto) {
  if (typeof proto !== 'object') {
    throw new TypeError('需要传入对象');
  }

  function F() {
  }

  F.prototype = proto

  return F()
}

