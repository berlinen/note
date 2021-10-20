// 实现new Proxy(target, handlers)

import { extend } from '@vue/shared'
// 是不是仅读的 设置 set时候会报异常
// 是不是深度的

// 核心拦截获取
const createGetter = (isReadonly = false, isShallow = false) => {

}

// 拦截设置值
const createSetter = (isShallow = false) => {

}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true, false)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const shallowSet = createSetter(true)

let readonlyObj = {
  set: (target, key, value) => {
    console.log(`can not set ${key} equal ${value} on target ${target}`)
  }
}

const mutableHandlers = {
  get,
  set
}

const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet
}

const readonlyHandlers = extend({
  get: readonlyGet,
}, readonlyObj)

const shallowReadonlyHandlers = extend({
  get: shallowReadonlyGet
}, readonlyObj)

export {
  mutableHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers
}