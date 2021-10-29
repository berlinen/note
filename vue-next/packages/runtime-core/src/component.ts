// 组件中所有的方法

import { isFunction, isObject, ShapeFlags } from "@vue/shared"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"


export const createComponentInstance = (vnode) => {
  // webcomponent 需要有 属性 和 插槽属性
  const instance = { // 组件的实例
    vnode,
    type: vnode.type,
    props: {}, // props 和 attrs 有什么区别  vnode.props
    attrs: {},
    slots: {},
    ctx: {}, // 上下文
    data: {c: 3},
    setupState: {b: 2}, // 如果setup返回一个对象， 这个对象会作为etUpState
    render: null,
    isMounted: false // 表示这个组件是否有挂载过
  }
  instance.ctx = {
    _: instance // instance.ctx._
  }
  return instance
}

export const setupComponent = (instance) => {
  const  { props, children } = instance.vnode // {types, props, children }

  // 根据props解析出props 和 attrs 将其放到 instance上
  instance.props = props // initProps()
  instance.children = children // 插槽的解析 initSlot()

  // 需要先看下，当前组件是不是有状态组件，函数组件
  let isStateFulComponent = instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT

  if(isStateFulComponent) { // 表示一个带状态的组件
    // 调用当前实例的setup 方法， 用setup的返回值填充 setupState和对应的render方法
    setupStatefulComponent(instance)
  }
}

const setupStatefulComponent = (instance) => {
  // 1. 代理 传递给render函数的参数
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers as any)
  // 2. 获取组件的类型 拿到组件的setup方法
  let Component = instance.type
  let { setup } = Component

  // ----  没有setup ？ 没有 render ？----
  if(setup) {
    let setupContext = createContext(instance)
    const setupResult = setup(instance.props, setupContext) // instance 中的props attrs slots emit expose 会被提取出来，因为在开发过程中会使用这些属性
    handleSetupResult(instance, setupResult)
  } else {
    finishComponentSetup(instance) // 完成组件的启动
  }

  // Component.render(instance.proxy)
}

// 根据表现， setup返回render优先级高于 外部render
const handleSetupResult = (instance, setupResult) => {
  if(isFunction(setupResult)) {
    instance.render = setupResult
  } else if(isObject(setupResult)) {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}

const finishComponentSetup = instance => {
  let Component = instance.type
  // 所以setup render优先级高于 普通render
  if(!instance.render) {
    // 对template模版进行编译 产生render函数
    if(!Component.render && Component.template) {
      // 编译 将结果赋值给Component.render
    }
    instance.render = Component.render // 需要将生成的render函数放在实例上
  }
  console.log('instance>>', JSON.stringify(instance.render.toString()))
  // 对v2做了兼容性处理
  // applyOptions
}

const createContext = instance => {
  return {
    attrs: instance.attrs,
    props: instance.props,
    slots: instance.slots,
    emit: () => {},
    expose: () => {},

  }
}


// instance 表示组件的 状态 各种各样的状态 组件的相关信息

// context 就四个参数 为了开发使用

// proxy 为了取值方便 => proxy.xxx