<template>
  <div class="flex items-center mb-6">
    <i :class="`fa ${icon} text-primary mr-2`"></i>
    <h3 class="text-xl font-semibold">{{ title }}</h3>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})
</script>
