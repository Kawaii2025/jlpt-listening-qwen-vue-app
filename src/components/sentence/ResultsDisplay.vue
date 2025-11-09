<template>
  <section v-if="showResults" id="results-section" class="max-w-4xl mx-auto">
    <ResultsHeader :sentence-count="sentenceData.length" />

    <!-- 句子列表 -->
    <div id="sentences-container" class="space-y-8">
      <SentenceCard
        v-for="(sentence, index) in sentenceData"
        :key="index"
        :index="index"
        :sentence="sentence"
        :chinese-sentence="chineseSentences[index]"
        :on-edit="onEdit"
      />
    </div>
  </section>
</template>

<script setup>
import SentenceCard from '../SentenceCard.vue'
import ResultsHeader from './results/ResultsHeader.vue'

defineProps({
  showResults: {
    type: Boolean,
    default: false
  },
  sentenceData: {
    type: Array,
    required: true
  },
  chineseSentences: {
    type: Array,
    required: true
  },
  onEdit: {
    type: Function,
    required: true
  }
})
</script>
