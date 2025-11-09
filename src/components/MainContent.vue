<template>
  <main class="flex-grow container mx-auto px-4 py-8">
    <!-- 页面介绍 -->
    <PageIntro />

    <!-- 文本输入区域 -->
    <SentenceInputArea
      :mixed-text="mixedText"
      @update:mixedText="mixedText = $event"
      @clear-text="clearText"
      @process-text="processText"
    />

    <!-- 结果显示区域 -->
    <ResultsDisplay
      :show-results="showResults"
      :sentence-data="sentenceData"
      :chinese-sentences="chineseSentences"
      :on-edit="openEditModal"
    />

    <!-- 空状态提示 -->
    <EmptyState 
      :show-results="showResults"
      :mixed-text="mixedText"
      @process-click="focusOnTextarea"
    />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import PageIntro from './sections/PageIntro.vue'
import SentenceInputArea from './sentence/SentenceInputArea.vue'
import ResultsDisplay from './sentence/ResultsDisplay.vue'
import EmptyState from './sentence/EmptyState.vue'
import { useMainContent } from '../composables/useMainContent'

defineProps({
  // Props if needed
})

const emit = defineEmits(['update-sentence', 'openEditModal'])

const {
  mixedText,
  sentenceData,
  chineseSentences,
  showResults,
  processText,
  clearText,
  focusOnTextarea,
  updateSentence
} = useMainContent()

const openEditModal = (index) => {
  const sentence = sentenceData.value[index]
  const chinese = chineseSentences.value[index]

  const editData = {
    index: index,
    gender: sentence.gender || '',
    japanese: sentence.text,
    chinese: chinese
  }

  emit('openEditModal', editData)
}

onMounted(() => {
  // 页面加载完成后自动处理文本
  setTimeout(() => {
    processText()
  }, 500)
})
</script>
