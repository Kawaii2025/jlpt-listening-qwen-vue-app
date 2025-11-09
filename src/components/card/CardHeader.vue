<template>
  <div class="flex items-center">
    <span class="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
      句子 {{ index + 1 }}
    </span>
    <GenderBadge :gender="gender" />
  </div>
</template>

<script setup>
import GenderBadge from '../sentence/GenderBadge.vue'

defineProps({
  index: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    default: null
  }
})
</script>
