/**
 * 防抖
 *
 * @param fn
 * @param delay
 * @param immediate
 * @private
 */
function _debounce(fn, delay, immediate) {
  var timeout

  return function () {
    if (timeout) {
      clearTimeout(timeout)
    }

    var context = this
    var args = arguments

    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, delay)

      if (callNow) {
        fn.apply(context, args)
      }


    } else {
      timeout = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }
}
