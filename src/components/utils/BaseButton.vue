<template>
  <button 
    :class="[
      'px-4 py-2 rounded-lg shadow-sm transition-all flex items-center justify-center',
      primary ? 'bg-primary hover:bg-primary/90 text-white' : '',
      secondary ? 'bg-secondary hover:bg-secondary/90 text-white' : '',
      outline ? 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100' : '',
      danger ? 'bg-red-500 hover:bg-red-600 text-white' : '',
      success ? 'bg-success hover:bg-success/90 text-white' : '',
      size === 'small' ? 'px-3 py-1.5 text-sm' : '',
      size === 'large' ? 'px-6 py-3' : '',
      rounded ? 'rounded-full' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    ]"
    :disabled="disabled"
  >
    <i v-if="icon" :class="`fa ${icon} mr-2`"></i>
    <slot></slot>
  </button>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseButton',
  props: {
    primary: {
      type: Boolean,
      default: false
    },
    secondary: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    danger: {
      type: Boolean,
      default: false
    },
    success: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'normal', // 'small', 'normal', 'large'
      validator: (value) => ['small', 'normal', 'large'].includes(value)
    },
    icon: {
      type: String,
      default: ''
    },
    rounded: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
</script>