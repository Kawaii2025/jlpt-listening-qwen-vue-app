<template>
  <span v-if="genderClass" :class="genderClass">
    {{ genderLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  gender: {
    type: String,
    default: null,
    validator: (value) => ['male', 'female', null].includes(value)
  }
})

const genderClass = computed(() => {
  const baseClass = 'text-xs font-medium px-2 py-0.5 rounded ml-2'
  return {
    'bg-male/10 text-male': props.gender === 'male',
    'bg-female/10 text-female': props.gender === 'female'
  }
})

const genderLabel = computed(() => {
  return props.gender === 'male' ? '男性' : '女性'
})
</script>
