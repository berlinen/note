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
    // 元素是相同节点
    let el = (n2.el = n1.el)

    // 更新属性 更新儿子
    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    patchProps(oldProps, newProps, el)

    patchChildren(n1, n2, el)
  }

  const patchProps = (oldProps, newProps, el) => {
    if(oldProps !== newProps) {
      for(let key in newProps) {
        const prev = oldProps[key]
        const next = newProps[key]
        if(prev !== next) {
          hostPatchProp(el, key, prev, next)
        }
      }

      for(const key in oldProps) {
        if(!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null)
        }
      }
    }
  }

  const unmountChildren = (children) => {
    for(let i = 0; i < children.length; i++) {
      unMount(children[i])
    }
  }

  const patchKeyedChildren = (c1, c2, el) => {
    // v3 特殊情况进行优化
    let i = 0 // 默认从头比对
    let e1  = c1.length -1
    let e2 = c2.length - 1

    console.log('>>>e1>>', c1)
    console.log('>>>e2>>', c2)

    // 尽可能减少比对的区域

    // sync from start 从头开始一个个逼 遇到不同就停止
    while(i <= e1 && i <= e2) {
       const n1 = c1[i]
       const n2 = c2[i]
       if(!isSameVNodeType(n1, n2)) {
         patch(n1, n2, el)
       } else {
         break
       }
       i++
    }
    // sync from end
    while(i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if(!isSameVNodeType(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      e1--;
      e2--;
    }

    // common  sequence+ mount 同序列加挂载
    // 比较后 有一方已经完全比对完成了
    // 怎么确定要挂载呢
    if(i > e1) { // 老的少 新的多
      if( i <= e2) { // 表示有新增的部分
        const nextPos = e2  + 1
        // 想知道是向前插入还是向后插入
        const anchor = nextPos < c2.length ? c2[nextPos].el : null
        while(i <= e2) {
          patch(null, c2[i], el, anchor) // 只是向后追加
          i++
        }
      }
    } else { // 老的多新的少

    }


    console.log(i, e1, e2)

  }

  const patchChildren = (n1, n2, el) => {
    const c1 = n1.children
    const c2 = n2.children

    // 老得有儿子新的没儿子 新的有儿子老得没儿子 新老都有儿子  新老都是文本
    const prevShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag

    if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {

      // 老的事n个孩子 但是新的是文本
      if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) { // case1: 现在是文本 之前是数组
        unmountChildren(c1) // 如果c1包含组件会调用销毁方法
      }
      // 两个都是文本的情况
      if(c2 !== c1) { //case2: 两个都是文本
        hostSetElementText(el, c2)
      }
    } else {
      // 现在是元素 上一次有可能是文本或者是数组
      if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) { // case3: 两个都是数组
        if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 当前是元素 之前是数组 或者是文本
          // 两个数组的比对 diff算法
         patchKeyedChildren(c1, c2, el)
        } else {
          // 没有孩子 特殊情况 当前是null 删除掉老的
          unmountChildren(c1) // 删除老的
        }
      } else {
        // 上一次是文本
        if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN) { // case4: 现在是数组，之前是文本
          hostSetElementText(el, '')
        }

        if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el)
        }
      }
    }
  }

  const isSameVNodeType = (n1, n2) => {
    return n1.type === n2.type && n2.key === n1.key
  }

  // 删除元素
  const unMount = (n1) => {
    hostRemove(n1.el)
  }

  const patch = (n1, n2, container, anchor =  null) => {

    // 针对不同类型 做初始化操作
    const { shapeFlag, type } = n2
    if(n1 && !isSameVNodeType(n1, n2)) {
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
