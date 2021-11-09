import { effect } from '@vue/reactivity'
import { ShapeFlags } from '@vue/shared'
import { createAppApi } from './apiCreateApp'
import { createComponentInstance, setupComponent } from './component'
import { normalizeVNode, TEXT } from './vnode'
import { queueJob } from './scheduler'

// 目的是创建一个渲染器
// 组件生成虚拟dom 虚拟dom生成真实dom渲染到页面上
export const createRenderer = (renderOptions) => { // 告诉core怎么取渲染 平台有关 小程序 浏览器
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    nextSibling: hostNextSibling
  } = renderOptions
  const setupRenderEffect = (instance, container) => {
    // 需要创建一个 effect，在effect中调用render方法。
    // 这样render方法中拿到的数据会收集这个effect。属性更新的时候effect会重新执行
    effect(() => {
      // 每个组件都有一个effect vue3 是组件级别更新 数据辩护会重新执行对应组件的effect
      // 初次渲染
      if(!instance.isMounted) {
        let proxyToUse = instance.proxy
        // $vnode _vnode
        // vnode subtree
        let subTree = instance.subTree = instance.render.call(proxyToUse, proxyToUse)
        // 用render函数的返回值继续渲染
        patch(null, subTree, container)
        instance.isMounted = true
      } else {
        // 更新逻辑
        const prevTree = instance.subTree
        let proxyToUse = instance.proxy
        let nextTree = instance.render.call(proxyToUse, proxyToUse)

        patch(prevTree, nextTree, container)
      }
    }, {
      scheduler: queueJob
    })
    // instance.render()
  }

  // ------------------------------------------------------组件

  const mountComponent = (initialVnode, container) => {
    // 组件的渲染流程 最核心的就是调用setup 拿到的返回值，获取render函数返回的结果来进行渲染
    // 1. 先有实例
    const instance = initialVnode.component = createComponentInstance(initialVnode)
    // 2. 需要的数据解析到实例上
    setupComponent(instance) // state props attrs render
    // 3. 创建一个effect 让render函数执行
    setupRenderEffect(instance, container)
  }


  const processComponent = (n1, n2, container) => {
    if(n1 === null) { // 组件没有上一次的虚拟节点
      // 挂载组件
      mountComponent(n2, container)
    } else {
      // 组件更新流程

    }
  }

  //------------------------------------------------------处理文本

  const processText = (n1, n2, container) => {
    if(n1 === null) {
      hostInsert(n2.el = hostCreateText(n2.children), container)
    }
  }

  // 挂载children
  const mountChildren = (children, container) => {
    for(let i = 0; i < children.length; i++) {
      let child = normalizeVNode(children[i])

      patch(null, child, container)
    }
  }

  const mountElemet = (vnode, container, anchor = null) => {
     // 递归渲染
     const { props, shapeFlag, type, children } = vnode
     let el = (vnode.el = hostCreateElement(type))
     if(props) {
       for(const key in props) {
         hostPatchProp(el, key, null, props[key])
       }
     }
      if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, children)
     } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el)
     }
     hostInsert(el, container, anchor)
  }
  // -----------------------------------------------------元素

  const processElement = (n1, n2, container, anchor) => {
     if(n1 === null) {
      mountElemet(n2, container, anchor)
     } else {
       patchElement(n1, n2, container)
     }
  }

  // 比对元素
  const patchElement = (n1, n2, container) => {

  }

  const isSameVNodeType = (n1, n2) => {
    return n1.type === n2.type && n2.key === n1.key
  }

  // 删除元素
  const unMount = (n1) => {
    hostRemove(n1.el)
  }

  const patch = (n1, n2, container, anchor = null) => {
    // 针对不同类型 做初始化操作
    const { shapeFlag, type } = n2
    if(n1 && isSameVNodeType(n1, n2)) {
      // 把以前的删除 换成n2
      anchor = hostNextSibling(n1.el)
      unMount(n1)
      n1 = null // 重新渲染n2
    }
    switch(type) {
      case TEXT:
        processText(n1, n2, container)
        break;
      default:
        if(shapeFlag & ShapeFlags.ELEMENT) {
          // element
          processElement(n1, n2, container, anchor)
        } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // component
          processComponent(n1, n2, container)
        }
        break;
    }

  }

  const render = (vnode, container) => {
    // core的核心 根据不同的虚拟节点 创建对应的真实元素

    // 默认调用render 可能是初始化流程
    patch(null, vnode, container)
  }
  return {
    createApp: createAppApi(render)
  }
}
