import { isFunction } from "@vue/shared"

class ComputedRefImpl {
  public _dirty = true // 默认取值时候不要用缓存
  public _value
  constructor(getter, public setter) { // ts中默认不会挂到this上

  }

  get value() { // 计算属性也要收集依赖
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