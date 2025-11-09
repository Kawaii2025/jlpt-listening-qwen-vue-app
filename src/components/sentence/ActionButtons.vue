<template>
  <div class="flex flex-wrap justify-end mt-2 gap-2">
    <CheckAnswerButton @check-answer="$emit('check-answer')" />
    <PlaybackButtons 
      :show-error-buttons="showErrorButtons"
      @play-short="$emit('play-short')"
      @play-to-particle="$emit('play-to-particle')"
      @play-error-range="$emit('play-error-range')"
    />
  </div>
</template>

<script setup>
import CheckAnswerButton from './buttons/CheckAnswerButton.vue'
import PlaybackButtons from './buttons/PlaybackButtons.vue'

defineProps({
  showErrorButtons: {
    type: Boolean,
    default: false
  }
})

defineEmits(['check-answer', 'play-short', 'play-to-particle', 'play-error-range'])
</script>
