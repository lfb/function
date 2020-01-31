/**
 * 定时器实现节流
 *
 * @param fn
 * @param delay
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
 * @param fn
 * @param delay
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
 * @param fn
 * @param delay
 * @private
 */
function _throttle3(fn, delay) {
  var previous = 0, timeout

  return function () {
    var args = arguments
    var context = this
    var now = +new Date()

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