<template>
  <div id="practice-content" class="flex justify-between items-center mb-6">
    <h3 class="text-xl font-semibold flex items-center">
      <i class="fa fa-list-alt text-primary mr-2"></i>练习内容
    </h3>
    <div class="text-sm text-neutral-600">
      <span id="sentence-count">{{ sentenceCount }}</span> 组句子
    </div>
  </div>
</template>

<script setup>
defineProps({
  sentenceCount: {
    type: Number,
    default: 0
  }
})
</script>
