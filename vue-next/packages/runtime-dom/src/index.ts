// runtime-dom 核心就是 提供domApi 方法 操作节点 操作属性的更新

import { extend } from '@vue/shared'
import { createRenderer } from '@vue/runtime-core'

// 节点操作就是增删改吃

// 属性操作 添加 删除 更新 样式 类 事件


import { nodeOps } from './nodeOps'

import { patchProp } from './patchProp'

// 渲染时用到的所有方法 理解成平台渲染的一些方法
export const renderOptions = extend({patchProp}, nodeOps)

// 用户调用的是runtime-dom -> runtime-core

// vue中 runtime-dom 提供了核心的方法，用来处理渲染逻辑，会使用runtime-dom中的api进行渲染
export const createApp = (rootComponent, rootProps = null) => {
  const app = createRenderer(renderOptions).createApp(rootComponent, rootProps)
  let { mount } = app
  // 重写mount方法
  app.mount = (container) => {
    // 清空容器的操作
    container = nodeOps.querySelector(container)
    container.innerHTML = ''
    // 调用creteRenderer返回的app上的mount1方法
    mount(container)
    // 将组件 渲染成dom元素 进行挂载

  }

  return app
}

