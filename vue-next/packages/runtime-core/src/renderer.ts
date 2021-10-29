import { ShapeFlags } from '@vue/shared'
import { createAppApi } from './apiCreateApp'
// 目的是创建一个渲染器
// 组件生成虚拟dom 虚拟dom生成真实dom渲染到页面上
export const createRenderer = (renderOptions) => { // 告诉core怎么取渲染 平台有关 小程序 浏览器
  const mountComponent = (initialVnode, container) => {
    console.log(initialVnode, 'ss',container)
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
