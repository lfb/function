/**
 * 节流的原理很简单：如果你持续触发事件，每隔一段时间，只执行一次事件
 *
 * 第一种：使用时间戳实现：
 *   首先初始化一个时间戳 previous 为 0，然后创建一个当前执行的时间戳 now，
 *   当 now - previous 大于设置的时间 delay 时，执行调用函数，如果小于，则不执行。
 *
 * 第二种：定时器实现节流：
 *   开始初始化一个定时器变量 timeout，判断 timeout 定时器值为空的时候，开启一个新定时器且赋值给 timeout，
 *   当 timeout 定时器设置的时间到了， 就会执行函数，执行完毕后就把 timeout 清空，重新轮回。
 *
 * 区别：
 *   第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行。
 *   第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件
 *
 *
 * @param fn 执行的回调函数
 * @param delay 设置的触发时间
 * @private
 */
function _throttle(fn, delay) {
  var timeout

  return function () {
    var context = this
    var args = arguments

    if (!timeout) {
      timeout = setTimeout(function () {
        timeout = null
        fn.apply(context, args)
      }, delay)
    }
  }
}

/**
 * 时间戳实现节流
 *
 * @param fn 执行的回调函数
 * @param delay 设置的触发时间
 * @return {Function}
 * @private
 */
function _throttle2(fn, delay) {
  var previous = 0

  return function () {
    var args = arguments
    var context = this
    var now = +new Date()

    if (now - previous > delay) {
      fn.apply(context, args)
      previous = now
    }
  }
}

/**
 * 定时器与时间戳相结合优化实现节流
 *
 * @param fn 执行的回调函数
 * @param delay 设置的触发时间
 * @private
 */
function _throttle3(fn, delay) {
  var previous = 0, timeout

  return function () {
    var args = arguments
    var context = this
    var now = +new Date()

    // 离下一次触发的时间
    var remaining = delay - (now - previous)
    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      fn.apply(context, args)
      previous = now

    } else if (!timeout) {
      timeout = setTimeout(function () {
        timeout = null
        previous = +new Date()
        fn.apply(context, args)

      }, remaining)
    }
  }
}