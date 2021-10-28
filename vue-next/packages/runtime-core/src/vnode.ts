// createVnode 创建虚拟节点

// h('div', { style: {}, className: ''}, 'children')
export const createVnode = (type, props, children = null) => {
  // 可以根据type来区分时组件还是普通元素

  // 根据 type来区分 是元素还是组件

  // 给虚拟节点加一个类型

  const vnode = { // 一个对象来描述对应的内容， 虚拟节点有跨平台能力
    __v__isVnode: true, // 一个vnode节点
    type,
    props,
    children,
    el: null, // 稍后会将虚拟节点和真实节点对应起来
    key: props && props.key // diff方法会用到key
  }


  return vnode
}