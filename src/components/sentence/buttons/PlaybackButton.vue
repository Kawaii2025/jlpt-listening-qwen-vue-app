<template>
  <BaseButton 
    @click="handleClick"
    :class="buttonClasses"
    class="flex items-center"
  >
    <i :class="`${icon} mr-1`"></i>{{ label }}
  </BaseButton>
</template>

<script setup>
import BaseButton from '../../utils/BaseButton.vue'

defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'fa fa-volume-up'
  },
  buttonClasses: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['action'])

const handleClick = () => emit('action')
</script>
