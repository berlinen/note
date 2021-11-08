import { isArray, isObject } from "@vue/shared"
import { createVnode, isVnode  } from "./vnode"

export function h(type, propsOrChildren, children) {
  const l = arguments.length // 儿子节点要么是字符串 要么是数组 针对的是createVnode

  if(l === 2) { // 类型 + 属性 or 类型 + 孩子
    // 如果propsOrChildren是数组 直接作为第三个参数
    if(isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if(isVnode(propsOrChildren)) {
        return createVnode(type, null, [propsOrChildren])
      }
      return createVnode(type, propsOrChildren)
    } else {
      // 如果第二个参数 不是对象， 那一定是孩子
      return createVnode(type, null, propsOrChildren)
    }
  } else {
    //  都是儿子节点
    if(l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if(l === 3 && isVnode(children)) { //
      children = [children]
    }

    return createVnode(type, propsOrChildren, children)
  }
} 