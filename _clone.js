// 目标数组
var targetArr = [10, 20, 30, [40, 50, 60]]
// 目标对象
var targetObj = {
  name: 'bobo',
  like: {
    eat: {
      fruit: 'Mango'
    },
    coding: 'js',
  },
  getName: function () {
    return this.name
  }
}

/**
 * 数组浅拷贝：使用数组的 concat, slice, ...展开运算符 实现
 */

// 第一种方法: 使用数组的 concat() 方法来实现：
console.log([].concat(targetArr))
// 第二种方法: 使用数组的 slice 方法来实现
console.log(targetArr.slice())
// 第三种方法: 通过...展开运算符实现浅拷贝
console.log([...targetArr])


/**
 * 对象浅拷贝
 */
// 第一种方法: Object.assign(target, ...sources) 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。
// 它将返回目标对象。第一个参数是目标对象，第二个参数是一个或多个源对象。
console.log(Object.assign({}, targetObj))

// 第二种方法: 通过...展开运算符实现浅拷贝
console.log({...targetObj})

/**
 * 浅拷贝缺点：如果源对象的属性值是指向一个对象的引用，它也只是拷贝那个引用值。
 * 实现浅拷贝的方法：这个方法可以理解为前几个方法的原理，实际上就是根据传入的参数类型，创建一个对象或数组，然后将每个属性赋给新的对象或者数组：
 */
function shallowCopy(obj) {
  // 判断是否为对象
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }

  // 判断传入的对象是函数还是对象
  var newObj = obj instanceof Array ? [] : {}
  for (var key in obj) {
    // 只拷贝obj上的的属性
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key]
    }
  }

  return newObj
}

/**
 * 测试
 */
console.log(shallowCopy(targetArr))
console.log(shallowCopy(targetObj))

/**
 * 深拷贝:
 */
/**
 * 第一种方法: 使用 JSON.parse(JSON.stringify(object)) 实现
 *
 * 缺点：
 *   会忽略 undefined
 *   会忽略 symbol
 *   不能序列化函数
 *   不能解决循环引用的对象
 *   @type {any}
 */

console.log(JSON.parse(JSON.stringify(targetObj)))
console.log(JSON.parse(JSON.stringify(targetArr)))


/**
 * 自己实现深拷贝方法，在刚才实现的浅拷贝方法上，再判断一下属性值的类型，如果是对象，我们递归调用深拷贝函数即可
 * @param obj
 * @return object
 */
function deepClone(obj) {
  // 判断是否为对象
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }
  var newObj = obj instanceof Array ? [] : {}
  for (var key in obj) {
    // 只拷贝obj上的的属性
    if (obj.hasOwnProperty(key)) {
      // 如果属性值是对象，我们递归调用深拷贝函数
      newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    }
  }
  return newObj
}

/**
 * 测试
 */
console.log(deepClone(targetArr))
console.log(deepClone(targetObj))
