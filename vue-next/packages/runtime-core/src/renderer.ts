import { ShapeFlags } from '@vue/shared'
import { createAppApi } from './apiCreateApp'
import { createComponentInstance, setupComponent } from './component'

// 目的是创建一个渲染器
// 组件生成虚拟dom 虚拟dom生成真实dom渲染到页面上
export const createRenderer = (renderOptions) => { // 告诉core怎么取渲染 平台有关 小程序 浏览器
  const setupRenderEffect = () => {}

  const mountComponent = (initialVnode, container) => {
    // 组件的渲染流程 最核心的就是调用setup 拿到的返回值，获取render函数返回的结果来进行渲染
    // 1. 先有实例
    const instance = initialVnode.component = createComponentInstance(initialVnode)
    // 2. 需要的数据解析到实例上
    setupComponent(instance)
    // 3. 创建一个effect 让render函数执行
    setupRenderEffect()
  }


  const processComponent = (n1, n2, container) => {
    if(n1 === null) { // 组件没有上一次的虚拟节点
      // 挂载组件
      mountComponent(n2, container)
    } else {
      // 组件更新流程
    }
  }


  const patch = (n1, n2, container) => {
    // 针对不同类型 做初始化操作
    const { shapeFlag } = n2
    if(shapeFlag & ShapeFlags.ELEMENT) {
      // element
    } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      // component
      processComponent(n1, n2, container)
    }
  }

  const render = (vnode, container) => {
    // core的核心 根据不同的虚拟节点 创建对应的真实元素

    // 默认调用render 可能是初始化流程
    patch(null, vnode, container)
  }
  return {
    createApp: createAppApi(render)
  }
}
