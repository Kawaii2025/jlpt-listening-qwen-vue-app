<template>
  <button 
    :class="[
      'text-neutral-500 hover:text-secondary transition-colors p-2 rounded-full hover:bg-secondary/10 focus:outline-none',
      { 'text-secondary': isActive },
      customClass
    ]"
    @click="handleClick"
  >
    <i class="fa fa-volume-up text-xl"></i>
  </button>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PlayButton',
  props: {
    customClass: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = () => {
      emit('click');
    };

    return {
      handleClick
    }
  }
})
</script>