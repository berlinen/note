import { hasChange, isObject } from "@vue/shared"
import { reactive } from "."
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

const convert = val  => isObject(val) ? reactive(val) : val

// beta 版本 之前的版本ref就是一个对象， 由于不方便扩展 改成了类
class RefImpl {
  public _value
  public __v_isRef = true // 当产生的实例会被添加__v_isRef属性， 表示是一个ref属性
  constructor(public rawValue, public shallow) {
    this._value = shallow ? rawValue : convert(rawValue) // 如果是深度，需要把里面的值都要设置成响应式的
  }

  // 类的的属性访问器
  get value() { // 代理 取值取value 帮我们代理到_value上
    // 收集依赖
    track(this, TrackOpTypes.GET, 'value')
    return this._value
  }

  set value(newValue) {
    // 判断老值和新值是否有变化
    if(hasChange(newValue, this.rawValue)) {
      this.rawValue = newValue // 新值或做老值
      this._value = this.shallow ? newValue : convert(newValue)
      // 触发effect
      trigger(this,TriggerOpTypes.SET, 'value', newValue)
    }
  }

}

function createRef(rawValue,shallow = false) {
  return new RefImpl( rawValue, shallow)
}

class ObjectRefImpl {
  public __v_isRef = true // 当产生的实例会被添加__v_isRef属性， 表示是一个ref属性
  constructor(public target, public key) {}

  get value() {
    return this.target[this.key]
  }

  set value(newValue) {
    this.target[this.key] = newValue
  }
}


export function toRef(target, key) {// 可以把一个对象的key转化成ref
   return new ObjectRefImpl(target, key)
}

export function toRefs(target, key) {
  
}

// vue  的源码 基本上都是高阶函数  做了类似克里化的功能

// effect 中的所有属性都会收集effect
// 当这个属性值发生变化 会重新执行effect