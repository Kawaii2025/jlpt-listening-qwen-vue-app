<template>
  <div class="bg-white rounded-xl shadow-sm p-6 card-hover border border-neutral-100">
    <!-- Card Top: Header and Actions -->
    <CardTop 
      :index="index"
      :sentence="sentence"
      :show-original="showOriginal"
      @play="playSentence"
      @toggle-original="toggleOriginal"
      @edit="editSentence"
    />

    <!-- User Input Area -->
    <UserInputArea
      v-model="userInput"
      :show-error-buttons="showErrorButtons"
      @input="handleUserInput"
      @check="checkAnswer"
      @play-short="playShort"
      @play-to-particle="playToParticle"
      @play-error-range="playErrorRange"
    />

    <!-- Result Display -->
    <ResultDisplay
      :show-result="showResult"
      :result-status="resultStatus"
      :accuracy="accuracy"
      :user-input-html="userInputHtml"
      :correct-answer-html="correctAnswerHtml"
    />

    <!-- Card Footer: Original Text and Translation -->
    <CardFooter
      :sentence="sentence"
      :chinese-sentence="chineseSentence"
      :show-original="showOriginal"
    />
  </div>
</template>

<script setup>
import CardTop from './card/CardTop.vue'
import UserInputArea from './card/UserInputArea.vue'
import ResultDisplay from './sentence/ResultDisplay.vue'
import CardFooter from './card/CardFooter.vue'
import { useSentenceCard } from '../composables/useSentenceCard'

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  sentence: {
    type: Object,
    required: true
  },
  chineseSentence: {
    type: String,
    required: true
  },
  onEdit: {
    type: Function,
    required: true
  }
})

const {
  userInput,
  showResult,
  showOriginal,
  resultStatus,
  accuracy,
  userInputHtml,
  correctAnswerHtml,
  showErrorButtons,
  playSentence,
  playErrorRange,
  playToParticle,
  playShort,
  checkAnswer,
  toggleOriginal,
  editSentence,
  handleUserInput
} = useSentenceCard(props)
</script>
