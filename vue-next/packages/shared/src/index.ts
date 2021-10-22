const isObject = val => typeof val === 'object' && val !== null
const extend = Object.assign
const isArray = Array.isArray
const isFunction = val => typeof val === 'function'
const isNumber = val => typeof val === 'number'
const isString = val => typeof val === 'string'
const isInTegerKey = val => parseInt(val) + '' === val

const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (target, key) => hasOwnProperty.call(target, key)
const hasChange = (oldVal, newVal) => oldVal !== newVal

export {
  isObject,
  extend,
  isArray,
  isFunction,
  isNumber,
  isString,
  isInTegerKey,
  hasOwn,
  hasChange
}