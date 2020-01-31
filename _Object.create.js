function _ObjectCreate(proto) {
  if (typeof proto !== 'object') {
    throw new TypeError('需要传入对象');
  }

  function F() {
  }

  F.prototype = proto

  return F()
}

