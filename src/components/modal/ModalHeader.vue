<template>
  <div class="p-6 border-b border-neutral-200">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-neutral-800">编辑句子</h3>
      <button @click="$emit('close')" class="text-neutral-500 hover:text-neutral-800">
        <i class="fa fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>
