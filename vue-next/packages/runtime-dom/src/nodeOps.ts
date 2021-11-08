export const nodeOps = {
  // crateElement 不同平台创建方式不同

  createElement: tagName => document.createElement(tagName), // 增加

  remove: child => { // 删除
    const parent = child.parentNode
    if(parent) parent.removeChild(child)
  },

  insert: (child, parent, anchor = null) => { // 插入
    parent.insertBefore(child, anchor) // 如果参照物为空 则相当于 appendChild
  },

  querySelector: selector => document.querySelector(selector),

  setElementText: (el, text) => el.textContent = text,

  // 文本操作
  createText: text => document.createTextNode(text),

  setText: (node, text) => node.nodeValue = text

}