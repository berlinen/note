
export const createAppApi = (render) => {
  return (rootComponent, rootProps) => { // 告诉他那个组件哪个属性来创建应用
    return {
      mount(container) { // 挂载的目标
          let vnode = {}
          render(vnode, container)
      }
    }
  }
}
