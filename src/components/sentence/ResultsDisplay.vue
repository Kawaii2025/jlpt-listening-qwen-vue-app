<template>
  <section :class="{ 'hidden': !showResults }" id="results-section" class="max-w-4xl mx-auto">
    <div id="practice-content" class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold flex items-center">
        <i class="fa fa-list-alt text-primary mr-2"></i>练习内容
      </h3>
      <div class="text-sm text-neutral-600">
        <span id="sentence-count">{{ sentenceData.length }}</span> 组句子
      </div>
    </div>

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

<script>
import { defineComponent } from 'vue'
import SentenceCard from '../SentenceCard.vue'

export default defineComponent({
  name: 'ResultsDisplay',
  components: {
    SentenceCard
  },
  props: {
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
  }
})
</script>