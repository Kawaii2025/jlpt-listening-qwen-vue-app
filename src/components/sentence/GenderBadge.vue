<template>
  <span 
    v-if="gender === 'male'" 
    class="bg-male/10 text-male text-xs font-medium px-2 py-0.5 rounded ml-2"
  >
    男性
  </span>
  <span 
    v-else-if="gender === 'female'" 
    class="bg-female/10 text-female text-xs font-medium px-2 py-0.5 rounded ml-2"
  >
    女性
  </span>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GenderBadge',
  props: {
    gender: {
      type: String,
      default: null,
      validator: (value) => ['male', 'female', null].includes(value)
    }
  }
})
</script>