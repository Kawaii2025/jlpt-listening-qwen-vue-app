<template>
  <BaseButton 
    @click="handleClick" 
    icon="fa-check"
    class="flex items-center"
  >
    检查答案
  </BaseButton>
</template>

<script setup>
import BaseButton from '../../utils/BaseButton.vue'

const emit = defineEmits(['check-answer'])

const handleClick = () => emit('check-answer')
</script>

