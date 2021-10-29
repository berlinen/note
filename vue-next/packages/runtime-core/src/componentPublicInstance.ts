import { hasOwn } from "@vue/shared"


 export const PublicInstanceProxyHandlers = {
    get({_: instance}, key) {
      // 取值得时候 要访问setUpState props data
      const { setupState, props, data } = instance
      if(hasOwn(setupState, key)) {
        return setupState[key]
      } else if(hasOwn(props, key)) {
        return props[key]
      } else if(hasOwn(data, key)) {
        return data[key]
      } else {
        return undefined
      }
    },
    set({_: instance}, key, value) {

    }
 }