

function createInvoker(value: Function) {
  const invoker = (e) => {
    invoker.value(e)
  }

  invoker.value = value // 为了能随时更改value的值

  return invoker
}
// 1. 给元素缓存一个绑定事件的列表
// 2. 如果缓存中没有缓存活的，而且value有值， 需要绑定方法， 并且缓存起来
// 3. 存在过，以前绑定过，需要删除掉
// 4. 如果前后都有 直接改变invoker中的value属性指向最新的事件即可
export const patchEvent = (el, key, value) => {
  // 函数的缓存
  const invokers = el.vei || (el._vei = {})
  // 取出缓存中的绑定的事件
  const curFn = invokers[key]
  // 如果存在事件
  if(curFn && value) { // 需要绑定事件 而且还存在的情况下
    curFn.value = value
  } else {
    const eventName = key.slice(2).toLowerCase()

    if(value) { // 要绑定事件 以前没有绑定过
      let invoker = invokers[key] = createInvoker(value)
      el.addEventListener(eventName, invoker)
    } else { // 以前绑定了，当时没有value
      el.removeEventListener(eventName, curFn)
      invokers[key] = undefined
    }
  }

}

// 一个元素 绑定事件  addEventListener

//

