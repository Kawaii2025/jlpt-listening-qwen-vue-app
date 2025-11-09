<template>
  <div v-if="showResult" class="check-result mb-4">
    <ResultHeader :status="resultStatus" :accuracy="accuracy" />
    <ResultContent :user-input-html="userInputHtml" :correct-answer-html="correctAnswerHtml" />
  </div>
</template>

<script setup>
import ResultHeader from './results/ResultHeader.vue'
import ResultContent from './results/ResultContent.vue'

defineProps({
  showResult: {
    type: Boolean,
    default: false
  },
  resultStatus: {
    type: String,
    default: ''
  },
  accuracy: {
    type: Number,
    default: 0
  },
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
