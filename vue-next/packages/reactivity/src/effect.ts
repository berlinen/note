// 副作用函数
let uid = 0



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

  }

  effect.id = uid++ // 制作一个effect标识i， 用于区分effect 用作排序 和更新
  effect._isEffect = true  //  用于标水这个是响应是effect
  effect.raw = fn // 保留effect对应的原函数
  effect.options = options  // 在effect上保存用户的属性

  return effect
}

export {
  effect
}

effect(() => {})