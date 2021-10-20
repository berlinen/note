// 副作用函数
let uid = 0
let activeEffect // 存储当前的effect
let effectStack = [] // effect 一个栈 根据函数调用执行站
const targetMap = new WeakMap()

const effect = (fn, options:any = {}) => {
  // 我需要让这个effect编程响应的effect， 可以做到重新执行

  const effect = createReactiveEffect(fn, options)

  if(!options.lazy) { // 默认的effect会先执行一次
    effect() // 响应是的effect默认会先执行一次 effect(
  }

  return effect
}

const createReactiveEffect = (fn, options) => {
  const effect = function reactiveEffect() {
   if(!effectStack.includes(effect)) { // 保证effect 没有加入到effectStack中
    try {
      effectStack.push(effect)
      activeEffect = effect
      return fn() //函数执行时候会取之 会执行get函数
     } finally {
       effectStack.pop()
       activeEffect = effectStack[effectStack.length - 1]
     }
   }
  }

  effect.id = uid++ // 制作一个effect标识i， 用于区分effect 用作排序 和更新
  effect._isEffect = true  //  用于标水这个是响应是effect
  effect.raw = fn // 保留effect对应的原函数
  effect.options = options  // 在effect上保存用户的属性

  return effect
}

// 让某刻对象中的属性收集当前他对应的effect函数
const track = (target, type, key) => { // 可以拿到当前的effect
  // activeEffect // 当前正在运行的effect
  if(activeEffect === undefined) return // 此属性不用依赖手机 因为没在effect中使用

  let depsMap = targetMap.get(target)

  if(!depsMap) {
    targetMap.set(target, (depsMap = new Map))
  }

  let dep = depsMap.get(key)

  if(!dep) {
    depsMap.set(key, (dep = new Set))
  }

  if(!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }

  console.log(targetMap)

}

// {name: 'berlon', age: 12} => name => [effect, effect]

export {
  effect,
  track
}

