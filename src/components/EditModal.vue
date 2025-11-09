<template>
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click="handleBackdropClick"
  >
    <div class="bg-white rounded-xl shadow-lg w-full max-w-lg">
      <ModalHeader @close="closeModal" />
      <ModalContent v-model="localData" />
      <ModalFooter @close="closeModal" @save="saveEdit" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ModalHeader from './modal/ModalHeader.vue'
import ModalContent from './modal/ModalContent.vue'
import ModalFooter from './modal/ModalFooter.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Object,
    default: () => ({
      index: null,
      gender: '',
      japanese: '',
      chinese: ''
    })
  }
})

const emit = defineEmits(['close', 'save'])

const localData = ref({ ...props.editData })

// Watch for changes in props.editData and update localData
watch(() => props.editData, (newData) => {
  localData.value = { ...newData }
}, { deep: true })

const closeModal = () => {
  emit('close')
}

const saveEdit = () => {
  emit('save', {
    index: props.editData.index,
    gender: localData.value.gender,
    japanese: localData.value.japanese,
    chinese: localData.value.chinese
  })
  closeModal()
}

const handleBackdropClick = (event) => {
  if (event.target.classList.contains('fixed')) {
    closeModal()
  }
}
</script>
