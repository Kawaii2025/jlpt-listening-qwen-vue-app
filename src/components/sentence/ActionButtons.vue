<template>
  <div class="flex flex-wrap justify-end mt-2 gap-2">
    <BaseButton 
      @click="checkAnswer" 
      icon="fa-check"
      class="flex items-center"
    >
      检查答案
    </BaseButton>
    <!-- 短播放按钮 - 粉色系 -->
    <BaseButton 
      v-if="showErrorButtons"
      @click="playShort"
      :class="[ 
        'bg-shortPlay/10 text-shortPlay hover:bg-shortPlay hover:text-white',
        { 'hidden': !showErrorButtons }
      ]"
      class="flex items-center"
    >
      <i class="fa fa-volume-up mr-1"></i>短播放
    </BaseButton>
    <!-- 助词按钮 - 青色系 -->
    <BaseButton 
      v-if="showErrorButtons"
      @click="playToParticle"
      :class="[
        'bg-particle/10 text-particle hover:bg-particle hover:text-white',
        { 'hidden': !showErrorButtons }
      ]"
      class="flex items-center"
    >
      <i class="fa fa-volume-up mr-1"></i>到助词为止
    </BaseButton>
    <!-- 错误播放按钮 - 紫色系 -->
    <BaseButton 
      v-if="showErrorButtons"
      @click="playErrorRange"
      :class="[
        'bg-accent/10 text-accent hover:bg-accent hover:text-white',
        { 'hidden': !showErrorButtons }
      ]"
      class="flex items-center"
    >
      <i class="fa fa-volume-up mr-1"></i>从错误处播放
    </BaseButton>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import BaseButton from '../utils/BaseButton.vue'

export default defineComponent({
  name: 'ActionButtons',
  components: {
    BaseButton
  },
  props: {
    showErrorButtons: {
      type: Boolean,
      default: false
    }
  },
  emits: ['check-answer', 'play-short', 'play-to-particle', 'play-error-range'],
  setup(props, { emit }) {
    const checkAnswer = () => emit('check-answer');
    const playShort = () => emit('play-short');
    const playToParticle = () => emit('play-to-particle');
    const playErrorRange = () => emit('play-error-range');

    return {
      checkAnswer,
      playShort,
      playToParticle,
      playErrorRange
    }
  }
})
</script>