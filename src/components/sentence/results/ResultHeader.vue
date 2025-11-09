<template>
  <div class="flex justify-between items-center mb-2">
    <span class="text-sm font-medium result-status" v-html="resultStatus"></span>
    <span class="text-xs text-neutral-500 accuracy">准确率: {{ accuracy.toFixed(1) }}%</span>
  </div>
</template>

<script setup>
defineProps({
  resultStatus: {
    type: String,
    default: ''
  },
  accuracy: {
    type: Number,
    default: 0
  }
})
</script>
