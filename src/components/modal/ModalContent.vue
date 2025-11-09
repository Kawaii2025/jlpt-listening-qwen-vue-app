<template>
  <div class="p-6">
    <GenderSelect 
      :model-value="modelValue.gender"
      @update:model-value="updateField('gender', $event)"
    />
    <JapaneseTextarea 
      :model-value="modelValue.japanese"
      @update:model-value="updateField('japanese', $event)"
    />
    <ChineseTextarea 
      :model-value="modelValue.chinese"
      @update:model-value="updateField('chinese', $event)"
    />
  </div>
</template>

<script setup>
import GenderSelect from './fields/GenderSelect.vue'
import JapaneseTextarea from './fields/JapaneseTextarea.vue'
import ChineseTextarea from './fields/ChineseTextarea.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}
</script>
