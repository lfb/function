/**
 * 防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，
 * 如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，
 * 总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行
 *
 * 也可以简单的概括：无论触发多少次，最后一次触发说了算
 *
 * 实现原理：定时器 --> 每次进入创建一个定时器，
 * --> 如果在规定时间之前还有进入触发，则清除上一次的定时器，再重新创建新定时器，
 * --> 直到时间到了，就进行触发调用函数。
 *
 * @param fn 传入的函数
 * @param delay 触发描述，单位毫秒
 * @param immediate 是否立即调用 true | false
 * @return {function(): *}
 */
function _debounce(fn, delay, immediate) {
  var timeout, result

  var _debounce = function () {
    var context = this
    var args = arguments

    if (timeout) {
      clearTimeout(timeout)
    }

    if (immediate) {
      var callNow = !timeout

      // 到了时间再去重新执行
      // clearTimeout(timeout) 是暂停了时器，但定时器还是存在
      // timeout = null 才是真正的清除定时器
      timeout = setTimeout(function () {
        timeout = null
      }, delay)

      if (callNow) {
        // 可能存在返回值
        result = fn.apply(context, args)
      }

    } else {
      timeout = setTimeout(function () {
        // setTimeout 是异步执行，需要等待秒数
        // 这时返回 result 会一直是 undefined
        fn.apply(context, args)
      }, delay)
    }

    return result
  }

  // 可以取消节流
  _debounce.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }

  return _debounce
}