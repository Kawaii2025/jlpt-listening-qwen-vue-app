<template>
  <div class="flex flex-col sm:flex-row gap-4 justify-end pt-4">
    <button
      @click="$emit('clear')"
      class="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-all flex items-center justify-center"
    >
      <i class="fa fa-eraser mr-2"></i>清空
    </button>
    <button
      @click="$emit('process')"
      class="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center font-medium"
    >
      <i class="fa fa-magic mr-2"></i>处理文本
    </button>
  </div>
</template>

<script setup>
defineEmits(['clear', 'process'])
</script>
