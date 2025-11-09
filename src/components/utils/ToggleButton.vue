<template>
  <button 
    :class="[
      'text-neutral-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10 focus:outline-none',
      customClass
    ]"
    @click="handleClick"
  >
    <i :class="iconClass"></i>
  </button>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'ToggleButton',
  props: {
    customClass: {
      type: String,
      default: ''
    },
    isToggled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const iconClass = computed(() => {
      return props.isToggled ? 'fa fa-eye-slash' : 'fa fa-eye';
    });

    const handleClick = () => {
      emit('click');
    };

    return {
      iconClass,
      handleClick
    }
  }
})
</script>