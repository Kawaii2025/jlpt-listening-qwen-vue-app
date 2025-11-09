<template>
  <section class="mb-12 bg-white rounded-xl shadow-md p-6 md:p-8 max-w-4xl mx-auto transform transition-all duration-500 hover:shadow-lg">
    <SectionHeader title="输入文本内容" icon="fa-pencil-square-o" />

    <div class="space-y-6">
      <!-- 混合输入区域 -->
      <TextInputField
        id="mixed-text"
        label="输入日语文本"
        :value="mixedText"
        @input="$emit('update:mixedText', $event)"
      />

      <ActionButtonsRow
        @clear="$emit('clear-text')"
        @process="$emit('process-text')"
      />
    </div>
  </section>
</template>

<script setup>
import SectionHeader from '../utils/SectionHeader.vue'
import TextInputField from '../utils/TextInputField.vue'
import ActionButtonsRow from './inputs/ActionButtonsRow.vue'

defineProps({
  mixedText: {
    type: String,
    required: true
  }
})

defineEmits(['update:mixedText', 'clear-text', 'process-text'])
</script>
