<template>
  <div class="flex space-x-2">
    <button 
      class="play-button text-neutral-500 hover:text-secondary transition-colors p-2 rounded-full hover:bg-secondary/10 focus:outline-none"
      @click="$emit('play', $event)"
      title="播放句子"
    >
      <i class="fa fa-volume-up text-xl"></i>
    </button>
    <button 
      class="toggle-original-button text-neutral-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10 focus:outline-none"
      @click="$emit('toggle-original')"
      title="切换原文显示"
    >
      <i class="fa" :class="{ 'fa-eye': !showOriginal, 'fa-eye-slash': showOriginal }"></i>
    </button>
    <button 
      class="edit-button text-neutral-500 hover:text-accent transition-colors p-2 rounded-full hover:bg-accent/10 focus:outline-none"
      @click="$emit('edit')"
      title="编辑句子"
    >
      <i class="fa fa-pencil text-xl"></i>
    </button>
  </div>
</template>

<script setup>
defineProps({
  showOriginal: {
    type: Boolean,
    default: false
  }
})

defineEmits(['play', 'toggle-original', 'edit'])
</script>
