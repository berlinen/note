<template>
  <div>{{ count }}</div>
  <HelloWorld />
  <button @click="handleClick">+</button>
</template>

<script>
import { reactive, toRefs } from 'vue'
import HelloWorld from './HelloWorld.vue'

export default {
  name: 'App',
  setup() {
    let state = reactive({
      count: 0
    })

    function handleClick() {
      state.count++
    }

    return {
      ...toRefs(state),
      handleClick
    }
  }
}
</script>
