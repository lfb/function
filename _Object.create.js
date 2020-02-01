/**
 * 模拟实现 Object.create() 方法
 *
 * Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
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

  return new F()
}

/**
 * 测试：完成一个继承例子
 */
function Parent(name) {
  this.name = name
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

Child.prototype = _ObjectCreate(Parent.prototype)

var o = new Child('lynn', 16)

console.log(o.name)
console.log(o.age)
console.log(o) // { name: 'lynn', age: 16 }
o.getName() // lynn
console.log(o instanceof Child) // true
console.log(o instanceof Parent) // true
console.log(o instanceof Object) // true



