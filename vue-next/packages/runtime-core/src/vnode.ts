// createVnode 创建虚拟节点

import { isArray, isObject, isString, ShapeFlags } from "@vue/shared"

// h('div', { style: {}, className: ''}, 'children')
export const createVnode = (type, props, children = null) => {
  // 可以根据type来区分时组件还是普通元素

  // 根据 type来区分 是元素还是组件

  // 给虚拟节点加一个类型

  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0

  const vnode = { // 一个对象来描述对应的内容， 虚拟节点有跨平台能力
    __v__isVnode: true, // 一个vnode节点
    type,
    props,
    children,
    el: null, // 稍后会将虚拟节点和真实节点对应起来
    key: props && props.key, // diff方法会用到key
    shapeFlag
  }

  normalizeChildren(vnode, children)
  return vnode
}

const normalizeChildren = (vnode, children) => {
  let type = 0
  if(children === null) { // 不对儿子进行处理

  } else if(isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else {
    type = ShapeFlags.TEXT_CHILDREN
  }

  vnode.shapeFlag |= type
}