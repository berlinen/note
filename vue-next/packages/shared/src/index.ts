const isObject = val => typeof val === 'object' && val !== null
const extend = Object.assign

export {
  isObject,
  extend
}