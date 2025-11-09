<template>
  <div class="bg-gray-50 font-sans text-neutral-800 min-h-screen flex flex-col">
    <Header />
    <MainContent @open-edit-modal="openEditModal" />
    <Footer />
    <EditModal 
      :show="editModal.show" 
      :edit-data="editModal.data"
      @close="closeEditModal"
      @save="saveEdit"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import MainContent from './components/MainContent.vue'
import EditModal from './components/EditModal.vue'

export default defineComponent({
  name: 'App',
  components: {
    Header,
    Footer,
    MainContent,
    EditModal
  },
  setup() {
    // Global state can be managed here if needed
    const appState = ref({
      isMobileMenuOpen: false,
    })
    
    const editModal = ref({
      show: false,
      data: {
        index: null,
        gender: '',
        japanese: '',
        chinese: ''
      }
    })

    onMounted(() => {
      // Initialize any global functionality here
      console.log('App mounted')
    })

    const openEditModal = (data) => {
      editModal.value.data = { ...data }
      editModal.value.show = true
    }

    const closeEditModal = () => {
      editModal.value.show = false
    }

    const saveEdit = (data) => {
      // In a real app, you would update the main content's sentence data
      // For now, we'll just log the update
      console.log('Saving edit:', data)
      closeEditModal()
      
      // Show notification
      showNotification(`句子 ${data.index + 1} 已更新`, 'success')
    }

    // 显示通知函数
    const showNotification = (message, type = 'info') => {
      // Remove any existing notifications
      const existingNotifications = document.querySelectorAll('.fixed.bottom-4.right-4');
      existingNotifications.forEach(notification => {
        if (notification.classList.contains('z-50')) {
          notification.remove();
        }
      });

      const notification = document.createElement('div');

      let bgColor, icon;
      switch (type) {
        case 'success':
          bgColor = 'bg-green-500';
          icon = 'fa-check-circle';
          break;
        case 'warning':
          bgColor = 'bg-yellow-500';
          icon = 'fa-exclamation-triangle';
          break;
        case 'error':
          bgColor = 'bg-red-500';
          icon = 'fa-times-circle';
          break;
        default:
          bgColor = 'bg-primary';
          icon = 'fa-info-circle';
      }

      notification.className = `fixed bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-10 opacity-0 z-50 flex items-center`;
      notification.innerHTML = `
        <i class="fa ${icon} mr-2"></i>
        <span>${message}</span>
      `;

      document.body.appendChild(notification);

      // 显示动画
      setTimeout(() => {
        notification.classList.remove('translate-y-10', 'opacity-0');
      }, 10);

      // 自动消失
      setTimeout(() => {
        notification.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }

    return {
      editModal,
      openEditModal,
      closeEditModal,
      saveEdit
    }
  }
})
</script>