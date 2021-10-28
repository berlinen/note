export const createRenderer = (renderOptions) => { // 告诉core怎么取渲染 平台有关 小程序 浏览器
  return {
    createApp(rootComponent, rootProps) { // 告诉他那个组件哪个属性来创建应用
      return {
        mount(container) { // 挂载的目标
            console.log(container, rootComponent, rootProps, renderOptions)
        }
      }
    }
  }
}