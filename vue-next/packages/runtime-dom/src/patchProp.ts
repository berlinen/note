// 这里针对的是属性操作，一系列属性操作

import { patchAttr } from "./modules/attr"
import { patchClass } from "./modules/class"
import { patchEvent } from "./modules/event"
import { patchStyle } from "./modules/style"


export const patchProp = (el, key, prevValue, nextValue) => {
  switch(key) {
    case 'class':
      patchClass(el, nextValue)
      break
    case 'style':
      patchStyle(el, prevValue, nextValue)
      break
    default:
      // 如果不是时间 才是属性
      if(/^on[^a-z]/.test(key)) {
        patchEvent(el, key, nextValue) // 事件就是添加和删除 修改
      } else {
        patchAttr(el, key, nextValue)
      }
      break
  }
}