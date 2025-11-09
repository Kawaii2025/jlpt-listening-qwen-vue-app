<template>
  <div class="flex flex-wrap justify-end mt-2 gap-2">
    <button 
      class="check-button px-4 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center"
      @click="$emit('check')"
    >
      <i class="fa fa-check mr-1"></i>检查答案
    </button>
    <!-- 短播放按钮 - 粉色系 -->
    <button 
      class="short-play-button px-4 py-1.5 bg-shortPlay/10 text-shortPlay hover:bg-shortPlay hover:text-white rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center"
      :class="{ 'hidden': !showErrorButtons }"
      @click="$emit('play-short', $event)"
    >
      <i class="fa fa-volume-up mr-1"></i>短播放
    </button>
    <!-- 助词按钮 - 青色系 -->
    <button 
      class="play-error-to-particle-button px-4 py-1.5 bg-particle/10 text-particle hover:bg-particle hover:text-white rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center"
      :class="{ 'hidden': !showErrorButtons }"
      @click="$emit('play-to-particle', $event)"
    >
      <i class="fa fa-volume-up mr-1"></i>到助词为止
    </button>
    <!-- 错误播放按钮 - 紫色系 -->
    <button 
      class="play-error-button px-4 py-1.5 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center"
      :class="{ 'hidden': !showErrorButtons }"
      @click="$emit('play-error-range', $event)"
    >
      <i class="fa fa-volume-up mr-1"></i>从错误处播放
    </button>
  </div>
</template>

<script setup>
defineProps({
  showErrorButtons: {
    type: Boolean,
    default: false
  }
})

defineEmits(['check', 'play-short', 'play-to-particle', 'play-error-range'])
</script>
