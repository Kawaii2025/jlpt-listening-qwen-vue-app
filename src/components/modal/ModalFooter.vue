<template>
  <div class="p-4 bg-neutral-50 rounded-b-xl flex justify-end gap-3">
    <button 
      @click="$emit('close')" 
      class="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-all"
    >
      取消
    </button>
    <button 
      @click="$emit('save')" 
      class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm hover:shadow transition-all"
    >
      保存
    </button>
  </div>
</template>

<script setup>
defineEmits(['close', 'save'])
</script>
