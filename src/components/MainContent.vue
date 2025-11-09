<template>
  <main class="flex-grow container mx-auto px-4 py-8">
    <!-- 页面介绍 -->
    <section class="mb-10 text-center max-w-3xl mx-auto">
      <h2 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-neutral-800 mb-4 text-shadow">
        提升你的日语听力
      </h2>
      <p class="text-neutral-700 text-lg mb-6">
        听日语句子，尝试输入你听到的内容，检查答案后可针对性播放错误部分的语音，高效纠正问题。
      </p>
      <div class="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
    </section>

    <!-- 文本输入区域 -->
    <section class="mb-12 bg-white rounded-xl shadow-md p-6 md:p-8 max-w-4xl mx-auto transform transition-all duration-500 hover:shadow-lg">
      <h3 class="text-xl font-semibold mb-6 flex items-center">
        <i class="fa fa-pencil-square-o text-primary mr-2"></i>输入文本内容
      </h3>

      <div class="space-y-6">
        <!-- 混合输入区域 -->
        <div>
          <label for="mixed-text" class="block text-sm font-medium text-neutral-700 mb-2">
            输入日语文本
          </label>
          <textarea
            id="mixed-text"
            v-model="mixedText"
            rows="10"
            class="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-lg"
            placeholder="请输入日语文本，例如：
電話で女の学生と男の学生が話しています。男の学生は明日何をしなければなりませんか。
女：もしもし、伊藤君、私田中だけど。明日のサークルのミーティングが急用で出られなくなっちゃったから代わりに仕切ってくれない？
男：はい、わかりました。何か特別に準備することはありますか？"
          ></textarea>
          <p class="mt-1 text-sm text-neutral-500">
            <i class="fa fa-info-circle mr-1"></i> 系统会按句号自动断句，并识别性别标识（如"女："、"男："）
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-end pt-4">
          <button
            @click="clearText"
            class="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-all flex items-center justify-center"
          >
            <i class="fa fa-eraser mr-2"></i>清空
          </button>
          <button
            @click="processText"
            class="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center font-medium"
          >
            <i class="fa fa-magic mr-2"></i>处理文本
          </button>
        </div>
      </div>
    </section>

    <!-- 结果显示区域 -->
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
          :on-edit="openEditModal"
        />
      </div>
    </section>

    <!-- 空状态提示 -->
    <section 
      :class="{ 'hidden': showResults || mixedText.trim() !== '' }" 
      id="empty-state" 
      class="max-w-4xl mx-auto py-16 text-center"
    >
      <div class="bg-white rounded-xl p-8 shadow-sm">
        <i class="fa fa-file-text-o text-5xl text-neutral-300 mb-4"></i>
        <h3 class="text-xl font-medium text-neutral-700 mb-2">还没有处理的文本</h3>
        <p class="text-neutral-500 mb-6">
          请在上方交替输入日语和中文内容，然后点击"处理文本"按钮开始练习
        </p>
        <button
          @click="focusOnTextarea"
          class="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm hover:shadow transition-all"
        >
          开始练习
        </button>
      </div>
    </section>
  </main>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import SentenceCard from './SentenceCard.vue'
import { useTextProcessing } from '../composables/useTextProcessing'

export default defineComponent({
  name: 'MainContent',
  components: {
    SentenceCard
  },
  emits: ['update-sentence'],
  setup(props, { emit }) {
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

    const { splitByPeriod, extractAndRemoveGenderPrefix, showNotification } = useTextProcessing()
    const sentenceData = ref([])
    const chineseSentences = ref([])
    const showResults = ref(false)
    const editModalData = ref({
      show: false,
      index: null,
      gender: '',
      japanese: '',
      chinese: ''
    })

    // 优化：无性别的句子继承前一个句子的性别
    const assignGenders = () => {
      for (let i = 0; i < sentenceData.value.length; i++) {
        if (!sentenceData.value[i].gender && i > 0) {
          // 向前查找最近的有性的句子
          for (let j = i - 1; j >= 0; j--) {
            if (sentenceData.value[j].gender) {
              sentenceData.value[i].gender = sentenceData.value[j].gender;
              break;
            }
          }
        }
      }
    }

    // 处理文本函数
    const processText = () => {
      try {
        const text = mixedText.value.trim();

        // 验证输入
        if (!text) {
          showNotification('请输入文本内容', 'warning');
          return;
        }

        // 验证输入不为空
        if (text.length === 0) {
          showNotification('未检测到有效内容', 'warning');
          return;
        }

        // 只处理日语句子
        sentenceData.value = [];
        chineseSentences.value = [];

        // 直接按句号分割所有文本
        const sentences = splitByPeriod(text);

        sentences.forEach(sentence => {
          if (sentence.trim() !== '') {
            const { text: processedText, gender } = extractAndRemoveGenderPrefix(sentence);
            sentenceData.value.push({
              text: processedText,
              gender: gender,
              errors: [], // 存储错误位置
              lastErrorRange: { start: 0, end: 0 }, // 存储上次错误范围
              lastErrorToParticleRange: { start: 0, end: 0 }, // 存储上次到助词的错误范围
              shortPlayRange: { start: 0, end: 0 } // 存储短播放范围
            });
            // 为每个日语句子添加一个空的中文翻译占位
            chineseSentences.value.push('');
          }
        });

        assignGenders();

        // 显示结果区域
        showResults.value = true;

        // 滚动到练习内容的顶部，考虑导航栏高度
        setTimeout(() => {
          const practiceContentAnchor = document.getElementById('practice-content');
          if (practiceContentAnchor) {
            const navbar = document.getElementById('navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const elementTop = practiceContentAnchor.getBoundingClientRect().top + window.scrollY;
            // 减去导航栏高度加一些额外的间距
            window.scrollTo({
              top: elementTop - navbarHeight - 20,
              behavior: 'smooth'
            });
          }
        }, 100);

        showNotification(`已成功处理 ${sentenceData.value.length} 句日语`, 'success');
      } catch (error) {
        console.error('处理文本时出错:', error);
        showNotification('处理文本时发生错误，请检查输入格式', 'error');
      }
    }

    // 清空文本
    const clearText = () => {
      mixedText.value = '';
      sentenceData.value = [];
      chineseSentences.value = [];
      showResults.value = false;
    }

    // 焦点到文本区域
    const focusOnTextarea = () => {
      const textarea = document.getElementById('mixed-text');
      if (textarea) {
        textarea.focus();
      }
    }

    // 打开编辑模态框
    const openEditModal = (index) => {
      const sentence = sentenceData.value[index];
      const chinese = chineseSentences.value[index];

      const editData = {
        index: index,
        gender: sentence.gender || '',
        japanese: sentence.text,
        chinese: chinese
      };

      emit('openEditModal', editData);
    }

    const updateSentence = (data) => {
      const { index, gender, japanese, chinese } = data;
      if (index >= 0 && index < sentenceData.value.length) {
        // Update the sentence data
        sentenceData.value[index].text = japanese;
        sentenceData.value[index].gender = gender;
        chineseSentences.value[index] = chinese;
        
        // Show notification
        showNotification(`句子 ${index + 1} 已更新`, 'success');
      }
    };

    onMounted(() => {
      // 页面加载完成后自动处理文本 (Auto-process text on page load)
      setTimeout(() => {
        processText();
      }, 500);
    });

    return {
      mixedText,
      sentenceData,
      chineseSentences,
      showResults,
      processText,
      clearText,
      showNotification,
      focusOnTextarea,
      openEditModal,
      updateSentence
    }
  }
})
</script>