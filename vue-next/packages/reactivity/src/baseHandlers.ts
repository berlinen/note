// 实现new Proxy(target, handlers)

import { extend, hasChange, hasOwn, isArray, isInTegerKey, isObject } from '@vue/shared'
import { reactive, readonly } from './reactive'
import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operators'

// 是不是仅读的 设置 set时候会报异常
// 是不是深度的

// 核心拦截获取
const createGetter = (isReadonly = false, isShallow = false) => {
  return function get(target, key, receiver) {
    // proxy + reflect
    // 后续的object上的方法会被移动到Reflect上
    // 以前的target[key] = value 方式设置值可能会失败 不会报异常 也没有返回值标识
    // Reflect 方法都具备返回值
    const res = Reflect.get(target, key, receiver)

    if(!isReadonly) {
      // 收集依赖没数据变化后可以更新对应的视图
      track(target, TrackOpTypes.GET, key)
    }
    // 如果是浅的 直接返回第一层
    if(isShallow)  {
      return res
    }
    // 如果不是浅的
    if(isObject(res)) { // v2 一上来就会递归 v3 取值得时候会代理 v3 是懒代理方式
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

// 拦截设置值
const createSetter = (isShallow = false) => {
  return function set(target, key, value, receiver) {

    const oldValue = target[key] // 获取老的值

    // 判断target是否有这个key值
    const hadKey = isArray(target) && isInTegerKey(key) ? Number(key) < target.length : hasOwn(target, key)

    const res = Reflect.set(target, key, value, receiver)
    // 区分新增 还是修改的 v2无法监控更改碎银 无法监控数组的长度  hack方法 需要特殊处理

    // 当数据更新时 通知对应属性的effect重新执行

    if(!hadKey) {
      // 新增
      trigger(target, TriggerOpTypes.ADD, key, value)
    } else if(hasChange) {
      // 修改
      trigger(target, TriggerOpTypes.SET, key, value, oldValue)
    }

    return res
  }
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true, false)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const shallowSet = createSetter(true)

let readonlyObj = {
  set: (target, key, value) => {
    console.warn(`can not set ${key} equal ${value} on target`)
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