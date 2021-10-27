import { isArray, isInTegerKey } from "@vue/shared"
import { TriggerOpTypes } from "./operators"

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

  // console.log(targetMap)

}

const trigger = (target, type, key?, newVal?, oldValue?) => {
  // 如果这个属性没有收集过effect， 那不需要做任何操作
  const depsMap = targetMap.get(target)
  if(!depsMap) return

  const effects = new Set() // 这里对Effect去重了
  const add = effectsToAdd => {
    if(effectsToAdd) {
      effectsToAdd.forEach((effect): any => effects.add(effect))
    }
  }
  // 将所有的要执行的effect全部存到一个新的集合中，最终一起执行

  // 结论  两个特殊情况
  // 1. 看修改的是不是数组的长度，修改长度影响范围比较广
  // 2. 修改数组的无效索引也就是当前索引大雨该数组的长度
  if(isArray(target) && key === 'length') {
    // 如果对应的长度有依赖收集，需要更新
    depsMap.forEach((dep, key) => {
      if(key === 'length' || key > newVal) { // newVal = state.arr.length  你改的长度比收集的的索引小了， 那收集对应的Effecct也要执行, 要将收集的索引置为empty
        console.log('>dep>', dep)
        add(dep)
      }
    })
  } else {
    // 改的不是数组 可能是个对象
    // 修改值
    if(key !== undefined) { // 修改对象· （对象的修改新增，数组有效索引的修改） 有效索引 -> 该索引小于等于数组的长度
      add(depsMap.get(key))
    }
    // 如果修改数组中的某一个索引 怎么办? 也要触发length
    switch(type) { // 如果添加一个索引的话就是触发长度的更新
      case TriggerOpTypes.ADD:
        // 如果是数组，并且修改了索引
        if(isArray(target) && isInTegerKey(key)) {
          // 拿到的是length收集的effects的集合
          add(depsMap.get('length'))
        }
    }
  }
  // console.log('>>effects>>', effects)
  // console.log('target', target, 'depsMap', depsMap,  'key', key, 'type', type)
  effects.forEach((effect: any) => {
    if(effect.options.scheduler) {
      effect.options.scheduler()
    } else {
      effect()
    }
  })
}

// {name: 'berlon', age: 12} => name => [effect, effect]

export {
  effect,
  track,
  trigger
}

