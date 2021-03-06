import { isFunction } from "@vue/shared"
import { track } from "."
import { effect, trigger } from "./effect"
import { TrackOpTypes, TriggerOpTypes } from "./operators"

class ComputedRefImpl {
  public _dirty = true // 默认取值时候不要用缓存
  public _value
  public effect: Function
  constructor(getter, public setter) { // ts中默认不会挂到this上
    this.effect = effect(getter, // 计算属性默认会产生一个effect
      {
        lazy: true,
        // effect 函数自定义 走自己的effect逻辑
        scheduler: () => {
          if(!this._dirty) {
            this._dirty = true
            // 自己收集的effect也要执行
            trigger(this, TriggerOpTypes.SET, 'value')
          }
        }
    })
  }

  get value() { // 计算属性也要收集依赖
    if(this._dirty) {
      this._value = this.effect() // 会将用户的返回值返回
      this._dirty = false
    }
    track(this, TrackOpTypes.GET, 'value')
    return this._value
  }

  set value(newValue) {
    this.setter(newValue)
  }
}

export const computed = (getterOptions) => {
  let getter
  let setter

  if(isFunction(getterOptions)) {
    getter = getterOptions
    setter = () => {
      console.log('computed value must be readonly')
    }
  } else {
    getter = getterOptions.get
    setter = getterOptions.set
  }

  return new ComputedRefImpl(getter, setter)
}