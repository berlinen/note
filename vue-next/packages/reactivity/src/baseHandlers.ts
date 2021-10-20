// 实现new Proxy(target, handlers)

// 是不是仅读的 设置 set时候会报异常
// 是不是深度的

const createGetter = (isReadonly = false, isShallow = false) => {

}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true, false)
const shallowReadonlyGet = createGetter(true, true)

const mutableHandlers = {
  get,
}

const shallowReactiveHandlers = {
  get: shallowGet
}

const readonlyHandlers = {
  get: readonlyGet
}

const shallowReadonlyHandlers = {
  get: shallowReadonlyGet
}

export {
  mutableHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers
}