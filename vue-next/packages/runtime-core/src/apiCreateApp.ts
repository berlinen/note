import { createVnode } from "./vnode"

export const createAppApi = (render) => {
  return (rootComponent, rootProps) => { // 告诉他那个组件哪个属性来创建应用
    const app: any = {
      __props: rootProps,
      __component: rootComponent,
      __container: null,
      mount(container) { // 挂载的目标
          // let vnode = {}
          // render(vnode, container)
          // 1. 根据组件创建虚拟节点
          // 2. 将虚拟节点和容器获取到后调用render方法进行渲染

          // 创造虚拟节点
          const vnode = createVnode(rootComponent, rootProps)
         
          // 调用render
          render(vnode, container)

          app._container = container
      }
    }

    return app
  }
}
