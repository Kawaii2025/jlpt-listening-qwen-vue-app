<template>
  <div>
    <label for="edit-chinese" class="block text-sm font-medium text-neutral-700 mb-1">
      中文翻译
    </label>
    <textarea 
      id="edit-chinese" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="3" 
      class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
