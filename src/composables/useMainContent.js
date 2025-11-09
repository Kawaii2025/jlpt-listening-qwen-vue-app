import { ref, onMounted } from 'vue'
import { useTextProcessing } from './useTextProcessing'

export const useMainContent = () => {
  const { splitByPeriod, extractAndRemoveGenderPrefix, showNotification } = useTextProcessing()
  
  const mixedText = ref(`大学の演劇サ一クルで女の学生と部長の男の学生が話しています。女の学生はこの後何
をしなければなりませんか。
女:鈴木さん。来週の新入生勧誘のためのサ一クル体験会、ポスタ一を見た人から早速
参加の申し込みが来てますね。
男:うん、準備進めないとね。当日来てくれた人には演劇を一部実際に体験してもらう
よね？その時に使うシ一ン、台本から候補選ぶのお願いしてたけど、どう?
女:はい。体験者が多くても使えそうなシンを3つピックアップしました。
男:じゃ、その中から僕が選んでセリフを印刷しておくよ。あと当日は受付とか誘導と
かみんなにも手伝ってもらうから誰が何を担当するか割り振ってほしいんだ。
女:わかりました。えっと、当日配る入部案内のチラシの準備は?
男：ああ、それは2年生に印刷してもらおうと思ってるんだ。僕から頼んでおくよ。
女：わかりました。
女の学生はこの後何をしなければなりませんか。`)

  const sentenceData = ref([])
  const chineseSentences = ref([])
  const showResults = ref(false)

  // 无性别的句子继承前一个句子的性别
  const assignGenders = () => {
    for (let i = 0; i < sentenceData.value.length; i++) {
      if (!sentenceData.value[i].gender && i > 0) {
        for (let j = i - 1; j >= 0; j--) {
          if (sentenceData.value[j].gender) {
            sentenceData.value[i].gender = sentenceData.value[j].gender
            break
          }
        }
      }
    }
  }

  // 处理文本
  const processText = () => {
    try {
      const text = mixedText.value.trim()

      if (!text) {
        showNotification('请输入文本内容', 'warning')
        return
      }

      sentenceData.value = []
      chineseSentences.value = []

      const sentences = splitByPeriod(text)

      sentences.forEach(sentence => {
        if (sentence.trim() !== '') {
          const { text: processedText, gender } = extractAndRemoveGenderPrefix(sentence)
          sentenceData.value.push({
            text: processedText,
            gender: gender,
            errors: [],
            lastErrorRange: { start: 0, end: 0 },
            lastErrorToParticleRange: { start: 0, end: 0 },
            shortPlayRange: { start: 0, end: 0 }
          })
          chineseSentences.value.push('')
        }
      })

      assignGenders()
      showResults.value = true

      // 滚动到练习内容
      setTimeout(() => {
        const practiceContentAnchor = document.getElementById('practice-content')
        if (practiceContentAnchor) {
          const navbar = document.getElementById('navbar')
          const navbarHeight = navbar ? navbar.offsetHeight : 0
          const elementTop = practiceContentAnchor.getBoundingClientRect().top + window.scrollY
          window.scrollTo({
            top: elementTop - navbarHeight - 20,
            behavior: 'smooth'
          })
        }
      }, 100)

      showNotification(`已成功处理 ${sentenceData.value.length} 句日语`, 'success')
    } catch (error) {
      console.error('处理文本时出错:', error)
      showNotification('处理文本时发生错误，请检查输入格式', 'error')
    }
  }

  // 清空文本
  const clearText = () => {
    mixedText.value = ''
    sentenceData.value = []
    chineseSentences.value = []
    showResults.value = false
  }

  // 焦点到文本区域
  const focusOnTextarea = () => {
    const textarea = document.getElementById('mixed-text')
    if (textarea) {
      textarea.focus()
    }
  }

  // 更新句子
  const updateSentence = (data) => {
    const { index, gender, japanese, chinese } = data
    if (index >= 0 && index < sentenceData.value.length) {
      sentenceData.value[index].text = japanese
      sentenceData.value[index].gender = gender
      chineseSentences.value[index] = chinese
      showNotification(`句子 ${index + 1} 已更新`, 'success')
    }
  }

  return {
    mixedText,
    sentenceData,
    chineseSentences,
    showResults,
    processText,
    clearText,
    focusOnTextarea,
    updateSentence
  }
}
