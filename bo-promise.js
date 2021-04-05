
try {
    module.exports = BoPromise
} catch (e) {
    console.log(e)
}

var PENDING = 'pending'
var RESOLVED = 'resolved'
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
    self.onResolvedCallback = []
    // promise 的 reject 的回调函数集，
    // 因为 promise 结束之前有可能有多个回调添加到它的上面
    self.onRejectedCallback = []

    function resolve(value) {
        if (value instanceof BoPromise) {
            return value.then(resolve, reject)
        }
        // 异步执行所有的回调函数
        setTimeout(function () {
            if (self.status === PENDING) {
                self.status = RESOLVED
                self.data = value
                // self.onResolvedCallback.forEach(cb => cb(value))
                for (var i = 0; i < self.onResolvedCallback.length; i++) {
                    self.onResolvedCallback[i](value)
                }
            }
        })
    }

    function reject(reason) {
        // 异步执行所有的回调函数
        setTimeout(function () {
            if (self.status === PENDING) {
                self.status = REJECTED
                self.data = reason
                // self.onRejectedCallback.forEach(cb => cb(reason))
                for (var j = 0; j < self.onRejectedCallback.length; j++) {
                    self.onRejectedCallback[j](reason)
                }
            }
        })
    }

    // executor 执行函数
    try {
        executor(resolve, reject)
    } catch (err) {
        reject(err)
    }
}


function resolvePromise(promise2, x, resolve, reject) {
    var then
    var thenCalledOrThrow = false

    // 对标准2.3.2节
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

        return false
    }

    // 对标准2.3.2节
    if ((x !== null) && ((typeof x === 'object') || typeof x === 'function')) {
        try {
            then = x.then

            if (typeof then === 'function') {
                then.call(
                    x,
                    function rs(y) {
                        if (thenCalledOrThrow) {
                            return false
                        }
                        thenCalledOrThrow = true
                        return resolvePromise(promise2, y, resolve, reject)
                    }, function rj(r) {
                        if (thenCalledOrThrow) {
                            return false
                        }
                        thenCalledOrThrow = true
                        return reject(r)
                    })
            } else {
                resolve(x)
            }
        } catch (e) {
            if (thenCalledOrThrow) {
                return false
            }
            return reject(e)
        }
    } else {
        resolve(x)
    }
}

/**
 * then 方法
 * @param onResolved 成功回调方法
 * @param onRejected 失败回调方法
 */
BoPromise.prototype.then = function (onResolved, onRejected) {
    var self = this
    var promise2 = null

    // then 的参数需要是function，如果传入不是函数，则需要重新默认函数处理
    onResolved = typeof onResolved === 'function' ? onResolved : function (value) {
        return value
    }
    onRejected = typeof onRejected === 'function' ? onRejected : function (reason) {
        throw reason
    }

    if (self.status === RESOLVED) {
        return promise2 = new BoPromise(function (resolve, reject) {
            // 异步执行 onResolved
            setTimeout(function () {
                try {
                    var x = onResolved(self.data)
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
            self.onResolvedCallback.push(function (value) {
                try {
                    var x = onResolved(value)
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


BoPromise.resolve = function (parameter) {
    if (parameter in BoPromise) {
        return parameter
    }
    return new BoPromise(function (resolve) {
        resolve(parameter)
    })
}

BoPromise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason)
    })
}

BoPromise.all = function (promiseList) {
    return new BoPromise(function (resolve, reject) {
        var count = 0
        var result = []
        var length = promiseList.length


        if (length === 0) {
            return resolve(result)
        }

        promiseList.forEach(function (promise, index) {
            BoPromise.resolve(promise).then(function (value) {
                count++
                result[index] = value

                if (count === length) {
                    resolve(result)
                }
            }, function (reason) {
                reject(reason)
            })
        })
    })
}

BoPromise.race = function (promiseList) {
    return new BoPromise(function (resolve, reject) {
        var length = promiseList.length

        if (length === 0) {
            return resolve()
        } else {
            for (var i = 0; i < length; i++) {
                BoPromise.resolve(promiseList[i]).then(function (value) {
                    return resolve(value)
                }, function (reason) {
                    return reject(reason)
                })
            }
        }
    })
}

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
