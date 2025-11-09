<template>
  <div class="font-japanese text-sm p-2 bg-neutral-50 rounded" v-html="formattedText"></div>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'TextDisplay',
  props: {
    text: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const formattedText = computed(() => {
      if (props.isCorrect) {
        return `<span class="correct-char">${props.text}</span>`;
      }
      return props.text;
    });

    return {
      formattedText
    }
  }
})
</script>