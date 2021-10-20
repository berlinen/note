import { isObject } from "@vue/shared"
import {
  mutableHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'

export function reactive(target) {
  return creatReactiveObject(target, false, mutableHandlers)
}

export function shallowReactive(target) {
  return creatReactiveObject(target, false, shallowReactiveHandlers)
}

export function readonly(target) {
  return creatReactiveObject(target, true, readonlyHandlers)
}

export function shallowReadonly(target) {
  return creatReactiveObject(target, true, shallowReadonlyHandlers)
}

// 是不是只读，是不是深度 柯里化
// new Proxy 最核心的是需要拦截数据的读取喝数据的修改
/**
 *
 * @param target
 * @param isReadonly 是否只读
 * @param baseHandlers handlers
 */
// 会被自动垃圾回收 不会造成内存泄露
const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()
export function creatReactiveObject(target, isReadonly, baseHandlers) {
  // 如果目标不是对象 就无法拦截了 reactive这个api只能拦截对象
  if(!isObject(target)) return target

  // 如果某个对象被代理过就不需要代理这个对象了
  // 可能一个对象 被代理深度 又被仅读代理
  const proxyMap = isReadonly ? readonlyMap : reactiveMap
  // 判断是否这个target存过代理
  const existProxy = proxyMap.get(target)

  if(existProxy) {
    return existProxy // 如果已经被代理了， 直接从缓存中获取
  }

  const proxy = new Proxy(target, baseHandlers)

  proxyMap.set(target, proxy)// 将要代理的对戏喝对应代理结果缓存起来

  return proxy
}