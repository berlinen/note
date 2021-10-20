import { isObject } from "@vue/shared"

const mutableHandlers = {

}

const shallowReactiveHandlers = {

}

export function reactive(target) {
  return creatReactiveObject(target, false, mutableHandlers)
}

export function shallowReactive(target) {
  return creatReactiveObject(target, false, shallowReactiveHandlers)
}

export function readonly(target) {
  return creatReactiveObject(target, true, mutableHandlers)
}

export function shallowReadonly(target) {
  return creatReactiveObject(target, true, shallowReactiveHandlers)
}

// 是不是只读，是不是深度 柯里化
// new Proxy 最核心的是需要拦截数据的读取喝数据的修改
/**
 *
 * @param target
 * @param isReadonly 是否只读
 * @param baseHandlers handlers
 */
export function creatReactiveObject(target, isReadonly, baseHandlers) {
  // 如果目标不是对象 就无法拦截了 reactive这个api只能拦截对象
}