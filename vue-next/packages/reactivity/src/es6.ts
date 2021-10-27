function deepClone(obj, hash = new WeakMap()) {
  if(obj === null) return obj
  if(obj instanceof RegExp) return new RegExp(obj)
  if(obj instanceof Date) return new Date(obj)

  // ...
  if(typeof obj !== 'object') return obj

  if(hash.get(obj)) return hash.get(obj)
  let copy = new obj.constructor
  hash.set(obj, copy)

  for(let key in obj) {
    if(obj.hasOwnProperty(key)) {
      copy[key] = deepClone(obj[key], hash)
    }
  }

  return copy

}

const objs = {
  name: 'ss',
  person: {
    name: 'sss',
    age: 12
  }
}

let c = deepClone(objs)

console.log(c)

//@ts-ignore
Array.prototype.reduce = function(callback, prev) {
  console.log(this)
 for(let i = 0; i < this.length; i++) {
  if(!prev) {
    prev = callback(this[i], this[i+1], i+1, this)
    i++
  } else {
    prev = callback(prev, this[i], i, this)
  }
 }

 return prev
}

let arr = [1,2,3,4]

const res = arr.reduce(function(prev, current) {
 return prev += current
})

console.log(res)


const compose = (...fns) => fns.reduce((prev, current) => (...args) => prev(current(...args)))
