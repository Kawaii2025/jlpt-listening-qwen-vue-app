<template>
  <div class="flex items-start justify-between mb-4">
    <CardHeader :index="index" :gender="sentence.gender" />
    <CardActions 
      :show-original="showOriginal"
      @play="$emit('play', $event)"
      @toggle-original="$emit('toggle-original')"
      @edit="$emit('edit')"
    />
  </div>
</template>

<script setup>
import CardHeader from './CardHeader.vue'
import CardActions from './CardActions.vue'

defineProps({
  index: {
    type: Number,
    required: true
  },
  sentence: {
    type: Object,
    required: true
  },
  showOriginal: {
    type: Boolean,
    default: false
  }
})

defineEmits(['play', 'toggle-original', 'edit'])
</script>
