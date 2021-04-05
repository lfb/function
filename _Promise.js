try {
    // 测试
    // npm i -g promises-aplus-tests
    // promises-aplus-tests Promise.js

    module.exports = BoPromise
} catch (e) {
    console.log(e)
}

// 一个 Promise 的当前状态必须为以下三种状态中的一种：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。
var PENDING = 'pending'
var FULFILLED = 'fulfilled'
var REJECTED = 'rejected'

/**
 * promise 是一个拥有 then 方法的对象或函数，其行为符合本规范；
 *
 * @param executor
 * @executor
 */
function BoPromise(executor) {
    var context = this
    // promise 当前状态
    context.status = PENDING
    // promise 的值
    context.data = null
    // promise 的 resolve 时的回调函数集，
    // 因为 promise 结束之前有可能有多个回调添加到它的上面
    context.onFulfilledCallback = []
    // promise 的 reject 的回调函数集，
    // 因为 promise 结束之前有可能有多个回调添加到它的上面
    context.onRejectedCallback = []

    // 定义 resolve 函数
    function resolve(value) {
        if (value instanceof BoPromise) {
            return value.then(resolve, reject)
        }
        // 异步执行所有的回调函数
        setTimeout(function () {
            if (context.status === PENDING) {
                // 异步任务成功，把结果赋值给 value
                context.data = value
                // 当前状态切换为 resolved
                context.status = FULFILLED
                for (var i = 0; i < context.onFulfilledCallback.length; i++) {
                    context.onFulfilledCallback[i](value)
                }
            }
        })
    }

    function reject(reason) {
        // 异步执行所有的回调函数
        setTimeout(function () {
            if (context.status === PENDING) {
                // 异步任务失败，把结果赋值给 value
                context.data = reason
                context.status = REJECTED
                for (var j = 0; j < context.onRejectedCallback.length; j++) {
                    context.onRejectedCallback[j](reason)
                }
            }
        })
    }

    try {
        // executor 执行函数
        // 把 resolve 和 reject 能力赋予执行器
        executor(resolve, reject)
    } catch (err) {
        reject(err)
    }
}


function resolvePromise(promise2, x, resolve, reject) {
    var then
    // 这个标识，是为了确保 resolve、reject 不要被重复执行
    var thenCalledOrThrow = false

    // 对标准2.3.2节
    // 决议程序规范：如果 resolve 结果和 promise2相同则reject，这是为了避免死循环
    // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise!'))
    }

    // 对标准2.3.2节
    // x 为 Promise
    // 如果 x 为 Promise ，则使 promise 接受 x 的状态 注4：
    //
    // 如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
    // 如果 x 处于执行态，用相同的值执行 promise
    // 如果 x 处于拒绝态，用相同的据因拒绝 promise
    if (x instanceof BoPromise) {
        if (x.status === PENDING) {
            x.then(function (value) {
                resolvePromise(promise2, value, resolve, reject)
            }, reject)
        } else {
            x.then(resolve, reject)
        }

        return
    }

    // 对标准2.3.2节
    // x 为对象或函数
    // 决议程序规范：如果x是一个对象或者函数，则需要额外处理下
    if ((x !== null) && ((typeof x === 'object') || typeof x === 'function')) {
        try {
            // 首先是看它有没有 then 方法（是不是 thenable 对象）
            // 如果是 thenable 对象，则将promise的then方法指向x.then。
            then = x.then
            // 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
            // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise:
            if (typeof then === 'function') {
                then.call(
                    x,
                    function rs(y) {
                        // 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
                        if (thenCalledOrThrow) {
                            return
                        }
                        thenCalledOrThrow = true

                        // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
                        return resolvePromise(promise2, y, resolve, reject)
                    }, function rj(r) {

                        // 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
                        if (thenCalledOrThrow) {
                            return
                        }
                        thenCalledOrThrow = true
                        // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                        return reject(r)
                    })
            } else {
                // 如果then不是function，用x为参数执行promise
                resolve(x)
            }

            // 如果调用 then 方法抛出了异常 e：
        } catch (e) {
            // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
            if (thenCalledOrThrow) {
                return false
            }
            // 否则以 e 为据因拒绝 promise
            return reject(e)
        }
    } else {
        // 如果x不是一个object或者function，用x为参数执行promise
        resolve(x)
    }
}

