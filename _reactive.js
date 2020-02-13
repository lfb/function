/**
 * 定义响应式
 *
 * @param obj 对象
 * @param key 对象key
 * @param val 对象的键值
 */
function defineReactive(obj, key, val) {
  const dep = new Dep()

  /**
   * @param obj 对象
   * @param key 对象的key
   * @param descriptor 描述符
   */
  Object.defineProperty(obj, key, {
    // 是否可以删除修改
    configurable: true,
    // 是否可以枚举
    enumerable: true,
    // 读取对象属性的时候触发
    get: function reactiveGetter() {
      // 收集依赖：Watcher
      dep.addSub(Dep.target)
      return val
    },
    // 设置对象属性值的时候触发
    set: function reactiveSetter(newVal) {
      if (newVal !== val) {
        val = newVal
        // 触发依赖更新
        dep.notify(newVal)
      }
    }
  })
}

/**
 * 观察者
 * @param obj
 */
function observer(obj) {
  if(!obj && typeof obj !== 'object'){
    return
  }
  // Object.keys 返回一个key数组，不包含原型上的属性
  // for-in 可能会返回原型上的方法
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

/**
 * 订阅者 Dep
 *
 * 用 addSub 方法可以在目前的 Dep 对象中增加一个 Watcher 的订阅操作；
 * 用 notify 方法通知目前 Dep 对象的 subs 中的所有 Watcher 对象触发更新操作。
 */
class Dep {
  // 存放 Watcher 对象
  constructor() {
    this.subs = []
  }

  // 新增一个 Watcher 对象
  addSub(sub) {
    this.subs.push(sub)
  }

  // 通知更新
  notify(newVal) {
    this.subs.forEach(sub => {
      sub.update(newVal)
    })
  }
}

/**
 * 观察者 Watcher

 */
class Watcher {
  constructor() {
    Dep.target = this
  }

  update(newVal) {
    console.log(`新值: ${newVal}, 更新啦~ `)
  }
}

Dep.target = null

class Vue {
  constructor(options) {
    this._data = options.data
    observer(this._data)
    new Watcher()
    // 模拟首次 render function 渲染, 读取对象的值，收集依赖
    console.log('render ~', this._data.name)
  }
}

const vm = new Vue({
  data: {
    name: '梁凤波'
  }
})

// 触发依赖，通知更新
vm._data.name = '林峰'