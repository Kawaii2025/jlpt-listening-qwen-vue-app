<template>
  <div v-if="show" :class="notificationClass">
    <i :class="`fa ${icon} mr-2`"></i>
    <span>{{ message }}</span>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'Notification',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const typeConfig = {
      success: { 
        bgColor: 'bg-green-500', 
        icon: 'fa-check-circle' 
      },
      warning: { 
        bgColor: 'bg-yellow-500', 
        icon: 'fa-exclamation-triangle' 
      },
      error: { 
        bgColor: 'bg-red-500', 
        icon: 'fa-times-circle' 
      },
      info: { 
        bgColor: 'bg-primary', 
        icon: 'fa-info-circle' 
      }
    };

    const config = typeConfig[props.type];
    
    const notificationClass = `fixed bottom-4 right-4 ${config.bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-10 opacity-0 z-50 flex items-center`;
    
    const icon = config.icon;

    return {
      notificationClass,
      icon
    }
  }
})
</script>