/**
 * then 方法必须返回一个 promise 对象，接收两个函数作为入参（可选）
 *
 * 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)
 * 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
 * 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
 * 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
 * 即：不论 promise1 被 reject 还是被 resolve 时 promise2 都会被 resolve，只有出现异常时才会被 rejected。
 *
 * @param onFulfilled 成功回调方法 如果 onFulfilled 是函数：
 *    当 promise 执行结束后其必须被调用，其第一个参数为 promise 的终值
 *    在 promise 执行结束前其不可被调用
 *    其调用次数不可超过一次
 * @param onRejected 失败回调方法 如果 onRejected 是函数：
 *    当 promise 被拒绝执行后其必须被调用，其第一个参数为 promise 的据因
 *    在 promise 被拒绝执行前其不可被调用
 *    其调用次数不可超过一次
 * onFulfilled 和 onRejected 必须被作为函数调用（即没有 this 值）
 * then 方法可以被同一个 promise 调用多次
 * 当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
 * 当 promise 被拒绝执行时，所有的 onRejected 需按照其注册顺序依次回调
 */
BoPromise.prototype.then = function (onFulfilled, onRejected) {
    // 依然是保存 this
    var context = this
    var promise2 = null

    // 注意，onFulfilled 和 onRejected必须是函数；如果不是，我们此处用一个透传来兜底
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) {
        return value
    }
    onRejected = typeof onRejected === 'function' ? onRejected : function (reason) {
        throw reason
    }

    // 判断是否是 resolved 状态
    if (context.status === FULFILLED) {
        return promise2 = new BoPromise(function (resolve, reject) {
            // 异步执行 onFulfilled
            setTimeout(function () {
                try {
                    var x = onFulfilled(context.data)
                    resolvePromise(promise2, x, resolve, reject)
                    resolve(x)
                } catch (e) {
                    reject(e)

                }
            })

        })
    }

    if (context.status === REJECTED) {
        return promise2 = new BoPromise(function (resolve, reject) {

            // 异步执行 onRejected
            setTimeout(function () {
                try {
                    var x = onRejected(context.data)
                    resolvePromise(promise2, x, resolve, reject)

                } catch (e) {
                    reject(e)
                }
            })

        })
    }

    if (context.status === PENDING) {
        // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，
        // 而resolve或reject函数里的内容已是异步执行，构造函数里的定义
        return promise2 = new BoPromise(function (resolve, reject) {
            context.onFulfilledCallback.push(function (value) {
                try {
                    var x = onFulfilled(value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })

            context.onRejectedCallback.push(function (reason) {
                try {
                    var x = onRejected(reason)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }

            })

        })
    }

}


/**
 * catch 方法可以用来进行异常捕获
 *
 * @param onRejected
 * @return {BoPromise|BoPromise}
 */
BoPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
}

BoPromise.deferred = BoPromise.defer = function () {
    var dfd = {}
    dfd.promise = new BoPromise(function (resolve, reject) {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}


/**
 * BoPromise.resolve(value) 方法返回一个以给定值解析后的 Promise 实例对象
 *
 * @param parameter
 * @return {BoPromise|*}
 */
BoPromise.resolve = function (parameter) {
    if (parameter in BoPromise) {
        return parameter
    }
    return new BoPromise(function (resolve) {
        resolve(parameter)
    })
}

// 和 BoPromise 同理
BoPromise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason)
    })
}

/**
 * BoPromise.all(iterable) 返回一个 Promise 实例，
 * 此实例在 iterable 参数内的所有 Promise 实例都"完成"，（resolved）或者参数不包含 Promise 实例时完成回调 resolve
 * 如果参数中的 Promise 实例有一个失败（rejected）,则此实例回调失败（reject），失败原因是第一个Promise 实例失败的原因。
 *
 * @param promiseArray
 * @return {BoPromise}
 */
BoPromise.all = function (promiseArray) {
    if (!promiseArray instanceof Array) {
        throw new TypeError('The arguments should be an array!')
    }

    return new BoPromise(function (resolve, reject) {
        try {
            var resultArray = []
            var length = promiseArray.length

            for (var i = 0; i < length; i++) {
                promiseArray[i].then(function (data) {
                    resultArray.push(data)

                    if (resultArray.length === length) {
                        resolve(resultArray)
                    }
                }, reject)
            }
        } catch (e) {
            reject(e)
        }
    })
}

BoPromise.race = function (promiseArray) {
    if (!promiseArray instanceof Array) {
        throw new TypeError('The arguments should be an array!')
    }
    return new BoPromise(function (resolve, reject) {
        try {
            var length = promiseArray.length
            for (var i = 0; i < length; i++) {
                promiseArray[i].then(resolve, reject)
            }

        } catch (e) {
            reject(e)
        }
    })
}

// 在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数。
// 这为在Promise是否成功完成后都需要执行的代码提供了一种方式
BoPromise.prototype.finally = function (cb) {
    return this.then(function (value) {
        return BoPromise.resolve(cb()).then(function () {
            return value
        })
    }, function (err) {
        return BoPromise.resolve(cb()).then(function () {
            throw err
        })
    })
}
