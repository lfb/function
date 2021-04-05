try {
    // 测试
    // npm i -g promises-aplus-tests
    // promises-aplus-tests Promise.js

    module.exports = BoPromise
} catch (e) {
    console.log(e)
}

var PENDING = 'pending'
var FULFILLED = 'fulfilled'
var REJECTED = 'rejected'

/**
 * Bo Promise 方法
 * @param executor
 * @executor
 */
function BoPromise(executor) {
    var self = this
    // promise 当前状态
    self.status = PENDING
    // promise 的值
    self.data = null
    // promise 的 resolve 时的回调函数集，
    // 因为 promise 结束之前有可能有多个回调添加到它的上面
    self.onFulfilledCallback = []
    // promise 的 reject 的回调函数集，
    // 因为 promise 结束之前有可能有多个回调添加到它的上面
    self.onRejectedCallback = []

    // 定义 resolve 函数
    function resolve(value) {
        if (value instanceof BoPromise) {
            return value.then(resolve, reject)
        }
        // 异步执行所有的回调函数
        setTimeout(function () {
            if (self.status === PENDING) {
                // 异步任务成功，把结果赋值给 value
                self.data = value
                // 当前状态切换为 resolved
                self.status = FULFILLED
                for (var i = 0; i < self.onFulfilledCallback.length; i++) {
                    self.onFulfilledCallback[i](value)
                }
            }
        })
    }

    function reject(reason) {
        // 异步执行所有的回调函数
        setTimeout(function () {
            if (self.status === PENDING) {
                // 异步任务失败，把结果赋值给 value
                self.data = reason
                self.status = REJECTED
                for (var j = 0; j < self.onRejectedCallback.length; j++) {
                    self.onRejectedCallback[j](reason)
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
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise!'))
    }

    // 对标准2.3.2节
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
    // 决议程序规范：如果x是一个对象或者函数，则需要额外处理下
    if ((x !== null) && ((typeof x === 'object') || typeof x === 'function')) {
        try {
            // 首先是看它有没有 then 方法（是不是 thenable 对象）
            // 如果是 thenable 对象，则将promise的then方法指向x.then。
            then = x.then
            // 如果 then 是是一个函数，那么用x为this来调用它，
            // 第一个参数为 resolvePromise，第二个参数为 rejectPromise
            if (typeof then === 'function') {
                then.call(
                    x,
                    function rs(y) {
                        // 如果已经被 resolve/reject 过了，那么直接 return
                        if (thenCalledOrThrow) {
                            return
                        }
                        thenCalledOrThrow = true

                        // 进入决议程序（递归调用自身）
                        return resolvePromise(promise2, y, resolve, reject)
                    }, function rj(r) {

                        // 这里 thenCalledOrThrow 用法和上面意思一样
                        if (thenCalledOrThrow) {
                            return
                        }
                        thenCalledOrThrow = true
                        return reject(r)
                    })
            } else {
                // 如果then不是function，用x为参数执行promise
                resolve(x)
            }
        } catch (e) {
            if (thenCalledOrThrow) {
                return false
            }
            return reject(e)
        }
    } else {
        // 如果x不是一个object或者function，用x为参数执行promise
        resolve(x)
    }
}

/**
 * then 方法接收两个函数作为入参（可选）
 *
 * @param onFulfilled 成功回调方法
 * @param onRejected 失败回调方法
 */
BoPromise.prototype.then = function (onFulfilled, onRejected) {
    // 依然是保存 this
    var self = this
    var promise2 = null

    // 注意，onFulfilled 和 onRejected必须是函数；如果不是，我们此处用一个透传来兜底
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) {
        return value
    }
    onRejected = typeof onRejected === 'function' ? onRejected : function (reason) {
        throw reason
    }

    // 判断是否是 resolved 状态
    if (self.status === FULFILLED) {
        return promise2 = new BoPromise(function (resolve, reject) {
            // 异步执行 onFulfilled
            setTimeout(function () {
                try {
                    var x = onFulfilled(self.data)
                    resolvePromise(promise2, x, resolve, reject)
                    resolve(x)
                } catch (e) {
                    reject(e)

                }
            })

        })
    }

    if (self.status === REJECTED) {
        return promise2 = new BoPromise(function (resolve, reject) {

            // 异步执行 onRejected
            setTimeout(function () {
                try {
                    var x = onRejected(self.data)
                    resolvePromise(promise2, x, resolve, reject)

                } catch (e) {
                    reject(e)
                }
            })

        })
    }

    if (self.status === PENDING) {
        // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，
        // 而resolve或reject函数里的内容已是异步执行，构造函数里的定义
        return promise2 = new BoPromise(function (resolve, reject) {
            self.onFulfilledCallback.push(function (value) {
                try {
                    var x = onFulfilled(value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })

            self.onRejectedCallback.push(function (reason) {
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
