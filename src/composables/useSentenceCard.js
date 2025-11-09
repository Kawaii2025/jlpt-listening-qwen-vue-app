import { ref } from 'vue'
import { useTextProcessing } from './useTextProcessing'

export const useSentenceCard = (props) => {
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
  const lastErrorRange = ref({ start: 0, end: 0 })
  const lastErrorToParticleRange = ref({ start: 0, end: 0 })
  const shortPlayRange = ref({ start: 0, end: 0 })

  // 更新对比结果
  const updateComparisonResult = () => {
    const userText = userInput.value.trim()
    const originalText = props.sentence.text

    if (!userText) {
      showNotification('请先输入内容再播放', 'warning')
      return null
    }

    const comparisonResult = compareTexts(userText, originalText)

    if (comparisonResult.errorPositions.length > 0) {
      const startPos = Math.min(...comparisonResult.errorPositions)
      const endPos = Math.max(...comparisonResult.errorPositions)
      lastErrorRange.value = { start: startPos, end: endPos }

      const particleEndPos = findNextParticlePosition(originalText, startPos)
      lastErrorToParticleRange.value = {
        start: startPos,
        end: particleEndPos
      }

      let shortPlayEndPos = findNthParticlePosition(originalText, startPos, 3)
      if (shortPlayEndPos - startPos < 5) {
        shortPlayEndPos = findNthParticlePosition(originalText, startPos, 3)
      }
      shortPlayRange.value = {
        start: startPos,
        end: shortPlayEndPos
      }
    }

    resultStatus.value = comparisonResult.correct ?
      '<span class="text-success"><i class="fa fa-check-circle mr-1"></i>回答正确</span>' :
      '<span class="text-error"><i class="fa fa-times-circle mr-1"></i>有错误</span>'

    accuracy.value = comparisonResult.accuracy
    userInputHtml.value = comparisonResult.userHtml
    correctAnswerHtml.value = comparisonResult.correctHtml
    showErrorButtons.value = !comparisonResult.correct

    return comparisonResult
  }

  // 播放句子
  const playSentence = (event) => {
    speakJapanese(props.sentence.text, props.sentence.gender)
    const button = event.target.closest('.play-button') || event.target
    button.classList.add('text-secondary')
    setTimeout(() => {
      button.classList.remove('text-secondary')
    }, 500)
  }

  // 播放错误范围
  const playErrorRange = (event) => {
    const comparisonResult = updateComparisonResult()
    if (!comparisonResult || comparisonResult.correct) {
      return
    }

    const { start, end } = lastErrorRange.value
    const originalText = props.sentence.text
    const playText = originalText.substring(
      start,
      Math.min(end + 1, originalText.length)
    )

    speakJapanese(playText, props.sentence.gender)

    const button = event.target.closest('.play-error-button') || event.target
    button.classList.add('bg-accent', 'text-white')
    setTimeout(() => {
      button.classList.remove('bg-accent', 'text-white')
    }, 500)
  }

  // 播放到助词为止
  const playToParticle = (event) => {
    const comparisonResult = updateComparisonResult()
    if (!comparisonResult || comparisonResult.correct) {
      return
    }

    const { start, end } = lastErrorToParticleRange.value
    const originalText = props.sentence.text
    const playText = originalText.substring(
      start,
      Math.min(end + 1, originalText.length)
    )

    speakJapanese(playText, props.sentence.gender)

    const button = event.target.closest('.play-error-to-particle-button') || event.target
    button.classList.add('bg-particle', 'text-white')
    setTimeout(() => {
      button.classList.remove('bg-particle', 'text-white')
    }, 500)
  }

  // 短播放
  const playShort = (event) => {
    const comparisonResult = updateComparisonResult()
    if (!comparisonResult || comparisonResult.correct) {
      return
    }

    const { start, end } = shortPlayRange.value
    const originalText = props.sentence.text
    const playText = originalText.substring(
      start,
      Math.min(end + 1, originalText.length)
    )

    speakJapanese(playText, props.sentence.gender)

    const button = event.target.closest('.short-play-button') || event.target
    button.classList.add('bg-shortPlay', 'text-white')
    setTimeout(() => {
      button.classList.remove('bg-shortPlay', 'text-white')
    }, 500)
  }

  // 检查答案
  const checkAnswer = () => {
    const result = updateComparisonResult()
    if (result) {
      showResult.value = true
    }
  }

  // 切换显示原文
  const toggleOriginal = () => {
    showOriginal.value = !showOriginal.value
  }

  // 编辑句子
  const editSentence = () => {
    props.onEdit(props.index)
  }

  // 处理用户输入变化
  const handleUserInput = () => {
    if (userInput.value.trim() !== '') {
      showErrorButtons.value = true
    } else {
      showErrorButtons.value = false
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
