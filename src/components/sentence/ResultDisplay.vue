<template>
  <div v-if="showResult" class="check-result mb-4">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium result-status" v-html="resultStatus"></span>
      <span class="text-xs text-neutral-500 accuracy">准确率: {{ accuracy.toFixed(1) }}%</span>
    </div>
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
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import TextDisplay from '../utils/TextDisplay.vue'

export default defineComponent({
  name: 'ResultDisplay',
  components: {
    TextDisplay
  },
  props: {
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
  }
})
</script>