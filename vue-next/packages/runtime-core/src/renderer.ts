import { createAppApi } from './apiCreateApp'
// 目的是创建一个渲染器
// 组件生成虚拟dom 虚拟dom生成真实dom渲染到页面上
export const createRenderer = (renderOptions) => { // 告诉core怎么取渲染 平台有关 小程序 浏览器
  const render = (vnode, container) => {

  }
  return {
    createApp: createAppApi(render)
  }
}
