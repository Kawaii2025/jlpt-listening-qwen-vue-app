<template>
  <div class="mb-4">
    <label for="edit-japanese" class="block text-sm font-medium text-neutral-700 mb-1">
      日语句子
    </label>
    <textarea 
      id="edit-japanese" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="3" 
      class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary font-japanese"
    ></textarea>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
