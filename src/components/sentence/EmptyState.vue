<template>
  <section
    v-if="!showResults && mixedText.trim() === ''"
    id="empty-state"
    class="max-w-4xl mx-auto py-16 text-center"
  >
    <div class="bg-white rounded-xl p-8 shadow-sm">
      <i class="fa fa-file-text-o text-5xl text-neutral-300 mb-4"></i>
      <h3 class="text-xl font-medium text-neutral-700 mb-2">还没有处理的文本</h3>
      <p class="text-neutral-500 mb-6">
        请在上方交替输入日语和中文内容，然后点击"处理文本"按钮开始练习
      </p>
      <button
        @click="$emit('process-click')"
        class="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm hover:shadow transition-all"
      >
        开始练习
      </button>
    </div>
  </section>
</template>

<script setup>
defineProps({
  showResults: {
    type: Boolean,
    default: false
  },
  mixedText: {
    type: String,
    required: true
  }
})

defineEmits(['process-click'])
</script>
