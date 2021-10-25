import { hasChange } from "@vue/shared"
import { track, trigger } from "./effect"
import { TrackOpTypes, TriggerOpTypes } from "./operators"

export function ref(value) { // value 是一个普通类型
  // 将普通类型变成一个对象
  // 可以是个对象，一般情况下是对象直接用reactive更合理
  return createRef(value)
}

// ref 和  reactive 区别   reactive 内部采用proxy ref  内部使用的的是defineProperty

export function shallowRef(value) {
  return createRef(value, true)
}

class RefImpl {
  public _value
  public __v_isRef = true // 当产生的实例会被添加__v_isRef属性， 表示是一个ref属性
  constructor(public rawValue, public shallow) {
    this._value = rawValue
  }

  // 类的的属性访问器
  get value() {
    // 收集依赖
    track(this, TrackOpTypes.GET, 'value')
    return this._value
  }

  set value(newValue) {
    // 判断老值和新值是否有变化
    if(hasChange(newValue, this.rawValue)) {
      this.rawValue = newValue
      this._value = newValue
      // 触发effect
      trigger(this,TriggerOpTypes.SET, 'value', newValue)
    }
  }

}

function createRef(rawValue,shallow = false) {
  return new RefImpl( rawValue, shallow)
}

// vue  的源码 基本上都是高阶函数  做了类似克里化的功能

// effect 中的所有属性都会收集effect
// 当这个属性值发生变化 会重新执行effect