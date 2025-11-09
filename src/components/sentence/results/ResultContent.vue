<template>
  <div class="space-y-3">
    <div>
      <span class="text-xs font-medium text-neutral-500">你的输入：</span>
      <TextDisplay :text="userInputHtml" />
    </div>
    <div>
      <span class="text-xs font-medium text-neutral-500">正确答案：</span>
      <TextDisplay :text="correctAnswerHtml" :is-correct="true" />
    </div>
  </div>
</template>

<script setup>
import TextDisplay from '../../utils/TextDisplay.vue'

defineProps({
  userInputHtml: {
    type: String,
    default: ''
  },
  correctAnswerHtml: {
    type: String,
    default: ''
  }
})
</script>
