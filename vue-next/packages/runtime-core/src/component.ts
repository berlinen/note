// 组件中所有的方法

import { ShapeFlags } from "@vue/shared"


export const createComponentInstance = (vnode) => {
  // webcomponent 需要有 属性 和 插槽属性
  const instance = { // 组件的实例
    vnode,
    type: vnode.type,
    props: {}, // props 和 attrs 有什么区别  vnode.props
    attrs: {},
    slots: {},
    ctx: {}, // 上下文
    setupState: {}, // 如果setup返回一个对象， 这个对象会作为etUpState
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
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers)
  // 2. 获取组件的类型 拿到组件的setup方法
  let Component = instance.type
  let { setup } = Component
  let setupContext = createConttext(instance)
  // --------
  setup(instance.props, setupContext) // instance 中的props attrs slots emit expose 会被提取出来，因为在开发过程中会使用这些属性
  Component.render()
}

const createConttext = instance => {
  return {
    attrs: instance.attrs,
    props: instance.props,
    slots: instance.slots,
    emit: () => {},
    expose: () => {},

  }
}
