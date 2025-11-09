<template>
  <div class="mb-4">
    <label for="edit-gender" class="block text-sm font-medium text-neutral-700 mb-1">
      性别
    </label>
    <select 
      id="edit-gender" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
    >
      <option value="">无</option>
      <option value="male">男性</option>
      <option value="female">女性</option>
    </select>
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
