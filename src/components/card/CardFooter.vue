<template>
  <div>
    <!-- 日语原文（默认隐藏） -->
    <div v-if="showOriginal" class="japanese-original mb-4">
      <h4 class="text-sm font-medium text-neutral-500 mb-1">日语原文</h4>
      <p class="font-japanese text-lg text-neutral-800">{{ sentence.text }}</p>
    </div>

    <!-- 中文翻译 -->
    <div>
      <h4 class="text-sm font-medium text-neutral-500 mb-1">中文翻译</h4>
      <p class="text-neutral-700">{{ chineseSentence }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sentence: {
    type: Object,
    required: true
  },
  chineseSentence: {
    type: String,
    required: true
  },
  showOriginal: {
    type: Boolean,
    default: false
  }
})
</script>
