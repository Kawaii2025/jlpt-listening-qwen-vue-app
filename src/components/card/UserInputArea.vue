<template>
  <div class="mb-4">
    <h4 class="text-sm font-medium text-neutral-500 mb-2">请输入你听到的日语</h4>
    <textarea
      :value="modelValue"
      @input="handleInput"
      class="user-input w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none font-japanese text-lg"
      rows="2"
      placeholder="在这里输入你听到的日语..."
    ></textarea>
    <UserInputActions
      :show-error-buttons="showErrorButtons"
      @check="$emit('check')"
      @play-short="$emit('play-short', $event)"
      @play-to-particle="$emit('play-to-particle', $event)"
      @play-error-range="$emit('play-error-range', $event)"
    />
  </div>
</template>

<script setup>
import UserInputActions from './UserInputActions.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  showErrorButtons: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'check', 'play-short', 'play-to-particle', 'play-error-range'])

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  emit('input')
}
</script>
