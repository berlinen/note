export function ref(value) { // value 是一个普通类型
  // 将普通类型变成一个对象
  return createRef(value)
}

// ref 和  reactive 区别   reactive 内部采用proxy ref  内部使用的的是defineProperty

export function shallowRef(value) {
  return createRef(value, true)
}

function createRef(value, isShallow = false) {

}

// effect 中的所有属性都会收集effect
// 当这个属性值发生变化 会重新执行effect