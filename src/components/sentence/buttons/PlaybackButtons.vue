<template>
  <div v-if="showErrorButtons" class="flex gap-2">
    <PlaybackButton
      v-for="button in buttons"
      :key="button.id"
      :label="button.label"
      :icon="button.icon"
      :button-classes="button.classes"
      @action="handleButtonAction(button.event)"
    />
  </div>
</template>

<script setup>
import { usePlaybackButtonConfig } from '../../../composables/usePlaybackButtonConfig'
import PlaybackButton from './PlaybackButton.vue'

defineProps({
  showErrorButtons: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['play-short', 'play-to-particle', 'play-error-range'])

const { buttons } = usePlaybackButtonConfig()

const eventMap = {
  'play-short': () => emit('play-short'),
  'play-to-particle': () => emit('play-to-particle'),
  'play-error-range': () => emit('play-error-range')
}

const handleButtonAction = (eventName) => {
  if (eventMap[eventName]) {
    eventMap[eventName]()
  }
}
</script>

