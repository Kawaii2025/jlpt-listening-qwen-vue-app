<template>
  <div class="bg-white rounded-xl shadow-sm p-6 card-hover border border-neutral-100">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center">
        <span class="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
          句子 {{ index + 1 }}
        </span>
        <span 
          v-if="sentence.gender === 'male'" 
          class="bg-male/10 text-male text-xs font-medium px-2 py-0.5 rounded ml-2"
        >
          男性
        </span>
        <span 
          v-else-if="sentence.gender === 'female'" 
          class="bg-female/10 text-female text-xs font-medium px-2 py-0.5 rounded ml-2"
        >
          女性
        </span>
      </div>
      <div class="flex space-x-2">
        <button 
          class="play-button text-neutral-500 hover:text-secondary transition-colors p-2 rounded-full hover:bg-secondary/10 focus:outline-none"
          @click="playSentence"
        >
          <i class="fa fa-volume-up text-xl"></i>
        </button>
        <button 
          class="toggle-original-button text-neutral-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10 focus:outline-none"
          @click="toggleOriginal"
        >
          <i class="fa" :class="{ 'fa-eye': !showOriginal, 'fa-eye-slash': showOriginal }"></i>
        </button>
        <button 
          class="edit-button text-neutral-500 hover:text-accent transition-colors p-2 rounded-full hover:bg-accent/10 focus:outline-none"
          @click="editSentence"
        >
          <i class="fa fa-pencil text-xl"></i>
        </button>
      </div>
    </div>

    <!-- 用户输入区域 -->
    <div class="mb-4">
      <h4 class="text-sm font-medium text-neutral-500 mb-2">请输入你听到的日语</h4>
      <textarea
        v-model="userInput"
        class="user-input w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none font-japanese text-lg"
        rows="2"
        placeholder="在这里输入你听到的日语..."
        @input="handleUserInput"
      ></textarea>
      <div class="flex flex-wrap justify-end mt-2 gap-2">
        <button 
          class="check-button px-4 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center"
          @click="checkAnswer"
        >
          <i class="fa fa-check mr-1"></i>检查答案
        </button>
        <!-- 短播放按钮 - 粉色系 -->
        <button 
          class="short-play-button px-4 py-1.5 bg-shortPlay/10 text-shortPlay hover:bg-shortPlay hover:text-white rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center"
          :class="{ 'hidden': !showErrorButtons }"
          @click="playShort"
        >
          <i class="fa fa-volume-up mr-1"></i>短播放
        </button>
        <!-- 助词按钮 - 青色系 -->
        <button 
          class="play-error-to-particle-button px-4 py-1.5 bg-particle/10 text-particle hover:bg-particle hover:text-white rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center"
          :class="{ 'hidden': !showErrorButtons }"
          @click="playToParticle"
        >
          <i class="fa fa-volume-up mr-1"></i>到助词为止
        </button>
        <!-- 错误播放按钮 - 紫色系 -->
        <button 
          class="play-error-button px-4 py-1.5 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center"
          :class="{ 'hidden': !showErrorButtons }"
          @click="playErrorRange"
        >
          <i class="fa fa-volume-up mr-1"></i>从错误处播放
        </button>
      </div>
    </div>

    <!-- 检查结果区域 -->
    <ResultDisplay
      :show-result="showResult"
      :result-status="resultStatus"
      :accuracy="accuracy"
      :user-input-html="userInputHtml"
      :correct-answer-html="correctAnswerHtml"
    />

    <!-- 日语原文（默认隐藏） -->
    <div v-if="showOriginal" class="japanese-original mb-4">
      <h4 class="text-sm font-medium text-neutral-500 mb-1">日语原文</h4>
      <p class="font-japanese text-lg text-neutral-800">{{ sentence.text }}</p>
    </div>

    <!-- 中文翻译 -->
    <div>
      <h4 class="text-sm font-medium text-neutral-500 mb-1">中文翻译</h4>
      <p class="text-neutral-700">{{ chineseSentence }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useTextProcessing } from '../composables/useTextProcessing'
import ActionButtons from './sentence/ActionButtons.vue'
import ResultDisplay from './sentence/ResultDisplay.vue'
import GenderBadge from './sentence/GenderBadge.vue'

export default defineComponent({
  name: 'SentenceCard',
  components: {
    ActionButtons,
    ResultDisplay,
    GenderBadge
  },
  props: {
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
  },
  setup(props) {
    const { compareTexts, findNextParticlePosition, findNthParticlePosition, speakJapanese, showNotification } = useTextProcessing()
    
    const userInput = ref('')
    const showResult = ref(false)
    const showOriginal = ref(false)
    const resultStatus = ref('')
    const accuracy = ref(0)
    const userInputHtml = ref('')
    const correctAnswerHtml = ref('')
    const showErrorButtons = ref(false)
    
    // 存储错误位置和范围
    const errors = ref([])
    const lastErrorRange = ref({ start: 0, end: 0 })
    const lastErrorToParticleRange = ref({ start: 0, end: 0 })
    const shortPlayRange = ref({ start: 0, end: 0 })

    // 更新对比结果
    const updateComparisonResult = () => {
      const userText = userInput.value.trim();
      const originalText = props.sentence.text;

      if (!userText) {
        showNotification('请先输入内容再播放', 'warning');
        return null;
      }

      // 比较用户输入和原文
      const comparisonResult = compareTexts(userText, originalText);

      // 保存错误位置和范围
      errors.value = comparisonResult.errorPositions;

      // 计算错误范围
      if (comparisonResult.errorPositions.length > 0) {
        const startPos = Math.min(...comparisonResult.errorPositions);
        const endPos = Math.max(...comparisonResult.errorPositions);
        lastErrorRange.value = { start: startPos, end: endPos };

        // 计算到助词为止的范围
        const particleEndPos = findNextParticlePosition(originalText, startPos);
        lastErrorToParticleRange.value = {
          start: startPos,
          end: particleEndPos
        };

        // 计算短播放范围（2-3个助词）
        let shortPlayEndPos = findNthParticlePosition(originalText, startPos, 3);
        // 如果内容较短，至少保证2个助词
        if (shortPlayEndPos - startPos < 5) {
          shortPlayEndPos = findNthParticlePosition(originalText, startPos, 3);
        }
        shortPlayRange.value = {
          start: startPos,
          end: shortPlayEndPos
        };
      }

      // 更新状态和准确率
      resultStatus.value = comparisonResult.correct ?
        '<span class="text-success"><i class="fa fa-check-circle mr-1"></i>回答正确</span>' :
        '<span class="text-error"><i class="fa fa-times-circle mr-1"></i>有错误</span>';

      accuracy.value = comparisonResult.accuracy;

      // 显示带标记的用户输入和正确答案
      userInputHtml.value = comparisonResult.userHtml;
      correctAnswerHtml.value = comparisonResult.correctHtml;

      // 根据检查结果显示/隐藏按钮
      showErrorButtons.value = !comparisonResult.correct;

      return comparisonResult;
    }

    // 播放句子
    const playSentence = () => {
      speakJapanese(props.sentence.text, props.sentence.gender);

      // 按钮动画效果
      const button = event.target.closest('.play-button') || event.target;
      button.classList.add('text-secondary');
      setTimeout(() => {
        button.classList.remove('text-secondary');
      }, 500);
    }

    // 播放错误范围
    const playErrorRange = () => {
      // 1. 先更新对比结果
      const comparisonResult = updateComparisonResult();
      if (!comparisonResult || comparisonResult.correct) {
        return; // 如果没有结果或回答正确，则不继续
      }

      // 2. 获取错误范围
      const { start, end } = lastErrorRange.value;
      const originalText = props.sentence.text;

      // 3. 朗读相应部分
      const playText = originalText.substring(
        start,
        Math.min(end + 1, originalText.length)
      );

      // 4. 播放
      speakJapanese(playText, props.sentence.gender);

      // 按钮动画效果
      const button = event.target.closest('.play-error-button') || event.target;
      button.classList.add('bg-accent', 'text-white');
      setTimeout(() => {
        button.classList.remove('bg-accent', 'text-white');
      }, 500);
    }

    // 播放到助词为止
    const playToParticle = () => {
      // 1. 先更新对比结果
      const comparisonResult = updateComparisonResult();
      if (!comparisonResult || comparisonResult.correct) {
        return; // 如果没有结果或回答正确，则不继续
      }

      // 2. 获取错误范围
      const { start, end } = lastErrorToParticleRange.value;
      const originalText = props.sentence.text;

      // 3. 朗读相应部分
      const playText = originalText.substring(
        start,
        Math.min(end + 1, originalText.length)
      );

      // 4. 播放
      speakJapanese(playText, props.sentence.gender);

      // 按钮动画效果
      const button = event.target.closest('.play-error-to-particle-button') || event.target;
      button.classList.add('bg-particleLight', 'text-white');
      setTimeout(() => {
        button.classList.remove('bg-particleLight', 'text-white');
      }, 500);
    }

    // 短播放
    const playShort = () => {
      // 1. 先更新对比结果
      const comparisonResult = updateComparisonResult();
      if (!comparisonResult || comparisonResult.correct) {
        return; // 如果没有结果或回答正确，则不继续
      }

      // 2. 获取短播放范围
      const { start, end } = shortPlayRange.value;
      const originalText = props.sentence.text;

      // 3. 朗读相应部分
      const playText = originalText.substring(
        start,
        Math.min(end + 1, originalText.length)
      );

      // 4. 播放
      speakJapanese(playText, props.sentence.gender);

      // 按钮动画效果
      const button = event.target.closest('.short-play-button') || event.target;
      button.classList.add('bg-shortPlayLight', 'text-white');
      setTimeout(() => {
        button.classList.remove('bg-shortPlayLight', 'text-white');
      }, 500);
    }

    // 检查答案
    const checkAnswer = () => {
      const result = updateComparisonResult();
      if (result) {
        showResult.value = true;
      }
    }

    // 切换显示原文
    const toggleOriginal = () => {
      showOriginal.value = !showOriginal.value;
    }

    // 编辑句子
    const editSentence = () => {
      props.onEdit(props.index);
    }

    // 处理用户输入变化
    const handleUserInput = () => {
      // 只要有输入，就显示按钮
      if (userInput.value.trim() !== '') {
        showErrorButtons.value = true;
      } else {
        showErrorButtons.value = false;
      }
    }

    return {
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
    }
  }
})
</script>